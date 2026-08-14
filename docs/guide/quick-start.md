---
title: TouchFish V5，全平台，开箱即用，快速部署，混合加密。机房社区、校园树洞、内网沟通的不二之选
---

[TouchFish Server 仓库链接。](https://github.com/2044-space-elevator/TouchFishServer)

[TouchFish Client 仓库链接。](https://github.com/ILoveScratch2/TouchFish-Client)

[TouchFish Server 快速下载指南。](http://touchfish.xin/tfv5/tfs_guide.html)

[TouchFish Client 快速下载指南。](http://touchfish.xin/tfv5/tfc_guide.html)

[TouchFish Official Web（国内部分地区可能会墙，体验不是很好，暂时没有浏览器通知，谨慎使用，仍然强烈推荐下载客户端）。](http://tf.ilovescratch.us.ci/)

[TouchFish UI Remake 2（微软风格 UI，目前可能滞后，具体发布时间关注 TouchFish 官网服务器以获得最新讯息）。](https://github.com/touchfish-devs/TouchFish-UI-Remake-2/releases/)


> 叠甲，本软件只用于娱乐与学术交流目的。并不是鼓励大家不听正课，比如老师讲陈年水题时可以交流其它学术内容。请各位合理使用。

> 同时，建立内网社区后，请规范使用。如发布不良内容遭制裁，TouchFish Dev 团队概不负责。

> 为了说明方便，下称客户端为 tfc，服务端为 tfs.
 
**如果您觉得 TouchFish 好用，请点个 star（没错我是来讨 star 的）。如果您在使用 TouchFish 的时候遇到 bug，请在本文章下提出，最好是去 Github 上提 Issue，以方便流程化处理。如果您想给 TouchFish 添砖加瓦，请提交 PR，感谢您的支持！**

在去年的 8 月中旬，我发布了 [TouchFish 初代](https://www.luogu.com.cn/article/z6se69kk)，广受好评，一度成为你谷热门文章，经过一年的沉淀，我们迎来了全面大升级，社区达到了很大的规模。从一个简陋的聊天室变成了现代化的聊天社区。

### TouchFish 能干什么

她不再只是一个纯粹的聊天室，你可以这样使用：
- 使用 tfc 来登录官网服务器，和来自各地的小伙伴畅聊。
- 自行将 tfs 部署在自己的服务器上，作为校园树洞、技术交流社区、游戏服务社区等等。
- 在机房里部署 tfs，和学校里的其他人在断公网的情况下密聊。

### 我们改进了什么

1. 开箱即用，在需要集成复杂的 web 服务器、数据库的情况下，我们将 tfs 归约成为一个独立软件。所以即使是网络新手也可以很极速的成功部署 tfs。
2. 混合加密，v4 及以前，使用 b64 编码甚至裸文进行消息通信，~~显然容易被缺德的机房大佬 ARP 欺骗~~。因此在 V5 及以后，会在部署服务器时自动生成 RSA 公私钥，配合 AES 混合快速加密。即使你没有配置 SSL 证书，也可以放心与机房的小伙伴通信。
3. 全平台，tfc 基于 flutter 构建，目前主流平台中只差 ios 由于设计原因无法上线。
4. 功能丰富，论坛、私聊、群聊、公告应有尽有，详细功能等待你的探索。
5. 轻量级，客户端安装包大部分控制在 70MB 以内，MacOS 由于特殊原因也控制在 200MB 以内。Server 也是很轻量的，极速部署。
6. 双端开源，放心使用，不惧下毒。
7. 聊天界面支持 Markdown、LaTeX，设计圆润，符合 OIer 审美（逃）。


### 快速启动——登录 TouchFish 官网服务器

我们提供了一个官网服务器，作为对 TouchFish 感兴趣的同志的交流平台，首先需要下载 tfc，下载方式见上。

在注册官网账号之前，你需要准备一个邮箱。为了方便溯源，邮箱是注册官网账号必备的。

在进入软件主页以后，点击注册。进入如图界面：![](https://cdn.luogu.com.cn/upload/image_hosting/loxagjmj.png)。

在输入相关信息以后，紧接着，输入从邮箱获得的验证码，就完成了官网账号的注册。注册后请自行完成登录。

我们推荐您加入 TouchFish 用户群，在【聊天】界面点击右上角放大镜，输入【TouchFish 主社区】即可加入主社区群聊，进入主社区无需通过管理员审核。但建议打开免打扰，~~显然这么多人会很吵~~。

详情请阅读【论坛->TouchFish 主论坛->置顶帖子“游玩指南”】。

### 服主注意——部署 TFS

