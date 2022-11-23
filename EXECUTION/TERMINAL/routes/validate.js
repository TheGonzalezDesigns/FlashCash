const { send } = require("./utils.js");
//import chalkAnimation from 'chalk-animation';
const yell = (name, what) => {
	        let t = "";

	        const r = (...d) => {
			let y = [...d].map(x => (typeof x) == 'object' ? JSON.stringify(x) : x).join("")
			t += `${y}\n`;
			console.log(...d);
			//chalkAnimation.glitch(...d, 2).start();
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

module.exports.yell = yell;
module.exports.audit = (b, c) => {

	let cargo = {
		baggage: b,
		collection: c
	}
	//yell("PROCESSING", cargo);
	//cargo.collection = [...cargo.collection].filter(load => load.stats.profitable)

	let collection = {};
	let profits = {};
	
	[...cargo.collection].forEach(load => collection[load.id.hash] = load)

	const ledger = [...cargo.baggage.ledger];
	const latest = ledger[0]?.block;

	//yell(`Currently @ ${latest}`, "");

	//yell("Collection Age", [...cargo.collection].map(load => latest - load?.id?.block))


	//yell("ledger", ledger)
	
	//yell("collection", collection)
	//yell("meta", collection[Object.keys(collection)[0]].load.meta)
	//yell("routes", collection[Object.keys(collection)[0]].load.routes)
	//yell("routes", collection[0])
	let audited = [...cargo.baggage.ledger]
		.filter(bag => collection[bag.hash]?.id.block == bag.block)
		.map(bag => {
			//yell("bag", collection[bag.hash])
			return { 
				hash: bag.hash, 
				load: collection[bag.hash]?.load 
			}
		})     
	//yell("audited", audited)	
	profits = [...cargo.collection]
		.filter(bag => collection[bag.hash]?.id.block == bag.block)
		.map(load => {
			//yell("load", load)
			return { 
				hash: load.id.hash, 
				stats: load?.stats 
			}
		})

	let rehash = a => { let o = {}; [...a].forEach(i => {o[i.hash] = i; delete o[i.hash]["hash"]}); return o; }

	let verified = [...audited].map(bag => bag.hash)
	
	audited = rehash(audited)

	profits = rehash(profits)


	let parcel = [...verified].map(hash => {
		return {
			stats: {
				profit: profits[hash]?.stats?.profit,
				gas: profits[hash]?.stats?.gas,
			},
			envelope: audited[hash].load
		}
	})
	
	let stats = [...parcel].map(i => i.stats)

	let totalProfit = 0;

	let totalGas = 0;

	stats.forEach( stat => {
		totalProfit += stat.profit;
		totalGas += stat.gas;
	})

	stats = {
		profit: totalProfit,
		gas: totalGas
	}

	let envelope = [...parcel].map(i => i.envelope)

	if (!envelope.length) 
	{
		//yell("envelope", envelope)
		return [];
	}
		
	parcel = {
		stats: stats,
		envelope: envelope,
		block: latest
	}

	//profits.length && yell("Profits", profits)
	
	//audited.length && yell("audited", audited)
	
	yell("Final Parcel", parcel)

	return parcel;
}

module.exports.deliver = async (crates) => {
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
	let res = await send(path, ops)
	try {
		res = await res.json();
	} catch (e) {
		error.log("Failed to parse response after delivery");
		res = {}
	}

	//yell("Response", res)
	return res;
}
