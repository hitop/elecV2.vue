<template>
<div id="themeSetInfo">
	<div class="wzborder" id="idCurrentSc"><span class="mtitle">当前主题</span>
		<div id="idcsshow">
			<p class="center"><input v-model="newname"></p>
			<ul>
				<li v-for="cl in minputcs" :key="cl" :style="{ background: cl }"></li>
			</ul>
		</div>
		<p class="center"><button class="longButton" @click="saveCurrencs">设置为默认主题</button></p>
	</div>
	<div id="allCsc" class="wzborder"><span class="mtitle">可用主题</span>
		<ul v-for="(sth, tid) in theme" :key="tid" class="colorSc" :id="tid" @click="applyCs(tid)">
			<li v-for="cli in sth.colorsc" :key="cli" :style="{ background: cli }">{{ cli }}</li><span name="nmthemename">{{ sth.name }}</span>
		</ul>
	</div>
	<div id="manualSc" class='wzborder'><span class="mtitle">更改主题</span>
		<p class="center"><button class="longButton" @click="manualSc(true)">随机配色</button></p>
		<p class='fgfwithword'><span>手动配色</span></p>
		<ul>
			<li v-for="(cl,ind) in minputcs" :key="ind"><input :placeholder="cl" v-model="minputcs[ind]"></li>
		</ul>
		<p class="center"><button @click="manualSc()" class="longButton">应用</button></p><small><i>Tips：</i>颜色依次为：左（主）窗口背景、右窗口背景、下窗口背景及主文字颜色、滚动条及边框等</small>
	</div>
</div>
</template>

<script>
export default {
	name: 'CompthemeSet',
	data(){
		return {
			active: false,
			newname: '未命名主题',
			evset: this.$root.gConf.evset,
			theme: this.$root.gConf.theme,
			minputcs: new Array(4)
		}
	},
	created: function(){
		let tid = this.evset.activetheme || Object.keys(this.theme)[0]
		this.active = tid
		this.newname = this.theme[tid].name
		this.minputcs = this.theme[tid].colorsc
	},
	methods: {
		applyCs: function(tid){
			this.active = tid
			this.newname = this.theme[tid].name
			this.minputcs = this.theme[tid].colorsc
			this.$root.theme(this.theme[tid].colorsc)
		},
		saveCurrencs: function(){
			let tid = this.active
			if (tid) {
				this.theme[tid].name = this.newname
			}	else {
				tid = this.$root.newElecId()
				let scobj = {"name": this.newname, "colorsc": this.minputcs}
				this.$set(this.theme, tid, scobj)
			}
			this.evset.activetheme = tid
			this.$root.saveGconf()
			this.$root.alertElec("成功设置默认主题：" + this.newname)
		},
		manualSc: function(random=false) {
			// 更改主题 random:随机主题
			this.active = false
			this.newname = "未命名主题"
			if (random) {
				this.minputcs = [this.randChex(125,125,125), this.randChex(125,125,125),this.randChex(), this.randChex()]
			}
			this.$root.theme(this.minputcs)
		},
		randChex: function(ra=256, rb=256, rc=256) {
			let k1 = Math.floor(Math.random() * ra).toString(16)
			if (k1.length < 2) k1 = "0" + k1
			let k2 = Math.floor(Math.random() * rb).toString(16)
			if (k2.length < 2) k2 = "0" + k2
			let k3 = Math.floor(Math.random() * rc).toString(16)
			if (k3.length < 2) k3 = "0" + k3

			return "#" + k1 + k2 + k3
		}
	}
}
</script>