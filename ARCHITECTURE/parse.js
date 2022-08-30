const fs = require("fs");
const output = `./${process.argv[2]}`;

let input = `${process.argv[3]}`;
const printData = (output, data) => fs.writeFileSync(output, JSON.stringify(data))/*.then(res => console.warn(`Printing parsed data to ${output}\n`, data));*/

let _parse = data => {
    let res;
    try {
        res = JSON.parse(data);
    } catch(e) {
	console.error("Alert:\tCould not parse quote!", e)
	   console.log("------")
	console.log("data:\t", data);
	   console.log("------")
        process.exit(1);
    }
    return res;
}

const due = _parse(input);
const network = due.priceRoute.network
let routes = due.priceRoute.bestRoute.map(route => route.swaps.map(swaps => swaps.swapExchanges.map(swap => {
	return {
		//destAmount: swap.destAmount,
		//blockPercent: route.percent,
		//swapPercent: swap.percent,
		totalPercent: (route.percent * swap.percent) * .01,
		data: swap.data
	};
	//return swap.data
})))

let merge = array => { 
	let state = []; 
	array.forEach( a => state = [...state, ...a]);
	return state;
}

routes = merge(merge(routes))
/*
let stats = routes.map(route => {
	return {
		destAmount: route.destAmount,
		blockPercent: route.blockPercent,
		swapPercent: route.swapPercent,
		totalPercent: route.totalPercent
	}
});

let getSum = (total, num) => total + parseInt(num);

let totalStats = {
	destAmount: stats.map(route => route.destAmount).reduce(getSum, 0),
	blockPercent: stats.map(route => route.blockPercent).reduce(getSum, 0),
	swapPercent: stats.map(route => route.swapPercent).reduce(getSum, 0),
	totalPercent: stats.map(route => route.totalPercent).reduce(getSum, 0)
}

let diffStats = {
	askDestAmount: parseInt(due.priceRoute.destAmount),
	sameDestAmount: parseInt(due.priceRoute.destAmount) == totalStats.destAmount,
	destAmountDiff: parseInt(due.priceRoute.destAmount) - totalStats.destAmount,
	destAmountPercDiff: (parseInt(due.priceRoute.destAmount) - totalStats.destAmount)/parseInt(due.priceRoute.destAmount)
}

console.clear();
//console.log(stats);
//console.error("<<-------------------------------------------------------------------------->>");
//console.warn(totalStats);
//console.error("<<-------------------------------------------------------------------------->>");
//console.warn(diffStats);
//console.error("<<-------------------------------------------------------------------------->>");
//console.warn(routes);
*/
let banged = key => key[0] === '!';
let debang = key => !banged(key) ? key : key.split("").splice(1).join("")

let wlist = (identifier, ...array) => {
	let o = {
		id: identifier,
		alias: -1,
		whitelist: array,
		blacklist: [],
		map: []
	}
	save(o);
	return o;
} 

let blist = (id, ...array) => {
	let _o = {...get(id)};
	_o["blacklist"] = array;
	save(_o);
	return _o;
}

let cMap = (id, type, ...keys) => {
	let _o = {...get(id)};
	//keys = keys.length ? keys : [name];
	let exp = [...keys].splice(-1)[0];
	let nFlag = !isNaN(exp);
	let name = exp === "^" ? keys[0] : nFlag ? keys[exp] : exp;
	if (nFlag) keys.pop();
	let attr = {
		type: type,
		name: debang(name),
		path: keys
	};
	_o.map.push(attr);
	save(_o);
	return _o;
}

let alias = (id, alias) => {
	let _o = {...get(id)};
	_o.alias = alias;
	save(_o);
}

let rename = (id, name, rebrand) => {
	let _o = {...get(id)};
	//console.log(`Renaming ${name} to ${rebrand}!`)
	//console.log("I:Map:\t", _o.map)
	_o.map.map((item, index) => {
		if (item.name === name) {
			item.name = rebrand
			//console.log(`Item #${index}:\t`, item.name)
		}
		return item
	})
	save(_o);
	//console.log("O:Map:\t", get(id).map)
}

let reroute = (id, _alias, name, rebrand) => {
	alias(id, _alias);
	rename(id, name, rebrand);
}

let getIndex = id => {
	let _o = {...get(id)};
	return (_o.alias + 1) ? _o.alias : _o.id
}

let schemas = {};
let at = 1;

let place = chain => schemas[chain] = !schemas[chain] ? [] : schemas[chain];

let to = chain => (at = chain) && place(at);

let connect = () => to(network)

let insert = o => schemas[at].push(o);

let del = o => schemas[at] = schemas[at].filter(schema => schema.id != o.id);

let get = id => schemas[at].filter(schema => schema.id == id)[0] || {};

let exists = o => get(o.id) !== undefined

let update = o => {
	let _o = {...get(o)};
	del(o);
	insert(o);
}

let save = o => exists(o) ? update(o) : insert(o);

//let traverse = (o, ...keys) => !keys.length ? o !== undefined ? o : undefined  : traverse(o[keys[0]], ...keys.splice(1))
let traverse = (o, ...keys) => {
	if (keys.length) {
		let _o = {...o}
		//let _a = {...o}
		//console.log("Input:\t", _o);
		//console.warn("<<-------------------------------------------------------------------------->>");
		keys.forEach((key, index) => {
			//console.log(`Key #${index}:\t${key}`)
			//console.log("_o:\t", _o);
			if (!banged(key[0])) _o = {..._o}[key]
			else {
				//console.warn("<<-------------------------------------------------------------------------->>");
				key = debang(key);
				//console.log("Key:\t", key)
				_o = _o ? [..._o].map(y => y[key]) : _o
				//_o = {..._o}.map(_y => _y[key])//should handle arrays well test and fix
			}
			//console.log("_o:\t", _o);
			//_a = {..._o}
			//console.info("_________________________________________________________________")
			//console.log("_a:\t", _a);
			//console.info("\\_________________________________________________________________/")
		})
		_o = _o !== undefined ? _o : null
		//console.warn("<<-------------------------------------------------------------------------->>");
		//console.error("Output:\t", _o);
		//console.error("<<-------------------------------------------------------------------------->>");
		return _o;
	} else return null
}

to(250);
//connect();
//console.log("at:\t", at)

wlist(2, "data", "pools", "!address");
cMap(2, "uint256[]", "data", "pools", "!address", 1);
//---
wlist(3, "data", "underlyingSwap");
cMap(3, "address", "data", "exchange");
rename(3, "exchange", "targetExchange");
cMap(3, "int128", "data", "i");
cMap(3, "int128", "data", "j");
cMap(3, "uint256", "data", "deadline");
cMap(3, "bool", "data", "underlyingSwap");
//---
wlist(4, "data", "underlyingSwap");
blist(4, "data", "deadline");
cMap(4, "address", "data", "exchange");
rename(4, "exchange", "targetExchange");
cMap(4, "uint256", "data", "i");
cMap(4, "uint256", "data", "j");
cMap(4, "bool", "data", "underlyingSwap");
//-
wlist(5, "data", "swaps", "!poolId");
cMap(5, "address[]", "data", "swaps", "!poolId"); //identity crisis | should be renamed to pools
reroute(5, 2, "poolId", "pools");
//console.log(get(3))
/**/
connect();

let scaffolding = []
let order = 0;

let mold = (type, name, value) => {
	let putty = {
		order: order++,
		type: type,
		name: name,
		value: value
	}
	scaffolding = [...scaffolding, putty];
}

mold("uint256", "index", "1")
mold("address", "targetExchange", "0x0000000000000000000000000000000000000000")
mold("uint256", "percent", "0")
mold("address", "weth", "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83")
mold("uint256[]", "pools", ["0x0000000000000000000000000000000000000000"])
mold("int128", "i", "0")
mold("int128", "j", "0")
mold("uint256", "iv2", "0")
mold("uint256", "jv2", "0")
mold("uint256", "deadline", "0")
mold("bool", "underlyingSwap", false)

let fill = list => {
	let temp = [...scaffolding];

	[...list].forEach(item => {
		let position;
		let status;
		temp = [...temp].filter(data => {
			status = true;
			if (data.name === item.name) {
				position = data.order;
				status = false;
			}
			return status;
		})
		item["order"] = position;
		temp = [...temp, item]
	})
	//console.log([...list].map(i=>i.name))
	//div();
	//console.log(temp)
	//div();
	return temp;
}

//console.log("schemas:\t", schemas)

let find = (route, ...path) => /*(console.log(`Path: [${path}]\t`) || true) &&*/ traverse(route, ...path) !== null

let match = route => {
	let pMatches = [...schemas[at]].filter(schema => find(route, ...schema.whitelist));
	let nMatches = [...schemas[at]].filter(schema => find(route, ...schema.blacklist));

	let score = match => {
		let paths = [...match.map].map(o => o.path)
		//console.log(paths)
		let total = 0;
		paths.forEach(path => {
			//console.log("Path:", path)
			total += (find(route, ...path) ? 1 : 0)
			//console.log("Path:", path)
			///console.error("\n******************************************************************\n")
		})

		return {
			id: match.id,
			//tally: 0,
			tally: total
		}
	}

	let increment = match => {
		return {
			id: match.id,
			tally: (match.tally + 1)
		}
	}
	
	let ascend = (a, b) => b.tally - a.tally;
	let greatest = array => array.sort(ascend)[0];

	pMatches = pMatches.map(match => score(match))
	//console.log(pMatches);
	nMatches = nMatches.map(match => increment(score(match))) //Because the blacklist is an additional point of accuracy.
	//console.log(nMatches);

	let matches = [...pMatches, ...nMatches];

	let id = greatest(matches)?.id
	
	//console.log(matches)
	

	//return 0;
	return id;
}
//let buildSwap = id, 

//let d = 0

let div = () => console.error("<<-------------------------------------------------------------------------->>");
/*console.log("#0:\t", get(match(routes[0])))
console.log("\n#1:\t", get(match(routes[1])))
console.log("\n#2:\t", get(match(routes[2])))
console.log("\n#3:\t", get(match(routes[3])))
console.error("<<-------------------------------------------------------------------------->>");
//console.log(traverse(routes[d], schemas[d].map))
//console.log(traverse(routes[0], ...schemas[0].map[0].path))
//console.log(routes[0])
//routes.forEach(route => div() || console.log(route.data))
console.log(getIndex(5))
/**/

let collect = (route, variables) => {
	let basket = [...variables].map(variable => {
		return {
			type: variable.type,
			name: variable.name,
			value: traverse(route, ...variable.path)
		}
	})

	return basket;
}

let bundle = (type, name, value) => {
	return {
		type: type,
		name: name,
		value: value
	}
}

let group = (basket, type, name, value) => {
	let _bundle = bundle(type, name, value);
	return [_bundle, ...basket];
}

let encode = () => {
	connect(); //to access the relevant schema
	let data = [...routes].map(route => {
		let id = match(route)
		let schema = get(id)
		let index = getIndex(id)
		console.log("SCHEMA.MAP @ parse.js:\t", schema.map)
		let basket = collect(route, schema.map)
		let percent = route.totalPercent
		basket = group(basket, "uint256", "percent", percent)
		basket = group(basket, "uint256", "index", index)
		//console.log("Schema:\t", schema);
		//console.log("Index:\t", index);
		//console.log("Basket:\t", basket);
		//console.log("Bundle:\t", bundle);
		//console.log("Route:\t", route);
		//console.log("Percent:\t", percent);
		basket = fill([...basket])
		basket = [...basket].sort((a, b) => a.order - b.order)
		//div()
		//console.log([...basket].map(item => item.order));
		//div()
		//console.log(basket)
		return basket;
	})
	.map(route => {
		let types = []
		let values = []
		let flow = []
		let names = []
		route.forEach(parsel => {
			types = [...types, parsel.type]
			values = [...values, parsel.value]
			flow = [...flow, parsel.order]
			names = [...names, parsel.name]
		})
		let crate = [types, values/*, flow, names*/]
		//console.log(crate)
		return crate
	})
	/*div()
	div()
	div()
	div()
	console.log(data)
	*/return data;
}

let MRC = parseFloat(process.argv[4])

let grab = key => parseFloat(due.priceRoute[key])

let gas = grab("gasCostUSD")

let bid = grab("srcUSD");

let quote = grab("destUSD");

let applyMRC = q => q * MRC;

let fees = applyMRC(quote) + gas;

let profit = quote - (bid + fees);

let profitability = profit/quote

let profitable = profitability > 0;

let stats = {
	profit: profit,
	profitability: profitability,
	profitable: profitable
}

let fToken = due.priceRoute.srcToken
let tToken = due.priceRoute.destToken
let tailOf = token => [...token].splice(token.length - 3, token.length).join("")
let hashOf = (f, t) => tailOf(f) + tailOf(t)
let hash = hashOf(fToken, tToken);

let id = {
	hash: hash, 
	block: due.priceRoute.blockNumber
}

let allData = encode();

let meta = [
	[
		"address",
		"address",
		"uint256"
	],
	[
		fToken,
		tToken,
		due.priceRoute.srcAmount
	]
]

let load = {
	meta: meta,
	routes: allData
}

let cargo = {
	id: id,
	stats: stats,
	load: load
}

printData(output, cargo);
//console.log("Cargo:\t", cargo);
//Bun.write("../SOLUTIONS/networks/fantom/paraswap/DATA/QUOTES/loVol/parsed/aed2de.json", load)
//Bun.write("/2ed2de.json", load)
