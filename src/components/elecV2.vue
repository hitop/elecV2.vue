<template>
<div :style="themeclstyle" class="center">
  <!-- <elecV2Head/> -->
  <elecV2Toggle  @set-toggle="setToggle"/>
  <keep-alive>
    <panel :is="currentpanel"/>
  </keep-alive>
  <elecV2CmdPanel/>
  <div id="elecV2Plugin"></div>
</div>
</template>

<script>
// import elecV2Head from './elecV2Head.vue'
import elecV2Toggle from './elecV2Toggle.vue'
import elecV2CmdPanel from "./elecV2CmdPanel.vue"
import elecV2Ser from "./elecV2Ser.vue"
import elecV2Set from "./elecV2Set.vue"

export default {
  name: 'elecV2',
  data() {
    return {
      themecl: this.$root.themecl,
      currentpanel: "elecV2Ser"
    }
  },
  computed: {
    themeclstyle() {
      return {
        '--themecl-zero': this.themecl[0],
        '--themecl-one': this.themecl[1],
        '--themecl-two': this.themecl[2],
        '--themecl-three': this.themecl[3],
        '--boxshadow-three': "0px 0px 16px " + this.themecl[3],
        '--border-two': "1px solid " + this.themecl[2],
        '--border-three': "1px solid " + this.themecl[3],
        '--linear-gradient':  "-webkit-linear-gradient(top , transparent, transparent 31px, " + this.themecl[0] + " 0)"
      }
    }
  },
  components: {
    elecV2Toggle,
    elecV2Ser,
    elecV2Set,
    elecV2CmdPanel,
  },
  methods: {
    setToggle(){
      if (this.currentpanel == "elecV2Ser") {
        this.currentpanel = "elecV2Set"
      } else {
        this.currentpanel = "elecV2Ser"
      }
    }
  }
}
</script>

<style>
html, body { 
  padding: 0;
  margin: 0;
  background: transparent;
  overflow-x: hidden;
  font-smoothing: antialiased;
  font-family: Microsoft YaHei UI,Consolas,Arial,sans-serif;
}
ul { list-style: none;padding-left: 0; margin: 0 }

::-webkit-scrollbar{ width: 8px;height: 8px;background: transparent;border-radius: 8px }
::-webkit-scrollbar-corner { border-radius: 8px }
.nav::-webkit-scrollbar-thumb, .contents::-webkit-scrollbar-thumb { border: none;z-index: 9999;-webkit-border-radius: 8px;background: var(--themecl-three) }

.infoname {
  width: 120px;
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  font-size: 22px;
  font-weight: bold;
}

.infoname:after { content: "："; }
.infoname_short { width: 106px }
.infoname_long { width: 220px }

.infoinput {
  background: var(--themecl-one);
  color: var(--themecl-two);
  border: var(--border-three);
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
  height: 46px;
  padding: 6px 12px;
  width: 436px;
  outline:0;
  border-radius: 8px;
  font: 400 24px Arial;
  letter-spacing: 1px;
  cursor: pointer;
}
.infoinput:hover { box-shadow: var(--boxshadow-three) }

.infoinput_textarea {
  vertical-align: middle;
  min-height: 106px;
  line-height: 32px;
  background-size: 100% 32px
}

.infoinput_checkbox {
  width: 18px;
  height: 18px;
  margin-right: 36px;
  /*margin: 10px;*/
  cursor: pointer;
  vertical-align: middle;
}

.infoinput_short { width: 112px }
.infoinput_two { width: 158px }
.infoinput_middle { width: 336px }
.infoinput_address { width: 306px }

.fgfwithword {
  border-bottom: var(--border-three);
  position: relative;
  text-align: center;
  margin: 1em 0px 1.5em
}

.fgfwithword .fgfwithword_word {
  background: var(--themecl-one);
  position: relative;
  top: 0.6em;
  display: inline-block;
  padding: 0px 12px;
  font-size: 24px;
}

.center { text-align: center }

.nbutton {
  background: var(--themecl-two);
  color: var(--themecl-one);
  border: none;
  cursor: pointer;
  border-radius: 8px;
  height: 40px;
  width: 160px;
  font-size: 22px;
  width: 160px;
}

.nbutton--long {
  width: 560px;
}

.nbutton--del { background: red }

.flexspace {
  display: flex;
  justify-content: space-around
}

.wzborder {
  border: var(--border-two);
  position: relative;
  border-radius: 8px;
  margin: 2em 0px;
  padding: 1em 20px;
  width: 608px;
  box-sizing: border-box;
  text-align: left;
}

.wzborder_mtitle {
  background: var(--themecl-one);
  color: var(--themecl-two);
  position: absolute;
  display: inline-block;
  padding: 0px 8px;
  font-size: 20px;
  top: -16px;
  left: 12px;
}

.tip {
  font-size: 16px;
  font-style: italic;
  line-height: 1.4em;
  text-align: center;
  margin: 8px 0;
}

.nav {
  background: var(--themecl-zero);
  position: relative;
  display: inline-block;
  overflow-y: overlay;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 6px 10px 26px;
  height: 460px;
  width: 320px;
  border-radius:8px 0 0 0
}

.nav .nav_tab {
  background: var(--themecl-one);
  color: var(--themecl-two);
  text-align: center;
  -webkit-box-sizing: border-box;
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

.nav .nav_tab:hover, .nav .nav_tab--selected {
  box-shadow: var(--boxshadow-three);
  background: var(--themecl-three)
}

.nav .nav_tab--actived {
  background: var(--themecl-two);
  color: var(--themecl-one)
}

.contents {
  background: var(--themecl-one);
  color: var(--themecl-two);
  display: inline-block;
  overflow-y: overlay;
  word-break: break-all;
  box-sizing: border-box;
  padding: 8px 16px;
  margin-left: -2px;
  font-size: 18px;
  width: 640px;
  height: 460px;
  border-radius: 0 8px 0 0
}

/******** css icon ************/
.cslittlebutton {
  display: inline-block;
  height: 1em;
  width: 1em;
  font-size: 16px;
  box-sizing: border-box;
  text-indent: -9999px;
  vertical-align: middle;
  position: relative;
}
.cslittlebutton::before,
.cslittlebutton::after {
  content: '';
  box-sizing: inherit;
  position: absolute;
  left: 50%; top: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.icon-move {cursor: move;}
.icon-move::before,
.icon-move::after {
  height: .4em; width: .4em;
  border-style: solid;
  border-width: 2px 0 0 2px;
}
.icon-move::before {
  -ms-transform: translate(-50%, -90%) rotate(45deg);
  transform: translate(-50%, -90%) rotate(45deg);
}
.icon-move::after {
  -ms-transform: translate(-50%, -10%) rotate(225deg);
  transform: translate(-50%, -10%) rotate(225deg);
}
.icon-close::before {
  width: 90%;
  border-top: 2px solid;
  -ms-transform: translate(-50%, -50%) rotate(45deg);
  transform: translate(-50%, -50%) rotate(45deg);
}
.icon-close::after {
  height: 90%;
  border-left: 2px solid;
  -ms-transform: translate(-50%, -50%) rotate(45deg);
  transform: translate(-50%, -50%) rotate(45deg);
}
.icon-shutdown::before {
  height: .5em;
  border-left: 2px solid;
  top: .2em;
}
.icon-shutdown::after {
  width: .9em; height: .9em;
  border: 2px solid;
  border-top-color: transparent;
  border-radius: 50%;
}
/******** end css icon end ************/

/************** css 动画 **********/
.waitdot:after {
  content: " • ";
  animation: waitdot 4.2s ease-in-out infinite;
  transform-origin: 50% 50%;
  display: inline-block;
  position: absolute;
}

@keyframes waitdot {
  0% { transform:translate(0,0) }
  16.66667% { transform:translate(15px,0) }
  33.33333% { transform:translate(0,0) }
  50% { transform:translate(15px,0) }
  66.66667% { transform:translate(0,0) }
  83.33333% { transform:translate(15px,0) }
  100% { transform:translate(0,0) }
}
/************* end css 动画 ***************/
</style>