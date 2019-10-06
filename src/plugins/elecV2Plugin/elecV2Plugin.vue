<template>
<transition name="fade">
	<div v-if="alertshow" class="alertelec">
		<p class="alertelec_message">{{ alertmessage }}</p>
		<button v-if="alertconfirm" class="alertelec_button" @click="alertshow=!alertshow">确定</button>
	</div>
</transition>
</template>

<script>
export default {
	name: "alertElec",
	data() {
		return {
			alertshow: false,
			alertconfirm: false,
			alertmessage: ""
		}
	}
}
</script>

<style scoped>
.alertelec {
	background: white;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	padding: 8px 18px;
	width: fit-content;
	height: fit-content;
	max-height: 480px;
	overflow-y: auto;
	min-width: 280px;
	max-width: 80%;
	border: none;
	border-radius: 12px;
	z-index: 9999;
}

.alertelec_message {
	text-align: center;
	word-break: break-all;
	font-size: 26px;
	color: var(--themecl-three);
	margin: 8px;
}

.alertelec_button {
	border: 0;
	margin: 16px 0px 6px;
	padding: 8px 26px;
	font-size: 24px;
}

.alertelec_input {
	text-align: center;
	padding: 8px;
	outline:0;
	border-radius: 8px;
	background: transparent;
	box-sizing: border-box;
	font: 400 24px Arial;
	letter-spacing: 1px
}

.alertelec_close {
	position: absolute;
	top: 0;
	right: 0;
	display: inline-block;
	width: 26px;
	height: 26px;
	font-size: 18px;
	cursor: pointer;
}
.alertelec_close:hover{opacity: 0.6}
</style>