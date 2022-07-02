const fs = require("fs");
const exchange = `./${process.argv[2]}`
if (exchange === './undefined') {
	console.error('ERROR: No exchange provided to clean.');
	process.exit(1);
}
const sourceFile = `${exchange}/DATA/allTokenData.json`;
const output = `${exchange}/DATA/cleanTokenData.json`;
const file = fs.readFileSync(sourceFile, "utf8");
const tokens = JSON.parse(file);

console.log(`Cleaning Token List of ${tokens.length}...`);
console.log('-----------------------');

const cleanTokens = tokens.filter(token => token.data.error === undefined)

console.log(`List is now ${((cleanTokens.length - tokens.length)/tokens.length) * -100}% lighter, retaining ${cleanTokens.length} tokens.`);

fs.writeFileSync(output, JSON.stringify(cleanTokens));
