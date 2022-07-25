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
//console.log("\nRaw...\n", input)
input = [...input].join("").replaceAll(" ", "").replaceAll("\n", "").replaceAll(",]", "]");
//console.log("\nSany...\n", input)
const printData = (output, data) => Bun.write(output, JSON.stringify(data)) && console.warn(`Printing data to ${output}\n`, data);
const raw = outputFiles.raw[vol];
const refined = outputFiles.refined[vol];

let parse = data => {
    let res;
    try {
        res = JSON.parse(data);
    } catch(e) {
	//console.error("Alert:\tCould not parse unsanitized input!")
        process.exit(1);
    }
    return res;
}

//console.log("input !== '':\t", input !== '');
//console.log("input:\t", input);
//console.log("input.length > 2:\t", input.length > 2);
//console.log("input[input.length - 1]:\t", input[input.length - 1] === ']');
let quotes = input !== '' && input && input.length > 2 && input[input.length - 1] === ']' ? parse(input) : [];

let empty = o => Object.entries(o).length == 0;

quotes = [...quotes].filter(q => !empty(q));

if (quotes.length < 1) {
	//console.error("Too short:\t", quotes)
	process.exit(1)
}
//else console.log("Proccessing quotes...", quotes)
let formatData = quotes => {
	//console.log("Formating", quotes)
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
		//console.log(quote)
		//console.log("Data:\t", data)
		return data;
	}).join("|"));
};
printData(raw, formatData(quotes));

const mostRecent = quotes => [...quotes].sort((a, b) => b.block - a.block)[0].block
const applyMRC = (quote) => quote - (quote * MRC);
const MR = mostRecent(quotes);

quotes = quotes.filter(quote => {
    let _MRC = applyMRC(quote.fiat.quote);
    return (MR - trailLimit <= quote.block) && (_MRC - quote.fiat.bid >= quote.fiat.gas) && ((_MRC - quote.fiat.bid) / quote.fiat.bid >= 0)
});

let printStats = () => {
	let avg = [...quotes].sort((a, b) => (b.fiat.quote - b.fiat.bid) - (a.fiat.quote - a.fiat.bid)).reduce((acc, quote) => {
        return acc + ((quote.fiat.quote - quote.fiat.bid) - quote.fiat.gas)
    }, 0);
    let trinaries = 12144;
    avg /= quantity;
    let avgTri = avg * 3;
    let maxProfit = avgTri * trinaries;
    let halfProfit = avgTri * trinaries * .5;
    let quarterProfit = avgTri * trinaries * .25;
    let tenthProfit = avgTri * trinaries * .10;
    let hundProfit = avgTri * trinaries * .01;
    let thouProfit = avgTri * trinaries * .001;
    let tenthouProfit = avgTri * trinaries * .0001;
    let hundhouProfit = avgTri * trinaries * .00001;

    console.info("LATEST:\t", MR);
    console.log("Quotes available:\t", quantity);
    console.log("Avg profit per transaction:\t", avg);
    console.log("Avg profit per set:\t", avgTri);
    console.log("Trinaries from sets:\t", trinaries);
    console.log("Max profit:\t", maxProfit);
    console.log("Half profit:\t", halfProfit);
    console.log("Quarter profit:\t", quarterProfit);
    console.log("Tenth profit:\t", tenthProfit);
    console.log("1% profit:\t", hundProfit);
    console.log(".1% profit:\t", thouProfit);
    console.log(".01% profit:\t", tenthouProfit);
    console.log(".001% profit:\t", hundhouProfit);
    console.log("Daily off Tenth profit:\t", tenthProfit * 60 * 60 * 24);
    console.log("Daily off 1% profit:\t", hundProfit * 60 * 60 * 24);
    console.log("Daily off .1% profit:\t", thouProfit * 60 * 60 * 24);
    console.log("Daily off .01% profit:\t", tenthouProfit * 60 * 60 * 24);
    console.log("Daily off .001% profit:\t", hundhouProfit * 60 * 60 * 24);
    console.log("trinaries * .01:\t", trinaries * .01);
}

let quantity = quotes.length;
// let trinaries = permutations(quantity) * .0000000000001;

if (quantity >= 1) {
	// printStats();
    console.clear();
    console.error("\nFound something!");
    console.error("\n__________________________________________________________\n")
    let data = formatData(quotes);
    console.error(data);
    printData(refined, data);
} else false && console.warn("Sorry no luck!");
printData(sourceFiles[vol], "--");
// reformat the data for hyperhash | redesign hyperhash to by a small c++ script that instantly generates all permutations of a giveb batch, sort them by most profitable and launch in profitability descending order.



// console.log("\n__________________________________________________________\n")
