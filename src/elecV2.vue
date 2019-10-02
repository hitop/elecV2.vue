<template>
  <div id="elecV2">
    <keep-alive>
      <panel :is="currentpanel" :title="title" @set-show="setShow"/>
    </keep-alive>
    <cmdPanel/>
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
      // sershow: true,
      currentpanel: "elecV2Ser"
    }
  },
  components: {
    cmdPanel,
    elecV2Ser,
    elecV2Set
  },
  methods: {
    setShow: function(){
      if (this.currentpanel == "elecV2Ser") {
        this.currentpanel = "elecV2Set"
      } else {
        this.currentpanel = "elecV2Ser"
      }
    }
  }
}
</script>