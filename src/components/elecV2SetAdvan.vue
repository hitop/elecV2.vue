<template>
<div class="advanSetInfo">
	<div class="wzborder"><span class="wzborder_mtitle">特殊参数设置</span>
		<p><b class="infoname">MUX</b><input class="infoinput_checkbox" type="checkbox" name="mux" v-model="outBset.mux"><b class="infoname infoname_long">concurrency</b><input name="concurrency" v-model="outBset.concurrency" placeholder="1-1024" class="infoinput infoinput_two"></p>
		<p><b class="infoname infoname_long">tcpfastopen</b><input class="infoinput_checkbox" type="checkbox" name="tcpfastopen" v-model="outBset.tcpfastopen"><b class="infoname">TLS</b><select name="tls" v-model="outBset.tls" class="infoinput infoinput_two">
				<option>none</option>
				<option>tls</option>
			</select></p>
		<p><b class="infoname infoname_long">allowInsecure</b><input class="infoinput_checkbox" type="checkbox" name="allowInsecure" v-model="outBset.allowInsecure"></p>
		<p><b class="infoname infoname_long">domainStrategy</b><select name="domainStrategy" v-model="outBset.domainStrategy" class="infoinput infoinput_middle">
				<option>AsIs</option>
				<option>IPIfNonMatch</option>
				<option>IPOnDemand</option>
			</select></p>
	</div>
	<div class="wzborder csoutbset"><span class="wzborder_mtitle">出站及路由优先级</span>
		<p class="center">第一个选择值顺序第一，第二个第二，剩余一个最后</p>
		<p class="csoutborder"><b class="infoname infoname_short">出站</b><select v-model="outBset.outborder[0]" class="infoinput infoinput_two">
				<option value="proxy">代理</option>
				<option value="direct">直连</option>
				<option value="block">阻止</option>
			</select><select v-model="outBset.outborder[1]" class="infoinput infoinput_two">
				<option value="proxy">代理</option>
				<option value="direct">直连</option>
				<option value="block">阻止</option>
			</select></p>
		<p class="tip">* 没有匹配到路由规则的网站默认使用第一个出站协议<br>* 即： 代理优先 - 白名单模式 直连优先 - 黑名单模式</p>
		<p class="csroutorder"><b class="infoname infoname_short">路由</b><select v-model="outBset.routorder[0]" class="infoinput infoinput_two">
				<option value="proxy">代理</option>
				<option value="direct">直连</option>
				<option value="block">阻止</option>
			</select><select v-model="outBset.routorder[1]" class="infoinput infoinput_two">
				<option value="proxy">代理</option>
				<option value="direct">直连</option>
				<option value="block">阻止</option>
			</select></p>
	</div>
	<div class="wzborder cskcpset"><span class="wzborder_mtitle">KCP参数设置</span>
		<p><b class="infoname">mtu</b><input name='mtu' v-model='outBset.kcp[0]' placeholder='最大传输单元 576 - 1460' class="infoinput"></p>
		<p><b class="infoname">tti</b><input name='tti' v-model='outBset.kcp[1]' placeholder='传输时间间隔 10 - 100' class="infoinput"></p>
		<p><b class="infoname infoname_long">ulinkCapacity</b><input name='uplinkCapacity' v-model='outBset.kcp[2]' placeholder='上行链路容量，单位 MB/s' class="infoinput infoinput_middle"></p>
		<p><b class="infoname infoname_long">dlinkCapacity</b><input name='downlinkCapacity' v-model='outBset.kcp[3]' placeholder='下行链路容量，单位 MB/s' class="infoinput infoinput_middle"></p>
		<p><b class="infoname infoname_long">congestion</b><input class="infoinput_checkbox" type="checkbox" name="congestion" v-model="outBset.kcp[4]"><b class="infoname">伪装类型</b><select v-model="outBset.kcp[7]" name="type" class="infoinput infoinput_two">
				<option>none</option>
				<option>srtp</option>
				<option>utp</option>
				<option>wechat-video</option>
				<option>dtls</option>
				<option>wireguard</option>
			</select></p>
		<p><b class="infoname">rBSize</b><input name='readBufferSize' v-model='outBset.kcp[5]' placeholder='读缓 MB' class="infoinput infoinput_two"><b class="infoname infoname_short">wBSize</b><input name='writeBufferSize' v-model='outBset.kcp[6]' placeholder='写缓 MB' class="infoinput infoinput_two"></p>
	</div>
	<p class="center"><button @click="saveadvanSet" class="nbutton nbutton--long">保存</button></p>
</div>
</template>

<script>
export default {
	name: 'elecV2SetAdvan',
	data(){
		return {
			outBset: this.$store.state.gConf.outBset
		}
	},
	methods: {
		saveadvanSet(){
			this.outBset.concurrency = Number(this.outBset.concurrency)
			if ((this.outBset.outborder[0] == this.outBset.outborder[1]) || (this.outBset.routorder[0] == this.outBset.routorder[1])) {
				this.$elecV2Alert("出站或路由规则请不要选择相同值")
				return
			}
			for (let v of ["direct", "block", "proxy"]) {
				if (this.outBset.outborder.indexOf(v) == -1) this.outBset.outborder[2] = v
				if (this.outBset.routorder.indexOf(v) == -1) this.outBset.routorder[2] = v
			}
			this.outBset.kcp[0] = Number(this.outBset.kcp[0]) || 1350
			this.outBset.kcp[1] = Number(this.outBset.kcp[1]) || 50
			this.outBset.kcp[2] = Number(this.outBset.kcp[2]) || 5
			this.outBset.kcp[3] = Number(this.outBset.kcp[3]) || 20
			this.outBset.kcp[5] = Number(this.outBset.kcp[5]) || 2
			this.outBset.kcp[6] = Number(this.outBset.kcp[6]) || 2

			this.$store.commit('saveGconf')
			this.$elecV2Alert("保存成功")
		}
	}
}
</script>

<style scoped>
.csoutbset .infoinput {
  margin-right: 68px;
}
</style>