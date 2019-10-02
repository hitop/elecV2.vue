<template>
	<div id="cmd">
		<input id="cmdStr" placeholder="cls" @keyup="run" v-model="current">
		<div id="consoleout" v-html="resultsshow"></div>
	</div>
</template>

<script>
export default {
	name: 'cmdPanel',
	data(){
		return {
			history: [],
			historyind: 0,
			current: 'cls',
			results: []
		}
	},
	computed: {
		resultsshow: function(){
			return this.results.join("<br>")
		}
	},
	methods: {
		run: function(e){
			if (e.which === 13) {
				if (this.current == "") return false
				this.results.unshift(">> " + this.current)
				this.history.push(this.current)
				this.historyind = this.history.length-1
				switch (this.current) {
					case "cls":
						this.results = []
						break
					default: {
						let jg
						try {
							jg = eval(this.current)
						} catch {
							jg = "不是合法的 js 代码"
						}
						if (typeof(jg) == "object") jg = JSON.stringify(jg)
						if (jg) this.results.unshift(jg)
					}
				}
				this.current = ""
			} else if (e.which === 38) {
				if(this.historyind<0) this.historyind = this.history.length-1
				this.current = this.history[this.historyind--]
			} else if (e.which === 40) {
				if(this.historyind>this.history.length-1) this.historyind = 0
				this.current = this.history[this.historyind++]
			}
		}
	}
}
</script>