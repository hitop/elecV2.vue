<template>
<li>
	<h3><big class="sername infoname infoname_long">名字</big><input class="infoinput infoinput_middle" name='name' type='text' :placeholder='serjson.id' v-model='serjson.name'></h3>
	<div class='info wzborder'>
		<p><b class="infoname">地址</b><input name='address' placeholder='服务器地址' v-model='serjson.address' class="infoinput infoinput_address"><span> : </span><input name='port' placeholder='端口' v-model='serjson.port' class="infoinput infoinput_short"></p>
		<div v-if="serjson.protocol=='vmess'">
			<p><b class="infoname">UUID</b><textarea name='id' placeholder='合法的 UUID 值' v-model="serjson.id" class="infoinput infoinput_textarea"></textarea></p>
			<p><b class="infoname">加密方式</b><select name="security" v-model="serjson.security" class="infoinput">
					<option value="auto">auto</option>
					<option value="aes-128-gcm">aes-128-gcm</option>
					<option value="chacha20-poly1305">chacha20-poly1305</option>
					<option value="none">none</option>
				</select></p>
			<p><b class="infoname">alterId</b><input name="aid" placeholder="4" v-model='serjson.aid' class="infoinput infoinput_two"><b class="infoname infoname_short">path</b><input name='path' v-model='serjson.path' class="infoinput infoinput_two"></p>
		</div>
		<div v-else>
			<p><b class="infoname">加密方式</b><select name="method" v-model="serjson.method" class="infoinput">
					<option value="aes-256-cfb">aes-256-cfb</option>
					<option value="aes-128-cfb">aes-128-cfb</option>
					<option value="chacha20">chacha20</option>
					<option value="chacha20-ietf">chacha20-ietf</option>
					<option value="aes-256-gcm">aes-256-gcm</option>
					<option value="aes-128-gcm">aes-128-gcm</option>
					<option value="chacha20-poly1305">chacha20-poly1305</option>
				</select></p>
			<p><b class="infoname">密码</b><input name='password' v-model='serjson.password' class="infoinput"></p>
		</div>
		<p class='fgfwithword'><span class="fgfwithword_word">底层传输方式{{ serjson.network }}</span></p>
		<div v-if="serjson.network=='tcp'" class="tcpSettings">
			<p><b class="infoname">type</b><select name="type" v-model="serjson.type" class="infoinput">
					<option value="none">none</option>
					<option value="http">http</option>
				</select></p>
		</div>
		<div v-else-if="serjson.network=='h2' || serjson.network=='ws'" class="httpSettings">
			<p><b class="infoname">伪装域名</b><textarea name='hosts' placeholder='123.com,exp.com,...' v-model="serjson.host" class="infoinput infoinput_textarea"></textarea></p>
		</div>
		<div v-else-if="serjson.network=='quic'" class="quicSettings">
			<p><b class="infoname">security</b><select name="quicsecurity" v-model="serjson.quicsecurity" class="infoinput">
					<option value="none">none</option>
					<option value="aes-128-gcm">aes-128-gcm</option>
					<option value="chacha20-poly1305">chacha20-poly1305</option>
				</select></p>
			<p><b class="infoname">key</b><input name='key' placeholder='加密密钥' v-model='serjson.key' class="infoinput"></p>
			<p><b class="infoname">伪装协议</b><select name="type" v-model="serjson.type" class="infoinput">
					<option value="none">none</option>
					<option value="srtp">srtp</option>
					<option value="utp">utp</option>
					<option value="wechat-video">wechat-video</option>
					<option value="dtls">dtls</option>
					<option value="wireguard">wireguard</option>
				</select></p>
		</div>
	</div>
	<p class='flexspace'>
		<button class="nbutton" @click='update'>更新</button>
		<button class="nbutton" @click='serToConfig(slcser)'>下载</button>
	</p>
	<p class='center'>
		<span class='sersurl'>{{ serlists[slcser].surl }}</span>
		<img class='serqrcode' :src="qrcode">
	</p>
</li>
</template>

<script>
import { putFile } from '../util.js'
import { getQrBase64 } from 'jr-qrcode'
import { Base64 } from 'js-base64'

export default {
	name: "elecV2SerInfo",
	props: ["slcser"],
	data(){
		return {
			gConf: this.$store.state.gConf,
			serlists: this.$store.state.gConf.serlists
		}
	},
	computed: {
		serjson() {
			if (this.slcser) return this.evurlToJson(this.serlists[this.slcser].surl)
			else return {}
		},
		qrcode(){
			if (this.slcser) return getQrBase64(this.serlists[this.slcser].surl)
			else return ""
		}
	},
	methods: {
		update(){
			let surl = (this.serjson.protocol=='shadowsocks'?"ss://":"vmess://") + Base64.encodeURI(JSON.stringify(this.serjson))
			this.serlists[this.slcser].surl = surl
			this.serlists[this.slcser].name = this.serjson.name
			this.serlists[this.slcser].address = this.serjson.address
			this.$store.commit('saveGconf')
			this.$elecV2Alert("成功更新服务器 " + this.serjson.name)
		},
		evurlToJson(url) {
			// 自定义的 vmess 转化为 json
			let bs = url.split(/:\/\/|#|\?/)
			let serinfo = Base64.decode(bs[1])
			return JSON.parse(serinfo)
		},
		toInbobj() {
			// 生成 inbounds obj
			let inb = []
			inb[0] = {"protocol": "socks", "port": this.gConf.inbound.sport || 10806}
			inb[1] = {"protocol": "http", "port": this.gConf.inbound.hport || 1081}
			return inb
		},
		serToConfig(sTag) {
			// 通过服务器生成 config.json 文件
			let config = {"log":{}, "dns": {}, "inbounds":[], "outbounds": [], "routing": {"domainStrategy": this.gConf.outBset.domainStrategy || "AsIs", "rules": []}}
			config.log = this.gConf.log
			config.dns.servers = this.gConf.dns
			config["inbounds"] = this.toInbobj()
			config["outbounds"][this.gConf.outBset.outborder.indexOf("proxy")] = this.surlToOutbobj(this.gConf.serlists[sTag].surl)
			config["outbounds"][this.gConf.outBset.outborder.indexOf("proxy")].tag = "proxy"
			config["outbounds"][this.gConf.outBset.outborder.indexOf("direct")] = {"tag": "direct","protocol": "freedom"}
			config["outbounds"][this.gConf.outBset.outborder.indexOf("block")] = {"tag": "block","protocol": "blackhole"}
			config.routing.rules = this.toConfRules()
			putFile(JSON.stringify(config))
		},
		surlToOutbobj(surl) {
			// 通过 vmess:// 或者 ssr:// 生成 outbounbs 信息
			let outbObj = {"settings": {}}
			let vmser = this.evurlToJson(surl)
			outbObj.protocol = vmser.protocol
			outbObj.streamSettings = {"network": vmser.network, "security": this.gConf.outBset.tls, "tlsSettings": {"allowInsecure": this.gConf.outBset.allowInsecure}, "sockopt": {"tcpFastOpen": this.gConf.outBset.tcpfastopen}}
			outbObj.mux = {"enabled": this.gConf.outBset.mux, "concurrency": this.gConf.outBset.concurrency}
			if (outbObj.protocol == "vmess") {
				outbObj.settings.vnext = [{"address": vmser.add || vmser.address, "port": Number(vmser.port), "users": [{"id": vmser.id, "alterId": typeof(vmser.aid)!="undefined"?Number(vmser.aid):4, "security": vmser.security || "auto"}]}]
				switch (vmser.network ) {
					case "tcp":
						outbObj.streamSettings.tcpSettings = {"header": {"type": vmser.type || "none"}}
						if (vmser.type == "http") {
							outbObj.streamSettings.tcpSettings.header.request = {"version": "1.1","method": "GET","path": [vmser.path || "/"],"headers": {"Host": [vmser.host || ""],"User-Agent": ["Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36","Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_2 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/53.0.2785.109 Mobile/14A456 Safari/601.1.46"],"Accept-Encoding": ["gzip, deflate"],"Connection": ["keep-alive"],"Pragma": "no-cache"}}
						}
						break
					case "kcp":
						vmser.kcp = this.gConf.outBset.kcp || vmser.kcp || []
						outbObj.streamSettings.kcpSettings = {"mtu": vmser.kcp[0], "tti": vmser.kcp[1], "uplinkCapacity": vmser.kcp[2], "downlinkCapacity": vmser.kcp[3], "congestion": vmser.kcp[4], "readBufferSize": vmser.kcp[5], "writeBufferSize": vmser.kcp[6], "header": {"type": vmser.type || "none"}}
						break
					case "ws":
						outbObj.streamSettings.wsSettings = {"path": vmser.path || "/", "headers": {"Host": vmser.host || ""}}
						break
					case "h2":
						outbObj.streamSettings.httpSettings = {"host": [vmser.host || ""],"path": vmser.path || "/"}
						break
					case "quic":
						outbObj.streamSettings.quicSettings = {"security": vmser.quicsecurity || "none", "key": vmser.key || vmser.password || "","header": {"type": vmser.type || "none"}}
						break
				}
			} else {
				// ss 协议
				outbObj.settings.servers = [{"email": "elecV2@kufl.ml", "address": vmser.address, "port": Number(vmser.port), "method": vmser.method || "aes-256-cfb", "password": decodeURIComponent(vmser.password), "level": Number(vmser.level) || 0}]
			}
			return outbObj
		},
		toConfRules() {
			let rdomain = {"proxy": [], "direct": [], "block": []}, rip = {"proxy": [], "direct": [], "block": []}
			this.gConf.routing.forEach(rl=>{
				let rule = rl.replace(/\s/g, '').split(",")
				if (rule[0] == "key") rdomain[rule[2]].push(rule[1])
				else if (rule[0] == "domain") rdomain[rule[2]].push("domain:"+rule[1])
				else if (rule[0] == "ip") rip[rule[2]].push(rule[1])
			})
			let rules = []
			let routorder = this.gConf.outBset.routorder
			if (rdomain[routorder[0]].length>0) rules.push({"type": "field", "outboundTag": routorder[0], "domain": rdomain[routorder[0]]})
			if (rip[routorder[0]].length>0) rules.push({"type": "field", "outboundTag": routorder[0], "ip": rip[routorder[0]]})
			if (rdomain[routorder[1]].length>0) rules.push({"type": "field", "outboundTag": routorder[1], "domain": rdomain[routorder[1]]})
			if (rip[routorder[1]].length>0) rules.push({"type": "field", "outboundTag": routorder[1], "ip": rip[routorder[1]]})
			if (rdomain[routorder[2]].length>0) rules.push({"type": "field", "outboundTag": routorder[2], "domain": rdomain[routorder[2]]})
			if (rip[routorder[2]].length>0) rules.push({"type": "field", "outboundTag": routorder[2], "ip": rip[routorder[2]]})
			if (rdomain.block.length>0) rules[routorder.indexOf("block")] = {"type": "field", "outboundTag": "block", "domain": rdomain.block}

			return rules
		}
	}
}
</script>

<style scoped>
.sername { font-size: 28px }
.sersurl {
	font-size: 18px;
	margin-bottom: 10px;
	display: block;
}

.serqrcode { margin-top: 8px }
.serqrcode:hover {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
	margin-top: 0;
	margin: auto;
}
</style>