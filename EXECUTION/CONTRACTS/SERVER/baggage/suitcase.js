//import { utils } from 'ethers';
const { utils } = require('ethers');

const reserialize = bytes => {

	const reserialized = utils.AbiCoder.prototype.encode(["bytes[]"], [bytes]);

	return reserialized;

}

const structure = payload => {

	const structured = {
		types: payload[0],
		data: payload[1]
	}

	return structured;
}

const encode = payload => {
	
	const structured = structure(payload);

	const encoded = utils.AbiCoder.prototype.encode(structured.types, structured.data);

	return encoded;

}

const compress = item => {
	
	const type = [item[0]];
	
	const data = [item[1]];

	const compressed = ['bytes', encode([type, data])];

	return compressed;
}

const heavy = item => [...item[0]].splice(-1)[0] == ']';

const link = data => [...data.types].map((type, i) => [type, data.data[i]]);

const compact = items => {

	const linked = link(items)

	const compacted = linked.map(item => heavy(item) ? compress(item) : item);

	return compacted;

}

const seperate = items => {

	let seperated = [[], []];

	items.forEach(item => {

		seperated[0].push(item[0]);
		
		seperated[1].push(item[1]);

	})
	
	return seperated;
}

const pack = items => {

	const itemized = structure(items);

	const compacted = compact(itemized);

	const seperated = seperate(compacted);

	const packed = encode(seperated);

	return packed;
}

const segregate = bag => {

	const meta = encode(bag.meta); // [[types], [data]] => bytes

	const packed = bag.routes.map(route => pack(route)); //[[[types], [data]]] => [bytes]

	const routes = reserialize(packed); // [bytes] => bytes

	const segregated = [meta, routes]; // [bytes, bytes]

	return segregated;
}

const process = bag => {

	const segregated = segregate(bag); //bag => [bytes, bytes]

	const reserialized = reserialize(segregated); // [bytes, bytes] => [bytes]

	return reserialized;
}

const repack = baggage => {

	const repacked = baggage.map(bag => process(bag)); // [{...}] => [bytes, bytes]

	const bytes = reserialize(repacked); // [bytes, bytes] => bytes

	return bytes;
}

module.exports = repack;
