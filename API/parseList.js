const fs = require("fs");
const exchange = `./${process.argv[2]}`;
const sourceFile = `${exchange}/DATA/tokenList.json`;
const output = `${exchange}/DATA/contracts.ba`;
const file = fs.readFileSync(sourceFile, "utf8");
const { tokens } = JSON.parse(file);

let contracts = "";

console.log(`\nParsing ${exchange} for token contracts...`);
console.log("_____________________________________________________");

tokens.forEach(token => {
		contracts += token.address + " "
	})

fs.writeFileSync(output, contracts);
