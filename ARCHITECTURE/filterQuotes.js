const fs = require('fs');
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
    high: `${exchange}/DATA/QUOTES/hiVol/refined.json`,
    low: `${exchange}/DATA/QUOTES/loVol/refined.json`,
};
const vol = `${process.argv[4]}` == 'hi' ? "high" : "low";
const MRC = process.argv[5];
const trailLimit = process.argv[6];

const input = fs.readFileSync(sourceFiles[vol], "utf8");
const printData = (output, data) => fs.writeFile(output, JSON.stringify(data), err => console.log(`${output} creation ${err ? 'failed' : 'succeeded'}`));
const output = outputFiles[vol];

let quotes = input.length > 2 && input[input.length - 1] === ']' ? JSON.parse(input) : [];

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
    avgTri = avg * 3;
    maxProfit = avgTri * trinaries;
    halfProfit = avgTri * trinaries * .5;
    quarterProfit = avgTri * trinaries * .25;
    tenthProfit = avgTri * trinaries * .10;
    hundProfit = avgTri * trinaries * .01;
    thouProfit = avgTri * trinaries * .001;
    tenthouProfit = avgTri * trinaries * .0001;
    hundhouProfit = avgTri * trinaries * .00001;

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
if (quantity >= 3) {
    
    printData(output, quotes);
} else console.warn("Sorry no luck!");





console.log("\n__________________________________________________________\n")