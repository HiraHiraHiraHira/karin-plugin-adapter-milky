/**
 * 事件转换自检（不连网络、不连协议端）
 * 运行：npx tsx scripts/selfcheck-events.mts
 *
 * 覆盖 P2：群精华变更要走到 createGroupHlightsChangedNotice（而不是只打 debug 日志）；
 * group_disband 只记日志不崩；未知事件返回 false。
 *
 * ⚠ 关于 `Cannot read properties of undefined (reading 'Bot:<selfId>:<groupId>')`：
 * node-karin 的 createGroupHlightsChangedNotice 内部 `groupNoticeHandler(event)` 是
 * **不 await** 的悬浮 Promise，它 reject 时不会回到本脚本的 try/catch，
 * 只能从 process 的 unhandledRejection 捕获。裸跑没有 Karin 的 groups.json 配置缓存，
 * 所以「成功构造通知」必然表现为这个错误 —— 它恰好证明代码已经进了通知构造函数。
 *
 * 因此本脚本显式收集 unhandledRejection 并对其断言，跑完正常 exit 0；
 * 出现**其他**未处理异常或断言失败才 exit 1。
 */
import assert from 'node:assert/strict'
import { EventDispatch } from '../src/event/index'
import { encodeMsgId } from '../src/core/client/msgId'

// 在 dispatch 之前挂，才能接住 node-karin 内部悬浮 Promise 的 reject
const rejections: unknown[] = []
process.on('unhandledRejection', (reason) => { rejections.push(reason) })

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

/** 让已排队的微任务/定时器落地，悬浮 Promise 的 reject 才会冒到 unhandledRejection */
const drain = () => new Promise((resolve) => setTimeout(resolve, 50))

await ok('群精华变更走了 createGroupHlightsChangedNotice（不再只打 debug）', async () => {
  const before = logs.length
  const beforeRejections = rejections.length

  await EventDispatch({
    event_type: 'group_essence_message_change',
    time: 1794400000,
    self_id: 3133320859,
    data: { group_id: 853065300, message_seq: 123, operator_id: 2279260508, is_set: true }
  } as any, bot)
  await drain()

  assert.equal(logs.length, before, '不应该落到 debug 日志分支')

  // 关键断言：必须真的进到通知构造函数（裸跑必然因缺配置缓存而 reject）
  const fresh = rejections.slice(beforeRejections)
  assert.equal(fresh.length, 1, `应当有且仅有 1 个来自通知构造函数的未处理异常，实际 ${fresh.length} 个`)
  assert.match(
    String((fresh[0] as any)?.message ?? fresh[0]),
    /Bot:3133320859:853065300/,
    `意外错误: ${(fresh[0] as any)?.message ?? fresh[0]}`
  )
})

await ok('group_disband 只记日志，不抛错', async () => {
  const before = logs.length
  const beforeRejections = rejections.length

  await EventDispatch({
    event_type: 'group_disband',
    time: 1794400001,
    self_id: 3133320859,
    data: { group_id: 853065300, operator_id: 2279260508 }
  } as any, bot)
  await drain()

  assert.ok(logs.length > before, '应该有日志')
  assert.match(logs.at(-1)!, /群解散/)
  assert.equal(rejections.length, beforeRejections, 'group_disband 不应抛错')
})

await ok('未知事件不抛错，返回 false', async () => {
  const beforeRejections = rejections.length
  const res = await EventDispatch({ event_type: 'some_future_event', time: 1, self_id: 1, data: {} } as any, bot)
  await drain()

  assert.equal(res, false)
  assert.equal(rejections.length, beforeRejections, '未知事件不应抛错')
})

console.log('--- logs:', logs.length, '| 已捕获的预期 unhandledRejection:', rejections.length)
console.log(process.exitCode === 1 ? '有失败用例' : '全部通过')

// node-karin 被 import 后会留下定时器/句柄，进程不会自然退出。
// 显式退出，退出码交给上面 ok() 累积的 process.exitCode。
process.exit(process.exitCode ?? 0)
