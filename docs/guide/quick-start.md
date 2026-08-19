---
title: TouchFish V5，全平台，开箱即用，快速部署，混合加密。机房社区、校园树洞、内网沟通的不二之选
---

[TouchFish Server 仓库链接。](https://github.com/2044-space-elevator/TouchFishServer)

[TouchFish Client 仓库链接。](https://github.com/ILoveScratch2/TouchFish-Client)

[TouchFish Server 快速下载指南。](http://touchfish.xin/tfv5/tfs_guide.html)

[TouchFish Client 快速下载指南。](http://touchfish.xin/tfv5/tfc_guide.html)

[TouchFish Official Web（国内部分地区可能会墙，体验不是很好，暂时没有浏览器通知，谨慎使用，仍然强烈推荐下载客户端）。](http://tf.ilovescratch.us.ci/)

> 叠甲，本软件只用于娱乐与学术交流目的。并不是鼓励大家不听正课，比如老师讲陈年水题时可以交流其它学术内容。请各位合理使用。

> 同时，建立内网社区后，请规范使用。如发布不良内容遭制裁，TouchFish Dev 团队概不负责。

> 为了说明方便，下称客户端为 tfc（即 TouchFish Client），服务端为 tfs（即 TouchFish Server）。
> 目前 tfc 移动端，通知还没有完全上线，会出现若干小问题，因此建议是将 tfc 一直留在后台，绝大多数情况下，这是可以收到通知的。
 
**如果您觉得 TouchFish 好用，请点个 star（没错我是来讨 star 的）。如果您在使用 TouchFish 的时候遇到 bug，请在本文章下提出，最好是去 Github 上提 Issue，以方便流程化处理。如果您想给 TouchFish 添砖加瓦，请提交 PR，感谢您的支持！**


在去年 8 月中旬，我发布了 [TouchFish 初代](https://www.luogu.com.cn/article/z6se69kk)，广受好评，~~一度成为洛谷热门文章~~。经过一年的沉淀，TouchFish 从一个简陋的聊天室变成了现代化的聊天社区。

## TouchFish 能干什么

她不再只是一个纯粹的聊天室，你可以这样使用：
- 使用 tfc 来登录官网服务器，和来自各地的小伙伴畅聊。
- 自行将 tfs 部署在自己的服务器上，作为校园树洞、技术交流社区、游戏服务社区等等。
- 在机房里部署 tfs，和学校里的其他人在断公网的情况下密聊。

## 我们改进了什么

1. 开箱即用，在需要集成复杂的 web 服务器、数据库的情况下，我们~~特立独行地~~将 tfs 归约成为一个独立软件。所以即使是网络新手也可以很极速的成功部署 tfs。在同类软件中这是少有的，也保证即使电脑小白也能成功部署 tfs。
2. 混合加密，v4 及以前，使用 b64 编码甚至裸文进行消息通信，~~显然容易被缺德的机房大佬 ARP 欺骗~~。因此在 V5 及以后，会在部署服务器时自动生成 RSA 公私钥，配合 AES 混合快速加密。即使你没有配置 SSL 证书，也可以放心与机房的小伙伴通信。
3. 全平台，tfc 基于 Flutter 构建，支持 Windows、macOS、Linux、Android，目前只差 iOS 由于~~某科技大厂~~原因无法上线。
4. 功能丰富，论坛、私聊、群聊、公告、表情包、文件共享应有尽有，更多功能等待你的探索。
5. 轻量级，客户端安装包大部分控制在 70MB 以内，MacOS 由于特殊原因也控制在 200MB 以内。Server 也是很轻量的，极速部署。
6. 双端开源，放心使用，不惧下毒。
7. 聊天界面支持 Markdown、LaTeX，设计圆润，符合 OIer 审美（逃）。


## 快速启动——登录 TouchFish 官网服务器

是的，虽然 TouchFish 被设计为易于自部署，我们还是准备了公网上的官方服务器！

我们提供了一个官网服务器，作为对 TouchFish 感兴趣的同志的交流平台，首先需要下载 tfc，下载方式见上。

在注册官网账号之前，你需要准备一个邮箱。为了方便溯源，邮箱是注册官网账号必备的。

默认要求用户名四个字及以上，而且为了防爆破（逃），验证码设置得较为难以辨认，请谅解。

打开软件进入主页，点击注册，按照提示填写信息（服务器开启了邮箱验证，需输入从邮箱获得的验证码），即可完成注册，注册后请自行完成登录。

：![](https://cdn.luogu.com.cn/upload/image_hosting/loxagjmj.png)。

我们推荐您加入 TouchFish 用户群，在【聊天】界面点击右上角放大镜（即搜索群功能），输入 `4` 即可加入主社区群聊，进入主社区无需通过管理员审核。但建议打开免打扰，~~显然这么多人会很吵~~。

同时呢，论坛中我们也提供了丰富多样的论坛作为交流的平台。建议加入：

- 主论坛：用于发布工单，发布更新信息等等，可以在这里向管理们提出问题。
- 信息学奥赛吧：提供给各位 OI 大佬交流学术内容。
- 弱智吧：作用参考原来 lg 的灌水吧。

更多内容请阅读[tfc 的多样玩法](#tfc-的多样玩法)。


## 服主须知——部署 TFS

> 目前由于进度赶，时间紧，生产环境数据库（如 MySQL）配置入口暂时还在施工，将在文章发布后不久上线，敬请谅解。

> TFS 基于 Python。目前仅提供了桌面端的可执行文件，如果~~真的有需求在移动端上部署 TFS~~，推荐下载 termux 并直接 clone repo 以部署。
> \*nix-Like 操作系统同样可以直接使用源码部署。

建议服主在阅读本段内容后，继续阅读 [配置一个专业的 TFS 服务器](#配置一个专业的-tfs-服务器) 与 [开服指导](/guide/server-setup)。

### 快速部署——适用于机房内，小范围，人数较少的小社区


下载 TFS 安装包并安装，运行后在终端中输入 `ipconfig`（Windows）或者 `ifconfig`（Linux/macOS）查看本机内网 IP。

通过在终端内输入 `ipconfig`（Windows）或者 `ifconfig`（Linux/MacOS）

请在快速下载指南中下载 TFS 安装包并予以安装，安装成功后运行。

选择两个不被占用的端口，一个是 Web 端口，用来提供 API 接口服务。一个是 TCP 端口（用于 WebSocket），用来提供即时通信服务。第一次部署服务器的时候，跟随导引即可。

在完成这两步后，输入 root 用户（UID 0）的用户名和密码。root 用户具有最高权限，所以密码需要安全以防爆破。耐心等待 root 用户自动注册完毕（一定要等不然~~就没有 UID 0 了~~），可以选择是否显式启动 Web 服务器，负荷小的前提下，显式启动 Web 服务器是方便而快捷的，故输入 `y` 即可。

建议服主在登录 root 账号以后，创建一个群聊，并将其设为无需审核加入，可通过 `default_join_targets`（默认加入目标）配置让新注册用户自动加入。因为在 v5 中取消了聊天大厅功能，可以通过该功能来与其他用户通信。

### 生产环境部署——适用于规模较大的社区，在公网上运行推荐依照该标准

你需要有 `python3`（建议 3.8+，低版本可能出现兼容问题）、`git`。这里以 ubuntu 为例，其余大同小异。

先 clone 下来：

```bash
git clone https://github.com/2044-space-elevator/TouchFishServer
```

进入目录，下载依赖。

```bash
cd TouchFishServer
pip3 install -r requirements.txt
```

放行所需端口：

```bash
ufw allow <port1>/tcp
ufw allow <port2>/tcp
```

> 可能需要在服务器提供商内二次放行端口。

创建服务器配置：

```bash
python3 main.py --create-new-config
```

跟随向导输入 API 端口、TCP 端口、root 用户名密码，完成高级配置（可选）后，即生成配置并自动写入 `server_config.json`。配置创建完成后进程会直接启动 TCP 服务，按 `Ctrl+C` 停止，然后使用配置编号正式启动（配置编号从 `0` 开始）：

注：由于 `gunicorn` 的部分兼容问题，暂时不推荐分离服务端，未来将会补充。

```bash
python3 main.py --start-api --use-config 0
```

`--start-api` 会在进程内启动内置高性能 waitress 服务器，无需额外配置 Nginx 即可对外提供 API 服务。建议使用 `screen`、`tmux` 或 systemd 将其常驻后台运行：

```bash
screen -R tfs
python3 main.py --start-api --use-config 0
```

退出时使用 `Ctrl+A D` 脱离（detach），**不要直接终止进程再退出**。

> 生产环境可选的配置（通过向导或 `config.json`）：
> - **MySQL / PostgreSQL 数据库**：当前为实验性支持，请谨慎使用（如果可以的话最好还是使用 SQLite）。
> - **OSS2（阿里云对象存储）**：将文件存储转移到云端，节省本地磁盘。
> - **反向代理**：使用 Nginx/Caddy 时开启，并正确设置代理层数。
> 以上配置的字段含义详见 [开服指导](/guide/server-setup)。


## TFC 的多样玩法

tfc 基于 Flutter 构建，开箱即可获得完整社交体验！

- **聊天**：私聊、群聊、群聊精华、消息置顶与引用、@ 提及、Markdown / LaTeX 渲染、全局消息搜索
- **文件**：拖拽发送图片、视频、音频与任意文件，支持在线预览与多媒体播放
- **表情包**：内置表情包市场，支持创建自己的表情包并分享
- **论坛**：发帖、评论、回复，支持富文本与附件
- **账号**：自定义头像、个性签名、个人简介，通知免打扰设置
- **数据**：聊天记录本地存储与离线同步，支持导出聊天记录、备份本地数据库
- **连接**：内置连通性自检与媒体代理，公网 / 内网 / 反向代理环境均可适配

更多细节等你亲自探索！也可以在【设置】→【调试】中查看连接日志（`talker`）以排查问题。

## 配置一个专业的 TFS 服务器

完整配置项说明（`config.json`、端口规划、频率限制、运行时修改）请参阅 [开服指导](/guide/server-setup)。日常运维与备份、密钥管理请参阅 [服务器维护](/guide/maintenance)。
