const fs = require("fs");
const exchange = `./${process.argv[2]}`;
const sourceFile = 'tokenList.json';
const output = `${exchange}/contracts.ba`;
const file = fs.readFileSync(sourceFile, "utf8");
const { tokens } = JSON.parse(file);

let contracts = "";

console.log(`Parsing File...`)

tokens.forEach(token => {
		contracts += token.address + " "
	})

fs.writeFileSync(output, contracts);
