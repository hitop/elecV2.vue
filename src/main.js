import Vue from 'vue'
import elecV2 from './elecV2.vue'
import elecV2Plugin from './plugins/elecV2Plugin'

Vue.config.productionTip = false

new Vue({
	data: {
		gConf: {},
		themecl: []
	},
	computed:{	},
	render: h => h(elecV2),
	created() {
		this.gConf = this.getGconf()
		if (this.gConf.evset.activetheme && this.gConf.theme[this.gConf.evset.activetheme])	{
			this.themecl = this.gConf.theme[this.gConf.evset.activetheme].colorsc.map((s)=>s)
		}	else {
			this.themecl = this.gConf.theme.e73Ue.colorsc.map((s)=>s)
		}
	},
	methods: {
		getGconf() {
			let ggconf = ""
			if (window.localStorage && localStorage.locgConf) {
				ggconf = JSON.parse(localStorage.locgConf)
			} else {
				ggconf = {"log": {"loglevel": "warning"},"dns": [],"evset": {"maxSubsers": 10,"isRandsub": false},"inbound": {"sport": 1080,"hport": 1081},"theme": {"e73Ue": {"name": "大海沙滩","colorsc": ["#2E3784","#2E0571","#FFCB40","#64AAD0"]},"tdxh": {"name": "土地玄黄","colorsc": ["#e2c275","#c36a2d","#f4f4f4","#C89B40"]},"TCXA2": {"name": "莫句","colorsc": ["#2e1630","#262b60","#e9bb4c","#d3fd3c"]}},"serlists": {},"group": {},"outBset": {"tcpfastopen": true,"mux": true,"concurrency": 8,"outborder": ["proxy", "direct", "block"],"routorder": ["block", "direct", "proxy"],"kcp": [1350,50,5,20,false,2,2,"none"],"tls": "tls","allowInsecure": true,"domainStrategy": "AsIs"},"routing": [],"subrules": {}}
				localStorage.setItem("locgConf", JSON.stringify(ggconf))
			}
			return ggconf
		},
		saveGconf() {
			localStorage.locgConf = JSON.stringify(this.gConf)
		},
		putFile(txt, name="config.json") {
			let blob = new Blob([txt])
			let aTag = document.createElement('a')
			aTag.download = name
			aTag.href = URL.createObjectURL(blob)
			aTag.click()
			URL.revokeObjectURL(aTag.href)
		},
		getRanStr(len = 6) {
			// 获取一个随机字符，默认长度为 6, 可自定义
			let b62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			let str = b62[Math.floor(Math.random()*52)]
			while(len > 1){
				str += b62[Math.floor(Math.random()*62)]
				len--
			}
			return str
		},
		newElecId(id=this.getRanStr()) {
			while (this.gConf.group[id] || this.gConf.serlists[id] || this.gConf.subrules[id] || this.gConf.theme[id]) {
				id = this.getRanStr()
			}
			return id
		}
	}
}).$mount('#elecV2')

Vue.use(elecV2Plugin)