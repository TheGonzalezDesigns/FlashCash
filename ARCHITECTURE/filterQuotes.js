// const fs = require('fs');
// const { permutations } = require('mathjs');
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
    high: `${exchange}/DATA/QUOTES/hiVol/refined.srls`,
    low: `${exchange}/DATA/QUOTES/loVol/refined.srls`,
};
const vol = `${process.argv[4]}` == 'hi' ? "high" : "low";
const MRC = process.argv[5];
const trailLimit = process.argv[6];

// const input = fs.readFileSync(sourceFiles[vol], "utf8");
const input = await Bun.file(sourceFiles[vol]).text();
//console.log(input);
// const printData = (output, data) => fs.writeFile(output, JSON.stringify(data), err => console.log(`${output} creation ${err ? 'failed' : 'succeeded'}`));
const printData = (output, data) => Bun.write(output, JSON.stringify(data));
const output = outputFiles[vol];

let parse = data => {
    let res;
    try {
        JSON.parse(data);
    } catch(e) {
        process.exit(1);
    }
    return JSON.parse(data);
}

let quotes = input !== '' && input && input.length > 2 && input[input.length - 1] === ']' ? parse(input) : [];

if (quotes.length < 1) process.exit(1);

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
		//console.log(quote)
		//console.log("Data:\t", data)
		return data;
	}).join("|"));
};
//console.log(formatData(quotes));
if (quantity >= 3) {
	// printStats();
    printData(output, formatData(quotes));
    console.clear();
    console.warn("Found something!");
    console.log("\n__________________________________________________________\n")
}
// } else false && console.warn("Sorry no luck!");

// reformat the data for hyperhash | redesign hyperhash to by a small c++ script that instantly generates all permutations of a giveb batch, sort them by most profitable and launch in profitability descending order.



// console.log("\n__________________________________________________________\n")
