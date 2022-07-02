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
const sourceFile = {
	high: `${exchange}/DATA/hiVolTokens.json`,
	low: `${exchange}/DATA/loVolTokens.json`,
};
const outputFiles = {
	high: `${exchange}/DATA/${/\w+(?=\.json)/.exec(sourceFile.high)[0]}.cf`,
	low: `${exchange}/DATA/${/\w+(?=\.json)/.exec(sourceFile.low)[0]}.cf`,
};
const input = {
	 high: JSON.parse(fs.readFileSync(sourceFile.high, "utf8")),
	 low: JSON.parse(fs.readFileSync(sourceFile.low, "utf8")),
}
const output = {
	 high: "",
	 low: ""
}

//1 Format token data to contain only values and no keys

const reformat = file => {
	const fileData = input[file];
	let lines = "";
	const record = ln => lines += ln + "\n";
	const report = ln => record(ln) || console.info(ln);
	report(fileData.quantity);
	report(fileData.binaries);
	report(fileData.trinaries);
	report(fileData.quadratics);
	fileData.contracts.forEach(c => report(c));
	output[file] = lines;
}

reformat("high");
reformat("low");

const printData = (output, data) => fs.writeFile(output, data, err => console.log(`${output} reformat ${err ? 'failed' : 'succeeded'}`));

console.log('\n                        Reformating Data')
console.log('________________________________________________________________\n')

printData(outputFiles.high, output.high);
printData(outputFiles.low, output.low);

