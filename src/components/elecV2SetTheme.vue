<template>
<div id="themeSetInfo">
  <div class="wzborder"><span class="wzborder_mtitle">当前主题</span>
    <div class="cthemeclshow">
      <p class="center"><input v-model="newname" class="infoinput"></p>
      <ul class="cthemeclshow_lists">
        <li v-for="cl in minputcs" :key="cl" class="cthemeclshow_item" :style="{ background: cl }"></li>
      </ul>
    </div>
    <p class="center"><button class="nbutton nbutton--long" @click="saveCurrencs">设置为默认主题</button></p>
  </div>
  <div class="allcsc wzborder"><span class="wzborder_mtitle">可用主题</span>
    <div v-for="(sth, tid) in theme" :key="tid" class="allcsc_container" :id="tid">
      <ul @click="applyCs(tid)" class="allcsc_lists"><li v-for="cli in sth.colorsc" :key="cli" :style="{ background: cli }" class="allcsc_item">{{ cli }}</li></ul>
      <span class="allcsc_name">{{ sth.name }}</span>
      <span class="allcsc_del" @click.prevent="deltheme(tid)">x</span>
    </div>
  </div>
  <div class="manualsc wzborder"><span class="wzborder_mtitle">更改主题</span>
    <p class="center"><button class="nbutton nbutton--long" @click="manualSc">随机配色</button></p>
    <p class="fgfwithword"><span class="fgfwithword_word">手动调整当前配色</span></p>
    <ul class="manualsc_lists">
      <li v-for="(cl,ind) in minputcs" :key="ind" class="manualsc_item"><input :placeholder="cl" v-model="minputcs[ind]" class="infoinput infoinput--manualsc"></li>
    </ul>
    <p class="tip">*颜色依次为：左（主）窗口背景、右窗口背景、下窗口背景及主文字颜色、滚动条及边框等</p>
  </div>
</div>
</template>

<script>
import { newElecId } from '../util.js'

export default {
  name: 'elecV2SetTheme',
  data(){
    return {
      active: false,
      newname: '未命名主题',
      evset: this.$store.state.gConf.evset,
      theme: this.$store.state.gConf.theme,
      minputcs: this.$root.themecl
    }
  },
  created(){
    let tid = this.evset.activetheme || Object.keys(this.theme)[0]
    this.active = tid
    this.newname = this.theme[tid].name
  },
  methods: {
    applyCs(tid){
      this.active = tid
      this.newname = this.theme[tid].name
      this.theme[tid].colorsc.map((s,ind)=>this.$set(this.minputcs, ind, s))
    },
    saveCurrencs(){
      let tid = this.active
      if (tid) {
        this.theme[tid].name = this.newname
      } else {
        tid = newElecId()
        let scobj = {"name": this.newname, "colorsc": this.minputcs}
        this.$set(this.theme, tid, scobj)
      }
      this.evset.activetheme = tid
      this.$store.commit('saveGconf')
      this.$elecV2Alert("成功设置默认主题：" + this.newname)
    },
    manualSc() {
      // 更改主题 random:随机主题
      this.active = false
      this.newname = "未命名主题"
      this.$set(this.minputcs, 0, this.randChex(125,125,125))
      this.$set(this.minputcs, 1, this.randChex(125,125,125))
      this.$set(this.minputcs, 2, this.randChex())
      this.$set(this.minputcs, 3, this.randChex())
    },
    deltheme(tid) {
      if (confirm("确定删除此主题？")) {
        this.$delete(this.theme, tid)
        this.$store.commit('saveGconf')
      }
    },
    randChex(ra=256, rb=256, rc=256) {
      let k1 = Math.floor(Math.random() * ra).toString(16)
      if (k1.length < 2) k1 = "0" + k1
      let k2 = Math.floor(Math.random() * rb).toString(16)
      if (k2.length < 2) k2 = "0" + k2
      let k3 = Math.floor(Math.random() * rc).toString(16)
      if (k3.length < 2) k3 = "0" + k3

      return "#" + k1 + k2 + k3
    }
  }
}
</script>

<style scoped>
.cthemeclshow_lists {
  display: flex;
  justify-content: space-around;
  border: 4px solid #ffffff;
  border-radius: 8px;
}

.cthemeclshow_item {
  display: inline-block;
  width: -webkit-fill-available;
  height: 36px;
}

.cthemeclshow_item:first-child { border-radius: 4px 0 0 4px }
.cthemeclshow_item:last-child { border-radius: 0 4px 4px 0 }

.manualsc_lists {
  padding: 0 18px;
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
}

.manualsc_item {
  display: inline-block;
  width: 108px;
  height: 40px;
}

.infoinput--manualsc {    
  font-size: 16px;
  width: 108px;
  height: 40px;
}

.allcsc {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between
}

.allcsc_container {
  position: relative;
  padding: 0;
  margin: 8px 16px;
  width: 160px;
  display: inline-block;
  font-size: 16px
}

.allcsc_lists:hover { cursor: pointer; }

.allcsc_item {
  font-size: 16px;
  line-height: 28px;
  padding-left: 16px;
  height: 28px;
}

.allcsc_item:first-child { border-radius: 8px 8px 0 0 }
.allcsc_item:nth-child(4) { border-radius: 0 0 8px 8px }

.allcsc_name {
  font-size: 16px;
  padding: 6px 0;
  width: 100%;
  text-align: center;
  display: inline-block;
}

.allcsc_del {
  position: absolute;
  display: inline-block;
  background: red;
  text-align: center;
  right: 0;
  top: 0;
  height: 40px;
  line-height: 40px;
  font-size: 40px;
  width: 40px;
  border-radius: 0 8px 0 0;
  opacity: 0;
  cursor: pointer;
}

.allcsc_del:hover { opacity: 1 }
</style>