<template>
	<div id="elecV2Set">
	<div id="left">
		<div id="idDrag">{{ title }}</div>
		<span id="settingShow" @click="$emit('set-show')"><span class="icon-menu cslittlebutton"></span></span>
		<ul id="setting"><li v-for="cset in setlists" :key="cset.id" @click="showSet(cset.id)" :id="cset.id" :class="{ active : acTab == cset.id }">{{ cset.text }}</li></ul>
	</div>
	<div id="infos">
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
	props: ['title'],
	components: {
		CompbasesSet,
		CompthemeSet,
		CompfruleSet,
		CompsubrsSet,
		CompadvanSet
	},
	methods: {
		showSet: function(id) {
			this.acTab = id
		}
	}
}
</script>