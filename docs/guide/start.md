---
title: 快速开始
---

# 快速开始

## 环境要求

- **Python**
- **操作系统**：Windows 10+、macOS、Linux 均可
- **网络**：服务端和客户端之间网络可达（局域网或公网）

## 安装

### 1. 获取源码

```bash
git clone https://github.com/2044-space-elevator/TouchFish.git
cd TouchFish
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

核心依赖包括 Flask、websockets、argon2-cffi、cryptography、Pillow、captcha。

## 配置服务端

### 创建新实例

```bash
python main.py --create-new-config --use-config 1
```

这会为配置 `1`（API 端口 8080、TCP 端口 8081）创建完整的运行目录，包括：
- RSA 密钥对（`res/8080/secret/`）
- SQLite 数据库文件
- 默认头像和资源文件
- 服务器配置文件

### 服务端配置项

生成后可在 `res/<api_port>/config.json` 中修改配置。常用配置项：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `server_name` | 服务器名称 | TouchFish |
| `captcha` | 注册是否需要验证码 | false |
| `email_activate` | 注册是否需要邮箱验证 | ""（空为不启用） |
| `file_last_time` | 文件保留时间（小时） | 72 |
| `max_file_size` | 单文件最大大小（字节，-1 不限制） | -1 |
| `user_storage_quota` | 用户存储配额（字节，-1 不限制） | -1 |
| `max_message_length` | 单条消息最大长度 | 10000 |

::: tip 完整配置参考
所有配置项的详细说明（频率限制、邮箱验证等）请参阅 [开服指导](/guide/server-setup)。
:::

## 启动服务端

```bash
# 使用配置 1 启动（API 端口 8080，TCP 端口 8081）
python main.py --start-api --use-config 1

# 开启调试模式
python main.py --start-api --use-config 1 --debug
```

启动后：
- REST API 监听 `http://0.0.0.0:<api_port>`
- WebSocket 监听 `ws://0.0.0.0:<tcp_port>`

注意：建议使用其他方式启动 API 服务。

## 连接客户端

使用 [TouchFish Client](https://github.com/ILoveScratch2/TouchFish-Client)（基于 Flutter 的跨平台客户端）连接到服务端：

1. 打开 TouchFish Client
2. 输入服务端的 IP 地址和 API 端口
3. 注册新账号或登录已有账号

客户端首次连接时会自动下载服务端 RSA 公钥，后续所有通信均为加密传输。

## 多实例部署

一份代码可以同时运行多个独立的服务端实例（不同端口、独立数据库、独立配置）。只需为每个实例创建配置后分别启动即可。
