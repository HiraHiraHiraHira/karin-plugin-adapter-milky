/**
 * OneBot lite 兼容层自检（不连网络）
 * 运行：npx tsx scripts/selfcheck.mts
 */
import assert from 'node:assert/strict'
import { invokeOneBotAction, oneBotToMilky, MilkyCompatError } from '../src/core/onebotCompat'
import { encodeMsgId } from '../src/core/client/msgId'

const calls: any[] = []
const bot: any = {
  adapter: { version: '1.3.3', protocol: 'yogurt' },
  logger: () => {},
  super: {
    encodeMsgId,
    sendGroupMessage: async (gid: number, msg: any) => { calls.push(['sendGroupMessage', gid, msg]); return { message_seq: 7, time: 99 } },
    sendPrivateMessage: async (uid: number, msg: any) => { calls.push(['sendPrivateMessage', uid, msg]); return { message_seq: 8, time: 100 } },
    recallGroupMessage: async (g: number, s: number) => { calls.push(['recallGroupMessage', g, s]) },
    recallPrivateMessage: async (u: number, s: number) => { calls.push(['recallPrivateMessage', u, s]) },
    getLoginInfo: async () => ({ uin: 3133320859, nickname: '蚊蚋雨中狂舞' })
  }
}

const ok = async (name: string, fn: () => Promise<void>) => {
  try { await fn(); console.log('PASS', name) } catch (e: any) { console.log('FAIL', name, '->', e?.message); process.exitCode = 1 }
}

await ok('段转换 text/at/face/reply/image/json', async () => {
  const seq = encodeMsgId('group', 853065300, 42)
  const segs = oneBotToMilky([
    { type: 'text', data: { text: 'hi' } },
    { type: 'at', data: { qq: '3133320859' } },
    { type: 'at', data: { qq: 'all' } },
    { type: 'face', data: { id: 14 } },
    { type: 'reply', data: { id: seq } },
    { type: 'image', data: { file: 'https://example.com/a.png' } },
    { type: 'json', data: { data: '{"app":"x"}' } }
  ])
  assert.deepEqual(segs[0], { type: 'text', data: { text: 'hi' } })
  assert.deepEqual(segs[1], { type: 'mention', data: { user_id: 3133320859 } })
  assert.deepEqual(segs[2], { type: 'mention_all', data: {} })
  assert.equal(segs[3].type, 'face')
  assert.deepEqual(segs[4], { type: 'reply', data: { message_seq: 42 } })
  assert.equal(segs[5].type, 'image')
  assert.deepEqual(segs[6], { type: 'light_app', data: { json_payload: '{"app":"x"}' } })
})

await ok('send_group_msg → sendGroupMessage', async () => {
  const res = await invokeOneBotAction(bot, 'send_group_msg', {
    group_id: 853065300,
    message: [{ type: 'text', data: { text: 'hello' } }]
  })
  assert.equal(res.message_id, encodeMsgId('group', 853065300, 7))
  const last = calls.at(-1)
  assert.equal(last[0], 'sendGroupMessage')
  assert.equal(last[1], 853065300)
})

await ok('send_private_msg → sendPrivateMessage', async () => {
  const res = await invokeOneBotAction(bot, 'send_private_msg', {
    user_id: 2279260508,
    message: [{ type: 'text', data: { text: 'hi' } }]
  })
  assert.equal(res.message_id, encodeMsgId('friend', 2279260508, 8))
})

await ok('delete_msg 用 base64 messageId 能定位', async () => {
  const id = encodeMsgId('group', 853065300, 42)
  await invokeOneBotAction(bot, 'delete_msg', { message_id: id })
  assert.deepEqual(calls.at(-1), ['recallGroupMessage', 853065300, 42])
})

await ok('get_login_info 返回 OneBot 形状', async () => {
  const res = await invokeOneBotAction(bot, 'get_login_info', {})
  assert.deepEqual(res, { user_id: 3133320859, nickname: '蚊蚋雨中狂舞' })
})

await ok('裸数字 message_id 明确报错，不猜场景', async () => {
  await assert.rejects(
    () => invokeOneBotAction(bot, 'delete_msg', { message_id: 123456 }),
    (e: any) => e instanceof MilkyCompatError && /裸数字/.test(e.message)
  )
})

await ok('send_packet 明确报错（协议层没有）', async () => {
  await assert.rejects(
    () => invokeOneBotAction(bot, 'send_packet', {}) as any,
    (e: any) => e instanceof MilkyCompatError && /send_packet/.test(e.message)
  )
})

await ok('未知动作明确报错', async () => {
  await assert.rejects(
    () => invokeOneBotAction(bot, 'get_group_msg_history', {}) as any,
    (e: any) => e instanceof MilkyCompatError && /get_group_msg_history/.test(e.message)
  )
})

console.log('--- calls:', calls.length)
