const cheerio = require("cheerio");
const fs = require('fs'); 
const exchange = `./${process.argv[2]}`;
if (exchange === './undefined') {
	console.error('ERROR: No exchange provided to traverse.');
	process.exit(1);
}
const network = `${process.argv[3]}`;
if (network === 'undefined') {
	console.error('ERROR: No network provided to address.');
	process.exit(1);
}
const sourceFiles = {
	networks: `./DATA/networks.json`,
	chainlist: `./DATA/chainlist.html`
};
const outputFiles = {
	name: `${exchange}/DATA/name`,
	chainID: `${exchange}/DATA/chainID`,
	report: `${exchange}/DATA/analysis_report.txt`
};
const nets = JSON.parse(fs.readFileSync(sourceFiles.networks, "utf8"));
let chainlist = fs.readFileSync(sourceFiles.chainlist, "utf8");

const getChain = (net) => {
	const $ = cheerio.load(chainlist);
	const script = $('#__NEXT_DATA__').text();
	const chains = JSON.parse(script).props.pageProps.sortedChains;
	const match = attr => attr !== undefined && attr.search(net) == 0;
	const chain = chains.filter(chain => match(chain?.icon) || match(chain?.name) || match(chain?.chain) || match(chain?.chainSlug) || match(chain?.nativeCurrency.name) || match(chain?.nativeCurrency?.symbol))[0];
	return chain;
}

let chain = getChain(network);

let findNet = net => {
	let ID = chainID = _net = data = null;
	for (let i = net.length; i > 0 && ID === null; i--)
	{
		_net = [...net].splice(0,i).join("");
		data = [...nets].filter(n => (n.id + "").search(_net) === 0)[0];

		if (!(data === undefined || data == null)) {
			ID = data.id;
			chainID = data.chain_identifier;
		}
	}
	chainID = chainID !== null ? chainID : chain.chainID;
    return { ID, chainID };
}

const net = findNet(network); 

const printData = (output, data) => fs.writeFile(output, data, err => console.log(`${output} update ${err ? 'failed' : 'succeeded'}`));

let reportData = "";
const report = (line, stringify) => {
	console.info(line);
	if (stringify) line = JSON.stringify(line).replaceAll(/([{])/g, '$1\n  ').replaceAll(/(})/g, '\n$1').replaceAll(/(:)/g, '$1 ').replaceAll(/(,")/g, ',\n  "');
	reportData += "\n" + line;
}

const printReport = (file, data) => fs.writeFile(file, data, err => console.log(`${file} update ${err ? 'failed' : 'succeeded'}`));

printData(outputFiles.name, net.ID);
printData(outputFiles.chainID, JSON.stringify(net.chainID));

report(`\n       Analysis Report for ${exchange} on ${network}`)
report('________________________________________________________________\n')
report('\nChain Identification:\n')
report(net, true);
report('----------------------------------------------------------------\n')
report('\nChain Details:\n')
report(chain, true)
report('________________________________________________________________\n')

printReport(outputFiles.report, reportData);