import Vue from 'vue'
import elecV2 from './elecV2.vue'
import './assets/elecV2.css'
// import './assets/theme.css'

Vue.config.productionTip = true

new Vue({
	data: {
		gConf: {}
	},
	render: h => h(elecV2),
	created() {
		this.gConf = this.getGconf()
		if (this.gConf.evset.activetheme && this.gConf.theme[this.gConf.evset.activetheme])	this.theme(this.gConf.theme[this.gConf.evset.activetheme].colorsc)
		else this.theme(this.gConf.theme[Object.keys(this.gConf.theme)[0]].colorsc)
	},
	methods: {
		getGconf: function() {
			let ggconf = ""
			if (window.localStorage && localStorage.locgConf) {
				ggconf = JSON.parse(localStorage.locgConf)
			} else {
				ggconf = {"log": {"loglevel": "warning"},"dns": [],"evset": {"maxSubsers": 10,"isRandsub": false},"inbound": {"sport": 1080,"hport": 1081},"theme": {"e73Ue": {"name": "大海沙滩","colorsc": ["#2E3784","#2E0571","#FFCB40","#64AAD0"]},"tdxh": {"name": "土地玄黄","colorsc": ["#e2c275","#c36a2d","#f4f4f4","#C89B40"]},"TCXA2": {"name": "莫句","colorsc": ["#2e1630","#262b60","#e9bb4c","#d3fd3c"]}},"serlists": {},"group": {},"outBset": {"tcpfastopen": true,"mux": true,"concurrency": 8,"outborder": ["proxy", "direct", "block"],"routorder": ["block", "direct", "proxy"],"kcp": [1350,50,5,20,false,2,2,"none"],"tls": "tls","allowInsecure": true,"domainStrategy": "AsIs"},"routing": [],"subrules": {}}
				localStorage.setItem("locgConf", JSON.stringify(ggconf))
			}
			return ggconf
		},
		saveGconf: function() {
			localStorage.locgConf = JSON.stringify(this.gConf)
		},
		putFile: function(txt) {
			let blob = new Blob([txt])
			let aTag = document.createElement('a')
			aTag.download = "config.json"
			aTag.href = URL.createObjectURL(blob)
			aTag.click()
			URL.revokeObjectURL(aTag.href)
			// alertElec(txt,false,false,false)
		},
		getRanStr: function(len = 6) {
			// 获取一个随机字符，默认长度为 6, 可自定义
			let b62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			let str = b62[Math.floor(Math.random()*52)]
			while(len > 1){
				str += b62[Math.floor(Math.random()*62)]
				len--
			}
			return str
		},
		newElecId: function(id=this.getRanStr()) {
			while (this.gConf.group[id] || this.gConf.serlists[id] || this.gConf.subrules[id] || this.gConf.theme[id]) {
				id = this.getRanStr()
			}
			return id
		},
		alertElec: function(cont, func, input=false, selfdelete=true) {
			let div = document.getElementById('alertElec')
			if (div) div.innerHTML = ""
			else {
				div = document.createElement("div")
				div.id = "alertElec"
				document.body.appendChild(div)
			}
			if (selfdelete && !func) {
				setTimeout("document.getElementById('alertElec').className='hide'",3000)
			}
			if (!selfdelete) {
				cont += `<span class="alertClose" onclick="cancelAlert()">x</span>`
			}
			cont = "<p>" + cont + "</p>"
			if (input) cont += `<div><input name='nmInput'></div>`
			div.innerHTML = cont
			if (func) {
				let divbtn = document.createElement("div")
				divbtn.className = "cstwoButton"
				divbtn.addEventListener("click", function(){this.cancelAlert()},false)
				let btn1 = document.createElement("button")
				btn1.setAttribute("onclick", "cancelAlert()")
				btn1.innerHTML = "取消"
				let btn2 = document.createElement("button")
				btn2.setAttribute("onclick", `runAlert(${func})`)
				// else btn2.setAttribute("onclick", `${func}`)
				btn2.innerHTML = "确定"
				divbtn.append(btn1)
				divbtn.append(btn2)
				div.append(divbtn)
			}
			div.className = "show"
			// fadeIn(div)
		},
		cancelAlert: function() {
			document.getElementById('alertElec').className = "hide"
		},
		runAlert: function(fn) {
			if (typeof(fn) == "function") {
				let alertInput = document.querySelector("#alertElec input[name=nmInput]")
				if (alertInput) eval(fn(alertInput.value))
				else eval(fn())
			}
			document.getElementById('alertElec').className = "hide"
		},
		theme: function(colorcl) {
			if (colorcl == 0) colorcl = [this.randChex(125,125,125),	this.randChex(125,125,125),this.randChex(),this.randChex()]
			else if (colorcl == 1) colorcl = ["#2E3784","#2E0571","#FFCB40","#64AAD0"]
			else if (colorcl == 2) colorcl = ["#e2c275","#c36a2d","#f4f4f4","#C89B40"]

			let css = `::-webkit-scrollbar-thumb {background-color: ${colorcl[3]}}#winquit {background: #eb261a}#winhide {background: #3CB371}#settingShow {background: #725E82}#winquit:hover, #winhide:hover, #settingShow:hover {box-shadow: 0px 0px 16px ${colorcl[3]}}#left, .csfMenu li:hover, #subrsSetInfo ul li {background-color: ${colorcl[0]}}#left ul li, #infos, .mtitle, .csfMenu, option, input, textarea, select, #alertElec span.alertClose{background: ${colorcl[1]};color: ${colorcl[2]}}#alertElec button, #infos button,.active, #slist .serGroup div span.csCollpser{background: ${colorcl[2]} !important;color: ${colorcl[1]} !important}#cmd,#consoleout{background-color: ${colorcl[2]};color: ${colorcl[0]}}#togglecmd{background: ${colorcl[3]}}#infos input, textarea, .fgf, #infos select, #alertElec input{border: 1px solid ${colorcl[3]};color:${colorcl[2]}}#left ul li.selected,#left ul li:hover{box-shadow: 0px 0px 16px ${colorcl[3]};background: ${colorcl[3]}}input:hover, textarea:hover, select:hover {box-shadow: 0 0 10px ${colorcl[3]}}#conMenu{box-shadow: 0 0 8px ${colorcl[3]}}#conMenu li{background: ${colorcl[2]};color: ${colorcl[3]};border-bottom: 1px solid ${colorcl[0]}}#conMenu li:hover, .serGroup div > span{background: ${colorcl[3]};color: ${colorcl[1]}}#alertElec{background: #fff;color: ${colorcl[3]}}.serGroup{background: rgba(222, 222, 222, 0.3)}.wzborder{border: 1px solid ${colorcl[2]}}.fgfwithword {border-bottom: 2px solid ${colorcl[3]}}.fgfwithword span {background: ${colorcl[1]}}#winquit, #winhide, #settingShow{color: ${colorcl[1]}}#idDrag{color: ${colorcl[2]}}#confipreview, #idrulescont textarea{background-image: -webkit-linear-gradient(top , transparent, transparent 31px,${colorcl[0]} 0)}
				/*长高宽*/::-webkit-scrollbar{width: 8px;height: 8px;background: transparent;border-radius: 8px}::-webkit-scrollbar-thumb {border: none;z-index: 9999;-webkit-border-radius: 8px}::-webkit-scrollbar-corner {border-radius: 8px}#left{width: 320px;height: 460px;border-radius:8px 0 0 0}#infos{width: 640px;height: 460px;border-radius: 0 8px 0 0}#cmd{width: 100%;max-width:960px;height: 220px;border-radius: 0 0 8px 8px}#consoleout{width: 100%;height: 180px}#togglecmd{border-radius: 0 0 8px 8px}
				`

			let csstyle = document.getElementById("skin")
			if (csstyle) csstyle.innerText = css
			else {
				csstyle = document.createElement("style")
				csstyle.id = "skin"
				csstyle.type = "text/css"
				csstyle.innerText = css
				document.head.appendChild(csstyle)
			}
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
}).$mount('#elecV2')