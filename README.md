# *原来是一个基于 electron/nodejs 的客户端，学习 vue , 新开的一个网页版*

基础功能：导入 vmess/ss 或者订阅链接，生成 config.json 文件，下载替换 v2ray 的 原 config.json 文件即可（建议原文件先备份）

<!-- 原 electron 客户端的说明 -->

***

## 使用说法

*功能写得太多了，怕自己忘了*

**本软件功能都是基于对原 v2ray 程序 config.json 的修改。如果有能力手动改写 config.json 文件，这个软件完全是没什么用的。**

**建议使用前先备份好原 config.json 文件，如果出现任何问题方便用原 config.json 文件覆盖新的即可**

Alt+F4: 退出 elecV2，不退出 v2ray
托盘或者点击红色退出: 退出 elecV2，同时关闭 v2ray

### elecV2.json 配置说明

inbound: 
- sport socks 代理端口
- hport http 代理端口

*默认是两种代理方式都打开的*

### 分流规则说明

- 每条规则为单独一行，
- 每条规则有三项内容，以半角逗号（,）分隔（逗号之后可以有空格，方便阅读。但不建议添加）

规则格式：
匹配规则,匹配内容,分流方式

匹配规则三种：key（关键字）| domain（域名）| ip（IP）
分流方式三种：proxy（代理）| direct（直连）| block（阻止）

示例：
key,google,proxy // 匹配关键字（key）（google），使用代理连接
domain,google.com,proxy // 匹配域名（domain）（google.com），使用代理连接
*和上条规则的区别 (1 vs 2)*
- 1 会匹配 googleapi.com/google.com.hk/fakegoogle.com/google.cn/googleee.com 等包含 google 关键字的网站
- 如果只是为了代理 google.com 及子域名（map.google.com/mail.google.com） 等网站，无区别
- 1 更广泛通用一些，但在涉及到网站屏蔽 (block) 的时候，可能会出现问题，比如下面两条规则：
-- domain,baiduad.com,block 和 key,baidu,direct。 原意是想所有 baidu 的网站直连，但如果有人用一个包含 baidu 关键字的域名做广告链接，那么针对这条广告就失效了。（如果 block 规则写在前面的话，屏蔽依然有效。

ip,127.0.0.1,direct // 支持 IP-CIDR ，太麻烦了，不建议使用


### CMD框

临时 cmd 命令窗口，可执行一些简单的 cmd 命令

如果命令以 **js** + 空格开头，可执行简单 js 代码

### 快捷链

使用
- F5: 刷新界面
- F7: 重启程序（试验中）
- ctrl+=: 打开添加服务器输入框
- ctrl+0: 上一次保存主题
- ctrl+1: 主题（大海海滩）
- ctrl+2: 主题（土地玄黄）
- ctrl+5: 随机配色方案

### elecV2 版本 vmess 协议

格式：json (通过 base64url 加密后生成 vmess 链接)

具体内容：
<pre>
{
	"v": "elecV2",		//vmess 版本格式声明
	"protocol": "vmess",		// 协议，参数： "vmess" | "shadowsocks" 。合并两个协议方便管理
	"name": "服务器名称",		// 服务器名称
	"address": "uni.exple.com",		// 服务器地址
	"port": 5666,		// 服务器端口，数据类型： number
	"id": "19328377-d8b3-4e15-b979-81e98d48d86f", 		// vmess 服务器 id
	"aid": 0,		// vmess 服务器 alterid
	"security": "auto",		// vmess 服务器加密方式
	"method": "aes-256-cfb",		// ss 服务器加密方式
	"level": 0,		// 用户等级，数据类型： number
	"network": "ws",		// 底层网络协议
	"tls": "tls",		// 是否开启传输层加密, 可选值："tls" | "none"
	"allowInsecure": true,		// 是否允许不安全连接（用于客户端）
	"tcpfastopen": true,		// 是否启用 tcpfastopen
	"type": "none",		// 伪装 header 类型
	"host": "",		// 伪装 host
	"path": "/v2",		// 分流路径
	"kcp": [1350, 50, 5, 20, false, 2, 2],		// kcp 相关设置
	"password": "",		// ss 服务器密码
	"mux": true,		// 是否启用 mux
	"concurrency": 8		// 最大 tcp 并发连接数
}
</pre>

* 并不是每一个 vmess 协议都必须包含以上所有项
* 为了兼容性，此协议是可能还包括其他项内容


#### 一些没什么用的说明

- Ping 功能使用的是 [ping.js](http://github.com/alfg/ping.js) ，是一个纯 JS 的测延迟工具，而且 Ping 的对象是服务器地址，所以可能和实际网络状况出入较大。

# 不解答任何关于路由的问题。这个东西你会就去用，不会的话，我的能力是不可能让我跟任何人解释清楚的。

## 引用项目

- [jrqrcode.js](https://github.com/diamont1001/jrQrcode)
- [simplycalc base64.js](https://simplycalc.com/base64-source.php)
- [icon-css](https://www.zhangxinxu.com/sp/icon/css.php)
- [ping.js](http://github.com/alfg/ping.js)
- [Sortable](https://github.com/SortableJS/Sortable)

## 参考项目

- [v2rayN](https://github.com/2dust/v2rayN)
- [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega)
