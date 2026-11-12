var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/utils/dir.ts
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { karinPathBase } from "node-karin";

// package.json
var package_default = {
  name: "@karinjs/plugin-adapter-milky",
  version: "1.3.3",
  license: "MIT",
  author: "KarinJS",
  type: "module",
  keywords: [
    "karin-plugin",
    "karin-adapter",
    "milky"
  ],
  description: "\u57FA\u4E8EKarin\u7684milky\u534F\u8BAE\u9002\u914D\u5668",
  homepage: "https://github.com/KarinJS/karin-plugin-adapter-milky",
  repository: {
    type: "git",
    url: "git+https://github.com/KarinJS/karin-plugin-adapter-milky.git"
  },
  scripts: {
    app: "node lib/app.js",
    build: "tsup",
    dev: 'cross-env EBV_FILE="development.env" node --import tsx src/app.ts'
  },
  main: "lib/index.js",
  devDependencies: {
    "@karinjs/plugin-basic": "^1.4.4",
    "@karinjs/plugin-puppeteer": "^2.0.2",
    "@saltify/milky-types": "1.2.2",
    "@types/express": "^5.0.6",
    "@types/lodash": "^4.17.23",
    "@types/node": "^25.0.6",
    "@types/ws": "^8.18.1",
    "@ys7zts/karin-plugin-nekostatus": "^1.4.0",
    "cross-env": "^10.1.0",
    eslint: "^9.39.4",
    jiti: "^2.6.1",
    "karin-plugin-ling": "^1.32.2",
    neostandard: "^0.12.2",
    "node-karin": "^1.15.3",
    tsup: "^8.5.1",
    tsx: "^4.21.0",
    typescript: "^6.0.2"
  },
  karin: {
    main: "src/index.ts",
    web: "lib/web.config.js",
    "ts-web": "src/web.config.ts",
    apps: [
      "lib/apps"
    ],
    "ts-apps": [
      "src/apps"
    ],
    static: [
      "resources"
    ],
    files: [
      "config"
    ]
  },
  files: [
    "/lib/**/*.js",
    "/lib/**/*.d.ts",
    "/config/*.json",
    "resources",
    "!lib/app.js"
  ],
  publishConfig: {
    access: "public",
    registry: "https://registry.npmjs.org"
  },
  dependencies: {
    eventsource: "^4.1.0",
    ws: "^8.19.0"
  }
};

// src/utils/dir.ts
var filePath = path.resolve(fileURLToPath(import.meta.url).replace(/\\/g, "/"), "../../..");
if (!fs.existsSync(path.join(filePath, "package.json"))) {
  filePath = path.resolve(fileURLToPath(import.meta.url).replace(/\\/g, "/"), "../..");
}
var dir = {
  /** 插件名 */
  name: package_default.name,
  /** 插件版本 */
  version: package_default.version,
  pkg: package_default,
  /** 插件绝对路径 */
  pluginPath: filePath,
  /** 插件在 @karinjs 中的目录 */
  get BaseDir() {
    return path.join(karinPathBase, this.name);
  },
  /** 配置文件路径 */
  get ConfigDir() {
    return path.join(this.BaseDir, "config");
  }
};

// src/utils/utils.ts
import { logger } from "node-karin";
var RandomToken = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};
var LoggerAdapter = (level, ...args) => logger[level](logger.violet(`[${dir.name}] `), ...args);

// src/core/milkyAdapter.ts
import karin3, { AdapterBase, contactFriend as contactFriend5, contactGroup as contactGroup5, contactGroupTemp as contactGroupTemp3, logger as logger4, registerBot, unregisterBot } from "node-karin";

// src/core/client/index.ts
import axios from "node-karin/axios";

// src/core/client/system.ts
var getLoginInfo = (ctx) => ctx.request("/get_login_info", {});
var getImplInfo = (ctx) => ctx.request("/get_impl_info", {});
var getUserProfile = (ctx, userId) => ctx.request("/get_user_profile", { user_id: +userId });
var getFriendList = (ctx, noCache = false) => ctx.request("/get_friend_list", { no_cache: noCache });
var getFriendInfo = (ctx, userId, noCache = false) => ctx.request("/get_friend_info", { user_id: +userId, no_cache: noCache });
var getGroupList = (ctx, noCache = false) => ctx.request("/get_group_list", { no_cache: noCache });
var getGroupInfo = (ctx, groupId, noCache = false) => ctx.request("/get_group_info", { group_id: +groupId, no_cache: noCache });
var getGroupMemberList = (ctx, groupId, noCache = false) => ctx.request("/get_group_member_list", { group_id: +groupId, no_cache: noCache });
var getGroupMemberInfo = (ctx, groupId, userId, noCache = false) => ctx.request("/get_group_member_info", { group_id: +groupId, user_id: +userId, no_cache: noCache });
var getPeerPins = (ctx) => ctx.request("/get_peer_pins", {});
var setPeerPin = (ctx, scene, peerId, isPinned = true) => ctx.request("/set_peer_pin", { message_scene: scene, peer_id: peerId, is_pinned: isPinned });
var setAvatar = (ctx, uri) => ctx.request("/set_avatar", { uri });
var setNickName = (ctx, name) => ctx.request("/set_nickname", { new_nickname: name });
var setBio = (ctx, bio) => ctx.request("/set_bio", { new_bio: bio });
var getCustomFaceUrlList = (ctx) => ctx.request("/get_custom_face_url_list", {});
var getCookies = (ctx, domain) => ctx.request("/get_cookies", { domain });
var getCSRFToken = (ctx) => ctx.request("/get_csrf_token", {});

// src/core/client/friend.ts
var sendFriendNudge = (ctx, userId, isSelf = false) => ctx.request("/send_friend_nudge", { user_id: +userId, is_self: isSelf });
var sendProfileLike = (ctx, userId, count = 1) => ctx.request("/send_profile_like", { user_id: +userId, count });
var deleteFriend = (ctx, userId) => ctx.request("/delete_friend", { user_id: +userId });
var getFriendRequests = (ctx, limit = 20, isFiltered = false) => ctx.request("/get_friend_requests", { limit, is_filtered: isFiltered });
var acceptFriendRequest = (ctx, initiatorUid, isFiltered = false) => ctx.request("/accept_friend_request", { initiator_uid: initiatorUid, is_filtered: isFiltered });
var rejectFriendRequest = (ctx, initiatorUid, isFiltered = false, reason = "") => ctx.request("/reject_friend_request", { initiator_uid: initiatorUid, is_filtered: isFiltered, reason });

// src/core/client/group.ts
var setGroupName = (ctx, groupId, name) => ctx.request("/set_group_name", { group_id: +groupId, new_group_name: name });
var setGroupAvatar = (ctx, groupId, uri) => ctx.request("/set_group_avatar", { group_id: +groupId, image_uri: uri });
var setGroupMemberCard = (ctx, groupId, userId, card) => ctx.request("/set_group_member_card", { group_id: +groupId, user_id: +userId, card });
var setGroupMemberSpecialTitle = (ctx, groupId, userId, title) => ctx.request("/set_group_member_special_title", { group_id: +groupId, user_id: +userId, special_title: title });
var setGroupMemberAdmin = (ctx, groupId, userId, isSet = true) => ctx.request("/set_group_member_admin", { group_id: +groupId, user_id: +userId, is_set: isSet });
var setGroupMemberMute = (ctx, groupId, userId, duration = 0) => ctx.request("/set_group_member_mute", { group_id: +groupId, user_id: +userId, duration });
var setGroupWholeMute = (ctx, groupId, isMute = true) => ctx.request("/set_group_whole_mute", { group_id: +groupId, is_mute: isMute });
var kickGroupMember = (ctx, groupId, userId, rejectRequest = false) => ctx.request("/kick_group_member", { group_id: +groupId, user_id: +userId, reject_add_request: rejectRequest });
var getGroupAnnouncements = (ctx, groupId) => ctx.request("/get_group_announcements", { group_id: +groupId });
var sendGroupAnnouncement = (ctx, groupId, content, uri) => ctx.request("/send_group_announcement", { group_id: +groupId, content, image_uri: uri });
var deleteGroupAnnouncement = (ctx, groupId, id) => ctx.request("/delete_group_announcement", { group_id: +groupId, announcement_id: String(id) });
var getGroupEssenceMessages = (ctx, groupId, pageIndex, pageSize) => ctx.request("/get_group_essence_messages", { group_id: +groupId, page_index: +pageIndex, page_size: +pageSize });
var setGroupEssenceMessage = (ctx, groupId, messageSeq, isSet = true) => ctx.request("/set_group_essence_message", { group_id: +groupId, message_seq: messageSeq, is_set: isSet });
var quitGroup = (ctx, groupId) => ctx.request("/quit_group", { group_id: +groupId });
var sendGroupMessageReaction = (ctx, groupId, messageSeq, reaction, reactionType, isAdd = true) => ctx.request("/send_group_message_reaction", { group_id: +groupId, message_seq: messageSeq, reaction, reaction_type: reactionType, is_add: isAdd });
var sendGroupNudge = (ctx, groupId, userId) => ctx.request("/send_group_nudge", { group_id: +groupId, user_id: +userId });
var getGroupNotifications = (ctx, start, isFiltered = false, limit = 20) => ctx.request("/get_group_notifications", { start_notification_seq: start, is_filtered: isFiltered, limit });
var acceptGroupRequest = (ctx, noticeId, noticeType, groupId, isFiltered = false) => ctx.request("/accept_group_request", { notification_seq: noticeId, notification_type: noticeType, group_id: +groupId, is_filtered: isFiltered });
var rejectGroupRequest = (ctx, noticeId, noticeType, groupId, isFiltered = false, reason) => ctx.request("/reject_group_request", { notification_seq: noticeId, notification_type: noticeType, group_id: +groupId, is_filtered: isFiltered, reason });
var acceptGroupInvitation = (ctx, groupId, invitationSeq) => ctx.request("/accept_group_invitation", { group_id: +groupId, invitation_seq: invitationSeq });
var rejectGroupInvitation = (ctx, groupId, invitationSeq) => ctx.request("/reject_group_invitation", { group_id: +groupId, invitation_seq: invitationSeq });

// src/core/client/message.ts
var sendPrivateMessage = (ctx, userId, message) => ctx.request("/send_private_message", { user_id: +userId, message });
var sendGroupMessage = (ctx, groupId, message) => ctx.request("/send_group_message", { group_id: +groupId, message });
var recallPrivateMessage = (ctx, userId, messageSeq) => ctx.request("/recall_private_message", { user_id: +userId, message_seq: +messageSeq });
var recallGroupMessage = (ctx, groupId, messageSeq) => ctx.request("/recall_group_message", { group_id: +groupId, message_seq: +messageSeq });
var getMessage = (ctx, scene, peerId, messageSeq) => ctx.request("/get_message", { message_scene: scene, peer_id: +peerId, message_seq: +messageSeq });
var getHistoryMessage = (ctx, scene, peerId, start, limit = 20) => ctx.request("/get_history_messages", { message_scene: scene, peer_id: +peerId, start_message_seq: start, limit });
var getResourceTempUrl = (ctx, resourceId) => ctx.request("/get_resource_temp_url", { resource_id: resourceId });
var getForwardedMessage = (ctx, forwardId) => ctx.request("/get_forwarded_messages", { forward_id: forwardId });
var markMessageAsRead = (ctx, scene, peerId, messageSeq) => ctx.request("/mark_message_as_read", { message_scene: scene, peer_id: +peerId, message_seq: +messageSeq });

// src/core/client/file.ts
var uploadPrivateFile = (ctx, userId, fileUri, fileName) => ctx.request("/upload_private_file", { user_id: +userId, file_uri: fileUri, file_name: fileName });
var uploadGroupFile = (ctx, groupId, folderId = "/", fileUri, fileName) => ctx.request("/upload_group_file", { group_id: +groupId, parent_folder_id: folderId, file_uri: fileUri, file_name: fileName });
var getPrivateFileDownloadUrl = (ctx, userId, fileId, fileHash) => ctx.request("/get_private_file_download_url", { user_id: +userId, file_id: fileId, file_hash: fileHash });
var getGroupFileDownloadUrl = (ctx, groupId, fileId) => ctx.request("/get_group_file_download_url", { group_id: +groupId, file_id: fileId });
var getGroupFiles = (ctx, groupId, folderId = "/") => ctx.request("/get_group_files", { group_id: +groupId, parent_folder_id: folderId });
var moveGroupFile = (ctx, groupId, fileId, folderId = "/", targetId = "/") => ctx.request("/move_group_file", { group_id: +groupId, file_id: fileId, parent_folder_id: folderId, target_folder_id: targetId });
var renameGroupFile = (ctx, groupId, fileId, folderId = "/", newName) => ctx.request("/rename_group_file", { group_id: +groupId, file_id: fileId, parent_folder_id: folderId, new_file_name: newName });
var deleteGroupFile = (ctx, groupId, fileId) => ctx.request("/delete_group_file", { group_id: +groupId, file_id: fileId });
var createGroupFolder = (ctx, groupId, folderName) => ctx.request("/create_group_folder", { group_id: +groupId, folder_name: folderName });
var renameGroupFolder = (ctx, groupId, folderId, newName) => ctx.request("/rename_group_folder", { group_id: +groupId, folder_id: folderId, new_folder_name: newName });
var deleteGroupFolder = (ctx, groupId, folderId) => ctx.request("/delete_group_folder", { group_id: +groupId, folder_id: folderId });

// src/core/client/msgId.ts
function encodeVarint(value) {
  if (value < 0) throw new Error("value\u4E0D\u53EF\u4E3A\u8D1F");
  const bytes = [];
  while (value > 127) {
    bytes.push(value & 127 | 128);
    value >>>= 7;
  }
  bytes.push(value);
  return bytes;
}
function decodeVarint(buffer, offset) {
  let result = 0;
  let shift = 0;
  while (true) {
    if (offset.index >= buffer.length) throw new Error("\u6570\u636E\u4E0D\u6B63\u786E");
    const byte = buffer[offset.index++];
    result |= (byte & 127) << shift;
    if ((byte & 128) === 0) break;
    shift += 7;
    if (shift > 35) throw new Error("\u6570\u636E\u8FC7\u5927");
  }
  return result;
}
function encodeMsgId(scene, peerId, seq) {
  const sceneId = scene === "group" ? 0 : scene === "friend" ? 1 : 2;
  const bytes = [
    ...encodeVarint(sceneId),
    ...encodeVarint(peerId),
    ...encodeVarint(seq)
  ];
  return Buffer.from(bytes).toString("base64").replace(/=+$/, "");
}
function decodeMsgId(msgid) {
  msgid += "===".slice((msgid.length + 3) % 4);
  const buffer = Buffer.from(msgid, "base64");
  const offset = { index: 0 };
  const sceneId = decodeVarint(buffer, offset);
  const scene = sceneId === 0 ? "group" : sceneId === 1 ? "friend" : "temp";
  const peerId = decodeVarint(buffer, offset);
  const seq = decodeVarint(buffer, offset);
  return { scene, peerId, seq };
}

// src/core/client/index.ts
var Client = class {
  #axios;
  #ctx;
  constructor(url, bot) {
    this.#axios = axios.create({
      baseURL: new URL("api", `${url.endsWith("/") ? url : `${url}/`}`).toString(),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    this.#axios.interceptors.request.use((config) => {
      const token = bot.adapter.secret;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    this.#ctx = { request: this.request.bind(this) };
  }
  async request(path3, data) {
    const res = await this.#axios.post(path3, data ?? {});
    if (res.data.status === "failed") {
      throw new Error(res.data.message);
    }
    return res.data.data;
  }
  /* === system === */
  getLoginInfo = () => getLoginInfo(this.#ctx);
  getImplInfo = () => getImplInfo(this.#ctx);
  getUserProfile = (userId) => getUserProfile(this.#ctx, userId);
  getFriendList = (noCache) => getFriendList(this.#ctx, noCache);
  getFriendInfo = (userId, noCache) => getFriendInfo(this.#ctx, userId, noCache);
  getGroupList = (noCache) => getGroupList(this.#ctx, noCache);
  getGroupInfo = (groupId, noCache) => getGroupInfo(this.#ctx, groupId, noCache);
  getGroupMemberList = (groupId, noCache) => getGroupMemberList(this.#ctx, groupId, noCache);
  getGroupMemberInfo = (groupId, userId, noCache) => getGroupMemberInfo(this.#ctx, groupId, userId, noCache);
  getPeerPins = () => getPeerPins(this.#ctx);
  setPeerPin = (scene, peerId, isPinned) => setPeerPin(this.#ctx, scene, peerId, isPinned);
  setAvatar = (uri) => setAvatar(this.#ctx, uri);
  setNickName = (name) => setNickName(this.#ctx, name);
  setBio = (bio) => setBio(this.#ctx, bio);
  getCustomFaceUrlList = () => getCustomFaceUrlList(this.#ctx);
  getCookies = (domain) => getCookies(this.#ctx, domain);
  getCSRFToken = () => getCSRFToken(this.#ctx);
  /* === friend === */
  sendFriendNudge = (userId, isSelf) => sendFriendNudge(this.#ctx, userId, isSelf);
  sendProfileLike = (userId, count) => sendProfileLike(this.#ctx, userId, count);
  deleteFriend = (userId) => deleteFriend(this.#ctx, userId);
  getFriendRequests = (limit, isFiltered) => getFriendRequests(this.#ctx, limit, isFiltered);
  acceptFriendRequest = (initiatorUid, isFiltered) => acceptFriendRequest(this.#ctx, initiatorUid, isFiltered);
  rejectFriendRequest = (initiatorUid, isFiltered, reason) => rejectFriendRequest(this.#ctx, initiatorUid, isFiltered, reason);
  /* === group === */
  setGroupName = (groupId, name) => setGroupName(this.#ctx, groupId, name);
  setGroupAvatar = (groupId, uri) => setGroupAvatar(this.#ctx, groupId, uri);
  setGroupMemberCard = (groupId, userId, card) => setGroupMemberCard(this.#ctx, groupId, userId, card);
  setGroupMemberSpecialTitle = (groupId, userId, title) => setGroupMemberSpecialTitle(this.#ctx, groupId, userId, title);
  setGroupMemberAdmin = (groupId, userId, isSet) => setGroupMemberAdmin(this.#ctx, groupId, userId, isSet);
  setGroupMemberMute = (groupId, userId, duration) => setGroupMemberMute(this.#ctx, groupId, userId, duration);
  setGroupWholeMute = (groupId, isMute) => setGroupWholeMute(this.#ctx, groupId, isMute);
  kickGroupMember = (groupId, userId, rejectRequest) => kickGroupMember(this.#ctx, groupId, userId, rejectRequest);
  getGroupAnnouncements = (groupId) => getGroupAnnouncements(this.#ctx, groupId);
  sendGroupAnnouncement = (groupId, content, uri) => sendGroupAnnouncement(this.#ctx, groupId, content, uri);
  deleteGroupAnnouncement = (groupId, id) => deleteGroupAnnouncement(this.#ctx, groupId, id);
  getGroupEssenceMessages = (groupId, pageIndex, pageSize) => getGroupEssenceMessages(this.#ctx, groupId, pageIndex, pageSize);
  setGroupEssenceMessage = (groupId, messageSeq, isSet) => setGroupEssenceMessage(this.#ctx, groupId, messageSeq, isSet);
  quitGroup = (groupId) => quitGroup(this.#ctx, groupId);
  setGroupMessageReaction = (groupId, messageSeq, reaction, reactionType, isAdd) => sendGroupMessageReaction(this.#ctx, groupId, messageSeq, reaction, reactionType, isAdd);
  sendGroupNudge = (groupId, userId) => sendGroupNudge(this.#ctx, groupId, userId);
  getGroupNotifications = (start, isFiltered, limit) => getGroupNotifications(this.#ctx, start, isFiltered, limit);
  acceptGroupRequest = (noticeId, noticeType, groupId, isFiltered) => acceptGroupRequest(this.#ctx, noticeId, noticeType, groupId, isFiltered);
  rejectGroupRequest = (noticeId, noticeType, groupId, isFiltered, reason) => rejectGroupRequest(this.#ctx, noticeId, noticeType, groupId, isFiltered, reason);
  acceptGroupInvitation = (groupId, invitationSeq) => acceptGroupInvitation(this.#ctx, groupId, invitationSeq);
  rejectGroupInvitation = (groupId, invitationSeq) => rejectGroupInvitation(this.#ctx, groupId, invitationSeq);
  /* === message === */
  sendPrivateMessage = (userId, message) => sendPrivateMessage(this.#ctx, userId, message);
  sendGroupMessage = (groupId, message) => sendGroupMessage(this.#ctx, groupId, message);
  recallPrivateMessage = (userId, messageSeq) => recallPrivateMessage(this.#ctx, userId, messageSeq);
  recallGroupMessage = (groupId, messageSeq) => recallGroupMessage(this.#ctx, groupId, messageSeq);
  getMessage = (scene, peerId, messageSeq) => getMessage(this.#ctx, scene, peerId, messageSeq);
  getHistoryMessage = (scene, peerId, start, limit) => getHistoryMessage(this.#ctx, scene, peerId, start, limit);
  getResourceTempUrl = (resourceId) => getResourceTempUrl(this.#ctx, resourceId);
  getForwardedMessage = (forwardId) => getForwardedMessage(this.#ctx, forwardId);
  markMessageAsRead = (scene, peerId, messageSeq) => markMessageAsRead(this.#ctx, scene, peerId, messageSeq);
  /* === file === */
  uploadPrivateFile = (userId, fileUri, fileName) => uploadPrivateFile(this.#ctx, userId, fileUri, fileName);
  uploadGroupFile = (groupId, folderId, fileUri, fileName) => uploadGroupFile(this.#ctx, groupId, folderId, fileUri, fileName);
  getPrivateFileDownloadUrl = (userId, fileId, fileHash) => getPrivateFileDownloadUrl(this.#ctx, userId, fileId, fileHash);
  getGroupFileDownloadUrl = (groupId, fileId) => getGroupFileDownloadUrl(this.#ctx, groupId, fileId);
  getGroupFiles = (groupId, folderId) => getGroupFiles(this.#ctx, groupId, folderId);
  moveGroupFile = (groupId, fileId, folderId, targetId) => moveGroupFile(this.#ctx, groupId, fileId, folderId, targetId);
  renameGroupFile = (groupId, fileId, folderId, newName) => renameGroupFile(this.#ctx, groupId, fileId, folderId, newName);
  deleteGroupFile = (groupId, fileId) => deleteGroupFile(this.#ctx, groupId, fileId);
  createGroupFolder = (groupId, folderName) => createGroupFolder(this.#ctx, groupId, folderName);
  renameGroupFolder = (groupId, folderId, newName) => renameGroupFolder(this.#ctx, groupId, folderId, newName);
  deleteGroupFolder = (groupId, folderId) => deleteGroupFolder(this.#ctx, groupId, folderId);
  /* === msgId 工具（纯函数转发，保持调用方 bot.super.encodeMsgId 兼容） === */
  encodeMsgId = encodeMsgId;
  decodeMsgId = decodeMsgId;
  encodeVarint = encodeVarint;
  decodeVarint = decodeVarint;
};

// src/event/convert.ts
import { promises as fs2 } from "fs";
import { contactFriend, contactGroup, contactGroupTemp, segment as segment2 } from "node-karin";

// src/event/segment.ts
var segment = {
  /** 构建文本元素
   * @param text 文本内容
   */
  text(text) {
    return { type: "text", data: { text: String(text) } };
  },
  /** 构建at元素
   * @param target 'all' 或 用户ID
   */
  at(target) {
    if (target === "all") {
      return { type: "mention_all", data: {} };
    }
    return { type: "mention", data: { user_id: +target } };
  },
  /** 构建表情元素
   * @param id 表情ID
   * @param isLarge 是否大表情
   */
  face(id, isLarge) {
    return { type: "face", data: { face_id: String(id), is_large: isLarge ?? false } };
  },
  /** 构建回复消息元素
   * @param messageSeq 消息序号
   */
  reply(messageSeq) {
    return { type: "reply", data: { message_seq: +messageSeq } };
  },
  /** 构建图片元素
   * @param uri uri 支持 file:// http(s):// base64:// 等格式
   * @param options 其他选项
   */
  image(uri, options) {
    return {
      type: "image",
      data: {
        uri,
        sub_type: options?.subType ?? "normal",
        summary: options?.summary
      }
    };
  },
  /** 构建语音元素
   * @param uri uri 支持 file:// http(s):// base64:// 等格式
   */
  record(uri) {
    return { type: "record", data: { uri } };
  },
  /** 构建视频元素
   * @param uri uri 支持 file:// http(s):// base64:// 等格式
   * @param options 其他选项（如封面图）
   */
  video(uri, options) {
    return { type: "video", data: { uri, thumb_uri: options?.thumbUri } };
  },
  fake(userId, messages, nickname) {
    return {
      user_id: userId,
      sender_name: nickname || "",
      segments: messages
    };
  },
  node(elements, options) {
    const msgs = {
      type: "forward",
      data: {
        messages: elements,
        title: options?.title,
        preview: options?.preview,
        summary: options?.summary,
        prompt: options?.prompt
      }
    };
    return [msgs];
  }
};

// src/core/onebotCompat.ts
var MilkyCompatError = class extends Error {
  action;
  constructor(message, action) {
    super(message);
    this.name = "MilkyCompatError";
    this.action = action;
  }
};
var normalizeUri = (uri) => {
  const match = /^data:[^;,]*;base64,(.+)$/s.exec(String(uri));
  return match ? `base64://${match[1]}` : String(uri);
};
function seqForReply(id) {
  const raw = String(id);
  if (/^\d+$/.test(raw)) return Number(raw);
  return resolveMessageId(raw).seq;
}
function seqFromMessageId(id) {
  return seqForReply(id);
}
function resolveMessageId(id) {
  const raw = String(id);
  if (/^\d+$/.test(raw)) {
    throw new MilkyCompatError(
      `\u6536\u5230\u88F8\u6570\u5B57 message_id=${raw}\uFF1AMilky \u7528 (scene, peer_id, seq) \u4E09\u5143\u7EC4\u5B9A\u4F4D\u6D88\u606F\uFF0C\u65E0\u6CD5\u53CD\u63A8\u573A\u666F\u3002\u8BF7\u4F20\u9002\u914D\u5668\u7ED9\u51FA\u7684 messageId\uFF08base64 \u5B57\u7B26\u4E32\uFF09\uFF0C\u6216\u5728\u63D2\u4EF6\u91CC\u76F4\u63A5\u7528 sendMsg \u7684\u8FD4\u56DE\u503C`
    );
  }
  try {
    const res = decodeMsgId(raw);
    if (res.seq > 0) return res;
  } catch {
  }
  throw new MilkyCompatError(`\u65E0\u6CD5\u89E3\u6790 message_id=${raw}`);
}
function oneBotToMilky(message) {
  if (typeof message === "string") return [segment.text(message)];
  if (!Array.isArray(message)) {
    throw new MilkyCompatError("message \u5FC5\u987B\u662F OneBot \u6BB5\u6570\u7EC4\u6216\u5B57\u7B26\u4E32");
  }
  const out = [];
  for (const seg of message) {
    const d = seg?.data ?? {};
    switch (seg?.type) {
      case "text":
        out.push(segment.text(String(d.text ?? "")));
        break;
      case "at":
        out.push(segment.at(String(d.qq) === "all" ? "all" : Number(d.qq)));
        break;
      case "face":
        out.push(segment.face(Number(d.id)));
        break;
      case "reply":
        out.push(segment.reply(seqForReply(d.id)));
        break;
      case "image":
        out.push(segment.image(normalizeUri(d.file ?? d.url ?? ""), {
          subType: d.sub_type === 1 || d.sub_type === "sticker" ? "sticker" : "normal",
          summary: d.summary
        }));
        break;
      case "record":
        out.push(segment.record(normalizeUri(d.file ?? "")));
        break;
      case "video":
        out.push(segment.video(normalizeUri(d.file ?? "")));
        break;
      case "json":
        out.push({ type: "light_app", data: { json_payload: String(d.data ?? d.json ?? "") } });
        break;
      default:
        throw new MilkyCompatError(
          `OneBot \u6BB5 "${seg?.type}" \u5728 Milky \u4E0B\u6CA1\u6709\u5BF9\u5E94\u5B9E\u73B0\uFF0C\u62D2\u7EDD\u9759\u9ED8\u964D\u7EA7\u4E3A\u6587\u672C`,
          "message"
        );
    }
  }
  return out;
}
function unsupported(action) {
  throw new MilkyCompatError(
    `[milky-compat] \u4E0D\u652F\u6301\u7684 OneBot \u52A8\u4F5C\uFF1A${action}\u3002Milky \u534F\u8BAE\u6CA1\u6709\u5BF9\u5E94\u80FD\u529B\uFF08\u4E34\u65F6\u4F1A\u8BDD / send_packet / OIDB / \u5E73\u53F0\u97F3\u4E50\u5361\u7B49\uFF09\uFF0C\u8BF7\u6539\u7528\u9002\u914D\u5668\u66B4\u9732\u7684 Karin API\uFF0C\u6216\u5728\u63D2\u4EF6\u91CC\u6309 adapter.standard \u5206\u652F\u5904\u7406`,
    action
  );
}
async function invokeOneBotAction(bot, action, params = {}) {
  const act = String(action).replace(/^(nc_|lgl_)/, "");
  const p = params ?? {};
  switch (act) {
    /* === 发送 === */
    case "send_msg": {
      const type = p.message_type ?? (p.group_id ? "group" : "private");
      if (type === "group") return invokeOneBotAction(bot, "send_group_msg", p);
      if (type === "private") return invokeOneBotAction(bot, "send_private_msg", p);
      return unsupported(`${act}(message_type=${type})`);
    }
    case "send_private_msg": {
      if (p.user_id == null) throw new MilkyCompatError("send_private_msg \u7F3A\u5C11 user_id", act);
      const userId = Number(p.user_id);
      const res = await bot.super.sendPrivateMessage(userId, oneBotToMilky(p.message));
      return { message_id: bot.super.encodeMsgId("friend", userId, res.message_seq), time: res.time };
    }
    case "send_group_msg": {
      if (p.group_id == null) throw new MilkyCompatError("send_group_msg \u7F3A\u5C11 group_id", act);
      const groupId = Number(p.group_id);
      const res = await bot.super.sendGroupMessage(groupId, oneBotToMilky(p.message));
      return { message_id: bot.super.encodeMsgId("group", groupId, res.message_seq), time: res.time };
    }
    case "send_forward_msg":
      throw new MilkyCompatError(
        "send_forward_msg \u7684 node \u7ED3\u6784\u65E0\u6CD5\u7B49\u4EF7\u6620\u5C04\uFF0C\u8BF7\u6539\u7528 bot.sendForwardMsg\uFF08\u9002\u914D\u5668\u5DF2\u5B9E\u73B0\uFF09",
        act
      );
    /* === 消息操作 === */
    case "delete_msg": {
      const { scene, peerId, seq } = resolveMessageId(p.message_id);
      if (scene === "group") await bot.super.recallGroupMessage(peerId, seq);
      else if (scene === "friend") await bot.super.recallPrivateMessage(peerId, seq);
      else unsupported(`${act}(scene=temp)`);
      return {};
    }
    case "get_msg": {
      const { scene, peerId, seq } = resolveMessageId(p.message_id);
      if (scene === "temp") return unsupported(`${act}(scene=temp)`);
      const res = await bot.super.getMessage(scene, peerId, seq);
      const m = res.message;
      const sender = m.message_scene === "friend" ? m.friend : m.message_scene === "group" ? m.group_member : null;
      return {
        message_id: bot.super.encodeMsgId(m.message_scene, m.peer_id, m.message_seq),
        message_seq: m.message_seq,
        time: m.time,
        message_type: m.message_scene,
        sender: sender ? { user_id: sender.user_id ?? m.sender_id, nickname: sender.nickname, card: sender.card ?? "" } : { user_id: m.sender_id },
        raw_message: "",
        message: m.segments
      };
    }
    case "get_forward_msg": {
      const res = await bot.super.getForwardedMessage(String(p.id ?? p.message_id ?? ""));
      return { messages: res.messages };
    }
    /* === 信息查询 === */
    case "get_login_info": {
      const info = await bot.super.getLoginInfo();
      return { user_id: info.uin, nickname: info.nickname };
    }
    case "get_group_info": {
      const res = await bot.super.getGroupInfo(Number(p.group_id), p.no_cache);
      const g = res.group;
      return {
        group_id: g.group_id,
        group_name: g.group_name,
        member_count: g.member_count,
        max_member_count: g.max_member_count
      };
    }
    case "get_group_list": {
      const res = await bot.super.getGroupList(p.no_cache);
      return res.groups;
    }
    case "get_group_member_info": {
      const res = await bot.super.getGroupMemberInfo(Number(p.group_id), Number(p.user_id), p.no_cache);
      const m = res.member;
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
      };
    }
    case "get_group_member_list": {
      const res = await bot.super.getGroupMemberList(Number(p.group_id), p.no_cache);
      return res.members;
    }
    case "get_friend_list": {
      const res = await bot.super.getFriendList(p.no_cache);
      return res.friends;
    }
    case "get_stranger_info": {
      const res = await bot.super.getUserProfile(Number(p.user_id));
      return res;
    }
    /* === 群管理 === */
    case "set_group_ban": {
      await bot.super.setGroupMemberMute(Number(p.group_id), Number(p.user_id), Number(p.duration ?? 0));
      return {};
    }
    case "set_group_whole_ban": {
      await bot.super.setGroupWholeMute(Number(p.group_id), Boolean(p.enable));
      return {};
    }
    case "set_group_kick": {
      await bot.super.kickGroupMember(Number(p.group_id), Number(p.user_id), Boolean(p.reject_add_request));
      return {};
    }
    case "set_group_card": {
      await bot.super.setGroupMemberCard(Number(p.group_id), Number(p.user_id), String(p.card ?? ""));
      return {};
    }
    case "set_group_name": {
      await bot.super.setGroupName(Number(p.group_id), String(p.group_name ?? ""));
      return {};
    }
    case "set_group_portrait":
    case "set_group_avatar": {
      const uri = p.file ?? p.url ?? p.portrait;
      if (!uri) throw new MilkyCompatError("set_group_portrait \u7F3A\u5C11 file/url \u53C2\u6570", act);
      await bot.super.setGroupAvatar(Number(p.group_id), normalizeUri(String(uri)));
      return {};
    }
    case "send_like": {
      await bot.super.sendProfileLike(Number(p.user_id), Number(p.times ?? 1));
      return {};
    }
    /* === 状态 === */
    case "get_status":
    case "get_version_info":
      return {
        online: true,
        good: true,
        app_name: "karin-adapter-milky",
        app_version: bot.adapter.version,
        protocol: "milky",
        impl: bot.adapter.protocol
      };
    default:
      return unsupported(act);
  }
}

// src/event/convert.ts
var FORWARD_MAX_NODES = 10;
var FORWARD_MAX_TEXT = 500;
var FILE_URI_MAX_BYTES = 64 * 1024 * 1024;
var mountMap = null;
function readMountMap() {
  if (mountMap) return mountMap;
  mountMap = [];
  try {
    const info = __require("fs").readFileSync("/proc/self/mountinfo", "utf8");
    for (const line of info.split("\n")) {
      const parts = line.split(" ");
      if (parts.length < 5) continue;
      const host = parts[3];
      const container = parts[4];
      if (!host.startsWith("/") || host === "/" || !container.startsWith("/")) continue;
      mountMap.push({ host, container });
    }
  } catch {
  }
  mountMap.sort((a, b) => b.container.length - a.container.length);
  return mountMap;
}
function toHostPath(path3) {
  for (const m of readMountMap()) {
    if (path3 === m.container || path3.startsWith(m.container.endsWith("/") ? m.container : m.container + "/")) {
      return m.host + path3.slice(m.container.length);
    }
  }
  return null;
}
async function localizeUri(uri, bot) {
  const raw = String(uri ?? "");
  if (!raw.startsWith("file://")) return normalizeUri(raw);
  let path3 = raw.slice("file://".length);
  try {
    path3 = decodeURIComponent(path3);
  } catch {
  }
  if (!path3.startsWith("/")) path3 = "/" + path3;
  let size = -1;
  try {
    const stat = await fs2.stat(path3);
    if (!stat.isFile()) return raw;
    size = stat.size;
  } catch {
    return raw;
  }
  const hostPath = toHostPath(path3);
  if (hostPath) return `file://${hostPath}`;
  if (size > FILE_URI_MAX_BYTES) {
    bot?.logger("warn", `[milky] \u672C\u5730\u6587\u4EF6 ${path3} \u6709 ${(size / 1024 / 1024).toFixed(1)}MB\uFF0C\u8D85\u8FC7 base64 \u515C\u5E95\u4E0A\u9650 ${FILE_URI_MAX_BYTES / 1024 / 1024}MB\uFF0C\u6309\u539F\u6837\u53D1\u7ED9\u534F\u8BAE\u7AEF`);
    return raw;
  }
  try {
    const buf = await fs2.readFile(path3);
    return `base64://${buf.toString("base64")}`;
  } catch {
    return raw;
  }
}
async function AdapterConvertKarin(event, bot, depth = 0) {
  const data = event.segments;
  const elements = [];
  for (const i of data) {
    switch (i.type) {
      case "text":
        elements.push(segment2.text(i.data.text));
        break;
      case "mention":
        elements.push(segment2.at(String(i.data.user_id), i.data.name));
        break;
      case "mention_all":
        elements.push(segment2.at("all"));
        break;
      case "face":
        elements.push(segment2.face(Number(i.data.face_id)));
        break;
      case "reply":
        elements.push(segment2.reply(bot.super.encodeMsgId(event.message_scene, event.peer_id, i.data.message_seq)));
        break;
      case "image":
        elements.push(segment2.image(i.data.temp_url, { width: i.data.width, height: i.data.height, subType: i.data.sub_type, summary: i.data.summary }));
        break;
      case "record":
        elements.push(segment2.record(i.data.temp_url));
        break;
      case "video":
        elements.push(segment2.video(i.data.temp_url, { width: i.data.width, height: i.data.height }));
        break;
      case "file": {
        const contact = event.message_scene === "friend" ? contactFriend(event.peer_id + "") : event.message_scene === "group" ? contactGroup(event.peer_id + "") : contactGroupTemp(event.group?.group_id + "", event.sender_id + "");
        const url = await bot.getFileUrl(contact, i.data.file_id);
        elements.push(segment2.file(url, { fid: i.data.file_id, name: i.data.file_name, size: i.data.file_size, hash: i.data.file_hash || void 0 }));
        break;
      }
      case "forward": {
        const parts = [];
        if ("title" in i.data && i.data.title) parts.push(String(i.data.title));
        if ("summary" in i.data && i.data.summary) parts.push(String(i.data.summary));
        if (depth >= 1) {
          parts.push(`forward_id=${i.data.forward_id}`);
          elements.push(segment2.text(`[\u5408\u5E76\u8F6C\u53D1 ${parts.join(" / ")}]`));
          break;
        }
        try {
          const nodes = await bot.getForwardMsg(i.data.forward_id, depth + 1);
          if (!nodes.length) throw new Error("\u8F6C\u53D1\u5185\u5BB9\u4E3A\u7A7A");
          let n = 0;
          for (const node of nodes) {
            if (n >= FORWARD_MAX_NODES) {
              elements.push(segment2.text("\u2026"));
              break;
            }
            for (const el of node.elements || []) {
              const any = el;
              if (el.type === "text") {
                elements.push(segment2.text(String(any.text ?? any.data?.text ?? "").slice(0, FORWARD_MAX_TEXT)));
              } else if (el.type === "at") {
                elements.push(segment2.text("@" + (any.name || any.targetId || any.data?.name || any.data?.qq || "")));
              } else if (el.type === "image") {
                const uri = any.file || any.url || any.data?.file || any.data?.url;
                if (uri) elements.push(segment2.image(uri));
                else elements.push(segment2.text("[\u56FE\u7247]"));
              } else if (el.type === "face") {
                elements.push(segment2.text("[\u8868\u60C5]"));
              } else {
                elements.push(segment2.text(`[${el.type}]`));
              }
            }
            elements.push(segment2.text("\n"));
            n += 1;
          }
        } catch (err) {
          bot.logger("warn", `\u5408\u5E76\u8F6C\u53D1\u5C55\u5F00\u5931\u8D25 forward_id=${i.data.forward_id}: ${err?.message ?? err}`);
          parts.push(`forward_id=${i.data.forward_id}`);
          elements.push(segment2.text(`[\u5408\u5E76\u8F6C\u53D1 ${parts.join(" / ")}]`));
        }
        break;
      }
      case "market_face":
        elements.push(segment2.marketFace(i.data.emoji_package_id + ""));
        break;
      case "light_app":
        elements.push(segment2.json(i.data.json_payload));
        break;
      case "xml":
        elements.push(segment2.xml(i.data.xml_payload));
        break;
      case "markdown":
        elements.push(segment2.markdown(i.data.content));
        break;
      default:
        elements.push(segment2.text(JSON.stringify(i)));
    }
  }
  return elements;
}
async function KarinConvertAdapter(data, bot) {
  const elements = [];
  for (const i of data) {
    switch (i.type) {
      case "text":
        elements.push(segment.text(i.text));
        break;
      case "at":
        elements.push(segment.at(i.targetId));
        break;
      case "face":
        elements.push(segment.face(i.id, i.isBig));
        break;
      case "reply":
        elements.push(segment.reply(seqFromMessageId(i.messageId)));
        break;
      case "image":
        elements.push(segment.image(await localizeUri(i.file, bot), { summary: i.summary, subType: i.subType }));
        break;
      case "record":
        elements.push(segment.record(await localizeUri(i.file, bot)));
        break;
      case "video":
        elements.push(segment.video(await localizeUri(i.file, bot)));
        break;
      case "json":
        elements.push({ type: "light_app", data: { json_payload: String(i.data ?? "") } });
        break;
      case "file":
      case "markdown":
      case "xml":
      case "music":
      case "share":
      case "location":
        throw new MilkyCompatError(
          `\u51FA\u7AD9 ${i.type} \u6BB5\u5728 Milky \u4E0B\u6CA1\u6709\u5BF9\u5E94\u5B9E\u73B0\uFF1B\u8BF7\u6539\u7528 text / image / light_app(ark) \u7B49\u652F\u6301\u7684\u6BB5`,
          `sendMsg(${i.type})`
        );
      default:
        throw new MilkyCompatError(
          `\u51FA\u7AD9\u6BB5 "${i.type}" \u5728 Milky \u4E0B\u6CA1\u6709\u5BF9\u5E94\u5B9E\u73B0`,
          `sendMsg(${i.type})`
        );
    }
  }
  return elements;
}

// src/config/config.ts
import fs3 from "fs";
import { existsSync, mkdirSync, requireFileSync } from "node-karin";
import path2 from "path";
import _ from "node-karin/lodash";
var Config = class {
  /** 默认配置 */
  #defCfg;
  /** 配置文件路径 */
  CfgPath;
  watch = null;
  watchTimers = null;
  #cache = null;
  constructor() {
    this.#defCfg = {
      reconnectMaxCount: 5,
      reconnectInterval: 5,
      webhookToken: "",
      bots: []
    };
    this.CfgPath = path2.join(dir.ConfigDir, "config.json");
    this.init();
  }
  init() {
    if (!existsSync(this.CfgPath)) {
      mkdirSync(path2.dirname(this.CfgPath));
      const def = { ...this.#defCfg };
      def.webhookToken = RandomToken();
      fs3.writeFileSync(this.CfgPath, JSON.stringify(def, null, 2), "utf8");
    }
    this.watcher();
  }
  /** 读取配置文件 */
  get get() {
    try {
      if (this.#cache) return this.#cache;
      const cfg = requireFileSync(this.CfgPath, { force: true });
      this.#cache = { ...this.#defCfg, ...cfg };
      return this.#cache;
    } catch (err) {
      LoggerAdapter("error", "\u8BFB\u53D6\u914D\u7F6E\u6587\u4EF6\u5931\u8D25\uFF0C\u5DF2\u52A0\u8F7D\u9ED8\u8BA4\u914D\u7F6E", err);
      return this.#defCfg;
    }
  }
  /** 默认配置 */
  get defCfg() {
    return this.#defCfg;
  }
  async save(data) {
    try {
      await fs3.promises.writeFile(this.CfgPath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      LoggerAdapter("error", "\u4FDD\u5B58\u914D\u7F6E\u6587\u4EF6\u9519\u8BEF", err);
      return false;
    }
  }
  watcher() {
    if (this.watch) return true;
    this.watch = fs3.watch(this.CfgPath, () => {
      if (this.watchTimers) clearTimeout(this.watchTimers);
      this.watchTimers = setTimeout(() => {
        const temp = this.#cache;
        LoggerAdapter("info", "\u914D\u7F6E\u53D8\u5316,\u5DF2\u6E05\u9664\u7F13\u5B58");
        this.#cache = null;
        if (!_.isEqual(temp?.bots, this.get.bots)) {
          LoggerAdapter("info", "Bot\u5217\u8868\u53D8\u5316,\u5F00\u59CB\u91CD\u8F7D\u53D8\u5316Bot");
          const cfgs = this.get.bots;
          const newMap = /* @__PURE__ */ new Map();
          for (const cfg of cfgs) {
            const key = Bot.getKey(cfg.protocol, cfg.url);
            newMap.set(key, cfg);
            const old = Bot.getBot(key);
            if (!old) {
              Bot.addBot(cfg);
              continue;
            }
            if (old.adapter.secret !== cfg.token) {
              old.stop();
              old.adapter.secret = cfg.token;
              old.start();
            }
          }
          for (const key of Bot.bots.keys()) {
            if (!newMap.has(key)) {
              Bot.delBot(key);
            }
          }
        }
      }, 1e3);
    });
  }
};
var Cfg = new Config();

// src/event/message.ts
import { contactFriend as contactFriend2, contactGroup as contactGroup2, contactGroupTemp as contactGroupTemp2, createFriendMessage, createGroupMessage, createGroupTempMessage, senderFriend, senderGroup, senderGroupTemp } from "node-karin";
async function createMessage(event, bot) {
  const data = event.data;
  const messageId = bot.super.encodeMsgId(data.message_scene, data.peer_id, data.message_seq);
  const elements = await AdapterConvertKarin(event.data, bot);
  if (data.message_scene === "group") {
    const contact = contactGroup2(data.peer_id + "", data.group.group_name);
    const MInfo = data.group_member;
    const sender = senderGroup(
      MInfo.user_id + "",
      MInfo.role,
      MInfo.nickname,
      MInfo.sex,
      0,
      MInfo.card,
      void 0,
      MInfo.level,
      MInfo.title
    );
    createGroupMessage({
      time: event.time,
      eventId: messageId,
      rawEvent: event,
      srcReply: (element) => bot.sendMsg(contact, element),
      bot,
      messageId,
      messageSeq: data.message_seq,
      elements,
      contact,
      sender
    });
  } else if (data.message_scene === "friend") {
    const FInfo = data.friend;
    const contact = contactFriend2(data.peer_id + "", FInfo.nickname);
    const sender = senderFriend(
      FInfo.user_id + "",
      FInfo.nickname,
      FInfo.sex
    );
    createFriendMessage({
      time: event.time,
      eventId: messageId,
      rawEvent: event,
      srcReply: (element) => bot.sendMsg(contact, element),
      bot,
      messageId,
      messageSeq: data.message_seq,
      elements,
      contact,
      sender
    });
  } else if (data.message_scene === "temp") {
    const TInfo = data.group;
    const contact = contactGroupTemp2(TInfo?.group_id + "", data.peer_id + "", TInfo?.group_name);
    const sender = senderGroupTemp(data.peer_id + "");
    createGroupTempMessage({
      time: event.time,
      eventId: messageId,
      rawEvent: event,
      srcReply: (element) => bot.sendMsg(contact, element),
      bot,
      messageId,
      messageSeq: data.message_seq,
      elements,
      contact,
      sender
    });
  }
}

// src/event/notice.ts
import { contactFriend as contactFriend3, contactGroup as contactGroup3, createGroupAdminChangedNotice, createGroupFileUploadedNotice, createGroupHlightsChangedNotice, createGroupMemberAddNotice, createGroupMemberBanNotice, createGroupMemberDelNotice, createGroupMessageReactionNotice, createGroupPokeNotice, createGroupRecallNotice, createGroupWholeBanNotice, createPrivateFileUploadedNotice, createPrivatePokeNotice, createPrivateRecallNotice, senderFriend as senderFriend2, senderGroup as senderGroup2 } from "node-karin";
function RecallNotice(event, bot) {
  const data = event.data;
  const messageId = bot.super.encodeMsgId(data.message_scene, data.peer_id, data.message_seq);
  if (data.message_scene === "friend") {
    const contact = contactFriend3(data.peer_id + "");
    const sender = senderFriend2(data.peer_id + "");
    createPrivateRecallNotice({
      time: event.time,
      eventId: "notice:" + event.time,
      rawEvent: event,
      contact,
      sender,
      srcReply: (elements) => bot.sendMsg(contact, elements),
      bot,
      content: {
        operatorId: data.operator_id + "",
        messageId,
        tips: data.display_suffix
      }
    });
  } else if (data.message_scene === "group") {
    const contact = contactGroup3(data.peer_id + "");
    const sender = senderGroup2(data.operator_id + "");
    createGroupRecallNotice({
      time: event.time,
      eventId: "notice:" + event.time,
      rawEvent: event,
      contact,
      sender,
      srcReply: (elements) => bot.sendMsg(contact, elements),
      bot,
      content: {
        operatorId: data.operator_id + "",
        messageId,
        targetId: data.sender_id + "",
        tip: data.display_suffix
      }
    });
  }
}
function FriendFileUpload(event, bot) {
  const contact = contactFriend3(event.data.user_id + "");
  createPrivateFileUploadedNotice({
    time: event.time,
    eventId: "notice" + event.time,
    contact,
    rawEvent: event,
    sender: senderFriend2(event.data.user_id + ""),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    bot,
    content: {
      operatorId: (event.data.is_self ? event.self_id : event.data.user_id) + "",
      fid: event.data.file_id,
      subId: 0,
      name: event.data.file_name,
      size: event.data.file_size,
      expireTime: 0,
      url: async () => {
        return await bot.getFileUrl(contact, event.data.file_id);
      }
    }
  });
}
function FriendPoke(event, bot) {
  const userId = event.data.user_id + "";
  const contact = contactFriend3(userId);
  createPrivatePokeNotice({
    eventId: `notice:${event.time}`,
    rawEvent: event,
    bot,
    time: event.time,
    contact,
    sender: senderFriend2(event.data.is_self_send ? event.self_id + "" : userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId: event.data.is_self_send ? event.self_id + "" : userId,
      targetId: event.data.is_self_receive ? event.self_id + "" : userId,
      action: event.data.display_action,
      actionImage: event.data.display_action_img_url,
      suffix: event.data.display_suffix
    }
  });
}
function GroupAdminChange(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  createGroupAdminChangedNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(event.data.operator_id + ""),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      targetId: event.data.user_id + "",
      isAdmin: event.data.is_set
    }
  });
}
function GroupMemberIncrease(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  const userId = event.data.user_id + "";
  createGroupMemberAddNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId: event.data.operator_id + "",
      targetId: userId,
      type: "approve"
    }
  });
}
function GroupMemberDecrease(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  const userId = event.data.user_id + "";
  createGroupMemberDelNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId: String(event.data.operator_id || ""),
      targetId: userId,
      type: event.data.operator_id ? "kick" : "leave"
    }
  });
}
function GroupMessageReaction(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  createGroupMessageReactionNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(event.data.user_id + ""),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      count: 1,
      faceId: +event.data.face_id,
      isSet: event.data.is_add,
      messageId: bot.super.encodeMsgId("group", +contact.peer, event.data.message_seq)
    }
  });
}
function GroupMute(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  const userId = event.data.user_id + "";
  createGroupMemberBanNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId: String(event.data.operator_id),
      targetId: userId,
      duration: event.data.duration,
      isBan: event.data.duration > 0
    }
  });
}
function GroupWholeMute(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  const userId = event.data.operator_id + "";
  createGroupWholeBanNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId: userId,
      isBan: event.data.is_mute
    }
  });
}
function GroupPoke(event, bot) {
  const userId = event.data.sender_id + "";
  const contact = contactGroup3(event.data.group_id + "");
  createGroupPokeNotice({
    eventId: `notice:${event.time}`,
    rawEvent: event,
    bot,
    time: Date.now(),
    contact,
    sender: senderGroup2(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId: userId,
      targetId: event.data.receiver_id + "",
      action: event.data.display_action,
      actionImage: event.data.display_action_img_url,
      suffix: event.data.display_suffix
    }
  });
}
function BotOffline(event, bot) {
  bot.logger("warn", `[Bot\u79BB\u7EBF] \u539F\u56E0: ${event.data.reason}`);
  bot.__unregisterBot();
}
function PeerPinChange(event, bot) {
  bot.logger("debug", `[\u4F1A\u8BDD\u7F6E\u9876\u53D8\u66F4] scene=${event.data.message_scene} peer=${event.data.peer_id} pinned=${event.data.is_pinned}`);
}
function GroupEssenceMessageChange(event, bot) {
  const contact = contactGroup3(event.data.group_id + "");
  const operatorId = event.data.operator_id + "";
  createGroupHlightsChangedNotice({
    bot,
    eventId: `notice:${event.time}`,
    rawEvent: event,
    time: event.time,
    contact,
    sender: senderGroup2(operatorId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      operatorId,
      // Milky 的精华事件只带 message_seq，不带发送者；拿 0 占位，插件如果需要可以自己 get_msg
      senderId: "",
      messageId: bot.super.encodeMsgId("group", event.data.group_id, event.data.message_seq),
      isSet: event.data.is_set
    }
  });
}
function GroupNameChange(event, bot) {
  bot.logger("info", `[\u7FA4\u540D\u53D8\u66F4] group=${event.data.group_id} newName=${event.data.new_group_name} operator=${event.data.operator_id}`);
}
function GroupDisband(event, bot) {
  bot.logger("warn", `[\u7FA4\u89E3\u6563] group=${event.data.group_id} operator=${event.data.operator_id}`);
}
function GroupFileUpload(event, bot) {
  const userId = event.data.user_id + "";
  const contact = contactGroup3(event.data.group_id + "");
  createGroupFileUploadedNotice({
    eventId: `notice:${event.time}`,
    rawEvent: event,
    bot,
    time: Date.now(),
    contact,
    sender: senderGroup2(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      fid: event.data.file_id,
      subId: 0,
      name: event.data.file_name,
      size: event.data.file_size,
      expireTime: 0,
      url: async () => {
        return await bot.getFileUrl(contact, event.data.file_id);
      }
    }
  });
}

// src/event/request.ts
import { contactFriend as contactFriend4, contactGroup as contactGroup4, createGroupApplyRequest, createGroupInviteRequest, createPrivateApplyRequest, senderFriend as senderFriend3, senderGroup as senderGroup3 } from "node-karin";
function FriendRequest(event, bot) {
  const userId = event.data.initiator_id + "";
  const contact = contactFriend4(userId);
  createPrivateApplyRequest({
    bot,
    time: event.time,
    contact,
    rawEvent: event,
    subEvent: "friendApply",
    eventId: `request:${event.time}`,
    sender: senderFriend3(userId),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      applierId: userId,
      message: event.data.comment,
      flag: event.data.initiator_uid
    }
  });
}
async function GroupJoinRequest(event, bot) {
  const groupId = String(event.data.group_id);
  const contact = contactGroup4(groupId);
  const isInvited = event.event_type === "group_invited_join_request";
  const applierId = isInvited && "target_user_id" in event.data ? String(event.data.target_user_id) : String(event.data.initiator_id);
  const inviterId = isInvited ? String(event.data.initiator_id) : "";
  const Info = await bot.getStrangerInfo(applierId);
  createGroupApplyRequest({
    bot,
    time: event.time,
    contact,
    rawEvent: event,
    subEvent: "groupApply",
    eventId: `request:${event.time}`,
    sender: senderGroup3(applierId, "unknown", Info.nick, Info.sex, Info.age, Info.remark, Info.level + "", 0, void 0),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      applierId,
      inviterId,
      reason: "comment" in event.data ? event.data.comment : "",
      flag: event.data.notification_seq + "",
      groupId
    }
  });
}
function GroupInvite(event, bot) {
  const userId = event.data.initiator_id + "";
  const contact = contactGroup4(event.data.group_id + "");
  bot.invitations.stash(event.data.invitation_seq, event.data.group_id);
  createGroupInviteRequest({
    bot,
    time: event.time,
    contact,
    rawEvent: event,
    subEvent: "groupInvite",
    eventId: `request:${event.time}`,
    sender: senderGroup3(userId, "member"),
    srcReply: (elements) => bot.sendMsg(contact, elements),
    content: {
      inviterId: userId,
      flag: event.data.invitation_seq + ""
    }
  });
}

// src/event/index.ts
var Handlers = /* @__PURE__ */ Object.create(null);
Handlers["message_receive"] = createMessage;
Handlers["message_recall"] = RecallNotice;
Handlers["friend_request"] = FriendRequest;
Handlers["group_join_request"] = GroupJoinRequest;
Handlers["group_invited_join_request"] = GroupJoinRequest;
Handlers["group_invitation"] = GroupInvite;
Handlers["friend_nudge"] = FriendPoke;
Handlers["friend_file_upload"] = FriendFileUpload;
Handlers["group_admin_change"] = GroupAdminChange;
Handlers["group_member_increase"] = GroupMemberIncrease;
Handlers["group_member_decrease"] = GroupMemberDecrease;
Handlers["group_message_reaction"] = GroupMessageReaction;
Handlers["group_mute"] = GroupMute;
Handlers["group_whole_mute"] = GroupWholeMute;
Handlers["group_nudge"] = GroupPoke;
Handlers["group_file_upload"] = GroupFileUpload;
Handlers["bot_offline"] = BotOffline;
Handlers["peer_pin_change"] = PeerPinChange;
Handlers["group_essence_message_change"] = GroupEssenceMessageChange;
Handlers["group_name_change"] = GroupNameChange;
Handlers["group_disband"] = GroupDisband;
async function EventDispatch(i, bot) {
  const handler = Handlers[i.event_type];
  if (!handler) {
    bot.logger("warn", `\u6536\u5230\u672A\u77E5\u4E8B\u4EF6: ${JSON.stringify(i)}`);
    return false;
  }
  return await handler(i, bot);
}

// src/transport/websocket.ts
import karin from "node-karin";
import WebSocket from "ws";
var WebSocketClient = class {
  #startTime = 0;
  #wss = null;
  /** 适配器实例 */
  bot;
  /** 重连次数 */
  #reconnectCount = 0;
  /** 连接时间计算器 */
  #IntervalTime = null;
  /** 重连计时器 */
  #reconnectTimer = null;
  /** 心跳计时器 */
  #heartbeatTimer = null;
  constructor(bot) {
    this.bot = bot;
  }
  connect() {
    if (this.#wss && (this.#wss.readyState === WebSocket.OPEN || this.#wss.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.#wss = new WebSocket(this.bot.adapter.address, {
      headers: { authorization: `Bearer ${this.bot.adapter.secret}` }
    });
    this.#wss.on("open", () => {
      this.#reconnectCount = 0;
      if (this.#IntervalTime) clearInterval(this.#IntervalTime);
      this.#startTime = Date.now();
      this.#IntervalTime = setInterval(() => {
        const time = Date.now();
        this.bot.adapter.connectTime = time - this.#startTime;
      }, 1e3);
      if (this.#heartbeatTimer) clearInterval(this.#heartbeatTimer);
      this.#heartbeatTimer = setInterval(() => {
        if (this.#wss?.readyState === WebSocket.OPEN) {
          try {
            this.#wss.ping();
          } catch {
          }
        }
      }, 3e4);
      this.bot.__registerBot();
    });
    this.#wss.on("message", (event) => {
      try {
        const data = JSON.parse(event);
        EventDispatch(data, this.bot);
      } catch (err) {
        this.bot.logger("error", `WebSocket \u6D88\u606F\u5904\u7406\u9519\u8BEF: ${err.message}`);
      }
    });
    this.#wss.on("error", (err) => {
      this.bot.logger("error", `WebSocket \u8FDE\u63A5\u9519\u8BEF: ${err.message}`);
    });
    this.#wss.on("close", (code, reason) => {
      const index = this.bot.adapter.index;
      if (index) {
        const bot = karin.getBot(index);
        if (bot) {
          this.bot.logger("error", `[WebSocket] \u65AD\u5F00\u8FDE\u63A5 \u72B6\u6001\u7801:${code} ${reason}`);
          this.bot.__unregisterBot();
        }
      }
      this.reconnect();
    });
  }
  reconnect() {
    if (this.#reconnectTimer) return;
    this.clear();
    let RMC = +Cfg.get.reconnectMaxCount || 0;
    if (RMC === -1) RMC = Infinity;
    if (this.#reconnectCount >= RMC) {
      this.bot.logger("error", "[WebSocket]\u91CD\u8FDE\u5DF2\u8FBE\u6700\u5927\u6B21\u6570,\u505C\u6B62\u91CD\u8FDE");
      this.bot.transport = null;
      return false;
    }
    let timeout = +Cfg.get.reconnectInterval || 1;
    if (timeout <= 0) timeout = 1;
    this.#reconnectCount++;
    this.bot.logger("error", `[WebSocket] ${timeout} \u79D2\u540E\u5C1D\u8BD5\u7B2C${this.#reconnectCount}\u6B21\u91CD\u8FDE`);
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      this.connect();
    }, timeout * 1e3);
  }
  clear() {
    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
    }
    if (this.#IntervalTime) {
      clearInterval(this.#IntervalTime);
      this.#IntervalTime = null;
    }
    if (this.#heartbeatTimer) {
      clearInterval(this.#heartbeatTimer);
      this.#heartbeatTimer = null;
    }
    const ws = this.#wss;
    if (ws) {
      this.#wss = null;
      ws.removeAllListeners();
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }
  }
};

// src/transport/sse.ts
import { EventSource } from "eventsource";
import karin2 from "node-karin";
var SSEClient = class {
  /** 首次连接时间 */
  #startTime = 0;
  /** sse实例 */
  #client = null;
  /** 适配器实例 */
  bot;
  /** 重连次数 */
  #reconnectCount = 0;
  /** 连接时间计算器 */
  #IntervalTime = null;
  #reconnectTimer = null;
  constructor(bot) {
    this.bot = bot;
  }
  async connect() {
    this.#client = new EventSource(this.bot.adapter.address, {
      fetch: (input, init) => fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          authorization: `Bearer ${this.bot.adapter.secret}`
        }
      })
    });
    this.#client.addEventListener("milky_event", (event) => {
      try {
        const data = JSON.parse(event.data);
        EventDispatch(data, this.bot);
      } catch (err) {
        this.bot.logger("error", `[SSE]\u6D88\u606F\u89E3\u6790\u5931\u8D25: ${err.message}`);
      }
    });
    this.#client.onopen = () => {
      if (this.#IntervalTime) {
        clearInterval(this.#IntervalTime);
        this.#IntervalTime = null;
      }
      this.#reconnectCount = 0;
      if (this.#IntervalTime) clearInterval(this.#IntervalTime);
      this.#startTime = Date.now();
      this.#IntervalTime = setInterval(() => {
        const time = Date.now();
        this.bot.adapter.connectTime = time - this.#startTime;
      }, 1e3);
      this.bot.__registerBot();
    };
    this.#client.onerror = (err) => {
      this.bot.logger("debug", `[SSE]\u8FDE\u63A5\u9519\u8BEF: ${JSON.stringify(err)}`);
      if (this.#client?.readyState !== 2) return;
      this.bot.logger("error", "[SSE]\u8FDE\u63A5\u5DF2\u5F7B\u5E95\u5173\u95ED\uFF0C\u8F6C\u4EA4\u9002\u914D\u5668\u91CD\u8FDE");
      const index = this.bot.adapter.index;
      if (index) {
        const bot = karin2.getBot(index);
        if (bot) {
          this.bot.__unregisterBot();
        }
      }
      this.reconnect();
    };
  }
  reconnect() {
    if (this.#reconnectTimer) return;
    this.clear();
    let RMC = +Cfg.get.reconnectMaxCount || 0;
    if (RMC === -1) RMC = Infinity;
    if (this.#reconnectCount >= RMC) {
      this.bot.logger("error", "[SSE]\u91CD\u8FDE\u5DF2\u8FBE\u6700\u5927\u6B21\u6570,\u505C\u6B62\u91CD\u8FDE");
      this.bot.transport = null;
      return false;
    }
    this.#reconnectCount++;
    let timeout = +Cfg.get.reconnectInterval || 1;
    if (timeout <= 0) timeout = 1;
    this.bot.logger("error", `[SSE]${timeout}\u79D2\u540E\u5C1D\u8BD5\u7B2C${this.#reconnectCount}\u6B21\u91CD\u8FDE`);
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      this.connect();
    }, timeout * 1e3);
  }
  clear() {
    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer);
      this.#reconnectTimer = null;
    }
    if (this.#IntervalTime) {
      clearInterval(this.#IntervalTime);
      this.#IntervalTime = null;
    }
    if (this.#client) {
      this.#client.close();
      this.#client = null;
    }
  }
};

// src/transport/webhook/server.ts
import { app, logger as logger3 } from "node-karin";
import express from "node-karin/express";

// src/transport/webhook/registry.ts
import { logger as logger2 } from "node-karin";
var Handler = class {
  #ClientMap;
  constructor() {
    this.#ClientMap = /* @__PURE__ */ new Map();
  }
  /** 注册事件 */
  register(bot) {
    const selfId = bot.account.selfId;
    if (!selfId) throw new Error("uin\u83B7\u53D6\u5931\u8D25");
    this.#ClientMap.set(selfId, bot);
    bot.__registerBot();
  }
  /** 触发事件 */
  handle(req, res) {
    const data = req.body;
    const bot = this.#ClientMap.get(data.self_id + "");
    if (!bot) {
      logger2.debug("[milky Adapter]\u6536\u5230\u672A\u77E5\u5BA2\u6237\u7AEF\u8BF7\u6C42", data);
      return res.status(400).json({
        error: "\u975E\u6CD5\u7684\u5BA2\u6237\u7AEF",
        message: "\u8BE5\u5BA2\u6237\u7AEF\u5C1A\u672A\u6CE8\u518C"
      });
    }
    EventDispatch(data, bot);
    return res.status(204).end();
  }
  /** 清理内容 */
  clear(Id) {
    this.#ClientMap.delete(Id);
  }
};
var webhookRegistry = new Handler();

// src/transport/webhook/server.ts
var RouterPath = "/milky/api/v1";
var router = express.Router();
var authMiddleware = (req, res, next) => {
  const token = Cfg.get.webhookToken || "";
  if (!token) return next();
  const accessToken = req.headers.authorization;
  if (!accessToken || accessToken !== `Bearer ${token}`) {
    logger3.debug("\u672A\u6388\u6743\u7684\u5BA2\u6237\u7AEF\u8BF7\u6C42:", req.body);
    return res.status(401).json({ error: "\u65E0\u6743\u9650", message: "\u9274\u6743\u5BC6\u94A5\u9519\u8BEF" });
  }
  return next();
};
router.use(express.json());
router.post("/webhook", authMiddleware, (req, res) => {
  webhookRegistry.handle(req, res);
});
router.get("/webhook", (_req, res) => res.json({
  name: "Milky-adapter",
  version: `${dir.version}`,
  time: Date.now(),
  msg: "Ciallo~(\u2220\u30FB\u03C9< )\u2312\u2606",
  success: "\u5F53\u4F60\u770B\u5230\u8FD9\u4E2A\u6D88\u606F\uFF0C\u90A3\u4E48\u5C31\u8BF4\u660E milky \u9002\u914D\u5668\u542F\u52A8\u6210\u529F!"
}));
app.use(RouterPath, router);
LoggerAdapter("info", "WebHook\u542F\u52A8\u6210\u529F");
LoggerAdapter("info", `${logger3.yellow("WebHook \u8BBF\u95EE\u5730\u5740")}: ${logger3.green(`http://127.0.0.1:${process.env.HTTP_PORT}${RouterPath}/webhook`)}`);

// src/core/invitationCache.ts
var InvitationCache = class {
  #map = /* @__PURE__ */ new Map();
  stash(invitationSeq, groupId) {
    this.#map.set(invitationSeq, groupId);
  }
  pop(invitationSeq) {
    const v = this.#map.get(invitationSeq);
    if (v !== void 0) this.#map.delete(invitationSeq);
    return v;
  }
};

// src/core/notificationLookup.ts
async function findGroupNotification(client, seq) {
  for (const isFiltered of [false, true]) {
    let next;
    for (let i = 0; i < 50; i++) {
      const res = await client.getGroupNotifications(next, isFiltered, 20);
      const found = res.notifications.find((v) => v.notification_seq === seq);
      if (found) return { req: found, isFiltered };
      if (!res.next_notification_seq || res.notifications.length === 0) break;
      next = res.next_notification_seq;
    }
  }
  return null;
}

// src/core/milkyAdapter.ts
var MilkyAdapter = class extends AdapterBase {
  #inited = false;
  super;
  cfg;
  clear = null;
  transport = null;
  /** 邀请自身入群事件的 invitation_seq → group_id 缓存（GroupInvite 事件入；setInvitedJoinGroupResult 取） */
  invitations = new InvitationCache();
  constructor(cfg) {
    super();
    this.cfg = cfg;
    this.adapter = {
      index: 0,
      name: dir.name,
      version: dir.version,
      platform: "qq",
      standard: "milky",
      protocol: "other",
      communication: cfg.protocol === "websocket" ? "webSocketClient" : cfg.protocol,
      address: new URL("event", `${cfg.url.endsWith("/") ? cfg.url : `${cfg.url}/`}`).toString(),
      connectTime: 0,
      secret: cfg.token
    };
    this.super = new Client(cfg.url, this);
  }
  async #init() {
    if (this.#inited) return;
    try {
      const info = await this.super.getLoginInfo();
      if (!info) throw new Error("\u83B7\u53D6\u767B\u5F55\u4FE1\u606F\u5931\u8D25");
      const selfId = String(info.uin);
      this.account = {
        uin: selfId,
        uid: selfId,
        selfId,
        name: info.nickname,
        avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${selfId}`,
        subId: {}
      };
      const imp = await this.super.getImplInfo();
      if (imp) {
        this.adapter.protocol = imp.impl_name;
      }
      return true;
    } catch (err) {
      this.#inited = false;
      throw err;
    }
  }
  async start() {
    if (this.transport) return;
    let RetryCount = 0;
    const RMC = +Cfg.get.reconnectMaxCount || 0;
    let RT = +Cfg.get.reconnectInterval || 1;
    if (RT <= 0) RT = 1;
    while (true) {
      try {
        await this.#init();
        break;
      } catch (err) {
        this.logger("error", err.message);
        if (RetryCount >= RMC && RMC !== -1) {
          return this.logger("error", "\u521D\u59CB\u5316\u5931\u8D25\uFF0C\u91CD\u8BD5\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u505C\u6B62\u91CD\u8BD5");
        }
        RetryCount++;
        this.logger("error", `\u521D\u59CB\u5316\u5931\u8D25\uFF0C${Cfg.get.reconnectInterval}\u79D2\u540E\u5C06\u8FDB\u884C\u7B2C${RetryCount}\u6B21\u91CD\u8BD5...`);
        await new Promise((resolve) => setTimeout(resolve, RT * 1e3));
      }
    }
    const protocol = this.adapter.communication;
    if (protocol === "webhook") {
      webhookRegistry.register(this);
      this.transport = {
        connect: () => {
        },
        clear: () => webhookRegistry.clear(this.selfId)
      };
    } else if (protocol === "sse") {
      this.transport = new SSEClient(this);
    } else if (protocol === "webSocketClient") {
      const url = new URL(this.adapter.address);
      if (url.protocol !== "ws:" && url.protocol !== "wss:") {
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      }
      this.adapter.address = url.toString();
      this.transport = new WebSocketClient(this);
    } else {
      return this.logger("error", "\u672A\u77E5\u7684\u901A\u8BAF\u65B9\u5F0F" + protocol);
    }
    return this.transport.connect();
  }
  stop() {
    if (this.transport) {
      this.transport.clear();
      this.transport = null;
      this.__unregisterBot();
    }
  }
  get selfId() {
    return this.account.selfId;
  }
  get selfName() {
    return this.account.name || "";
  }
  /**
   * 注册 Bot，仅限适配器内部调用。
   * 幂等：若已有有效 index 则先卸载，避免重连/重入场景下产生孤儿 bot 实例。
   */
  __registerBot() {
    if (this.adapter.index && karin3.getBotByIndex(this.adapter.index)) {
      unregisterBot("index", this.adapter.index);
      this.adapter.index = 0;
    }
    const index = registerBot(this.adapter.communication, this);
    if (index) this.adapter.index = index;
  }
  /** 卸载 Bot，仅限适配器内部调用 */
  __unregisterBot() {
    if (this.adapter.index && karin3.getBotByIndex(this.adapter.index)) {
      unregisterBot("index", this.adapter.index);
    }
    this.adapter.index = 0;
  }
  logger(level, ...args) {
    logger4.bot(level, this.account.selfId, ...args);
  }
  /**
   * Karin 的 sendApi 语义是 OneBot v11 动作，不是 Milky 的 API 路径。
   * 直接 POST /api/<action> 对 OneBot 动作名一律 404，所以这里走 lite 兼容层：
   * 语义完全一致的动作做映射，其余显式报错（绝不静默失败）。
   */
  async sendApi(action, params) {
    return invokeOneBotAction(this, action, params);
  }
  async sendMsg(contact, elements, _retryCount) {
    const result = {
      messageId: "",
      time: 0,
      rawData: {},
      message_id: "",
      messageTime: 0
    };
    const msg = await KarinConvertAdapter(elements, this);
    let res;
    if (contact.scene === "group") {
      res = await this.super.sendGroupMessage(+contact.peer, msg);
    } else {
      if (contact.scene === "friend") {
        res = await this.super.sendPrivateMessage(+contact.peer, msg);
      } else {
        throw new Error("\u4E0D\u652F\u6301\u7684\u64CD\u4F5C");
      }
    }
    result.messageId = this.super.encodeMsgId(contact.scene, +contact.peer, res.message_seq);
    result.time = res.time;
    result.rawData = res;
    return result;
  }
  async sendForwardMsg(_contact, _elements, _options) {
    const userId = +this.account.selfId;
    const NickName = this.account.name;
    const messages = [];
    for (const v of _elements) {
      const userid = v.subType === "fake" ? +v.userId : userId;
      const nickname = v.subType === "fake" ? v.nickname : NickName;
      const content = v.subType === "fake" ? v.message : (await this.getForwardMsg(v.messageId))[0].elements;
      const message = await KarinConvertAdapter(content, this);
      messages.push(segment.fake(userid, message, nickname));
    }
    const data = segment.node(messages);
    const result = { messageId: "", forwardId: "" };
    if (_contact.scene === "friend") {
      const res = await this.super.sendPrivateMessage(+_contact.peer, data);
      result.messageId = this.super.encodeMsgId("friend", +_contact.peer, res.message_seq);
    } else {
      const res = await this.super.sendGroupMessage(+_contact.peer, data);
      result.messageId = this.super.encodeMsgId("group", +_contact.peer, res.message_seq);
    }
    return result;
  }
  async recallMsg(contact, messageId) {
    const Id = +contact.peer;
    const { seq } = this.super.decodeMsgId(messageId);
    if (contact.scene === "group") {
      await this.super.recallGroupMessage(Id, seq);
    } else {
      if (contact.scene === "friend") {
        await this.super.recallPrivateMessage(Id, seq);
      }
    }
  }
  async getMsg(Contact2, messageId) {
    let peerId, scene, seq;
    if (typeof Contact2 === "string") {
      ({ scene, peerId, seq } = this.super.decodeMsgId(Contact2));
    } else {
      scene = Contact2.scene === "friend" ? "friend" : Contact2.scene === "group" ? "group" : "temp";
      peerId = Contact2.peer;
      ({ seq } = this.super.decodeMsgId(messageId));
    }
    const { message } = await this.super.getMessage(scene, +peerId, seq);
    const userId = String(message.sender_id);
    const nickname = message.message_scene === "friend" ? message.friend.nickname : message.message_scene === "group" ? message.group_member.nickname : "";
    const contact = message.message_scene === "friend" ? contactFriend5(String(message.friend.user_id), message.friend.nickname) : message.message_scene === "group" ? contactGroup5(String(message.group.group_id), message.group.group_name) : contactGroupTemp3(String(message.group?.group_id), String(message.sender_id));
    return {
      time: message.time,
      messageId: this.super.encodeMsgId(message.message_scene, message.peer_id, message.message_seq),
      messageSeq: message.message_seq,
      contact,
      sender: {
        role: message.message_scene === "group" ? message.group_member.role : "unknown",
        userId,
        nick: nickname,
        name: nickname
      },
      elements: await AdapterConvertKarin(message, this)
    };
  }
  async getHistoryMsg(contact, startMsgSeq, count) {
    const MsgId = typeof startMsgSeq === "string" ? this.super.decodeMsgId(startMsgSeq).seq : startMsgSeq;
    const scene = contact.scene === "friend" ? "friend" : contact.scene === "group" ? "group" : "temp";
    const result = [];
    let cursor = MsgId > 0 ? MsgId : void 0;
    while (result.length < count) {
      const batch = Math.min(30, count - result.length);
      const res = (await this.super.getHistoryMessage(scene, +contact.peer, cursor, batch)).messages;
      if (res.length === 0) break;
      result.unshift(...res);
      const oldest = res[0].message_seq;
      if (res.length < batch || oldest <= 1) break;
      cursor = oldest - 1;
    }
    const elements = [];
    for (const i of result) {
      const userId = String(i.sender_id);
      const nickname = i.message_scene === "friend" ? i.friend.nickname : i.message_scene === "group" ? i.group_member.nickname : "";
      elements.push({
        time: i.time,
        messageId: this.super.encodeMsgId(i.message_scene, i.peer_id, i.message_seq),
        messageSeq: i.message_seq,
        contact: i.message_scene === "friend" ? contactFriend5(String(i.friend.user_id), i.friend.nickname) : i.message_scene === "group" ? contactGroup5(String(i.group.group_id), i.group.group_name) : contactGroupTemp3(String(i.group?.group_id), String(i.sender_id)),
        sender: {
          role: i.message_scene === "group" ? i.group_member.role : "unknown",
          userId,
          nick: nickname,
          name: nickname
        },
        elements: await AdapterConvertKarin(i, this)
      });
    }
    return elements;
  }
  async getForwardMsg(_resId, depth = 0) {
    const info = await this.super.getForwardedMessage(_resId);
    const result = [];
    for (const v of info.messages) {
      const messageSeq = v.message_seq ?? 0;
      const synthetic = {
        message_scene: "group",
        peer_id: 0,
        message_seq: messageSeq,
        sender_id: 0,
        time: v.time,
        segments: v.segments,
        group: { group_id: 0, group_name: "", member_count: 0, max_member_count: 0 },
        group_member: {
          user_id: 0,
          nickname: v.sender_name,
          sex: "unknown",
          card: "",
          title: "",
          level: 0,
          role: "member",
          join_time: 0,
          last_sent_time: 0,
          group_id: 0
        }
      };
      result.push({
        time: v.time,
        messageId: messageSeq ? this.super.encodeMsgId("group", 0, messageSeq) : "",
        messageSeq,
        contact: contactGroup5("0", ""),
        sender: {
          userId: "0",
          nick: v.sender_name,
          name: v.sender_name,
          role: "member"
        },
        elements: await AdapterConvertKarin(synthetic, this, depth)
      });
    }
    return result;
  }
  /**
   * 取文件下载链接：群文件走 get_group_file_download_url。
   * 私聊文件协议端要 file_hash，而入站段不一定带——拿不到就明确报错，不自己拼 URL。
   */
  async getFileUrl(_contact, _fileId) {
    if (_contact.scene === "group") {
      const res = await this.super.getGroupFileDownloadUrl(+_contact.peer, _fileId);
      return res.download_url;
    }
    throw new MilkyCompatError("Milky \u6682\u4E0D\u652F\u6301\u83B7\u53D6\u79C1\u804A/\u4E34\u65F6\u4F1A\u8BDD\u6587\u4EF6\u4E0B\u8F7D\u94FE\u63A5\uFF08\u534F\u8BAE\u7AEF\u9700\u8981 file_hash\uFF09");
  }
  /**
   * 上传文件。Karin 的插件用 `bot.uploadFile(contact, 本地路径, 名字)`，
   * Milky 这边 group 走 upload_group_file、friend 走 upload_private_file。
   * 本地路径同样有「协议端在宿主机、读不到容器路径」的问题，所以先转 base64。
   */
  async uploadFile(_contact, _file, _name, _folder) {
    const uri = await localizeUri(_file.startsWith("file://") ? _file : `file://${_file}`, this);
    if (_contact.scene === "group") {
      await this.super.uploadGroupFile(+_contact.peer, _folder || "/", uri, _name);
      return;
    }
    if (_contact.scene === "friend") {
      await this.super.uploadPrivateFile(+_contact.peer, uri, _name);
      return;
    }
    throw new MilkyCompatError("Milky \u4E0D\u652F\u6301\u5411\u4E34\u65F6\u4F1A\u8BDD\u4E0A\u4F20\u6587\u4EF6");
  }
  /**
   * 群禁言列表。Milky 没有单独的接口，用群成员列表里 shut_up_end_time 过期的项合成。
   * muteTime 按 Unix 秒返回（与 Milky 字段一致）。
   */
  async getGroupMuteList(_groupId) {
    const res = (await this.super.getGroupMemberList(+_groupId, true)).members;
    const now = Math.floor(Date.now() / 1e3);
    return res.filter((m) => m.shut_up_end_time && m.shut_up_end_time > now).map((m) => ({ userId: m.user_id + "", muteTime: m.shut_up_end_time }));
  }
  async setMsgReaction(contact, messageId, faceId, isSet) {
    if (contact.scene !== "group") throw new Error("\u4EC5\u652F\u6301\u7FA4\u804A\u8BBE\u7F6E\u8868\u60C5\u56DE\u5E94");
    const seq = this.super.decodeMsgId(messageId).seq;
    const raw = String(faceId).trim();
    let reaction = raw;
    let reactionType;
    if (/^\d+$/.test(raw)) {
      reactionType = raw.length <= 3 ? "face" : "emoji";
    } else {
      const codePoint = raw.codePointAt(0);
      if (codePoint === void 0) throw new Error("\u8868\u60C5\u56DE\u5E94 id \u4E0D\u80FD\u4E3A\u7A7A");
      reaction = String(codePoint);
      reactionType = "emoji";
    }
    await this.super.setGroupMessageReaction(+contact.peer, seq, reaction, reactionType, isSet);
  }
  async groupKickMember(_groupId, _targetId, _rejectAddRequest, _kickReason) {
    await this.super.kickGroupMember(+_groupId, +_targetId, _rejectAddRequest);
  }
  async setGroupMute(_groupId, _targetId, _duration) {
    await this.super.setGroupMemberMute(+_groupId, +_targetId, _duration);
  }
  async setGroupAllMute(_groupId, _isBan) {
    await this.super.setGroupWholeMute(+_groupId, _isBan);
  }
  async setGroupAdmin(_groupId, _targetId, _isAdmin) {
    await this.super.setGroupMemberAdmin(+_groupId, +_targetId, _isAdmin);
  }
  async setGroupMemberCard(_groupId, _targetId, _card) {
    await this.super.setGroupMemberCard(+_groupId, +_targetId, _card);
  }
  async setGroupName(_groupId, _groupName) {
    await this.super.setGroupName(+_groupId, _groupName);
  }
  async setGroupQuit(_groupId, _isDismiss) {
    const info = await this.getGroupMemberInfo(_groupId, this.account.selfId);
    if (["owner"].includes(info.role) && !_isDismiss) return;
    await this.super.quitGroup(+_groupId);
  }
  async setGroupMemberTitle(_groupId, _targetId, _title) {
    await this.super.setGroupMemberSpecialTitle(+_groupId, +_targetId, _title);
  }
  async getGroupInfo(_groupId, _noCache) {
    const res = await this.super.getGroupInfo(+_groupId, _noCache);
    let admins = [];
    try {
      const memberList = (await this.super.getGroupMemberList(+_groupId, _noCache)).members;
      admins = memberList.filter((m) => m.role === "admin" || m.role === "owner").map((m) => ({ userId: m.user_id + "", name: m.card || m.nickname, role: m.role }));
    } catch {
    }
    return {
      groupId: res.group.group_id + "",
      groupName: res.group.group_name,
      maxMemberCount: res.group.max_member_count,
      memberCount: res.group.member_count,
      admins,
      avatar: await this.getGroupAvatarUrl(_groupId, 640)
    };
  }
  async getGroupList(_refresh) {
    const res = (await this.super.getGroupList(_refresh)).groups;
    const groups = [];
    for (const i of res) {
      groups.push({
        groupId: i.group_id + "",
        groupName: i.group_name,
        maxMemberCount: i.max_member_count,
        memberCount: i.member_count,
        admins: [],
        // qlogo 群头像（与 getGroupAvatarUrl 同规则，纯拼 URL 无网络开销）
        avatar: `https://p.qlogo.cn/gh/${i.group_id}/${i.group_id}/0`
      });
    }
    return groups;
  }
  async getGroupMemberInfo(_groupId, _targetId, _refresh) {
    const res = await this.super.getGroupMemberInfo(+_groupId, +_targetId, _refresh);
    return {
      userId: res.member.user_id + "",
      role: res.member.role,
      nick: res.member.nickname,
      age: 0,
      uniqueTitle: res.member.title,
      card: res.member.card,
      joinTime: res.member.join_time,
      lastActiveTime: res.member.last_sent_time,
      level: res.member.level,
      shutUpTime: res.member.shut_up_end_time || void 0,
      sex: res.member.sex,
      sender: {
        userId: res.member.user_id + "",
        nick: res.member.nickname,
        name: res.member.nickname,
        role: res.member.role,
        card: res.member.card,
        level: res.member.level,
        title: res.member.title
      }
    };
  }
  async getGroupMemberList(_groupId, _refresh) {
    const res = (await this.super.getGroupMemberList(+_groupId, _refresh)).members;
    const info = [];
    for (const i of res) {
      info.push({
        userId: i.user_id + "",
        role: i.role,
        nick: i.nickname,
        age: 0,
        uniqueTitle: i.title,
        card: i.card,
        joinTime: i.join_time,
        lastActiveTime: i.last_sent_time,
        level: i.level,
        shutUpTime: i.shut_up_end_time || void 0,
        sex: i.sex,
        sender: {
          userId: i.user_id + "",
          nick: i.nickname,
          name: i.nickname,
          role: i.role,
          card: i.card,
          level: i.level,
          title: i.title
        }
      });
    }
    return info;
  }
  async getGroupHighlights(_groupId, _page, _pageSize) {
    const res = (await this.super.getGroupEssenceMessages(+_groupId, _page, _pageSize)).messages;
    const list = [];
    for (const i of res) {
      list.push({
        groupId: i.group_id + "",
        senderId: i.sender_id + "",
        senderName: i.sender_name,
        operatorId: i.operator_id + "",
        operatorName: i.operator_name,
        operationTime: i.operation_time,
        messageTime: i.message_time,
        messageId: this.super.encodeMsgId("group", i.sender_id, i.message_seq),
        messageSeq: i.message_seq,
        jsonElements: JSON.stringify(i.segments)
      });
    }
    return list;
  }
  async setGroupHighlights(_groupId, _messageId, _create) {
    await this.super.setGroupEssenceMessage(+_groupId, this.super.decodeMsgId(_messageId).seq, _create);
  }
  async getStrangerInfo(_targetId) {
    const res = await this.super.getUserProfile(+_targetId);
    return {
      userId: _targetId,
      nick: res.nickname,
      qid: res.qid,
      remark: res.remark,
      level: res.level,
      age: res.age,
      sex: res.sex
    };
  }
  async getFriendList(_refresh) {
    const res = (await this.super.getFriendList(_refresh)).friends;
    const info = [];
    for (const i of res) {
      info.push({
        userId: i.user_id + "",
        nick: i.nickname,
        qid: i.qid,
        remark: i.remark,
        sex: i.sex
      });
    }
    return info;
  }
  async sendLike(_targetId, _count) {
    await this.super.sendProfileLike(+_targetId, _count);
  }
  async getAvatarUrl(_userId, _size) {
    return `https://q1.qlogo.cn/g?b=qq&s=${_size || 0}&nk=${_userId}`;
  }
  async getGroupAvatarUrl(_groupId, _size, _history) {
    return `https://p.qlogo.cn/gh/${_groupId}/${_groupId}/${_size}`;
  }
  async pokeUser(_contact, _targetId, _count = 1) {
    let pokeFunc;
    if (_contact.scene === "group") pokeFunc = async () => this.super.sendGroupNudge(+_contact.peer, +_targetId);
    if (_contact.scene === "friend") pokeFunc = async () => this.super.sendFriendNudge(+_contact.peer, +_targetId === +this.account.selfId);
    if (!pokeFunc) throw new Error("\u4E0D\u652F\u6301\u7684\u573A\u666F" + _contact.scene);
    for (let i = 0; i < +_count; i++) {
      await pokeFunc();
    }
    return true;
  }
  async setFriendApplyResult(_requestId, _isApprove, _remark) {
    let res = (await this.super.getFriendRequests()).requests;
    let req = res.find((v) => v.initiator_uid === _requestId && v.state === "pending");
    if (!req) {
      res = (await this.super.getFriendRequests(20, true)).requests;
      req = res.find((v) => v.initiator_uid === _requestId && v.state === "pending");
      if (!req) return;
    }
    if (_isApprove) {
      await this.super.acceptFriendRequest(req.initiator_uid, req.is_filtered);
    } else {
      await this.super.rejectFriendRequest(req.initiator_uid, req.is_filtered, _remark);
    }
  }
  async setGroupApplyResult(_requestId, _isApprove, _denyReason) {
    const seq = +_requestId;
    const found = await findGroupNotification(this.super, seq);
    if (!found) {
      this.logger("warn", `setGroupApplyResult: \u672A\u5728\u901A\u77E5\u5217\u8868\u4E2D\u627E\u5230 seq=${seq}`);
      return;
    }
    const { req, isFiltered } = found;
    if (req.type !== "join_request" && req.type !== "invited_join_request") return;
    if (req.state !== "pending") return;
    if (_isApprove) {
      await this.super.acceptGroupRequest(seq, req.type, req.group_id, isFiltered);
    } else {
      await this.super.rejectGroupRequest(seq, req.type, req.group_id, isFiltered, _denyReason);
    }
  }
  async setInvitedJoinGroupResult(_requestId, _isApprove) {
    const seq = +_requestId;
    const groupId = this.invitations.pop(seq);
    if (groupId !== void 0) {
      if (_isApprove) {
        await this.super.acceptGroupInvitation(groupId, seq);
      } else {
        await this.super.rejectGroupInvitation(groupId, seq);
      }
      return;
    }
    const found = await findGroupNotification(this.super, seq);
    if (found && found.req.type === "invited_join_request" && found.req.state === "pending") {
      const { req, isFiltered } = found;
      if (_isApprove) {
        await this.super.acceptGroupRequest(seq, "invited_join_request", req.group_id, isFiltered);
      } else {
        await this.super.rejectGroupRequest(seq, "invited_join_request", req.group_id, isFiltered);
      }
      return;
    }
    this.logger("warn", `setInvitedJoinGroupResult: \u627E\u4E0D\u5230\u9080\u8BF7 seq=${seq}\uFF08adapter \u5185\u5B58\u4E0E\u901A\u77E5\u5217\u8868\u5747\u65E0\u5339\u914D\uFF09`);
  }
  async getCookies(_domain) {
    const res = await this.super.getCookies(_domain);
    return { cookie: res.cookies };
  }
  async getCredentials(_domain) {
    const cookies = (await this.getCookies(_domain)).cookie;
    const token = (await this.getCSRFToken()).token;
    return { cookies, csrf_token: token };
  }
  async getCSRFToken() {
    const res = await this.super.getCSRFToken();
    const token = Number(res.csrf_token);
    if (!Number.isFinite(token)) {
      this.logger("warn", `getCSRFToken: \u534F\u8BAE\u7AEF\u8FD4\u56DE "${res.csrf_token}" \u65E0\u6CD5\u8F6C\u6362\u4E3A number\uFF0C\u4F7F\u7528 0 \u515C\u5E95`);
      return { token: 0 };
    }
    return { token };
  }
};

// src/core/botManager.ts
var BotManager = class {
  bots = /* @__PURE__ */ new Map();
  getKey(protocol, url) {
    return `${protocol}::${url}`;
  }
  getBot(key) {
    return this.bots.get(key);
  }
  async addBot(cfg) {
    const key = this.getKey(cfg.protocol, cfg.url);
    const existing = this.bots.get(key);
    if (existing) existing.stop();
    const bot = new MilkyAdapter(cfg);
    this.bots.set(key, bot);
    await bot.start();
  }
  delBot(key) {
    const bot = this.bots.get(key);
    if (!bot) return true;
    bot.stop();
    this.bots.delete(key);
  }
};
var Bot = new BotManager();

export {
  dir,
  LoggerAdapter,
  Bot,
  Cfg
};
