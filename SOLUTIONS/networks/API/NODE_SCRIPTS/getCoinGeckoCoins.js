const CoinGecko = require('coingecko-api');
const fs = require('fs');
const network = process.argv[2];

console.log(`Extracting every token from the Coin Gecko Index`);
console.log('------------------------------------------------')

//1. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

//2 Get Coins
const getAllTokens = async() => {
	const params = {
		tickers: false,
		market_data: false,
		community_data: false,
		developer_data: false,
		localization: false,
		sparkline: false
	};
	try {
		const { data } = await CoinGeckoClient.coins.list(params);
		const tokens = data.map(coin => coin.id);
		return tokens;
	} catch (error) {
		console.error('ERROR:\tFailed to connect to the Coin Gecko Index.');
		process.exit(1);
	}
};

//3 Convert to bash array
const convertToBashArray = array => {
	let bashArray = "";
	array.forEach(item => bashArray += `${item} `);
	return bashArray;
}

//4 Print array to file
const printList = (tokens) => {
	const filename = "./CoinGeckoTokens.ba";
	console.info(`Retrieved ${tokens.length} tokens and moved to ${filename}`);
	fs.writeFile(filename, JSON.stringify(tokens), err => console.error(err ? `ERROR:\t${err}` : ''));	
};

//5 Execute
Promise.resolve(getAllTokens())
	.then(tokens => printList(convertToBashArray(tokens)));
