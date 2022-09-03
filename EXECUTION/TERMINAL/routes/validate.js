import { send } from "./utils.js";
import chalkAnimation from 'chalk-animation';
export const yell = (name, what) => {
	        let t = "";

	        const r = (...d) => {
			let y = [...d].map(x => (typeof x) == 'object' ? JSON.stringify(x) : x).join("")
			t += `${y}\n`;
			//console.log(...d);
			chalkAnimation.glitch(...d, 2).start();
		}
	
		const c = (...d) => console.log(...d);
		
	        r("\n\n\t\t                   ______________________                 ")
	        r("\t\t         ___________________________________________          ")
	        r("\t\t______________________________________________________________")
	        r(`\t_________________________${name.split('').join("_").split('').map(t => t.toUpperCase()).join('_')}__________________________`)
		r("\t\t______________________________________________________________")
	        c(what)
	        r("\t\t______________________________________________________________")
	        r("\t\t         ___________________________________________          ")
	        r("\t\t                   ______________________                 \n\n")
	        return t;
}

export const audit = (b, c) => {

	let cargo = {
		baggage: b,
		collection: c
	}
	//yell("PROCESSING", cargo);
	cargo.collection = [...cargo.collection].filter(load => load.stats.profitable)

	let collection = {};
	let profits = {};
	
	[...cargo.collection].forEach(load => collection[load.id.hash] = load)

	const ledger = [...cargo.baggage.ledger];
	const latest = ledger[0]?.block;

	//yell("latest", latest)

	//yell("Collection Age", [...cargo.collection].map(load => latest - load?.id?.block))


	//yell("ledger", ledger)
	
	//yell("collection", collection)
	let audited = [...cargo.baggage.ledger]
		.filter(bag => collection[bag.hash]?.id.block == bag.block)
		.map(bag => collection[bag.hash]?.load)     
	
	profits = [...cargo.collection]
		.filter(bag => collection[bag.hash]?.id.block == bag.block)
		.map(load => load?.stats)

	profits.length && yell("Profits", profits)
	
	audited.length && yell("audited", audited)

	return audited;
}

export const deliver = async (crates) => {
	yell("crates", crates)
	const path = "/encrypt"
	const ops = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(crates)
	}
	const res = await send(path, ops)
	yell("Response", res)
	return res;
}
