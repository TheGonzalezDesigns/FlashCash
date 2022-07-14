const fs = require('fs'); 
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
const input = fs.readFileSync(sourceFiles[vol], "utf8")
const output = outputFiles[vol];
// console.log("\nInput:\n", input);
let quotes = input.length > 2 && input[input.length - 1] === ']' ? JSON.parse(input) : [];

// const quotes = process.argv[2];
// quotes.sort((a,b) => a.block - b.block)
// quotes.sort((a,b) => (b.fiat.quote - b.fiat.bid) - (a.fiat.quote - a.fiat.bid))
quotes = quotes.filter(q => true)
    // .filter(quote => (quote.fiat.quote - quote.fiat.bid) >= quote.fiat.gas)
    .filter(quote => (quote.fiat.quote - quote.fiat.bid)/quote.fiat.bid >= 0)
    // .sort((a,b) => (b.fiat.quote - b.fiat.bid) - (a.fiat.quote - a.fiat.bid))
console.log("\nquotes:\t", quotes)

const printData = (output, data) => fs.writeFile(output, JSON.stringify(data), err => console.log(`${output} creation ${err ? 'failed' : 'succeeded'}`));

printData(output, quotes);

console.log("\n__________________________________________________________\n")