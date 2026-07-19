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
| TCP 端口 | WebSocket | 实时通信（消息、通知、状态推送） |

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

::: danger 重要
请务必将终端输出的 RSA 公钥 SHA-256 哈希值公布在可信渠道（如官网、README），供客户端校对抗中间人攻击。
:::

## config.json 完整参考

配置文件位于 `res/<api_port>/config.json`。

### 基础配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `server_name` | string | `"TouchFish"` | 服务器名称，显示在客户端和通知邮件中 |
| `captcha` | bool | `false` | 注册时是否需要图片验证码 |
| `email_activate` | string | `""` | 发件邮箱地址，空字符串表示不启用邮箱验证 |
| `email_password` | string | `""` | 发件邮箱密码或 SMTP 授权码 |

### 文件与存储

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `file_last_time` | int | `72` | 文件保留时间（小时）。无引用的文件超时后自动清理 |
| `max_file_size` | int | `-1` | 单文件最大上传大小（字节），`-1` 表示不限制 |
| `max_avatar_size` | int | 同 `max_file_size` | 头像文件最大大小（字节），`-1` 表示不限制 |
| `user_storage_quota` | int | `-1` | 每用户存储配额（字节），`-1` 表示不限制 |
| `allowed_file_extensions` | array \| null | `null` | 允许上传的文件扩展名白名单，如 `["jpg","png","pdf"]`；`null` 不限制 |

::: tip 存储配额说明
- `user_storage_quota` 检查的是该用户所有**活跃引用**的文件总大小
- 文件上传采用 SHA-256 去重：相同文件只存一份，多次引用共享物理存储
- 当文件的引用计数归零且超过 `file_last_time` 小时未被重新引用后，自动清理
:::

### 群组限制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `groups_limit` | int | `30` | 单个用户最多创建的群组数，`-1` 不限制 |
| `single_group_max_people` | int | `200` | 单个群组最大人数，`-1` 不限制 |
| `min_group_name_length` | int | `1` | 群名最小长度 |
| `max_group_name_length` | int | `50` | 群名最大长度 |

### 消息限制

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_message_length` | int | `10000` | 单条消息最大字符数 |

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
- WebSocket 消息频率由服务端内置限流，暂时不在此配置
:::

### 完整配置示例

```json
{
    "server_name": "我的 TouchFish 服务器",
    "captcha": true,
    "email_activate": "noreply@example.com",
    "email_password": "your_smtp_password",
    "file_last_time": 168,
    "groups_limit": 20,
    "single_group_max_people": 100,
    "max_file_size": 104857600,
    "max_avatar_size": 5242880,
    "user_storage_quota": 1073741824,
    "max_message_length": 5000,
    "min_group_name_length": 2,
    "max_group_name_length": 30,
    "allowed_file_extensions": ["jpg", "jpeg", "png", "gif", "webp", "pdf", "zip", "txt", "md"],
    "rate_limits": {
        "default":           {"requests": 60,  "range": 60},
        "/auth/register":    {"requests": 3,   "range": 300},
        "/auth/login":       {"requests": 20,  "range": 60},
        "/file/upload_file": {"requests": 10,  "range": 60}
    }
}
```

## 运行时修改配置

root 用户可通过客户端（或 API）在运行时修改大部分配置项，可修改的字段包括：

`server_name`、`captcha`、`file_last_time`、`groups_limit`、`single_group_max_people`、`max_file_size`、`max_avatar_size`、`user_storage_quota`、`max_message_length`、`min_group_name_length`、`max_group_name_length`

::: warning
`rate_limits` 的修改通过独立接口 `/auth/change_rate_limits` 完成。邮箱相关配置通过 `/auth/change_email_verify` 修改。
:::

::: warning
`rate_limits` 等配置项的修改不会立即生效，需重启服务端。
:::


