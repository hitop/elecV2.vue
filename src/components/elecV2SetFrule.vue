<template>
<div>
	<p class="center"><button @click="frulesave" class="nbutton nbutton--long"> 保存 - <small>当前规则总行 </small><i>{{ rules.length-1 }}</i></button></p>
	<div>
		<table cellspacing="0" cellpadding="0" class="fruletable">
			<thead>
				<tr>
					<th class="fruletable_th fruletable_fixedwidth">匹配方式</th>
					<th class="fruletable_th">匹配内容</th>
					<th class="fruletable_th fruletable_fixedwidth">分流规则</th>
					<th class="fruletable_th fruletable_fixedwidth">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(rule, ind) in editrules" :key="ind">
					<td><select v-model="rule[0]" class="infoinput fruletable_select">
							<option value="key">关键字</option>
							<option value="domain">子域名</option>
							<option value="ip">IP</option>
						</select></td>
					<td><input v-model="rule[1]" class="infoinput fruletable_input"></td>
					<td><select v-model="rule[2]" class="infoinput fruletable_select">
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
	</div>
	<div>
		<textarea class="infoinput rulescont" v-model="strrules"></textarea></div>
</div>
</template>

<script>
export default {
	name: 'elecV2SetFrule',
	data(){
		return {
			rules: this.$store.state.gConf.routing,
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
		frulesave() {
			this.distinct()
			this.$store.state.gConf.routing = this.rules
			this.$store.commit('saveGconf')
			this.$elecV2Alert("去掉重复及错误，总保存分流规则 " + (this.rules.length-1))
		}
	}
}
</script>

<style scoped>
/******* 分流表格样式 ***********/
.fruletable {
	width: 608px;
	border-radius: 8px;
	border: 1px solid;
}

.fruletable_th {
	text-align: center;
	box-sizing: border-box;
	border: 1px solid;
	background: #999;
	font-size: 22px;
	padding: 6px;
}

.fruletable_th:first-child {
	border-top-left-radius: 8px;
}

.fruletable_th:last-child {
	border-top-right-radius: 8px;
}

.fruletable tr td {
	border: 1px solid;
	border-top: none;
	box-sizing: border-box;
	padding: 4px 8px;
	height: 46px;
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

.fruletable_select, .fruletable_input {
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

.icon-copy::before {
  width: .7em; height: .8em;
  border: 2px solid;
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-radius: .1em;  
  left: 40%; top: 40%;
}
.icon-copy::after {
  width: .7em; height: .8em;
  border: 2px solid;
  border-radius: .1em;
  left: 60%; top: 60%;
}
.icon-delete {color: red;}
.icon-delete::before {
  width: .75em; height: .6em;
  border: 2px solid;
  border-top: 0;
  border-radius: 0 0 2px 2px;  
  top: 70%;
}
.icon-delete::after {
  width: .5em;
  border-top: 2px solid;
  box-shadow: -.2em .2em, .2em .2em;
  top: 1px;
}

.rulescont {
	width: 608px;
	height: 400px;
	margin-top: 1em;
	text-align: left;
	font-size: 22px;
	line-height: 32px;
	background-size: 100% 32px;
	background-image: var(--linear-gradient)
}

.rulescont::-webkit-scrollbar-thumb{background: var(--themecl-three)}
</style>