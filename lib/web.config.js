import {
  Cfg,
  dir
} from "./chunk-I5B23PDE.js";

// src/web.config.ts
import { components, defineConfig } from "node-karin";
import _ from "node-karin/lodash";
var web_config_default = defineConfig({
  info: {
    id: dir.name,
    name: "Milky\u9002\u914D\u5668",
    author: {
      name: dir.pkg.author,
      home: "https://github.com/KarinJS",
      avatar: "https://github.com/KarinJS.png"
    },
    icon: {
      name: "Computer",
      size: 24,
      color: "#B2A8D3"
    },
    version: dir.version,
    description: dir.pkg.description
  },
  components: () => [
    components.input.string("webhookToken", {
      label: "WebHook\u9274\u6743Token",
      isRequired: false,
      defaultValue: Cfg.get.webhookToken
    }),
    components.input.number("reconnectMaxCount", {
      label: "\u6700\u5927\u91CD\u8FDE\u6B21\u6570",
      description: "\u8FDE\u63A5\u5931\u8D25\u540E\u7684\u91CD\u8FDE\u6B21\u6570, \u8BBE\u7F6E\u4E3A-1\u8868\u793A\u65E0\u9650\u6B21\u6570",
      defaultValue: Cfg.get.reconnectMaxCount + "",
      rules: [{
        min: -1
      }]
    }),
    components.input.number("reconnectInterval", {
      label: "\u91CD\u8FDE\u95F4\u9694(\u5355\u4F4D\u79D2)",
      description: "\u6BCF\u6B21\u91CD\u8FDE\u7684\u95F4\u9694",
      defaultValue: Cfg.get.reconnectInterval + "",
      rules: [{
        min: 1,
        error: "\u91CD\u8FDE\u95F4\u9694\u5FC5\u987B\u5927\u4E8E0"
      }]
    }),
    components.accordionPro.create(
      "bots",
      Cfg.get.bots.map((item, index) => ({
        title: `Bot ${index + 1}`,
        ...item
      })),
      {
        label: "MilkyBot \u5217\u8868",
        children: components.accordion.createItem("bots-a", {
          children: [
            components.radio.group("protocol", {
              label: "\u8FDE\u63A5\u65B9\u6CD5",
              color: "warning",
              size: "sm",
              isRequired: true,
              radio: [
                components.radio.create("websocket", {
                  label: "WebSocket \u8FDE\u63A5",
                  value: "websocket"
                }),
                components.radio.create("sse", {
                  label: "SSE \u8FDE\u63A5",
                  value: "sse"
                }),
                components.radio.create("webhook", {
                  label: "WebHook \u63A8\u9001",
                  value: "webhook"
                })
              ]
            }),
            components.input.string("url", {
              label: "\u901A\u8BAF\u5730\u5740",
              description: "\u8BF7\u586B\u5199\u4EE5http://\u6216\u8005https://\u5F00\u5934\u7684\u94FE\u63A5",
              placeholder: "\u8BF7\u8F93\u5165url\u94FE\u63A5"
            }),
            components.input.string("token", {
              label: "\u9274\u6743token",
              description: "\u7528\u6765\u8BF7\u6C42\u901A\u8BAF\u5730\u5740\u6240\u4F7F\u7528\u7684Token",
              isRequired: false
            })
          ]
        })
      }
    )
  ],
  save: async (config) => {
    if (_.isEqual(config, Cfg.get)) {
      return {
        success: false,
        message: "\u914D\u7F6E\u6587\u4EF6\u65E0\u53D8\u5316"
      };
    }
    const s = await Cfg.save(config);
    return {
      success: s,
      message: s ? "\u914D\u7F6E\u4FDD\u5B58\u6210\u529F" : "\u914D\u7F6E\u4FDD\u5B58\u5931\u8D25"
    };
  }
});
export {
  web_config_default as default
};
