<template>
<div id="fruleSetInfo">
	<div class="fruletable">
		<table cellspacing="0" cellpadding="0">
			<thead>
				<tr>
					<th class="fruletable_fixedwidth">匹配方式</th>
					<th>匹配内容</th>
					<th class="fruletable_fixedwidth">分流规则</th>
					<th class="fruletable_fixedwidth">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(rule, ind) in editrules" :key="ind">
					<td><select v-model="rule[0]">
							<option value="key">关键字</option>
							<option value="domain">子域名</option>
							<option value="ip">IP</option>
						</select></td>
					<td><input v-model="rule[1]"></td>
					<td><select v-model="rule[2]">
							<option value="proxy">代理</option>
							<option value="direct">直连</option>
							<option value="block">阻止</option>
						</select></td>
					<td class="fruletable_action"><span @click="deltbrule(ind)" class="fruletable_acbutton"><span class="cslittlebutton icon-delete"></span></span><span @click="copytbrule(ind)" class="fruletable_acbutton"><span class="cslittlebutton icon-copy"></span></span></td>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="4" @click="addRuleTotable">+</td>
				</tr>
				<tr>
					<td colspan="4">
						<p class="tip" @click="addRulesToView">⇓⬇⇓ 添加到路由规则 ⇓⬇⇓</p>
					</td>
				</tr>
			</tfoot>
		</table>
		<p class="cspage"></p>
	</div>
	<div><textarea class="infoinput rulescont" v-model="strrules"></textarea></div>
	<p class="center"><button @click="save" class="nbutton nbutton--long"> 保存 - <small>当前规则总行 </small><i>{{ rules.length }}</i></button></p>
</div>
</template>

<script>
export default {
	name: 'CompfruleSet',
	data(){
		return {
			rules: this.$root.gConf.routing,
			editrules: []
		}
	},
	computed: {
		strrules: {
			get() {
				return this.rules.join("\n")
			},
			set(newValue) {
				this.rules = newValue.split(/\n|\r/)
			}
		}
	},
	methods: {
		addRuleTotable(rule, ind=false) {
			if (rule) rule = this.clarifyRule(rule)
			if (!rule) rule = ["domain","","proxy"]
			if (typeof(ind) == "number") this.editrules.splice(ind+1, 0, rule)
			else this.editrules.push(rule)
		},
		deltbrule(ind){
			this.editrules.splice(ind,1)
		},
		copytbrule(ind){
			this.addRuleTotable(this.editrules[ind].join(","), ind)
		},
		addRulesToView() {
			let tmpr=[]
			this.editrules.forEach(rule=>{
				tmpr.push(rule.join(","))
			})
			this.strrules = tmpr.join("\n") + "\n" + this.strrules
			this.editrules = []
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
		},
		addGrules(group, tag="proxy", type="key") {
			// 批量添加到分组, group 为内容组，比如 [a.com,b.com,google,facebook]
			for (let rule of group) {
				this.push(`${type},${rule},${tag}`)
			}
		},
		distinct() {
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
		save() {
			this.distinct()
			this.$root.saveGconf()
			this.$root.alertElec("去掉重复及错误，总保存分流规则 " + this.rules.length)
		}
	}
}
</script>

<style scoped>
/******* 分流表格样式 ***********/
.fruletable table {
	width: 608px;
	border-radius: 8px;
	border: 1px solid;
}

.fruletable th {
	text-align: center;
	box-sizing: border-box;
	border: 1px solid;
	background: #999;
	font-size: 22px;
	padding: 6px;
}

.fruletable tr td {
	border: 1px solid;
	border-top: none;
	box-sizing: border-box;
	padding: 4px 8px;
	height: 46px;
}

.fruletable tr th:first-child {
	border-top-left-radius: 8px;
}

.fruletable tr th:last-child {
	border-top-right-radius: 8px;
}

.fruletable .fruletable_fixedwidth {
	width: 120px;
}

.fruletable .fruletable_action {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 0;
}

.fruletable .fruletable_acbutton {
	padding: 0px 5px;
	border: 1px solid;
	border-radius: 4px;
	height: 30px;
	box-sizing: border-box;
	cursor: pointer;
}

.fruletable table td select, .fruletable table td input {
	width: 100%;
	font-size: 18px;
	height: 32px;
	line-height: 32px;
	padding: 0px 8px;
}

.fruletable tfoot tr td {
	border-radius: 0 0 8px 8px;
	text-align: center;
	font-size: 22px;
	height: 30px;
	padding: 0;
	cursor: pointer;
}

.rulescont {
	width: 608px;
	height: 400px;
	text-align: left;
	font-size: 22px;
	line-height: 32px;
	background-size: 100% 32px;
	background-image: var(--linear-gradient)
}

.rulescont::-webkit-scrollbar-thumb{background: var(--themecl-three)}
</style>