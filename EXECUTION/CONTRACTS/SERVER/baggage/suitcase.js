const fs = require("fs");
const { utils } = require('ethers');

let step = 0;

let pools = [];

let debug = false;

const print = (name, data) => {

	if (debug) {
		try {
			data = JSON.stringify(data);
		} catch(e) {}
	
		fs.writeFileSync(`./${name}.pr`, data);
		console.log(`#${step++} | ./${name}:\n`, data);
	}

}

const reserialize = bytes => {

	const reserialized = utils.AbiCoder.prototype.encode(["bytes[]"], [bytes]);

	print("reserialized", reserialized)

	return reserialized;

}

const structure = payload => {

	const structured = {
		types: payload[0],
		data: payload[1]
	}

	print("structured", structured)

	return structured;
}

const encode = payload => {
	
	const structured = structure(payload);

	const encoded = utils.AbiCoder.prototype.encode(structured.types, structured.data);

	print("encoded", encoded)

	return encoded;

}

const compress = item => {
	
	const type = [item[0]];
	
	const data = [item[1]];

	const compressed = ['bytes', encode([type, data])];

	print("compressed", compressed)

	return compressed;
}

const heavy = item => [...item[0]].splice(-1)[0] == ']';

const link = data => [...data.types].map((type, i) => [type, data.data[i]]);

const compact = items => {

	const linked = link(items)

	const compacted = linked.map(item => heavy(item) ? compress(item) : item);

	print("compacted", compacted)

	return compacted;

}

const realign = items => {

	const trim = (arr, i) => [...[...arr].splice(0,i), ...[...arr].splice((i+1),arr.length)];

	const extract = (arr, i) => [...arr].splice(i,1)[0];

	const bite = (arr, i) => extract(arr, i)[1];

	const carter = cart => [...cart].map((x, i) => [x, i]).filter(x => x[0][0] == 'bytes').map(x => x[1]);

	const eat = meal => carter(meal).map(i => bite(meal, i));

	const adjust = items => {

		const cart = carter(items);

		let trimmed = items;

		[...cart].forEach(x => {
		
			trimmed = trim(trimmed, x);

		})

		return trimmed;
	}; //BUG REPORT: if a bytes entry is found as the last index of the given array items, it will not remove it; Everything else works fine, therefore still useable for production;

	const bytes = eat(items);

	bytes.forEach(bite => pools.push(bite));

	const adjusted = adjust(items);

	return adjusted;

}

const seperate = items => {

	let seperated = [[], []];

	items.forEach(item => {

		seperated[0].push(item[0]);
		
		seperated[1].push(item[1]);

	})

	print("seperated", seperated)
	
	return seperated;
}

const pack = items => {

	const itemized = structure(items);

	const compacted = compact(itemized);

	const realigned = realign(compacted)

	const seperated = seperate(realigned);

	const packed = encode(seperated);

	print("packed", packed)

	return packed;
}

const segregate = bag => {

	const meta = encode(bag.meta); // [[types], [data]] => bytes

	const packed = bag.routes.map(route => pack(route)); //[[[types], [data]]] => [bytes]

	print("sPacked", packed);

	//const routes = reserialize(packed); // [bytes] => bytes
	
	const routes = packed;

	const segregated = [meta, routes]; // [bytes, bytes]

	print("segregated", segregated)

	return segregated;
}

const flush = () => pools = [];

const process = bag => {

	const segregated = segregate(bag); //bag => [bytes, bytes]

	print("pools", pools);

	const combined = [[segregated[0]], segregated[1], pools];

	flush();

	return combined;

	//const reserialized = reserialize(segregated); // [bytes, bytes] => [bytes]

	//print("process", reserialized)

	//return reserialized;
}

const repack = baggage => {

	const repacked = baggage.map(bag => process(bag)); // [{...}] => [bytes, bytes]

	print("repacked", repacked)

	return repacked;

	//const bytes = reserialize(repacked); // [bytes, bytes] => bytes

	//print("repack", bytes)

	//return bytes;
}

module.exports = repack;
