import Vue from 'vue'
import Vuex from 'vuex'
import elecV2 from './components/elecV2.vue'
import elecV2Plugin from './plugins/elecV2Plugin'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    gConf: {log: {}}
  },
  mutations: {
    getGconf(state) {
      if (window.localStorage && localStorage.locgConf) {
        state.gConf = JSON.parse(localStorage.locgConf)
      } else {
        state.gConf = {"log": {"loglevel": "warning"},"dns": [],"evset": {"maxSubsers": 10,"isRandsub": false},"inbound": {"sport": 1080,"hport": 1081},"theme": {"e73Ue": {"name": "大海沙滩","colorsc": ["#2E3784","#2E0571","#FFCB40","#64AAD0"]},"tdxh": {"name": "土地玄黄","colorsc": ["#e2c275","#c36a2d","#f4f4f4","#C89B40"]},"TCXA2": {"name": "莫句","colorsc": ["#2e1630","#262b60","#e9bb4c","#d3fd3c"]}},"serlists": {},"group": {},"outBset": {"tcpfastopen": true,"mux": true,"concurrency": 8,"outborder": ["proxy", "direct", "block"],"routorder": ["block", "direct", "proxy"],"kcp": [1350,50,5,20,false,2,2,"none"],"tls": "tls","allowInsecure": true,"domainStrategy": "AsIs"},"routing": [],"subrules": {}}
        localStorage.setItem("locgConf", JSON.stringify(state.gConf))
      }
    },
    saveGconf(state) {
      localStorage.locgConf = JSON.stringify(state.gConf)
    }
  }
})

new Vue({
  data: {
    themecl: []
  },
  store,
  render: h => h(elecV2),
  created() {
    store.commit('getGconf')
    if (store.state.gConf.evset.activetheme && store.state.gConf.theme[store.state.gConf.evset.activetheme])  {
      this.themecl = store.state.gConf.theme[store.state.gConf.evset.activetheme].colorsc.map(r=>r)
    } else {
      this.themecl = store.state.gConf.theme.e73Ue.colorsc.map(r=>r)
    }
  }
}).$mount('#elecV2')

Vue.use(elecV2Plugin)