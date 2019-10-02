<template>
	<ul id="conMenu" :style="{ left: axis[0], top: axis[1] }"><li v-for="(fun, labe) in fmenus" :onclick="fun">{{ label }}</li></ul>
</template>

<script>
export default {
	name: 'CompMenu',
  data: function(){
    return {
      axis: [0, 0]
    }
  },
	props: ['menus', 'axis'],
	template: ``,
	computed: {
		fmenus: function(){
			var fselect = {}
			if (typeof(this.tags.length) == "number") {
				this.tags.forEach(el=>fselect[el]=el)
			} else {
				fselect = this.tags
			}
			return fselect
		}
	}
}
</script>