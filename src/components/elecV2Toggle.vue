<template>
	<div class="settoggle" @click="$emit('set-toggle')">
		<span class="cslittlebutton icon-menu"></span>
	</div>
</template>

<script>
export default {
	name: 'elecV2Toggle'
}
</script>

<style scoped>
.settoggle {
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

.settoggle:hover {
	box-shadow: var(--boxshadow-three);
	transform: scale(1.2);
	opacity: 1
}

.icon-menu::before {
  box-shadow: 0 -.35em, 0 .35em;
  border-top: 2px solid;
  width: 100%;
}
</style>