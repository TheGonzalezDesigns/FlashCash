const exchange = `./${process.argv[2]}`;
if (exchange === './undefined') {
    console.error('ERROR: No exchange provided to calculate.');
    process.exit(1);
}
const network = `${process.argv[3]}`;
if (network === 'undefined') {
    console.error('ERROR: No network provided to address.');
    process.exit(1);
}
const sourceFiles = {
    high: `${exchange}/DATA/QUOTES/hiVol/dispatch.json`,
    low: `${exchange}/DATA/QUOTES/loVol/dispatch.json`,
};
const outputFiles = {
	raw: 
		{
    			high: `${exchange}/DATA/QUOTES/hiVol/raw.srls`,
    			low: `${exchange}/DATA/QUOTES/loVol/raw.srls`
		},
	refined:
		{
    			high: `${exchange}/DATA/QUOTES/hiVol/refined.srls`,
    			low: `${exchange}/DATA/QUOTES/loVol/refined.srls`
		}
};
const vol = `${process.argv[4]}` == 'hi' ? "high" : "low";
const MRC = process.argv[5];
const trailLimit = process.argv[6];

let input = await Bun.file(sourceFiles[vol]).text();
input = [...input].join("").replaceAll(" ", "").replaceAll("\n", "").replaceAll(",]", "]");
const printData = async (output, data) => await Bun.write(output, JSON.stringify(data)) && console.warn(`Printing data to ${output}\n`, data);
const raw = outputFiles.raw[vol];
const refined = outputFiles.refined[vol];

let parse = data => {
    let res;
    try {
        res = JSON.parse(data);
    } catch(e) {
	console.error("Filter Alert:\tCould not parse unsanitized input!")
	console.error("Fliter Error:", data);
        process.exit(1);
    }
    return res;
}

let quotes = input !== '' && input && input.length > 2 && input[input.length - 1] === ']' ? parse(input) : [];

let empty = o => Object.entries(o).length == 0;

quotes = [...quotes].filter(q => !empty(q));

if (quotes.length < 1) {
	console.error("Filter Alert:\t No quotes found...")
	process.exit(1)
}
let formatData = quotes => {
	return (quotes.map(quote => {
		let data = "";

		data += quote.hash + " "
		data += quote.block + " "
		data += quote.fiat.quote + " "
		data += quote.fiat.bid + " "
		data += quote.fiat.gas + " "
		data += quote.token.quote + " "
		data += quote.token.bid + " "
		data += quote.token.gas
		return data;
	}).join("|"));
};

printData(raw, formatData(quotes));
let uuid = 0;
let qualifiers = [];
let foo = () => !false;
let state = (v, fn) => {
	console.log(`uuid[${uuid++}]`);
	console.log(`fn[${fn}] :: v[${v}]`);
	if (!isNaN(fn)) {	
		fn = foo;
	}
	let r = fn(v);
	qualifiers.push(fn);
	console.log(`${fn} => `, r);
	return r;
}
let apply = v => {
	let methods = [...qualifiers];
	let mapped = methods.map(fn => state(fn, v));
	console.log(`methods => ${methods}`)
	console.log(`mapped => ${mapped}`)
	return mapped;
}
let ev = (state, n) => {
	console.log(`state[${state}] && n[${n}] => ${state && n}`)
	return state && n
}
let qualify = v => {
	let applied = apply(v);
	let reduced = [...applied].reduce(ev, true);
	console.log(`applied => ${applied}`);
	console.log(`reduced => ${reduced}`);
	return reduced;
}

let disqualify = () => {
	qualifiers = [];
	console.log(`Disqualified[${qualifiers}]`);
}

let get = v => isNaN(v) ? parseFloat(v) : v;

let applyMRC = (quote) => quote - (quote * MRC);

let qualified = [...quotes].filter(quote => {
	let f = key => quote.fiat[key]
	let retrieve = key => get(f(key))
	let q = retrieve("quote");
	let g = retrieve("gas");
	let b = retrieve("bid");
	let _mrc = applyMRC(q);
	let fl = 0.0009 * q;
	//let s = fn => state(q, fn);
	let s = fn => fn(q);
	
	let t1 = s(v => (_mrc - b) > 0)
	let t2 = s(() => q > b)
	let t3 = s(() => (q - (g + fl)) > b)
	//state(q, () => (q - (g + fl)) > b)

	//let quality = qualify(q);
	let quality = t1 && t2 && t3

	//disqualify();

	//console.log("Quality:\t", quality);

	return quality;
});

let quantity = qualified.length;

//console.log("\nQUALIFIED:\t", qualified);

if (quantity > 0) {
    	console.clear();
    	console.log(`\n>>>>>>>>> Found ${quantity} <<<<<<<<<<<`);
    	
	let payload = formatData(qualified);
    	console.log("Refined!:\t", payload);
    	await printData(refined, payload);
	
	let relay = await Bun.file(refined).json();
	console.log("VERIFICATION:\t", relay);
	process.exit(0);
} else {
	console.log("Still searching....")
	process.exit(1);
}
