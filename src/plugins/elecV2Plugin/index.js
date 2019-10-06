import elecV2Plugin from "./elecV2Plugin.vue"

export default {
	install(Vue) {
		const ins = Vue.extend(elecV2Plugin)
		const instance = new ins()
		instance.$mount('#elecV2Plugin')
		Vue.prototype.$elecV2Alert = (msg, dur=3000)=>{
			instance.alertmessage = msg
			instance.alertshow = true

			setTimeout(()=>instance.alertshow=false, dur)
		}
	}
}