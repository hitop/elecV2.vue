<template>
<div class="elecV2Set">
	<div class="nav">
		<elecV2Head/><elecV2Toggle @set-toggle="$emit('set-toggle')"/>
		<ul class="setting">
			<li class="" v-for="cset in setlists" :key="cset.id" @click="showSet(cset.id)" :class="['nav_tab', { 'nav_tab--actived' : acTab == cset.id }]">{{ cset.text }}</li>
		</ul>
	</div>
	<div class="contents">
		<keep-alive>
			<setpanel :is="'elecV2Set' + acTab"/>
		</keep-alive>
	</div>
</div>
</template>

<script>
import elecV2Head from './elecV2Head.vue'
import elecV2Toggle from './elecV2Toggle.vue'
import elecV2SetBases from './elecV2SetBases.vue'
import elecV2SetTheme from './elecV2SetTheme.vue' 
import elecV2SetFrule from './elecV2SetFrule.vue'
import elecV2SetSubrs from './elecV2SetSubrs.vue'
import elecV2SetAdvan from './elecV2SetAdvan.vue'

export default {
	name: 'elecV2Set',
	data(){
		return {
			setlists: [
				{id: "Bases", text: "基础设置"},
				{id: "Theme", text: "主题配色"},
				{id: "Frule", text: "路由分流"},
				{id: "Subrs", text: "规则订阅"},
				{id: "Advan", text: "进阶设置"}
			],
			acTab: 'Bases'
		}
	},
	props: [],
	computed: {
	},
	components: {
		elecV2Head,
		elecV2Toggle,
		elecV2SetBases,
		elecV2SetTheme,
		elecV2SetFrule,
		elecV2SetSubrs,
		elecV2SetAdvan
	},
	methods: {
		showSet(id) {
			this.acTab = id
		}
	}
}
</script>

<style scoped>
.elecV2Set { height: 460px }
</style>