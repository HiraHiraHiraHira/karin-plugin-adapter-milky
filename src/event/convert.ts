import { IncomingMessage, OutgoingSegment } from '@saltify/milky-types'
import { promises as fs } from 'node:fs'
import { contactFriend, contactGroup, contactGroupTemp, Elements, segment, SendElement } from 'node-karin'
import { segment as Segment } from '@/event/segment'
import { MilkyAdapter } from '@/core/milkyAdapter'
import { MilkyCompatError, normalizeUri, seqFromMessageId } from '@/core/onebotCompat'

/** 入站转发展开上限：条数与单条文本长度 */
const FORWARD_MAX_NODES = 10
const FORWARD_MAX_TEXT = 500

/**
 * 出站 file:// 本地文件的兜底读取上限。
 * Yogurt 跑在宿主机、Karin 在容器里，/app/... 这种容器内路径协议端读不到
 * （实测 -500 File not found），所以能在本地读到的就直接转 base64 发过去。
 * 超过上限的不硬转，保留原样让协议端报明确错误，免得把几百 MB 塞进 JSON。
 */
const FILE_URI_MAX_BYTES = 32 * 1024 * 1024

/**
 * 把容器内 file:// 路径转成 base64://。
 * 读不到或超限就原样返回（让协议端报错，别静默改成别的东西）。
 */
export async function localizeUri (uri: string, bot?: MilkyAdapter): Promise<string> {
  const raw = String(uri ?? '')
  if (!raw.startsWith('file://')) return normalizeUri(raw)
  let path = raw.slice('file://'.length)
  try { path = decodeURIComponent(path) } catch { /* 保留原样 */ }
  // file:///app/x → /app/x；file://app/x 这种非标准写法补一个斜杠
  if (!path.startsWith('/')) path = '/' + path
  try {
    const stat = await fs.stat(path)
    if (!stat.isFile()) return raw
    if (stat.size > FILE_URI_MAX_BYTES) {
      bot?.logger('warn', `[milky] 本地文件 ${path} 有 ${(stat.size / 1024 / 1024).toFixed(1)}MB，超过 base64 兜底上限，按原样发给协议端`)
      return raw
    }
    const buf = await fs.readFile(path)
    return `base64://${buf.toString('base64')}`
  } catch {
    // 文件不在这个容器里（比如插件给的宿主机路径），原样交给协议端
    return raw
  }
}

/** milky 消息转 Karin */
export async function AdapterConvertKarin (
  event: IncomingMessage,
  bot: MilkyAdapter,
  depth = 0
): Promise<Array<Elements>> {
  const data = event.segments
  const elements = []
  for (const i of data) {
    switch (i.type) {
      case 'text':
        elements.push(segment.text(i.data.text))
        break
      case 'mention':
        elements.push(segment.at(String(i.data.user_id), i.data.name))
        break
      case 'mention_all':
        elements.push(segment.at('all'))
        break
      case 'face':
        elements.push(segment.face(Number(i.data.face_id)))
        break
      case 'reply':
        elements.push(segment.reply(bot.super.encodeMsgId(event.message_scene, event.peer_id, i.data.message_seq)))
        break
      case 'image':
        elements.push(segment.image(i.data.temp_url, { width: i.data.width, height: i.data.height, subType: i.data.sub_type, summary: i.data.summary }))
        break
      case 'record':
        elements.push(segment.record(i.data.temp_url))
        break
      case 'video':
        elements.push(segment.video(i.data.temp_url, { width: i.data.width, height: i.data.height }))
        break
      case 'file': {
        const contact = event.message_scene === 'friend' ? contactFriend(event.peer_id + '') : event.message_scene === 'group' ? contactGroup(event.peer_id + '') : contactGroupTemp(event.group?.group_id + '', event.sender_id + '')
        const url = await bot.getFileUrl(contact, i.data.file_id)
        elements.push(segment.file(url, { fid: i.data.file_id, name: i.data.file_name, size: i.data.file_size, hash: i.data.file_hash || undefined }))
        break
      }
      case 'forward': {
        /**
         * 入站合并转发：展开成「文本 + 图片」。
         * Karin 的段模型没有 forward 元素，保留 forward_id 现有插件都不会去取，
         * 所以这里直接压平——上限 10 条 / 每条 500 字，避免长转发刷屏。
         * 同样有问题的是嵌套转发：depth >= 1 时只留占位，避免递归。
         */
        const parts: string[] = []
        if ('title' in i.data && i.data.title) parts.push(String(i.data.title))
        if ('summary' in i.data && i.data.summary) parts.push(String(i.data.summary))
        if (depth >= 1) {
          parts.push(`forward_id=${i.data.forward_id}`)
          elements.push(segment.text(`[合并转发 ${parts.join(' / ')}]`))
          break
        }
        try {
          const nodes = await bot.getForwardMsg(i.data.forward_id, depth + 1)
          if (!nodes.length) throw new Error('转发内容为空')
          let n = 0
          for (const node of nodes) {
            if (n >= FORWARD_MAX_NODES) {
              elements.push(segment.text('…'))
              break
            }
            for (const el of node.elements || []) {
              const any = el as any
              if (el.type === 'text') {
                elements.push(segment.text(String(any.text ?? any.data?.text ?? '').slice(0, FORWARD_MAX_TEXT)))
              } else if (el.type === 'at') {
                elements.push(segment.text('@' + (any.name || any.targetId || any.data?.name || any.data?.qq || '')))
              } else if (el.type === 'image') {
                const uri = any.file || any.url || any.data?.file || any.data?.url
                if (uri) elements.push(segment.image(uri))
                else elements.push(segment.text('[图片]'))
              } else if (el.type === 'face') {
                elements.push(segment.text('[表情]'))
              } else {
                elements.push(segment.text(`[${el.type}]`))
              }
            }
            elements.push(segment.text('\n'))
            n += 1
          }
        } catch (err: any) {
          // 展开失败不是致命错误：保留占位，让消息其余部分继续流动
          bot.logger('warn', `合并转发展开失败 forward_id=${i.data.forward_id}: ${err?.message ?? err}`)
          parts.push(`forward_id=${i.data.forward_id}`)
          elements.push(segment.text(`[合并转发 ${parts.join(' / ')}]`))
        }
        break
      }
      case 'market_face':
        elements.push(segment.marketFace(i.data.emoji_package_id + ''))
        break
      case 'light_app':
        elements.push(segment.json(i.data.json_payload))
        break
      case 'xml':
        elements.push(segment.xml(i.data.xml_payload))
        break
      case 'markdown' as any:
        elements.push(segment.markdown((i.data as any).content))
        break
      default:
        elements.push(segment.text(JSON.stringify(i)))
    }
  }
  return elements
}

/** Karin 消息转 milky */
export async function KarinConvertAdapter (data: Array<SendElement>, bot?: MilkyAdapter): Promise<Array<OutgoingSegment>> {
  const elements: Array<OutgoingSegment> = []
  for (const i of data) {
    switch (i.type) {
      case 'text':
        elements.push(Segment.text(i.text))
        break
      case 'at':
        elements.push(Segment.at(i.targetId))
        break
      case 'face':
        elements.push(Segment.face(i.id, i.isBig))
        break
      case 'reply':
        // messageId 是适配器 encodeMsgId 的 base64 三元组，必须解成 seq 再发
        elements.push(Segment.reply(seqFromMessageId(i.messageId)))
        break
      case 'image':
        elements.push(Segment.image(await localizeUri(i.file, bot), { summary: i.summary, subType: i.subType as any }))
        break
      case 'record':
        elements.push(Segment.record(await localizeUri(i.file, bot)))
        break
      case 'video':
        elements.push(Segment.video(await localizeUri(i.file, bot)))
        break
      case 'json':
        // Karin 的 json 段 → Milky 的 light_app，ark 卡片唯一的出站通道
        elements.push({ type: 'light_app', data: { json_payload: String(i.data ?? '') } })
        break
      case 'file':
      case 'markdown':
      case 'xml':
      case 'music':
      case 'share':
      case 'location':
        // 这些段在 Milky 出站侧没有对应类型。以前走 default 变成 JSON 文本还返回成功，
        // 插件会误判「发出去了」——这里明确失败，让插件能按能力降级。
        throw new MilkyCompatError(
          `出站 ${i.type} 段在 Milky 下没有对应实现；请改用 text / image / light_app(ark) 等支持的段`,
          `sendMsg(${i.type})`
        )
      default:
        throw new MilkyCompatError(
          `出站段 "${(i as any).type}" 在 Milky 下没有对应实现`,
          `sendMsg(${(i as any).type})`
        )
    }
  }
  return elements
}
