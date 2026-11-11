# PATCHES

本仓库是 [`KarinJS/karin-plugin-adapter-milky`](https://github.com/KarinJS/karin-plugin-adapter-milky) 的维护分支，
用于在 Karin + Yogurt（Milky 协议端）环境下补齐上游暂未覆盖的能力。

- 基线版本：`@karinjs/plugin-adapter-milky@1.3.3`
- 包名保持不变（`@karinjs/plugin-adapter-milky`），Karin 的配置目录无需迁移
- `lib/` 构建产物随源码一起提交，支持 `pnpm add github:HiraHiraHiraHira/karin-plugin-adapter-milky#<tag>` 直接安装
- 每个补丁一个 commit，能提上游的一律提 PR；合入后本 fork 降级为跟随版本

## P1 入站合并转发：展开成文本 + 图片

**问题**：Milky 入站 `forward` 段只带 `forward_id`，Karin 的段模型没有 forward 元素，
上游转换器只产出一行占位文本，插件读不到转发内容。Karin 生态里 `sendForwardMsg` 是 API 不是段，
所以「保留 forward_id 让插件自己取」也不成立——现有插件都不会去取。

**改法**（`src/event/convert.ts` + `src/core/milkyAdapter.ts`）：

- `AdapterConvertKarin` 的 `case 'forward'` 调 `bot.getForwardMsg(forward_id, depth)`
- 压平为「文本 + 图片 + 换行」，上限 10 条、每条文本 500 字
- 嵌套转发 `depth >= 1` 时只留占位，防递归
- 展开失败（协议端解析错误/空转发）降级为原来的占位文本，并打 `warn` 日志，不让整条消息失败
- `getForwardMsg` 增加可选 `depth` 参数用于传递嵌套层级

**验证**：群里转发一条多段消息，Karin 日志应显示展开后的原文，而不是 `[合并转发 forward_id=...]`。

**已知上游限制**：Yogurt 0.1.0-dev 对部分含小程序/卡片的转发节点会抛
`XmlParsingException: Fields [templateID, m_resid] are required ...`，这类转发仍会降级成占位。
这是协议端解析器的限制，适配器无法修复。

## P2 出站 json → light_app（ark 卡片）

**问题**：上游出站转换只认 text/at/face/reply/image/record/video，`segment.json(...)` 落进
default 分支被转成一段 JSON 文本，**而且 API 返回成功**——插件以为卡片发出去了，实际群里是一行 JSON。

**改法**（`src/event/convert.ts`）：`case 'json'` → `{ type: 'light_app', data: { json_payload: String(i.data) } }`。

**验证**：点歌/卡片类命令，日志 `通道=ark 结果=ok`，群里显示卡片而不是 JSON 文本。

## P3 不支持出站段「明确报错」而不是静默降级

**问题**：`file` / `markdown` / `music` 等 Milky 出站没有对应类型的段，上游走 default 变成 JSON 文本并返回成功，
插件无法感知失败（假成功）。

**改法**（`src/event/convert.ts` + `src/core/onebotCompat.ts`）：

- `file` / `markdown` / `xml` / `music` / `share` / `location` / 未知类型 → 抛 `MilkyCompatError`
- 错误信息写明「该段在 Milky 下没有对应实现」以及可用替代（text / image / light_app）

**验证**：触发一次不支持的段，应看到明确报错，而不是群里出现 JSON 字符串。

## P4 OneBot v11 动作别名（lite）

**问题**：Karin 的 `bot.sendApi(action, params)` 语义是 OneBot v11 动作名，上游实现直接
`POST /api/<action>`；Milky 的路径是 `send_group_message` 这种，OneBot 动作名一律 404。
老插件（如 random-welcome 的 `send_private_msg`）在 Milky 号上直接不可用。

**改法**（新增 `src/core/onebotCompat.ts`，`MilkyAdapter.sendApi` 改为走兼容层）：

| OneBot 动作 | Milky 实现 |
|---|---|
| `send_msg` / `send_private_msg` / `send_group_msg` | `send_private_message` / `send_group_message` |
| `delete_msg` | `recall_*_message`（仅接受适配器发出的 base64 messageId） |
| `get_msg` | `get_message` |
| `get_forward_msg` | `get_forwarded_messages` |
| `get_login_info` | `get_login_info` |
| `get_group_info` / `get_group_list` | 同语义 |
| `get_group_member_info` / `get_group_member_list` | 同语义 |
| `get_friend_list` / `get_stranger_info` | 同语义 |
| `set_group_ban` / `set_group_whole_ban` / `set_group_kick` / `set_group_card` / `set_group_name` | 同语义 |
| `send_like` | `send_profile_like` |
| `get_status` / `get_version_info` | 本地合成 |

其余动作一律抛 `MilkyCompatError`，错误信息带动作名和原因。**故意不做全量别名层**：
临时会话、`send_packet`/OIDB、平台原生音乐卡在 Milky 协议层不存在，映射不了；
半套兼容（部分能用、部分静默失败）比明确报错更难排查。

**已知限制**：

- `delete_msg` / `get_msg` 传裸数字 `message_id` 会明确报错——Milky 用 `(scene, peer_id, seq)`
  三元组定位消息，裸数字反推不出场景。要用适配器给出的 base64 messageId。
- `send_forward_msg` 不做映射（node 结构无法等价），请用 `bot.sendForwardMsg`。

## P5 群文件下载链接

**问题**：入站 `file` 段需要 `bot.getFileUrl()`，上游没实现，Yogurt 直接报「此接口未实现」，
文件上传监听类插件每次都会抛错。

**改法**（`src/core/milkyAdapter.ts`）：实现 `getFileUrl`，群文件走 `get_group_file_download_url`；
私聊文件因为协议端要 `file_hash` 而段里不一定带，明确报错而不是拼错链接。

## 自检

```bash
pnpm install --ignore-scripts
npx tsx scripts/selfcheck.mts   # 覆盖段转换、动作映射、明确报错路径
pnpm build
```

## 升级上游

```bash
git fetch upstream
git rebase upstream/main   # 冲突集中在 convert.ts / milkyAdapter.ts
npx tsx scripts/selfcheck.mts && pnpm build
git add -f lib && git commit -m "chore: rebuild lib"
```
