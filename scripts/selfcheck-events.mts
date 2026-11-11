/**
 * 事件转换自检（不连网络、不连协议端）
 * 运行：npx tsx scripts/selfcheck-events.mts
 *
 * 覆盖 P2：群精华变更要走到 createGroupHlightsChangedNotice（而不是只打 debug 日志）；
 * group_disband 只记日志不崩；未知事件返回 false。
 *
 * 注意：node-karin 的通知构造函数内部会读 Karin 自己的 groups.json 配置缓存，
 * 单进程裸跑没有那份缓存，所以「成功构造通知」在这里表现为
 * `Cannot read properties of undefined (reading 'Bot:<selfId>:<groupId>')`。
 * 这个错误恰好证明代码已经进了 createGroupHlightsChangedNotice —— 只验证这一点。
 */
import assert from 'node:assert/strict'
import { EventDispatch } from '../src/event/index'
import { encodeMsgId } from '../src/core/client/msgId'

const logs: string[] = []
const bot: any = {
  adapter: { version: '1.3.3', protocol: 'yogurt', standard: 'milky' },
  account: { selfId: '3133320859', uin: '3133320859', name: '测试' },
  selfId: '3133320859',
  super: { encodeMsgId },
  sendMsg: async () => ({}),
  logger: (level: string, ...args: any[]) => { logs.push(`${level}: ${args.join(' ')}`) }
}

const ok = async (name: string, fn: () => Promise<void>) => {
  try { await fn(); console.log('PASS', name) } catch (e: any) { console.log('FAIL', name, '->', e?.message); process.exitCode = 1 }
}

await ok('群精华变更走了 createGroupHlightsChangedNotice（不再只打 debug）', async () => {
  const before = logs.length
  let err: any = null
  try {
    await EventDispatch({
      event_type: 'group_essence_message_change',
      time: 1794400000,
      self_id: 3133320859,
      data: { group_id: 853065300, message_seq: 123, operator_id: 2279260508, is_set: true }
    } as any, bot)
  } catch (e) { err = e }
  assert.equal(logs.length, before, '不应该落到 debug 日志分支')
  if (err) {
    // 裸跑没有 Karin 的配置缓存：这个错误说明代码已经进到通知构造函数里了
    assert.match(String(err.message), /Bot:3133320859:853065300/, `意外错误: ${err.message}`)
  }
})

await ok('group_disband 只记日志，不抛错', async () => {
  const before = logs.length
  await EventDispatch({
    event_type: 'group_disband',
    time: 1794400001,
    self_id: 3133320859,
    data: { group_id: 853065300, operator_id: 2279260508 }
  } as any, bot)
  assert.ok(logs.length > before, '应该有日志')
  assert.match(logs.at(-1)!, /群解散/)
})

await ok('未知事件不抛错，返回 false', async () => {
  const res = await EventDispatch({ event_type: 'some_future_event', time: 1, self_id: 1, data: {} } as any, bot)
  assert.equal(res, false)
})

console.log('--- logs:', logs.length)
