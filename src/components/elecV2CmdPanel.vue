<template>
  <div class="cmd">
    <input class="cmd_line" placeholder="cls" @keyup="run" v-model="current">
    <div class="cmd_results" v-html="resultsshow"></div>
  </div>
</template>

<script>
export default {
  name: 'elecV2CmdPanel',
  data(){
    return {
      history: [],
      historyind: 0,
      current: 'cls',
      results: []
    }
  },
  computed: {
    resultsshow(){
      return this.results.join("<br>")
    }
  },
  methods: {
    run(e){
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

<style>
.cmd {
  background: var(--themecl-two);
  color: var(--themecl-zero);
  display: inline-block;
  width: 960px;
  height: 220px;
  border-radius: 0 0 8px 8px
}

.cmd_line {
  border: none;
  height: 36px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  font-size: 22px;
}

.cmd_line:focus, .cmd_line:active{outline: none}

.cmd_results{
  font-size: 20px;
  overflow-y: auto;
  word-break: break-all;
  padding: 0 12px;
  box-sizing: border-box;
  width: 100%;
  height: 180px
}
</style>