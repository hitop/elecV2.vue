<template>
	<div id="basesSetInfo">
		<div id="inbound" class="wzborder"><span class="mtitle">本地代理</span>
			<p class="infolongb"><b>socks 代理端口</b><input name='sport' v-model='inbound.sport'></p>
			<p class="infolongb"><b>HTTP 代理端口</b><input name='hport' v-model='inbound.hport'></p>
			<p class="center"><i>*两种代理模式同时启用，请勿设置相同端口</i></p>
		</div>
		<div id='idBsetdns' class='wzborder'><span class='mtitle'>DNS</span>
			<p><b>DNS</b><textarea name='dns' placeholder='8.8.8.8,1.1.1.1' v-model="dns"></textarea></p>
		</div>
		<div id="idlogset" class="wzborder"><span class="mtitle">log 日志</span>
			<p class="infolongb"><b>访问日志保存目录</b><input name="access" placeholder="建议留空" v-model="log.access"></p>
			<p class="infolongb"><b>错误日志保存目录</b><input name="error" placeholder="建议留空" v-model="log.error"></p>
			<p class="infolongb"><b>错误日志保存级别</b><select v-model="log.loglevel" name="loglevel">
					<option>debug</option>
					<option>info</option>
					<option>warning</option>
					<option>error</option>
					<option>none</option>
				</select></p>
			<p class="center"><i>*若目录为空则输出到 stdout<br>*如果不是测试开发，不建议保留任何日志（设为 none）</i></p>
		</div>
		<div id="idsubset" class="wzborder"><span class="mtitle">订阅相关设置</span>
			<p class="infolongb"><b>最大获取服务器数</b><input name="maxSubsers" v-model="evset.maxSubsers"></p>
			<p><b>是否随机</b><input type="checkbox" name="isRandsub" v-model="evset.isRandsub">
				<p class="tip">* 一些免费订阅链接可能包含上百个服务器，根本用不了那么多，还占位置，选择起来也麻烦。</p>
		</div>
		<div id="idevset" class="wzborder csevset"><span class="mtitle">本程序相关</span>
			<p><input name="isLocalStorage" type="checkbox" v-model="evset.isLocalStorage"><span>启用 localStorage</span></p>
			<p><input name="runonStart" type="checkbox" v-model="evset.runonStart"><span>启动时运行 v2ray</span></p>
			<p><input name="isResize" type="checkbox" v-model="evset.isResize"><span>收缩已隐藏的透明界面</span></p>
			<p class="tip">* 默认使用 localStorage 保存配置文件。不选择则使用本地文件 elecV2.json 文件保存配置<br>* 收缩透明界面：默认点击收缩界面时只是透明隐藏了，程序实际窗口大小并没有变化（启用界面展开时可能会闪烁）</p>
		</div>
		<p class="center"><button class="longButton" @click="saveBset">保存</button></p>
	</div>
</template>

<script>
export default {
	name: 'CompbasesSet',
	data(){
		return {
			inbound: this.$root.gConf.inbound,
			log: this.$root.gConf.log,
			evset: this.$root.gConf.evset,
			gdns: this.$root.gConf.dns
		}
	},
	computed: {
		dns: {
			get(){
				return this.gdns.join(",")
			},
			set(newValue){
				this.gdns = newValue.split(",")
			}
		}
	},
	methods: {
		saveBset(){
			if (this.inbound.sport == this.inbound.hport) {
				this.$root.alertElec("http 和 socks 代理端口冲突")
				return false
			}
			if (this.inbound.sport && this.inbound.hport) {
				this.inbound.sport = Number(this.inbound.sport)
				this.inbound.hport = Number(this.inbound.hport)
			} else {
				this.$root.alertElec("http 和 socks 代理端口输入不完整")
				return false
			}
			this.evset.maxSubsers = Number(this.evset.maxSubsers) || 10
			this.$root.gConf.dns = this.gdns
			this.$root.saveGconf()
			this.$root.alertElec("基础设置已保存")
		}
	}
}
</script>

<style>
#idevset{padding: 0 20px}
</style>