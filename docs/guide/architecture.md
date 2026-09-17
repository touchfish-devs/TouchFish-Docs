---
title: 服务器架构
---

# 服务器架构

TouchFish V5 服务端采用分层架构设计。

## 双协议设计

V5 服务端同时运行两个网络协议：

### REST API
- 基于 **Flask**，处理业务请求
- 分为**公开端点**（GET，无需加密）和加密端点（POST，RSA+AES 加密）
- 公开端点：服务器信息、RSA 公钥、用户查询、论坛列表、头像/文件下载、验证码
- 加密端点：所有涉及用户数据和状态变更的操作
- 频率限制在 `before_request` 钩子中统一处理
- 生产环境使用内置 **waitress** 服务器（线程数与连接数可通过启动参数调整），也可用 `--dev-server` 回退到 Flask 开发服务器

### WebSocket
- 基于 `websockets`，处理实时通信
- 支持的实时事件：
  - 私聊/群聊消息收发
  - 消息回执与已读/未读状态
  - 输入状态提示
  - 新消息/通知实时推送
  - 消息撤回、置顶推送
  - **通话信令中继**（`call.invite` / `call.answer` / `call.ice` / `call.hangup`）
- 消息负载使用 AES 加密，握手阶段使用 RSA 交换密钥
- 默认消息频率限制：10条/秒（消息），20条/秒（输入状态）

## 加密协议

V5 采用全新 **RSA + AES 混合加密**：

1. 客户端请求 `GET /get_rsa_pub` 获取服务端 RSA 公钥
2. 客户端生成随机 32 字节 AES-256 密钥 + 16 字节 IV
3. AES 密钥用 RSA 公钥加密
4. 请求体（JSON）用 AES-256-CBC 加密（PKCS7 填充）
5. 服务端解密后处理，响应用同一 AES 密钥加密返回

整个加解密过程由 `crypto.py` 中的 `@api` 装饰器透明处理，业务代码无需关心加密细节。

## 认证体系

### JWT（推荐）
- 登录时请求体携带 `"jwt": true`，服务端签发 token（`expires_in` / `expires_at`）
- 后续请求用 `token` 字段代替 `uid` + `password`
- 签名密钥位于 `res/<port>/secret/jwt_secret`，替换后全部 token 失效
- 每用户可持有 token 数量受 `jwt_max_per_user` 限制，超限返回 `token_limit_reached`
- 会话管理：`/auth/tokens/list` 查看活跃设备，`/auth/tokens/revoke` 踢出指定设备（其 WebSocket 连接会被主动断开）
- 修改密码/重置密码、封禁、删除账号会使该用户全部 token 立即失效

### 旧版认证（在 TFS v5.0.1 后不再使用，保留仅为兼容旧客户端）
- 请求体携带 `uid` + `password`，由服务器逐次校验（显然这不太好）
- `legacy_auth_enabled` 控制是否接受；开启时响应附带弃用提示 `note`
- 旧版本的客户端的 `/auth/login` 返回 `"<timestamp>True/False"` 字符串，新版可用作 JWT 能力探测与降级依据

### 详细错误
所有加密 API 支持在请求体加入 `"detail_error": true`，此时错误响应返回规范化错误码（如 `AUTH_FAILED`）与英文 `error_message`，并使用对应 HTTP 状态码。未携带时保持旧行为，旧客户端无需修改。

API 实现细节详见服务端仓库的 [docs/api/](https://github.com/2044-space-elevator/TouchFishServer/tree/main/docs/api)。

---

## 数据库设计

默认采用 **SQLite + WAL 模式**，每个服务实例拥有独立的数据库文件集；也可通过高级配置切换到 **MySQL / PostgreSQL**（实验性支持，不推荐）。

实验性的 MYSQL / PGSQL 在此不做说明。

| 数据库文件 | 表 | 用途 |
|-----------|-----|------|
| `user.db` | `users`, `friendship`, `tokens` | 用户账户、好友关系、JWT 会话记录 |
| `forum.db` | `forums`, `contents`, `post_attachments`, `forum_members`, `F<fid>` | 论坛、帖子、附件、成员、帖内资源表 |
| `group.db` | `groups`, `group_members`, `join_requests`, `group_id_sequence`, `schema_migrations` | 群组、成员、加群审批、ID 序列、迁移记录 |
| `messages.db` | `messages`, `room_preferences`, `message_mentions`, `group_pinned_messages` | 私聊/群聊消息、房间偏好、@提及、群置顶 |
| `file/file.db` | `file`, `user_file`, `file_uploaders`, `file_references`, `file_gc`, `chunk_upload_tasks`, `chunk_upload_parts` | 文件元数据、用户-文件关联、引用关系、回收记录、分块上传任务 |
| `notification.db` | `notifications`, `notification_meta` | 统一通知事件表（含已读标记）与元信息 |
| `db/sticker.db` | `sticker_packs`, `stickers`, `user_sticker_packs`, `sticker_pack_creation_log`, `sticker_files` | 表情包、表情资源、用户收藏、创建频率记录 |

## 用户角色体系

| 角色 | 权限 |
|------|------|
| `banned` | 被封禁，无法登录或操作 |
| `user` | 基础用户：个人管理、聊天、论坛、群组、文件 |
| `admin` | 管理员：管理用户/封禁账号、审批论坛、设置默认资源 |
| `root` | 超级管理员：管理所有账号（含 admin/root）、配置服务器 |

关键约束：
- 系统必须始终保留至少一个 `root` 账号
- `root` 只能由另一个 `root` 管理
- `admin` 不能操作 `root` 或其他 `admin`

## 通话信令

实时通话的媒体流走 **WebRTC P2P**，服务端不参与媒体转发，只做信令中继（`channel.py` 的 `_handle_call_message`）：

- 信令类型：`call.invite`、`call.answer`、`call.ice`、`call.hangup`
- 每次转发前校验：双方必须是好友、目标 UID 非自身、`call_id` 合法、发送方未触发速率限制
- 服务端不持有通话状态，仅把消息改写为 `{"type", "call_id", "from_uid", ...}` 后投递给目标用户的全部在线连接
- 每类信令会回执 `call.ack`，`status` 可为 `delivered`、`offline`、`not_friends`、`invalid_target`、`invalid_call_id`、`invalid_request`、`rate_limited`
- `call.hangup` 的 `reason` 限定为 `hangup` / `decline` / `cancel` / `busy` / `error`
- ICE 服务器列表由管理员在 `config.json` 的 `rtc` 段配置，通过 `GET /info` 下发给客户端

TFS 自身不搭建 TURN（虽然我们不是微服务架构但是有的服务就是得拆分的呀）

## 多实例架构

一份代码支持同时运行多个独立的服务端实例，例如：

```json
{
    "1": [8080, 8081],
    "2": [8082, 8083],
    "3": [8084, 8085]
}
```

每个实例拥有独立的端口、数据库、配置与密钥文件，互不影响。启动时通过 `--use-config <编号>` 选择实例。

其他仍待补充！

