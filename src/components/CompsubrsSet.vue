<template>
	<div id="subrsSetInfo">
	<div id="idsublist">
		<ul><li v-for="(rs, rid) in subrs" :key="rid" :id="rid" @click="upsubrules" @mouseleave="isupdatesub=''">{{ rs.name + isupdatesub }}</li></ul><span>{{ rs.numb }}</span>
	</div>
	<div class="sInfoMtop">
		<p><b>订阅链接</b><input name="suburl" v-model="subrurl"></p>
		<p><b>订阅名字</b><input name="name" v-model="subrname"></p>
		<p class="longButton center"><button @click="addSuburl()">添加订阅</button></p>
	</div>
</div>
</template>

<script>
export default {
	name: 'CompsubrsSet',
	data(){
		return {
			subrs: this.$root.gConf.subrules,
			rules: this.$root.gConf.routing,
			subrurl: '',
			subrname: '',
			isupdatesub: ''
		}
	},
	methods: {
		upsubrules(event) {
			// 更新规则
			if (this.isupdatesub) {
				this.isupdatesub = ''
				event.target.classList.add("waitdot")
				let rid = event.target.id
				let url = this.subrs[rid].surl
				var vm = this, root = this.$root
				fetch(url).then(function(res) {return res.text()}).then(function(res){
					res = res.split("\n")
					let leng = vm.push(res)
					vm.$set(vm.subrs[rid], 'numb', leng)
					root.saveGconf()
					root.alertElec("添加规则条数： " + leng)
					event.target.style.background = "#fff"
					event.target.classList.remove("waitdot")
				})
			} else {
				this.isupdatesub = " - 再次点击更新此订阅"
			}
		},
		addSuburl() {
			// 添加订阅链接
			if (this.subrurl && this.subrname) {
				let sid = this.$root.newElecId()
				this.$set(this.subrs, sid, {name: this.subrname, surl: this.subrurl, numb: 0})
				this.$root.saveGconf()
				this.$root.alertElec("新的订阅已保存")
			} else {
				this.$root.alertElec("输入不能为空")
			}
		},
		clarifyRule(rule) {
			let tmpr = rule.toString().replace(/\s/g, '').split(",")
			if (tmpr.length!=3) return false
			if (/domain/i.test(tmpr[0])) tmpr[0] = "domain"
			else if (/(ip|IP-CIDR)/i.test(tmpr[0])) tmpr[0] = "ip"
			else if (/(domain|ip|key)/.test(tmpr[0])) tmpr[0] = tmpr[0].toLowerCase()
			else return false
			switch (tmpr[0]) {
				case "key":
					if (/(^domain:|^geoip:)/.test(tmpr[1])) {
						let sr = tmpr[1].split(":")
						tmpr[0] = sr[0] == "domain"?"domain":"ip"
						if (tmpr[0] == "domain") tmpr[1] = sr[1]
					}
					break
				case "domain":
					if (/[a-zA-Z0-9]+\.[a-z]+/.test(tmpr[1]) == false) return false
					break
				case "ip":
					if (/(ip|[0-9]+\.[0-9]+\.[0-9]+\.[0-9])/i.test(tmpr[1]) == false) return false
					break
			}
			if (/Reject/i.test(tmpr[2])) tmpr[2] = "block"
			else if (/REMOTE/i.test(tmpr[2])) tmpr[2] = "proxy"
			else if (/(proxy|direct|block)/i.test(tmpr[2])) tmpr[2] = tmpr[2].toLowerCase()
			else return false

			return tmpr
		},
		isrepeat(rule) {
			if (this.rules.indexOf(rule.toString())==-1) return false
			else return true
		},
		push(prules, empty=false) {
			// 添加规则到 gConf, string 单条规则，array 规则组: ["key,netifly,proxy","domain,ab.com,proxy"]
			if (empty) this.rules = []
			let leng = 0
			if (typeof(prules) == "string") {
				let fri = this.clarifyRule(prules)
				if (fri && !this.isrepeat(fri)) {
					this.rules.push(fri.join(","))
					leng++
				}
			}	else {
				prules.forEach(rule=>{
					let frl = this.clarifyRule(rule)
					if (frl && !this.isrepeat(frl)) {
						this.rules.push(frl.join(","))
						leng++
					}
				})
			}
			return leng
		}
	}
}
</script>

<style>
#subrsSetInfo ul li {
	text-align: center;
	box-sizing: border-box;
	border-radius: 10px;
	width: 80%;
	margin: 12px auto;
	padding: 12px;
	word-break: break-all;
	font-weight: bold;
	font-size: 20px;
	cursor: pointer;
	position: relative;
}

#subrsSetInfo ul li span {
	font-size: 12px;
	line-height: 30px;
	position: absolute;
	right: 10px;
}
</style>