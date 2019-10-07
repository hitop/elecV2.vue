<template>
<div class="elecV2Ser">
	<div class="nav">
		<elecV2Head/><elecV2Toggle  @set-toggle="$emit('set-toggle')"/>
		<ul class="serlists">
			<li v-for="ser in nogroupser" :class="['nav_tab', { 'nav_tab--actived' : slcser == ser }]" :key="ser" @click.self="showSerInfo(ser)">{{ serlists[ser].name }}<span class="serlists_delete" @click.prevent="delSer(ser)">x</span></li>
			<li class="nav_tab nav_tab--addser" @click="showSerInfo('addSer')">+</li>
		</ul>
		<div v-for="(gser, gid, index) in groupser" class="serlists" :key="gid">
			<div><span class="serlists_groupinfo serlists_groupname" @click.self="showSerInfo(gid, true)">{{ group[gid].name }}</span><span class="serlists_groupinfo serlists_gcollapse" @click="collapseSer(index, $event)">></span></div>
			<ul class="serlists_grouplist" v-show="!gcollapse[index]">
				<li v-for="ser in gser" :class="['nav_tab', { 'nav_tab--actived' : slcser == ser }]" :key="ser" @click.self="showSerInfo(ser)">{{ serlists[ser].name }}<span class="serlists_delete" @click.prevent="delSer(ser)">x</span></li>
			</ul>
		</div>
	</div>
	<div class="contents">
		<ul id="serInfoList">
			<li v-show="addSershow">
				<p><b class="infoname">链接</b><textarea type='text' name='adds' v-model='addsurl' placeholder="vmess://xxx or ss://xxxx or 订阅地址" class="infoinput infoinput_textarea"></textarea></p>
				<p><b class="infoname">别名</b><input name='sername' v-model='addname' placeholder='可留空' class="infoinput"></p>
				<p><b class="infoname">添加到组</b><select v-model='addgroup' class="infoinput">
						<option value="none">不添加到分组</option>
						<option v-for="(gl, v) in group" :value="v" :key="v">{{ gl.name }}</option>
					</select></p>
				<p class='center'><button @click='addS' class="nbutton nbutton-long">添加</button></p>
			</li>
			<li v-if="currentgid" :id="currentgid + 'Info'">
				<div class="wzborder"><span class="wzborder_mtitle">订阅组信息</span>
					<h3 class="infotitle"><big class="infoname">名字</big><input name='name' type='text' v-model='group[currentgid].name' class="infoinput"></h3>
					<p><b class="infoname">链接</b><textarea type='text' name='gurl' v-model='group[currentgid].suburl' class="infoinput infoinput_textarea"></textarea></p>
					<p class='flexspace'><button class="nbutton" @click='upGSer("change")'>保存更改</button><button class="nbutton" @click='upGSer("update")'>更新订阅</button></p>
					<p class="fgf"></p>
					<p class='flexspace'><button class="nbutton nbutton--del" @click.prevent='upGSer("delete")'>删除订阅</button><button class="nbutton" @click='upGSer("export")'>导出订阅</button></p>
				</div>
			</li>
			<elecV2SerInfo v-if="slcser" :slcser="slcser"/>
		</ul>
	</div>
</div>
</template>

<script>
// import Ping from 'ping.js'
import { putFile, newElecId } from '../util.js'
import elecV2Head from './elecV2Head.vue'
import elecV2Toggle from './elecV2Toggle.vue'
import elecV2SerInfo from './elecV2SerInfo.vue'
import { Base64 } from 'js-base64'

export default {
	name: 'elecV2Ser',
	data(){
		return {
			serlists: this.$store.state.gConf.serlists,
			group: this.$store.state.gConf.group,
			addsurl: '',
			addname: '',
			addgroup: 'none',
			addSershow: true,
			currentgid: false,
			slcser: false,
			gcollapse: []
		}
	},
	props: [],
	components: {
		elecV2Head,
		elecV2Toggle,
		elecV2SerInfo
	},
	computed: {
		nogroupser() {return Object.keys(this.serlists).filter(ser=>!this.serlists[ser].group)},
		groupser() {
			let gser = {}
			for (let gid in this.group) {
				gser[gid] = Object.keys(this.serlists).filter(ser=>this.serlists[ser].group == gid)
				this.gcollapse.push[true]
			}
			return gser
		}
	},
	methods: {
		showSerInfo(id, isgroup=false) {
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
		collapseSer(index, ev) {
			// 展开/收缩 订阅
			if (this.gcollapse[index]) {
				this.$set(this.gcollapse, index, false)
				ev.target.style.transform = "rotate(-90deg)"
			} else {
				this.$set(this.gcollapse, index, true)
				ev.target.style.transform = "rotate(90deg)"
			}
		},
		addToSerlists(surl, addgp=null, sname=null) {
			if(surl.match(/^(vmess:\/\/|ss:\/\/)/i)) {
				let serid = newElecId()
				let sjson = this.surlToJson(surl)
				sjson.name = sname || sjson.name || "新服务器"
				addgp = addgp=="none"?null:addgp
				surl = (sjson.protocol=='shadowsocks'?"ss://":"vmess://") + Base64.encodeURI(JSON.stringify(sjson))
				this.$set(this.serlists, serid, {"name": sjson.name, "surl": surl, "group": addgp, "address": sjson.address})
				this.$store.commit('saveGconf')
				this.$elecV2Alert("成功添加服务器 " + sjson.name )
			} else this.$elecV2Alert("添加的服务器信息有误，请修改后重试")
		},
		delSer(sTag){
			if (confirm("确定删除？")) {
				this.slcser = false
				this.$delete(this.serlists, sTag)
				this.$store.commit('saveGconf')
				// this.$root.saveGconf()
			}
		},
		shuffle(array) {
			// 数组重排/去空
			var i = 0, j = 0, temp = null

			for (i = array.length - 1; i > 0; i -= 1) {
				j = Math.floor(Math.random() * (i + 1))
				temp = array[i]
				array[i] = array[j]
				array[j] = temp
			}
			return array
		},
		updateGroupSer(groupid, mn=this.$store.state.gConf.evset.maxSubsers, isRandsub=this.$store.state.gConf.evset.isRandsub) {
			// 更新一个订阅组信息, mn 获取服务器个数
			if (this.group[groupid] && this.group[groupid].suburl) {
				for (let ser in this.serlists) {
					if (this.serlists[ser].group == groupid) delete this.serlists[ser]
				}
				let suburl = this.group[groupid].suburl
				fetch(suburl).then(response=>response.text()).then((rtext)=>{
					let ser = Base64.decode(rtext).split(/\r?\n/), j = 1
					if (ser.length>mn && isRandsub) ser = this.shuffle(ser)
					for (let si of ser) {
						if (/^vmess|^ss/i.test(si)) {
							this.addToSerlists(si, groupid)
							if (j>=mn) break
							else j++
						}
					}
				})
			} else {
				this.$elecV2Alert("订阅组不存在")
			}
		},
		addS() {
			if (this.addsurl == "") {	this.$elecV2Alert("输个值呀，兄弟~");	return false }
			if (/^http/i.test(this.addsurl)) {
				if (this.addgroup!="none") { this.$elecV2Alert("不支持订阅组添加到组");return false	}
				let ngid = newElecId()
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
		upGSer(type=false) {
			let groupid = this.currentgid
			let ngname = this.group[groupid].name
			let ngurl = this.group[groupid].suburl
			if (ngname == "" || /^[0-9]|\.|-|#|:|@|\\|\//.test(ngname) || ngurl=="") {
				this.$elecV2Alert("输入有误（请不要使用空值和特殊字符）")
				return false
			}
			switch(type) {
				case "change":
					this.group[groupid].name = ngname
					this.group[groupid].suburl = ngurl
					this.$store.commit('saveGconf')
					this.$elecV2Alert("更改完成")
					break
				case "update":
					this.group[groupid].name = ngname
					this.group[groupid].suburl = ngurl
					this.updateGroupSer(groupid)
					this.$elecV2Alert("更新中，请稍等...")
					break
				case "delete":
					// 删除一个订阅
					if (confirm("确定删除此订阅？")){
						this.currentgid = false
						this.$delete(this.groupser, groupid)
						for (let ser in this.serlists) {
							if (this.serlists[ser].group == groupid) this.$delete(this.serlists, ser)
						}
						this.$delete(this.group, groupid)
						this.$store.commit('saveGconf')
					}
					break
				case "export": {
					// 导出订阅组信息
					putFile(this.groupser[groupid].map(sid=>this.serlists[sid].surl).join("\n"), this.group[groupid].name)
					break
				}
				default: {
					break
				}
			}
		},
		isJson(str) {
			if (typeof(str) == "object") return true
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		toelecV2Json(vmser, clarify=false) {
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
		surlToJson(url) {
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
		}
	}
}
</script>

<style>
</style>

<style scoped>
.elecV2Ser { height: 460px }
.serlists {
	box-sizing: border-box;
	list-style: none;
	overflow-x: hidden;
	text-align: center;
	display: block;
	width: 300px;
	margin: 16px 0;
	border-radius: 8px;
	background: rgba(222, 222, 222, 0.3)
}

.serlists .serlists_pingres {
	position: absolute;
	display: inline-block;
	font-size: 12px;
	float: right;
	right: 8px;
	top: 8px;
	opacity: 0.8;
	min-width: 30px
}

.nav .nav_tab--addser {
	background: var(--themecl-one);
	color: var(--themecl-two);
	padding: 0;
	height: 24px;
	overflow: hidden;
	font-size: 0;
}
.nav .nav_tab--addser:hover {font-size: initial}

.serlists .serlists_delete {
	position: absolute;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	right: 0;
	top: 0;
	height: 100%;
	line-height: 100%;
	font-size: 40px;
	width: 40px;
	border-radius: 0 8px 8px 0;
	opacity: 0;
	background: red;
}

.serlists .serlists_delete:hover {opacity: 1}

.serlists .serlists_groupinfo {
	display: inline-block;
	box-sizing: border-box;
	height: 36px;
	font-size: 18px;
	cursor: pointer;
	padding: 6px 12px;
}

.serlists .serlists_groupname {
	background: var(--themecl-three);
	color: var(--themecl-one);
	width: 264px;
	text-align: left;
	float: left
}

.serlists .serlists_gcollapse {
	background: var(--themecl-two);
	color: var(--themecl-one);
	width: 36px;
	transform: rotate(-90deg);
}
</style>