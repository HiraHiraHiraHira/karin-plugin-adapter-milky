import {
  Bot
} from "../chunk-I5B23PDE.js";

// src/apps/bot.ts
import karin from "node-karin";
var Connect = karin.command(/^#milky上线(.*)?$/i, async (ctx) => {
  const line = ctx.msg.substring(8).trim();
  const [protocol, address] = line.split(",").map((i) => i.trim().toLowerCase());
  if (!protocol || !address) return ctx.reply("\u683C\u5F0F\u9519\u8BEF,\u8BF7\u4F7F\u7528#milky\u4E0A\u7EBF\u901A\u8BAF\u534F\u8BAE,\u901A\u8BAF\u5730\u5740\n\u4F8B\u5982:\n#milky\u4E0A\u7EBFwebsocket,http://127.0.0.1:7860");
  const key = Bot.getKey(protocol, address);
  const bot = Bot.getBot(key);
  if (!bot) return ctx.reply("\u672A\u627E\u5230\u5BF9\u5E94\u7684Bot\uFF0C\u8BF7\u5148\u5728\u914D\u7F6E\u6587\u4EF6\u4E2D\u6DFB\u52A0\u8BE5 protocol/url");
  try {
    await bot.start();
    return ctx.reply("\u5DF2\u53D1\u9001\u4E0A\u7EBF\u6307\u4EE4");
  } catch (err) {
    return ctx.reply(`\u4E0A\u7EBF\u5931\u8D25: ${err.message ?? err}`);
  }
}, { perm: "master" });
export {
  Connect
};
