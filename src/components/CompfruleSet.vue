<template>
	<div id="fruleSetInfo"><ul class="csfMenu"><li @click="save">保存 - <small>当前规则总行 </small><i>{{ rules.length }}</i></li></ul><div id="fruleTable"><table cellspacing="0" cellpadding="0"><thead><tr><th class="csfixedtbwidth">匹配方式</th><th>匹配内容</th><th class="csfixedtbwidth">分流规则</th><th class="csfixedtbwidth">操作</th></tr></thead><tbody><tr v-for="(rule, ind) in editrules" :key="ind"><td name="nmMrule"><select v-model="rule[0]"><option value="key">关键字</option><option value="domain">子域名</option><option value="ip">IP</option></select></td><td name="nmMcont"><input v-model="rule[1]"></td><td name="nmOutbt"><select v-model="rule[2]"><option value="proxy">代理</option><option value="direct">直连</option><option value="block">阻止</option></select></td><td class="csaction"><span @click="deltbrule(ind)"><span class="cslittlebutton icon-delete"></span></span><span @click="copytbrule(ind)"><span class="cslittlebutton icon-copy"></span></span></td></tr></tbody><tfoot><tr><td colspan="4" @click="addRuleTotable">+</td></tr><tr><td colspan="4"><p class="tip" @click="addRulesToView">⇓⬇⇓ 添加到路由规则 ⇓⬇⇓</p></td></tr></tfoot></table><p class="cspage"></p></div><div id="idrulescont"><textarea v-model="strrules"></textarea></div></div>
</template>

<script>
export default {
	name: 'CompfruleSet',
	data: function(){
		return {
			rules: this.$root.gConf.routing,
			editrules: []
		}
	},
	computed: {
		strrules: {
			get: function() {
				return this.rules.join("\n")
			},
			set: function(newValue) {
				this.rules = newValue.split(/\n|\r/)
			}
		}
	},
	methods: {
		addRuleTotable: function(rule, ind=false) {
			if (rule) rule = this.clarifyRule(rule)
			if (!rule) rule = ["domain","","proxy"]
			if (typeof(ind) == "number") this.editrules.splice(ind+1, 0, rule)
			else this.editrules.push(rule)
		},
		deltbrule: function(ind){
			this.editrules.splice(ind,1)
		},
		copytbrule: function(ind){
			this.addRuleTotable(this.editrules[ind].join(","), ind)
		},
		addRulesToView: function() {
			let tmpr=[]
			this.editrules.forEach(rule=>{
				tmpr.push(rule.join(","))
			})
			this.strrules = tmpr.join("\n") + "\n" + this.strrules
			this.editrules = []
		},
		clarifyRule: function(rule) {
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
		isrepeat: function(rule) {
			if (this.rules.indexOf(rule.toString())==-1) return false
			else return true
		},
		push: function(prules, empty=false) {
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
		},
		addGrules: function (group, tag="proxy", type="key") {
			// 批量添加到分组, group 为内容组，比如 [a.com,b.com,google,facebook]
			for (let rule of group) {
				this.push(`${type},${rule},${tag}`)
			}
		},
		distinct: function() {
			// 规则去重
			let result = []
			let obj = {}

			for (let i of this.rules) {
				if (!obj[i]) {
					result.push(i)
					obj[i] = 1
				}
			}
			this.rules = result
		},
		save: function() {
			this.distinct()
			this.$root.saveGconf()
			this.$root.alertElec("去掉重复及错误，总保存分流规则 " + this.rules.length)
		}
	}
}
</script>