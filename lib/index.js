import {
  Bot,
  Cfg,
  LoggerAdapter
} from "./chunk-I5B23PDE.js";

// src/index.ts
LoggerAdapter("info", "\u5F00\u59CB\u52A0\u8F7DBot~");
var bots = Cfg.get.bots;
if (bots.length >= 0) {
  for (const v of bots) {
    if (!v.protocol || !v.url) continue;
    Bot.addBot(v);
  }
}
LoggerAdapter("info", `Bot \u52A0\u8F7D\u5B8C\u6210,\u5171 ${bots.length} \u4E2A Bot`);
