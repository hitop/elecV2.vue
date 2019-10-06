<template>
<div id="elecV2Set">
	<div class="nav">
		<div class="todrag">{{ title }}</div>
		<span class="settingShow" @click="$emit('set-show')"><span class="icon-menu cslittlebutton"></span></span>
		<ul class="setting"><li class="" v-for="cset in setlists" :key="cset.id" @click="showSet(cset.id)" :class="['nav_tab', { 'nav_tab--actived' : acTab == cset.id }]">{{ cset.text }}</li></ul>
	</div>
	<div class="contents">
		<keep-alive>
			<setpanel :is="'Comp' + acTab"/>
		</keep-alive>
	</div>
</div>
</template>

<script>
import CompbasesSet from './CompbasesSet.vue'
import CompthemeSet from './CompthemeSet.vue' 
import CompfruleSet from './CompfruleSet.vue'
import CompsubrsSet from './CompsubrsSet.vue'
import CompadvanSet from './CompadvanSet.vue'

export default {
	name: 'elecV2Set',
	data(){
		return {
			setlists: [
				{id: "basesSet", text: "基础设置"},
				{id: "themeSet", text: "主题配色"},
				{id: "fruleSet", text: "路由分流"},
				{id: "subrsSet", text: "规则订阅"},
				{id: "advanSet", text: "进阶设置"}
			],
			acTab: 'basesSet'
		}
	},
	props: ['title', 'navtabstyle'],
	components: {
		CompbasesSet,
		CompthemeSet,
		CompfruleSet,
		CompsubrsSet,
		CompadvanSet
	},
	methods: {
		showSet(id) {
			this.acTab = id
		}
	}
}
</script>

<style scoped>
#elecV2Set { height: 460px }
</style>