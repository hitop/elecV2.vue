<template>
	<select :name='name'><option v-for="(tag, val) in ftags" :value="val" :selected='val===selected?true:false' :key='val'>{{ tag }}</option></select>
</template>

<script>
export default {
	name: 'CompSelect',
	props: ['tags', 'selected', 'name'],
	template: ``,
	computed: {
		ftags: function(){
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