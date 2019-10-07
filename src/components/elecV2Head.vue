<template>
	<div class="head">{{ title }}</div>
</template>

<script>
export default {
	name: 'elecV2Head',
	data() {
		return {
			title: 'elecV2 网页版'
		}
	}
}
</script>

<style scoped>
.head {
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
</style>