const send = (path, ops) => {
	return fetch(`http://localhost:8888${path}`, ops)
}
const ping = async (payload) => {
	
	const path = "/onchain/test"
	const ops = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',	
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}
	
	const res = await send(path, ops)

	return res;
}

const call = async (payload) => {
	let blob = await Promise.resolve(ping(payload));
	let text = await blob.text();
	return parseInt(text)
}

module.exports = call;
