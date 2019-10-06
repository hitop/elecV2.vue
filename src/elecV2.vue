<template>
	<div :style="themeclstyle">
		<keep-alive>
			<panel :is="currentpanel" :title="title" @set-show="setShow"/>
		</keep-alive>
		<cmdPanel/>
		<div id="elecV2Plugin"></div>
	</div>
</template>

<script>
import cmdPanel from "./components/cmdPanel.vue"
import elecV2Ser from "./components/elecV2Ser.vue"
import elecV2Set from "./components/elecV2Set.vue"

export default {
	name: 'elecV2',
	data(){
		return {
			title: 'elecV2 网页版',
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
		cmdPanel,
		elecV2Ser,
		elecV2Set
	},
	methods: {
		setShow(){
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
html,body{
	padding: 0;
	margin: auto;
	width: 100vw;
	height: 680px;
	max-width: fit-content;
	background-color: transparent;
	overflow-x: hidden;
	-webkit-font-smoothing: antialiased;
	font-family: Microsoft YaHei UI,Consolas,Arial,sans-serif;
	position: relative;
}
::-webkit-scrollbar{width: 8px;height: 8px;background: transparent;border-radius: 8px}
::-webkit-scrollbar-corner {border-radius: 8px}
.nav::-webkit-scrollbar-thumb, .contents::-webkit-scrollbar-thumb {border: none;z-index: 9999;-webkit-border-radius: 8px;background: var(--themecl-three)}

#elecV2Ser, #elecV2Set { height: 460px }

/************ 主题 style ************/
ul { padding-left: 0; margin: 0 }
li { list-style: none; }

textarea {
	vertical-align: middle;
	min-height: 106px;
	line-height: 32px;
	background-size: 100% 32px
}

input[type="checkbox"] {
	width: 18px;
	height: 18px;
	margin: 10px;
	cursor: pointer;
}

.infoname {
	width: 136px;
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
	height: 56px;
	padding: 6px 12px;
	width: 420px;
	outline:0;
	border-radius: 8px;
	font: 400 24px Arial;
	letter-spacing: 1px
}
.infoinput:hover { box-shadow: var(--boxshadow-three) }
.infoinput_short { width: 100px }
.infoinput_two { width: 156px }
.infoinput_middle { width: 340px }
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

/************ end 主题 style end ************/
.center{text-align: center}

.nbutton {
	background: var(--themecl-two);
	color: var(--themecl-one);
	border: none;
	cursor: pointer;
	border-radius: 8px;
	height: 50px;
	width: 160px;
	font-size: 26px;
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
	padding: 0 10px;
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

.todrag {
	color: var(--themecl-two);
	height: 30px;
	width: 270px;
	font-size: 20px;
	padding-top: 6px;
	overflow: hidden;
	cursor: move;
	text-align: center;
	float: left;
}

.settingShow {
	color: var(--themecl-one);
	position: fixed;
	display: inline-block;
	z-index: 999;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	cursor: pointer;
	padding: 4px;
	opacity: 0.6;
	position: sticky;
	left: 286px;
	top: 420px;
	background: var(--themecl-two);
	font-size: 0px;
}

.settingShow:hover {
	box-shadow: var(--boxshadow-three);
	transform: scale(1.2);
	opacity: 1
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
.icon-menu::before {
  box-shadow: 0 -.35em, 0 .35em;
  border-top: 2px solid;
  width: 100%;
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
.icon-minus::before {
  width: 90%;
  border-top: 2px solid;
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

.loading:after {
  overflow: hidden;
  position: absolute;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4,end) 900ms infinite;      
  animation: ellipsis steps(4,end) 900ms infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;    
  }
}
/************* end css 动画 ***************/
</style>