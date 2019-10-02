<template>
	<div id="elecV2Ser">
		<div id="left">
			<div id="idDrag">{{ title }}</div>
			<span id="settingShow" @click="$emit('set-show')"><span class="icon-menu cslittlebutton"></span></span>
			<div id="slist">
				<ul id="ulist" class="serGroup">
					<li v-for="ser in allser.nogroupser" :id="ser" :class="{ selected : slcser == ser }" :key="ser" @click.self="showSerInfo(ser)">{{ serlists[ser].name }}<span @click.prevent="delSer(ser)" @mouseleave="isdelser='white'" :style="{ background: isdelser }">x</span></li>
					<li id="addSer" @click="showSerInfo('addSer')">+</li>
				</ul>
				<div v-for="(gser, gid) in allser.grouplist" class="serGroup" :name="gid" :key="gid">
					<div><span :id="gid" @click.self="showSerInfo(gid, true)">{{ group[gid].name }}</span><span class="csCollpser" @click="collapseSer">></span></div>
					<ul v-if="nocollpe">
						<li v-for="ser in allser.grouplist[gid]" :id="ser" :class="{ selected : slcser == ser }" :key="ser" @click.self="showSerInfo(ser)">{{ serlists[ser].name }}<span @click.prevent="delSer(ser)" @mouseleave="isdelser=false" :style="{ background: isdelser }">x</span></li>
					</ul>
				</div>
			</div>
		</div>
		<div id="infos">
			<ul id="serInfoList">
				<li v-if="addSershow" id='addSerInfo' class='sInfoMtop'>
				<p><b>链接</b><textarea type='text' name='adds' v-model='addsurl' placeholder="vmess://xxx or ss://xxxx or 订阅地址"></textarea></p>
				<p><b>别名</b><input name='sername' v-model='addname' placeholder='可留空'></p>
				<p><b>添加到组</b><select v-model='addgroup'>
						<option value="none">不添加到分组</option>
						<option v-for="(gl, v) in group" :value="v" :key="v">{{ gl.name }}</option>
					</select></p>
				<p class='center'><button @click='addS'>添加</button></p>
				</li>
				<li v-if="currentgid" :id="currentgid + 'Info'" class='sInfoMtop'>
					<h3><big>订阅组名：</big><input name='gname' type='text' v-model='group[currentgid].name'></h3>
					<p><b>链接：</b><textarea type='text' name='gurl' v-model='group[currentgid].suburl'></textarea></p>
					<p class='center cstwoButton'><button @click='upGSer(currentgid, true)'>保存更改</button><button @click='upGSer(currentgid)'>更新订阅</button></p>
				</li>
<li v-if="slcser"><h3 class="center"><big>服务器名称：</big><input name='name' type='text' :placeholder='serjson.id' v-model='serjson.name'></h3><div class='wzborder'><p><b>服务器</b><input name='address' placeholder='服务器地址' v-model='serjson.address'><span> : </span><input name='port' placeholder='端口' v-model='serjson.port'></p><div v-if="serjson.protocol=='vmess'"><p><b>UUID</b><textarea name='id' placeholder='合法的 UUID 值' v-model="serjson.id"></textarea></p><p><b>加密方式</b><select name="security" v-model="serjson.security"><option value="auto">auto</option><option value="aes-128-gcm">aes-128-gcm</option><option value="chacha20-poly1305">chacha20-poly1305</option><option value="none">none</option></select></p><p><b>alterId</b><input name="aid" placeholder="4" v-model='serjson.aid'><b>path</b><input name='path' v-model='serjson.path'></p></div><div v-else><p><b>加密方式</b><select name="method" v-model="serjson.method"><option value="aes-256-cfb">aes-256-cfb</option><option value="aes-128-cfb">aes-128-cfb</option><option value="chacha20">chacha20</option><option value="chacha20-ietf">chacha20-ietf</option><option value="aes-256-gcm">aes-256-gcm</option><option value="aes-128-gcm">aes-128-gcm</option><option value="chacha20-poly1305">chacha20-poly1305</option></select></p><p><b>密码</b><input name='password' v-model='serjson.password'></p></div><p class='fgfwithword streamset'><span>底层传输方式：{{ serjson.network }}</span></p><div v-if="serjson.network=='tcp'" class="tcpSettings"><p><b>type</b><select name="type" v-model="serjson.type"><option value="none">none</option><option value="http">http</option></select></p></div><div v-else-if="serjson.network=='h2' || serjson.network=='ws'" class="httpSettings"><p><b>伪装域名</b><textarea name='hosts' placeholder='123.com,exp.com,...' v-model="serjson.host"></textarea></p></div><div v-else-if="serjson.network=='quic'" class="quicSettings"><p><b>security</b><select name="quicsecurity" v-model="serjson.quicsecurity"><option value="none">none</option><option value="aes-128-gcm">aes-128-gcm</option><option value="chacha20-poly1305">chacha20-poly1305</option></select></p><p><b>key</b><input name='key' placeholder='加密密钥' v-model='serjson.key'></p><p><b>伪装协议</b><select name="type" v-model="serjson.type"><option value="none">none</option><option value="srtp">srtp</option><option value="utp">utp</option><option value="wechat-video">wechat-video</option><option value="dtls">dtls</option><option value="wireguard">wireguard</option></select></p></div></div><p class='cstwoButton'><button @click='update'>更新</button><button @click='serToConfig(slcser)'>下载</button></p><p class='center'><span class='tSer'>{{ serlists[slcser].surl }}</span><br><img class='serqrcode' :src="qrcode"></p></li></ul>
		</div>
	</div>
</template>

<script>
// import Ping from 'ping.js'
// import jrQrcode from 'jr-qrcode'
// import CompMenu from "./CompMenu.vue"
// import CompSelect from './CompSelect.vue'

var getQrBase64 = require('jr-qrcode').getQrBase64
var Base64 = require('js-base64').Base64

export default {
	name: 'elecV2Ser',
	data(){
		return {
			serlists: this.$root.gConf.serlists,
			group: this.$root.gConf.group,
			addsurl: '',
			addname: '',
			addgroup: 'none',
			nocollpe: true,
			addSershow: true,
			currentgid: false,
			slcser: false,
			isdelser: 'white'
		}
	},
	props: ['title'],
	components: { },
	computed: {
		allser: function(){
			let aser = {grouplist: {}, nogroupser:[]}
			for (let ser in this.serlists) {
				let temg = this.serlists[ser].group
				if (temg) { aser.grouplist[temg]?aser.grouplist[temg].push(ser):aser.grouplist[temg] = [ser] }
				else { aser.nogroupser.push(ser) }
			}
			return aser
		},
		serjson: function() {
			if (this.slcser) return this.surlToJson(this.serlists[this.slcser].surl)
			else return {}
		},
		qrcode:function(){
			if (this.slcser) return getQrBase64(this.serlists[this.slcser].surl)
			else return ""
		}
	},
	created: function(){
	},
	methods: {
		showSerInfo: function(id, isgroup=false) {
			if (id == "addSer") {
				this.slcser = false
				this.currentgid = false
				this.addSershow = true
			} else if (isgroup){
				this.slcser = false
				this.addSershow = false
				this.currentgid = id
			} else {
				this.addSershow = false
				this.currentgid = false
				this.slcser = id
			}
		},
		randShowSer: function(){
			this.slcser = this.shuffle(Object.keys(this.serlists))[0]
		},
		collapseSer: function(ev) {
			// 展开/收缩 订阅
			if (this.nocollpe) {
				this.nocollpe = false
				ev.target.style.transform = "rotate(-90deg)"
			} else {
				this.nocollpe = true
				ev.target.style.transform = "rotate(90deg)"
			}
		},
		addToSerlists: function(surl, addgp=null, sname=null) {
			if(surl.match(/^(vmess:\/\/|ss:\/\/)/i)) {
				let serid = this.$root.newElecId()
				let sjson = this.surlToJson(surl)
				sname = sname || sjson.name || "新服务器"
				addgp = addgp=="none"?null:addgp
				surl = (sjson.protocol=='shadowsocks'?"ss://":"vmess://") + Base64.encodeURI(JSON.stringify(sjson))
				this.$set(this.serlists, serid, {"name": sname, "surl": surl, "group": addgp, "address": sjson.address})
				this.$root.saveGconf()
				this.$root.alertElec("成功添加服务器 " + sname )
			} else this.$root.alertElec("添加的服务器信息有误，请修改后重试")
		},
		delSer: function(sTag){
			if (this.isdelser == "white") this.isdelser = "red"
			else {
				this.slcser = false
				this.isdelser == "white"
				if (this.serlists[sTag].group) {
					let ind = this.allser.grouplist[this.serlists[sTag].group].indexOf(sTag)
					this.allser.grouplist[this.serlists[sTag].group].splice(ind, 1)
				} else {
					let ind = this.allser.nogroupser.indexOf(sTag)
					this.allser.nogroupser.splice(ind, 1)
				}
				this.$delete(this.serlists, sTag)
				this.$root.saveGconf()
			}
		},
		shuffle: function(array) {
			// 数组重排/去空
			var i = 0
				, j = 0
				, temp = null

			for (i = array.length - 1; i > 0; i -= 1) {
				j = Math.floor(Math.random() * (i + 1))
				temp = array[i]
				array[i] = array[j]
				array[j] = temp
			}
			return array
		},
		updateGroupSer: function(groupid, mn=this.$root.gConf.evset.maxSubsers, isRandsub=this.$root.gConf.evset.isRandsub) {
			// 更新一个订阅组信息, mn 获取服务器个数
			if (this.group[groupid] && this.group[groupid].suburl) {
				for (let ser in this.serlists) {
					if (this.serlists[ser].group == groupid) delete this.serlists[ser]
				}
				let suburl = this.group[groupid].suburl
				var vm = this
				fetch(suburl).then((response)=>{return response.text()})
				.then(function(rtext) {
					let ser = Base64.decode(rtext).split(/\r?\n/), j = 1
					if (ser.length>mn && isRandsub) ser = vm.shuffle(ser)
					for (let si of ser) {
						if (/^vmess|^ss/i.test(si)) {
							vm.addToSerlists(si, groupid)
							if (j>=mn) break
							else j++
						}
					}
				})
			} else {
				this.$root.alertElec("订阅组不存在")
			}
		},
		deleteSubser: function(groupid) {
			// 删除一个订阅
			for (let ser in this.serlists) {
				if (this.serlists[ser].group == groupid) this.$delete(this.serlists, ser)
			}
			this.$delete(this.group, groupid)
			this.$root.saveGconf()
		},
		exportGroup: function(groupid) {
			// 导出订阅组信息
			let sa = []
			this.allser.grouplist[groupid].forEach(sid=>{
				sa.push(this.serlists[sid].surl)
			})
			this.$root.putFile(JSON.stringify(sa))
		},
		addS: function() {
			if (this.addsurl == "") {	this.$root.alertElec("输个值呀，兄弟~");	return false }
			if (/^http/i.test(this.addsurl)) {
				if (this.addgroup!="none") { this.$root.alertElec("不支持订阅组添加到组");return false	}
				let ngid = this.$root.newElecId()
				this.group[ngid] = {}
				this.group[ngid].name = this.addname || "新订阅组"
				this.group[ngid].suburl = this.addsurl
				this.updateGroupSer(ngid)
			} else {
				this.addToSerlists(this.addsurl, this.addgroup, this.addname)
			}
			this.addsurl = ""
			this.addname = ""			
		},
		upGSer: function(groupid, changeName=false) {
			let ngname = this.group[this.currentgid].name
			let ngurl = this.group[this.currentgid].suburl
			if (ngname == "" || /^[0-9]|\.|-|#|:|@|\\|\//.test(ngname) || ngurl=="") {
				this.$root.alertElec("输入有误（请不要使用空值和特殊字符）")
				return false
			} 
			if (changeName) {
				this.group[groupid].name = ngname
				this.group[groupid].suburl = ngurl
				this.$root.saveGconf()
				this.$root.alertElec("更改完成")
			} else {
				this.group[groupid].name = ngname
				this.group[groupid].suburl = ngurl
				this.updateGroupSer(groupid)
			}
		},
		isJson: function(str) {
			if (typeof(str) == "object") return true
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		update: function(){
			let surl = (this.serjson.protocol=='shadowsocks'?"ss://":"vmess://") + Base64.encodeURI(JSON.stringify(this.serjson))
			this.$root.gConf.serlists[this.slcser].surl = surl
			this.$root.gConf.serlists[this.slcser].name = this.serjson.name
			this.$root.gConf.serlists[this.slcser].address = this.serjson.address
			this.$root.saveGconf()
			this.$root.alertElec("成功更新服务器 " + this.serjson.name)
		},
		toelecV2Json:function(vmser, clarify=false) {
			// 生成 elecV2 自定义 json 格式。 clarify 是否删除多余项
			// 统一格式，elecV2 vmess 格式整理 
			vmser.name = decodeURIComponent(vmser.name || vmser.ps || vmser.remark || "新服务器")
			vmser.address = vmser.address || vmser.add || vmser.host || vmser.ip || ""
			vmser.network = vmser.net || vmser.network || "tcp"
			vmser.level = vmser.level || vmser.userlevel || 0
			vmser.path = vmser.path || vmser.wsPath || "/"

			if (clarify) {
				let clarifylist = ["ps", "remark", "net", "alterid", "wsPath", "userlevel", "mtu", "tti", "uplinkCapacity", "downlinkCapacity", "congestion", "readBufferSize", "writeBufferSize", "muxConcurrency", "mux", "allowInsecure"]
				// 清理非 elecV2 vmess 格式数据
				clarifylist.forEach(dat=>delete vmser[dat])
			}
			return vmser
		},
		surlToJson: function(url) {
			// 其他 vmess 或者 ss 链接转换
			let bs = url.split(/:\/\/|#|\?/)
			let serinfo = Base64.decode(bs[1]) + (bs[2]?"#"+bs[2]:"")
			let vmser = {}

			if (bs[0] == "vmess") {
				if (this.isJson(serinfo)) vmser = JSON.parse(serinfo)
				else {
					let vss = serinfo.split(/:|@|#/)
					vmser.address = vss[2]
					vmser.port = Number(vss[3])
					vmser.security = vss[0]
					vmser.id = vss[1]
					vss[4].split("&").forEach(pram=>{
						let tp = pram.split("=")
						vmser[tp[0]] = tp[1]
					})
				}
				vmser.network = vmser.net || vmser.network || "tcp"
				vmser.tls = typeof(vmser.tls)!="undefined"?((vmser.tls=="tls" || Boolean(Number(vmser.tls)))?"tls":"none"):"none"
				vmser.protocol = "vmess"
			} else {
				if (this.isJson(serinfo)) vmser = JSON.parse(serinfo)
				else {
					let ssser = serinfo.split(/:|@|#/)
					vmser.name = ssser[4] || "SS服务器"
					vmser.address = ssser[2]
					vmser.port = ssser[3]
					vmser.method = ssser[0]
					vmser.password = decodeURIComponent(ssser[1])
					vmser.protocol = "shadowsocks"
				}
			}
			return this.toelecV2Json(vmser, true)
		},
		evurlToJson:function(url) {
			// 自定义的 vmess 转化为 json
			let bs = url.split(/:\/\/|#|\?/)
			let serinfo = Base64.decode(bs[1])
			return JSON.parse(serinfo)
		},
		toInbobj:function() {
			// 生成 inbounds obj
			let inb = []
			inb[0] = {"protocol": "socks", "port": this.$root.gConf.inbound.sport || 10806}
			inb[1] = {"protocol": "http", "port": this.$root.gConf.inbound.hport || 1081}
			return inb
		},
		serToConfig:function(sTag) {
			// 通过服务器生成 config.json 文件
			let config = {"log":{}, "dns": {}, "inbounds":[], "outbounds": [], "routing": {"domainStrategy": this.$root.gConf.outBset.domainStrategy || "AsIs", "rules": []}}
			config.log = this.$root.gConf.log
			config.dns.servers = this.$root.gConf.dns
			config["inbounds"] = this.toInbobj()
			config["outbounds"][this.$root.gConf.outBset.outborder.indexOf("proxy")] = this.surlToOutbobj(this.$root.gConf.serlists[sTag].surl)
			config["outbounds"][this.$root.gConf.outBset.outborder.indexOf("proxy")].tag = "proxy"
			config["outbounds"][this.$root.gConf.outBset.outborder.indexOf("direct")] = {"tag": "direct","protocol": "freedom"}
			config["outbounds"][this.$root.gConf.outBset.outborder.indexOf("block")] = {"tag": "block","protocol": "blackhole"}
			config.routing.rules = this.toConfRules()
			this.$root.putFile(JSON.stringify(config))
		},
		surlToOutbobj:function(surl) {
			// 通过 vmess:// 或者 ssr:// 生成 outbounbs 信息
			let outbObj = {"settings": {}}
			let vmser = this.evurlToJson(surl)
			outbObj.protocol = vmser.protocol
			outbObj.streamSettings = {"network": vmser.network, "security": this.$root.gConf.outBset.tls, "tlsSettings": {"allowInsecure": this.$root.gConf.outBset.allowInsecure}, "sockopt": {"tcpFastOpen": this.$root.gConf.outBset.tcpfastopen}}
			outbObj.mux = {"enabled": this.$root.gConf.outBset.mux, "concurrency": this.$root.gConf.outBset.concurrency}
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
						vmser.kcp = this.$root.gConf.outBset.kcp || vmser.kcp || []
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
		toConfRules:function() {
			let rdomain = {"proxy": [], "direct": [], "block": []}, rip = {"proxy": [], "direct": [], "block": []}
			this.$root.gConf.routing.forEach(rl=>{
				let rule = rl.replace(/\s/g, '').split(",")
				if (rule[0] == "key") rdomain[rule[2]].push(rule[1])
				else if (rule[0] == "domain") rdomain[rule[2]].push("domain:"+rule[1])
				else if (rule[0] == "ip") rip[rule[2]].push(rule[1])
			})
			let rules = []
			let routorder = this.$root.gConf.outBset.routorder
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