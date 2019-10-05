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
		<div v-for="(sth, tid) in theme" :key="tid" class="colorSc" :id="tid">
			<ul @click="applyCs(tid)"><li v-for="cli in sth.colorsc" :key="cli" :style="{ background: cli }">{{ cli }}</li></ul>
			<span class="csthemename">{{ sth.name }}</span>
			<span class="csdeltheme" @click.prevent="deltheme(tid)" @mouseleave="isdeltheme='white'" :style="{ background: isdeltheme }">x</span>
		</div>
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
			minputcs: new Array(4),
			isdeltheme: "white"
		}
	},
	created(){
		let tid = this.evset.activetheme || Object.keys(this.theme)[0]
		this.active = tid
		this.newname = this.theme[tid].name
		this.minputcs = JSON.parse(JSON.stringify(this.theme[tid].colorsc))
	},
	methods: {
		applyCs(tid){
			this.active = tid
			this.newname = this.theme[tid].name
			this.minputcs = JSON.parse(JSON.stringify(this.theme[tid].colorsc))
			this.$root.theme(this.theme[tid].colorsc)
		},
		saveCurrencs(){
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
		manualSc(random=false) {
			// 更改主题 random:随机主题
			this.active = false
			this.newname = "未命名主题"
			if (random) {
				this.minputcs = [this.randChex(125,125,125), this.randChex(125,125,125),this.randChex(), this.randChex()]
			}
			this.$root.theme(this.minputcs)
		},
		deltheme(tid) {
			if (this.isdeltheme == "white") this.isdeltheme = "red"
			else {
				this.$delete(this.theme, tid)
				this.$root.saveGconf()
			}
		},
		randChex(ra=256, rb=256, rc=256) {
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

<style>
#idCurrentSc {
	padding: 8px 22px;
}

#idcsshow ul {
	display: flex;
	justify-content: space-around;
	border: 4px solid #ffffff;
	border-radius: 8px;
}

#idcsshow ul li {
	display: inline-block;
	width: -webkit-fill-available;
	height: 36px;
}

#idcsshow ul li:first-child {border-radius: 4px 0 0 4px}
#idcsshow ul li:last-child {border-radius: 0 4px 4px 0}

#manualSc ul, #manualSc small {
	padding: 0 18px;
	margin: 16px 0;
	display: flex;
	justify-content: space-between;
}

#manualSc ul li {
	display: inline-block;
	width: 108px;
	height: 40px;
}

#manualSc ul li input {
	font-size: 16px;
	max-width: 100%;
	height: 40px;
	text-align: center;
	box-sizing: border-box;
}

#allCsc {
	display: flex;
	flex-flow: wrap;
	justify-content: space-between
}

#allCsc .colorSc {
	position: relative;
	padding: 0;
	margin: 8px 16px;
	width: 160px;
	display: inline-block;
	font-size: 16px
}

#allCsc .colorSc ul:hover{cursor: pointer;}

#allCsc .colorSc li {
	font-size: 16px;
	line-height: 28px;
	padding-left: 16px;
	height: 28px;
}

#allCsc .colorSc li:first-child{border-radius: 8px 8px 0 0}
#allCsc .colorSc li:nth-child(4){border-radius: 0 0 8px 8px}

#allCsc .csthemename {
	font-size: 16px;
	padding: 6px 0;
	width: 100%;
	text-align: center;
	display: inline-block;
}

#allCsc .csdeltheme {
	position: absolute;
	display: inline-block;
	text-align: center;
	right: 0;
	top: 0;
	height: 40px;
	line-height: 40px;
	font-size: 40px;
	width: 40px;
	border-radius: 0 8px 0 0;
	opacity: 0;
	cursor: pointer;
}

#allCsc .csdeltheme:hover {opacity: 1}
</style>