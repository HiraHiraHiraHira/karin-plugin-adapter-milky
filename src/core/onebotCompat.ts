/**
 * OneBot v11 → Milky 的 lite 兼容层
 *
 * 设计原则：**只映射语义完全对得上的动作**。
 * 其余一律显式抛错——半套兼容比没有更危险：
 * 插件看到「成功」却什么都没发生，比看到明确报错难查一百倍。
 *
 * 不做的事：
 * - 群临时会话（Milky 的 send_private_message 只收好友号）
 * - send_packet / OIDB（协议层不存在）
 * - 平台原生音乐卡（没有 music 段，只能走 light_app）
 * - 裸数字 message_id 的 delete_msg / get_msg（Milky 用 scene+peer+seq 三元组，反推不出场景）
 */
import type { OutgoingSegment } from '@saltify/milky-types'
import type { MilkyAdapter } from '@/core/milkyAdapter'
import { segment as Segment } from '@/event/segment'
import { decodeMsgId, type MessageScene } from '@/core/client/msgId'

export class MilkyCompatError extends Error {
  readonly action?: string
  constructor (message: string, action?: string) {
    super(message)
    this.name = 'MilkyCompatError'
    this.action = action
  }
}

/** OneBot v11 消息段（只声明本层会读的字段） */
export interface OneBotSegment {
  type: string
  data?: Record<string, any>
}

/** data: URL → base64://（Milky 的 uri 只认 file:// http(s):// base64://） */
export const normalizeUri = (uri: string): string => {
  const match = /^data:[^;,]*;base64,(.+)$/s.exec(String(uri))
  return match ? `base64://${match[1]}` : String(uri)
}

/** 从适配器发出的 messageId（base64 三元组）解出 seq；reply 段允许裸数字 */
function seqForReply (id: string | number): number {
  const raw = String(id)
  if (/^\d+$/.test(raw)) return Number(raw)
  return resolveMessageId(raw).seq
}

/**
 * 出站 reply 段用：Karin 的 reply 元素带的是适配器 encodeMsgId 出来的 base64 三元组，
 * 直接 `+messageId` 会变 NaN（JSON 里成 null，协议端接受但引用静默消失）。
 * 这里解出 seq；解不出来就明确报错，别发一条没有引用的消息。
 */
export function seqFromMessageId (id: string | number): number {
  return seqForReply(id)
}

/** 解析 messageId。Milky 没有全局 message_id，裸数字直接拒绝（不猜场景） */
function resolveMessageId (id: string | number): { scene: MessageScene; peerId: number; seq: number } {
  const raw = String(id)
  if (/^\d+$/.test(raw)) {
    throw new MilkyCompatError(
      `收到裸数字 message_id=${raw}：Milky 用 (scene, peer_id, seq) 三元组定位消息，无法反推场景。` +
      '请传适配器给出的 messageId（base64 字符串），或在插件里直接用 sendMsg 的返回值'
    )
  }
  try {
    const res = decodeMsgId(raw)
    if (res.seq > 0) return res
  } catch { /* fallthrough */ }
  throw new MilkyCompatError(`无法解析 message_id=${raw}`)
}

/** OneBot 消息段数组（或纯文本）→ Milky 出站段 */
export function oneBotToMilky (message: OneBotSegment[] | string): OutgoingSegment[] {
  if (typeof message === 'string') return [Segment.text(message)]
  if (!Array.isArray(message)) {
    throw new MilkyCompatError('message 必须是 OneBot 段数组或字符串')
  }
  const out: OutgoingSegment[] = []
  for (const seg of message) {
    const d = seg?.data ?? {}
    switch (seg?.type) {
      case 'text':
        out.push(Segment.text(String(d.text ?? '')))
        break
      case 'at':
        out.push(Segment.at(String(d.qq) === 'all' ? 'all' : Number(d.qq)))
        break
      case 'face':
        out.push(Segment.face(Number(d.id)))
        break
      case 'reply':
        out.push(Segment.reply(seqForReply(d.id)))
        break
      case 'image':
        out.push(Segment.image(normalizeUri(d.file ?? d.url ?? ''), {
          subType: d.sub_type === 1 || d.sub_type === 'sticker' ? 'sticker' : 'normal',
          summary: d.summary
        }))
        break
      case 'record':
        out.push(Segment.record(normalizeUri(d.file ?? '')))
        break
      case 'video':
        out.push(Segment.video(normalizeUri(d.file ?? '')))
        break
      case 'json':
        // Karin 的 json 段：data 是 ark JSON 字符串
        out.push({ type: 'light_app', data: { json_payload: String(d.data ?? d.json ?? '') } })
        break
      default:
        throw new MilkyCompatError(
          `OneBot 段 "${seg?.type}" 在 Milky 下没有对应实现，拒绝静默降级为文本`,
          'message'
        )
    }
  }
  return out
}

function unsupported (action: string): never {
  throw new MilkyCompatError(
    `[milky-compat] 不支持的 OneBot 动作：${action}。` +
    'Milky 协议没有对应能力（临时会话 / send_packet / OIDB / 平台音乐卡等），' +
    '请改用适配器暴露的 Karin API，或在插件里按 adapter.standard 分支处理',
    action
  )
}

/**
 * OneBot v11 动作 → Milky API（lite 版）
 * 返回 OneBot 风格的 data 对象，调用方不用改。
 */
export async function invokeOneBotAction (bot: MilkyAdapter, action: string, params: any = {}): Promise<any> {
  const act = String(action).replace(/^(nc_|lgl_)/, '')
  const p = params ?? {}
  switch (act) {
    /* === 发送 === */
    case 'send_msg': {
      const type = p.message_type ?? (p.group_id ? 'group' : 'private')
      if (type === 'group') return invokeOneBotAction(bot, 'send_group_msg', p)
      if (type === 'private') return invokeOneBotAction(bot, 'send_private_msg', p)
      return unsupported(`${act}(message_type=${type})`)
    }
    case 'send_private_msg': {
      if (p.user_id == null) throw new MilkyCompatError('send_private_msg 缺少 user_id', act)
      const userId = Number(p.user_id)
      const res = await bot.super.sendPrivateMessage(userId, oneBotToMilky(p.message))
      return { message_id: bot.super.encodeMsgId('friend', userId, res.message_seq), time: res.time }
    }
    case 'send_group_msg': {
      if (p.group_id == null) throw new MilkyCompatError('send_group_msg 缺少 group_id', act)
      const groupId = Number(p.group_id)
      const res = await bot.super.sendGroupMessage(groupId, oneBotToMilky(p.message))
      return { message_id: bot.super.encodeMsgId('group', groupId, res.message_seq), time: res.time }
    }
    case 'send_forward_msg':
      throw new MilkyCompatError(
        'send_forward_msg 的 node 结构无法等价映射，请改用 bot.sendForwardMsg（适配器已实现）',
        act
      )

    /* === 消息操作 === */
    case 'delete_msg': {
      const { scene, peerId, seq } = resolveMessageId(p.message_id)
      if (scene === 'group') await bot.super.recallGroupMessage(peerId, seq)
      else if (scene === 'friend') await bot.super.recallPrivateMessage(peerId, seq)
      else unsupported(`${act}(scene=temp)`)
      return {}
    }
    case 'get_msg': {
      const { scene, peerId, seq } = resolveMessageId(p.message_id)
      if (scene === 'temp') return unsupported(`${act}(scene=temp)`)
      const res = await bot.super.getMessage(scene, peerId, seq)
      const m: any = res.message
      const sender = m.message_scene === 'friend' ? m.friend : m.message_scene === 'group' ? m.group_member : null
      return {
        message_id: bot.super.encodeMsgId(m.message_scene, m.peer_id, m.message_seq),
        message_seq: m.message_seq,
        time: m.time,
        message_type: m.message_scene,
        sender: sender ? { user_id: sender.user_id ?? m.sender_id, nickname: sender.nickname, card: sender.card ?? '' } : { user_id: m.sender_id },
        raw_message: '',
        message: m.segments
      }
    }
    case 'get_forward_msg': {
      const res = await bot.super.getForwardedMessage(String(p.id ?? p.message_id ?? ''))
      return { messages: res.messages }
    }

    /* === 信息查询 === */
    case 'get_login_info': {
      const info = await bot.super.getLoginInfo()
      return { user_id: info.uin, nickname: info.nickname }
    }
    case 'get_group_info': {
      const res = await bot.super.getGroupInfo(Number(p.group_id), p.no_cache)
      const g: any = res.group
      return {
        group_id: g.group_id,
        group_name: g.group_name,
        member_count: g.member_count,
        max_member_count: g.max_member_count
      }
    }
    case 'get_group_list': {
      const res = await bot.super.getGroupList(p.no_cache)
      return res.groups
    }
    case 'get_group_member_info': {
      const res = await bot.super.getGroupMemberInfo(Number(p.group_id), Number(p.user_id), p.no_cache)
      const m: any = res.member
      return {
        group_id: m.group_id,
        user_id: m.user_id,
        nickname: m.nickname,
        card: m.card,
        sex: m.sex,
        role: m.role,
        level: m.level,
        title: m.title,
        join_time: m.join_time,
        last_sent_time: m.last_sent_time
      }
    }
    case 'get_group_member_list': {
      const res = await bot.super.getGroupMemberList(Number(p.group_id), p.no_cache)
      return res.members
    }
    case 'get_friend_list': {
      const res = await bot.super.getFriendList(p.no_cache)
      return res.friends
    }
    case 'get_stranger_info': {
      const res = await bot.super.getUserProfile(Number(p.user_id))
      return res
    }

    /* === 群管理 === */
    case 'set_group_ban': {
      await bot.super.setGroupMemberMute(Number(p.group_id), Number(p.user_id), Number(p.duration ?? 0))
      return {}
    }
    case 'set_group_whole_ban': {
      await bot.super.setGroupWholeMute(Number(p.group_id), Boolean(p.enable))
      return {}
    }
    case 'set_group_kick': {
      await bot.super.kickGroupMember(Number(p.group_id), Number(p.user_id), Boolean(p.reject_add_request))
      return {}
    }
    case 'set_group_card': {
      await bot.super.setGroupMemberCard(Number(p.group_id), Number(p.user_id), String(p.card ?? ''))
      return {}
    }
    case 'set_group_name': {
      await bot.super.setGroupName(Number(p.group_id), String(p.group_name ?? ''))
      return {}
    }
    case 'set_group_portrait':
    case 'set_group_avatar': {
      // ling 的「改群头像」走 set_group_portrait；Milky 对应 set_group_avatar
      const uri = p.file ?? p.url ?? p.portrait
      if (!uri) throw new MilkyCompatError('set_group_portrait 缺少 file/url 参数', act)
      await bot.super.setGroupAvatar(Number(p.group_id), normalizeUri(String(uri)))
      return {}
    }
    case 'send_like': {
      await bot.super.sendProfileLike(Number(p.user_id), Number(p.times ?? 1))
      return {}
    }

    /* === 状态 === */
    case 'get_status':
    case 'get_version_info':
      return {
        online: true,
        good: true,
        app_name: 'karin-adapter-milky',
        app_version: bot.adapter.version,
        protocol: 'milky',
        impl: bot.adapter.protocol
      }

    default:
      return unsupported(act)
  }
}
