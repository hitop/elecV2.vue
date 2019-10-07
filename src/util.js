export function putFile(txt, name="config.json") {
	let blob = new Blob([txt])
	let aTag = document.createElement('a')
	aTag.download = name
	aTag.href = URL.createObjectURL(blob)
	aTag.click()
	URL.revokeObjectURL(aTag.href)
}


function getRanStr(len = 6) {
	// 获取一个随机字符，默认长度为 6, 可自定义
	let b62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let str = b62[Math.floor(Math.random()*52)]
	while(len > 1){
		str += b62[Math.floor(Math.random()*62)]
		len--
	}
	return str
}

export function newElecId(id = getRanStr()) {
	if (window.localStorage && localStorage.locgConf) {
		let gConf = JSON.parse(localStorage.locgConf)
		while (gConf.group[id] || gConf.serlists[id] || gConf.subrules[id] || gConf.theme[id]) {
			id = getRanStr()
		}
	}
	return id
}
