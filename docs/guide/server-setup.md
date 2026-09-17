---
title: 开服指导
---

# 开服指导

本文档详细说明 TouchFish V5 服务端的所有配置项及其含义，可作为开服时的完整参考。

## 端口规划

TouchFish V5 每个服务实例需要**两个端口**：

| 端口 | 协议 | 用途 |
|------|------|------|
| API 端口 | HTTP | Flask REST API，处理所有业务请求 |
| TCP 端口 | WebSocket | 实时通信（消息、通知、通话信令、状态推送） |

两个端口不能重复，必须可访问。


## 创建服务器实例

使用

```bash
python main.py
```

后选择交互式创建，或直接运行：


```bash
python main.py --create-new-config
```

交互式流程：
1. 输入 API 端口号和 TCP 端口号
2. 自动生成 RSA-2048 密钥对，终端会打印**公钥 SHA-256 哈希值**
3. 自动创建 `res/<api_port>/` 下的完整目录结构
4. 自动初始化所有数据库文件
5. 设置 root 用户（首个注册用户自动成为 root）
6. 询问是否进行**高级配置**（可选）：OSS2 对象存储、SMTP 邮箱验证、反向代理、MySQL/PostgreSQL 数据库后端

::: danger 重要
请务必将终端输出的 RSA 公钥 SHA-256 哈希值公布在可信渠道（如官网、README），供客户端校对以对抗中间人攻击。
:::

## config.json 完整参考

配置文件位于 `res/<api_port>/config.json`。

创建实例时只写入**最小配置**（服务器名、端口、验证码、邮件、文件保留时间、群组限制、限流、`max_file_size`、`user_storage_quota`），其余字段按需在高级配置或运行时补写。下表中的默认值为**服务端读取配置时使用的回退值**，因此字段缺失与显式填入默认值的行为一致。

类型标注中的 `int（-1 = 不限制）` 表示该字段支持 `-1`。

### 基础配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `server_name` | string | `"TouchFish"` | 服务器名称，显示在客户端和通知邮件中 |
| `port_api` | int | 创建时指定 | API 端口 |
| `port_tcp` | int | 创建时指定 | TCP（WebSocket）端口 |
| `captcha` | bool | `false` | 注册时是否需要图片验证码 |
| `email_activate` | string | `""` | 发件邮箱地址，空字符串表示不启用邮箱验证 |
| `email_password` | string | `""` | 发件邮箱密码或 SMTP 授权码 |
| `smtp_host` | string | `""` | SMTP 服务器地址，留空时按邮箱域名自动猜测（如 `smtp.gmail.com`） |
| `smtp_port` | int | `465` | SMTP 端口（`465`=SSL 直连，`587`=STARTTLS） |
| `smtp_use_ssl` | bool | `true` | 使用 SSL 直连；`false` 时使用 STARTTLS |

### 反向代理

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `reverse_proxy_enabled` | bool | `false` | 服务器是否运行在反向代理（如 Nginx）后方 |
| `proxy_count` | int | `1` | 信任的代理层数，用于正确解析客户端真实 IP |

::: tip 何时启用反向代理
将 TFS 部署在 Nginx/Caddy 等反代后方时，开启此配置并正确设置 `proxy_count`，否则基于 IP 的限流和封禁可能误伤反代出口 IP。
:::

### 文件与存储

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_last_time` | int | `72` | 文件保留时间（小时）。无引用的文件超时后自动清理 |
| `max_file_size` | int（`-1`） | `-1` | 单文件最大上传大小（字节），`-1` 表示不限制 |
| `max_avatar_size` | int（`-1`） | 同 `max_file_size` | 头像文件最大大小（字节） |
| `user_storage_quota` | int（`-1`） | `-1` | 每用户存储配额（字节） |
| `max_user_storage_quota` | int（`-1`） | `73400320` | 单用户存储配额的**硬性上限**（字节，约 70MB），即使 `user_storage_quota` 更高也不得超过 |
| `max_sticker_storage_quota` | int（`-1`） | `31457280` | 瞬时表情包（Sticker）总存储配额（字节，约 30MB） |
| `allowed_file_extensions` | array \| null | `null` | 允许上传的文件扩展名白名单，如 `["jpg","png","pdf"]`；`null` 不限制 |
| `storage_backend` | string | `"local"` | 文件存储后端：`local`（本地磁盘）或 `oss2`（阿里云 OSS） |
| `file_download_mode` | string | `"redirect"` | OSS2 模式下的下载方式：`redirect`（307 预签名直链）或 `proxy`（服务端中转）。本地存储下无效果 |
| `oss2_authid` | string | 无 | OSS2 AccessKey ID |
| `oss2_authkey` | string | 无 | OSS2 AccessKey Secret |
| `oss2_endpoint` | string | 无 | OSS2 Endpoint，如 `oss-cn-hangzhou.aliyuncs.com` |
| `oss2_bucket` | string | 无 | OSS2 Bucket 名称 |

::: tip 存储配额说明
- 创建实例时 `max_file_size` 与 `user_storage_quota` 被写为 `73400320`（约 70MB），这是新建服务器的**保守默认值**而非代码回退值；字段缺失或手动删除时服务端按 `-1`（不限制）处理，可在运行时调整
- `user_storage_quota` 与 `max_user_storage_quota` 检查的是该用户所有**活跃引用**的文件总大小
- 文件上传采用 SHA-256 去重：相同文件只存一份，多次引用共享物理存储
- 当文件的引用计数归零且超过 `file_last_time` 小时未被重新引用后，自动清理
- 使用 OSS2 时，文件存储于云端，本地不再保留文件实体；请为 OSS 配置生命周期规则以清理过期文件
:::

### 实时通话（RTC）

TFS 现在支持了实时通话！~~（虽然 AI 含量为 inf）~~

TFS 不提供 TURN 服务，只负责把管理员配置的 ICE 服务器下发给客户端（`GET /info` 的 `ice_servers`）。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rtc.turn_enabled` | bool | `false` | 是否下发自定义 ICE 服务器列表 |
| `rtc.ice_servers` | array | `[]` | ICE 服务器条目，格式为 `{"urls": [...], "username": ..., "credential": ...}` |

::: tip 配置示例
```json
{
    "rtc": {
        "turn_enabled": true,
        "ice_servers": [
            {"urls": ["stun:stun.epygi.com", "stun:stun.fitauto.ru"]},
            {
                "urls": ["turn:turn.example.com:3478"],
                "username": "touchfish",
                "credential": "replace-with-a-strong-password"
            }
        ]
    }
}
```
`turn_enabled` 为 `false` 或缺失时只返回内置 STUN 列表。TURN 服务的部署与验证详见服务端仓库的 `docs/rtc_turn_setup.md`。
:::

### 群组限制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `groups_limit` | int（`-1`） | `30` | 单个用户最多创建的群组数 |
| `single_group_max_people` | int（`-1`） | `200` | 单个群组最大人数 |
| `default_join_targets` | array | `[]` | 新注册用户自动加入的目标，格式为 `["U<uid>", "G<gid>"]`（如 `["G1"]` 表示自动加入群组 1），目标必须真实存在 |
| `min_group_name_length` | int | `1` | 群名最小长度 |
| `max_group_name_length` | int | `50` | 群名最大长度 |

### 消息与内容限制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_message_length` | int | `10000` | 单条消息最大字符数 |
| `max_sign_length` | int（`-1`） | `100` | 个性签名最大长度 |
| `max_introduction_length` | int（`-1`） | `500` | 个人简介最大长度 |
| `max_post_content_length` | int（`-1`） | `20000` | 论坛帖子正文最大长度 |
| `min_username_length` | int | `4` | 用户名最小长度（运行时最少 4） |
| `min_password_length` | int | `1` | 密码最小长度 |

### 表情包（Sticker）限制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_sticker_packs_per_user` | int（`-1`） | `24` | 单个用户最多可创建的表情包数量 |
| `max_stickers_per_pack` | int（`-1`） | `24` | 单个表情包内最多表情数量 |
| `daily_sticker_pack_creation_limit` | int（`-1`） | `-1` | 用户每日最多创建表情包数量 |
| `max_sticker_size` | int（`-1`） | `1048576` | 单个表情文件最大大小（字节，约 1MB） |

### 认证（JWT）

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `legacy_auth_enabled` | bool | `true` | 是否接受旧版 `uid + password` 认证（开启时旧客户端可继续使用，其响应会附带弃用提示 note） |
| `jwt_expires_seconds` | int | `604800` | JWT 有效期（秒），默认 7 天（运行时最少 60） |
| `jwt_max_per_user` | int（`0` = 不限制） | `5` | 单用户可同时持有的 token 数量，超限返回 `token_limit_reached` |

::: tip JWT 说明
- 客户端登录时请求体携带 `"jwt": true`，服务器返回 `{"token", "expires_in", "expires_at"}`。
- 后续请求在加密请求体中以 `token` 字段代替 `uid` + `password`。
- 用户修改密码、被封禁或删除时，其已签发的全部 JWT 立即失效。
- JWT 签名密钥自动生成于 `res/<port>/secret/jwt_secret`；替换该文件并重启服务器可使全部 token 失效。
- 单台设备可通过 `/auth/tokens/revoke` 主动踢出，详见 API 文档的 JWT 章节。
:::

### 数据库

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `db_backend` | string | `"sqlite"` | 数据库后端：`sqlite`、`mysql`、`postgresql` |
| `db_host` | string | `"localhost"` | 数据库主机地址 |
| `db_port` | int | `3306` / `5432` | 数据库端口 |
| `db_user` | string | 无 | 数据库用户名 |
| `db_password` | string | 无 | 数据库密码 |
| `db_name` | string | `"touchfish_v5"` | 数据库名 |

::: warning 实验性支持
MySQL / PostgreSQL 后端目前为**实验性支持**，不保证稳定性，可能造成数据丢失或崩溃，请谨慎使用。缺失 `db_user`/`db_password` 时会自动回退到 SQLite。
:::

### 频率限制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rate_limits` | object | 见下方 | 基于 IP + 端点的请求频率限制 |

默认配置：
```json
{
    "rate_limits": {
        "default": {"requests": 60, "range": 60}
    }
}
```

- `default`：对未单独配置的端点生效；若不存在则不限速
- `requests`：时间窗口内允许的最大请求数
- `range`：时间窗口长度（秒）

针对特定端点配置示例：
```json
{
    "rate_limits": {
        "default":           {"requests": 60,  "range": 60},
        "/auth/register":    {"requests": 5,   "range": 300},
        "/file/upload_file": {"requests": 20,  "range": 60},
        "/auth/login":       {"requests": 30,  "range": 60}
    }
}
```

::: tip 限流建议
- 注册端点 (`/auth/register`) 建议严格限制，防止批量注册
- 文件上传 (`/file/upload_file`) 按服务器带宽适当限制
- WebSocket 消息与通话信令频率由服务端内置限流，暂时不在此配置
:::

### 完整配置示例

```json
{
    "server_name": "我的 TouchFish 服务器",
    "port_api": 7001,
    "port_tcp": 21474,
    "captcha": true,
    "email_activate": "noreply@example.com",
    "email_password": "your_smtp_password",
    "smtp_host": "smtp.example.com",
    "smtp_port": 465,
    "smtp_use_ssl": true,
    "reverse_proxy_enabled": false,
    "proxy_count": 1,
    "file_last_time": 168,
    "groups_limit": 20,
    "single_group_max_people": 100,
    "default_join_targets": ["G1"],
    "max_file_size": -1,
    "max_avatar_size": -1,
    "user_storage_quota": -1,
    "max_user_storage_quota": 73400320,
    "max_sticker_storage_quota": 31457280,
    "max_message_length": 5000,
    "min_group_name_length": 2,
    "max_group_name_length": 30,
    "min_username_length": 4,
    "min_password_length": 1,
    "max_sign_length": 100,
    "max_introduction_length": 500,
    "max_post_content_length": 20000,
    "max_sticker_packs_per_user": 24,
    "max_stickers_per_pack": 24,
    "daily_sticker_pack_creation_limit": -1,
    "max_sticker_size": 1048576,
    "allowed_file_extensions": ["jpg", "jpeg", "png", "gif", "webp", "pdf", "zip", "txt", "md"],
    "legacy_auth_enabled": true,
    "jwt_expires_seconds": 604800,
    "jwt_max_per_user": 5,
    "rtc": {
        "turn_enabled": false,
        "ice_servers": []
    },
    "rate_limits": {
        "default":           {"requests": 60,  "range": 60},
        "/auth/register":    {"requests": 3,   "range": 300},
        "/auth/login":       {"requests": 20,  "range": 60},
        "/file/upload_file": {"requests": 10,  "range": 60}
    }
}
```

## 运行时修改配置

root 用户可通过客户端（或 API）在运行时修改大部分配置项。主要入口：

- `POST /auth/server_settings/query`：查询当前配置
- `POST /auth/server_settings/update`：更新以下字段（仅更新显式传入的字段，成功时返回更新后的完整配置）

可更新字段：`server_name`、`captcha`、`file_last_time`、`groups_limit`、`single_group_max_people`、`default_join_targets`、`max_file_size`、`max_avatar_size`、`user_storage_quota`、`max_user_storage_quota`、`max_sticker_storage_quota`、`max_message_length`、`min_group_name_length`、`max_group_name_length`、`max_sign_length`、`max_introduction_length`、`max_post_content_length`、`min_username_length`、`min_password_length`、`max_sticker_packs_per_user`、`max_stickers_per_pack`、`daily_sticker_pack_creation_limit`、`max_sticker_size`、`smtp_host`、`smtp_port`、`smtp_use_ssl`、`reverse_proxy_enabled`、`proxy_count`、`legacy_auth_enabled`、`jwt_expires_seconds`、`jwt_max_per_user`、`file_download_mode`

::: warning 独立接口
- `rate_limits` 通过 `POST /auth/change_rate_limits` 修改，传入 `null` 可清空全部限流，修改后**立即生效**
- 邮箱验证开关及 SMTP 凭据通过 `POST /auth/change_email_verify` 修改
- 图片验证码开关可通过 `POST /auth/change_captcha` 修改
- `max_message_length` 修改后立即生效，无需重启
- `reverse_proxy_enabled` 与 `proxy_count` 修改后立即重新包装请求中间件
- `file_download_mode` 可随时切换，无需重启
- 其余字段需重启服务端后生效
:::

::: tip 校验约束
- `server_name` 必须是非空字符串
- `file_last_time` ≥ `0`；`proxy_count` ≥ `0`；`smtp_port` ≥ `1`
- `groups_limit`、`single_group_max_people`、`max_file_size`、`max_avatar_size`、`user_storage_quota`、`max_user_storage_quota`、`max_sticker_storage_quota`、`max_sign_length`、`max_introduction_length`、`max_post_content_length`、`max_sticker_packs_per_user`、`max_stickers_per_pack`、`daily_sticker_pack_creation_limit`、`max_sticker_size` 与 `jwt_max_per_user` 支持传入 `-1`（`jwt_max_per_user` 为 `0`）表示不限制
- `min_username_length` 运行时不可低于 `4`
- `default_join_targets` 中的目标必须真实存在（用户或群组）
:::
