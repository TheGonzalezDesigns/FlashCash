const CoinGecko = require('coingecko-api');
const fs = require('fs');
const network = process.argv[2];

console.log(`Extracting coins from ${network}`);
console.log('-----------------------------------------------')

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

//3 Get Coins
const getAllCoins = async() => {
	const params = {
		tickers: false,
		market_data: false,
		community_data: false,
		developer_data: false,
		localization: false,
		sparkline: false
	};
	const res = await CoinGeckoClient.coins.all(params);
	const coins = res.data.map(coin => coin.id);
	const data = {coins: coins, quantity: coins.length};
	return data;
};

//4 Extract Network Compatible Coins
const isCompatible = async(coin, network) => {
	const params = {
		tickers: false,
		market_data: true,
		community_data: false,
		developer_data: false,
		localization: false,
		sparkline: false
	};
	const res = await CoinGeckoClient.coins.fetch(coin, params);
	const platforms = res.data.platforms;	
	const marketData = res.data["market_data"];
	const compatibility = network in platforms;
	const contract = compatibility ? platforms[network] : null;
	return {comp: compatibility, contract: contract, marketData: marketData};
};

const getCompatibleCoins = async(network) => {
	const allCoins = await getAllCoins();
	let compatibileCoins;
	let compatibility;

	return Promise.all(allCoins.coins).
		then(coins => {
			//Adds Compatibility flag
			compatibleCoins = coins.map(async(coin) => {
				compatibility = await isCompatible(coin, network)
				return  {
					coin: coin,
					compatible: compatibility.comp,
					contract: compatibility.contract,
					marketData: compatibility.marketData
				};
			});
			return Promise.all(compatibleCoins).
				then(_compatibleCoins => {
					compatibleCoins = _compatibleCoins
						//Filters coins based on networl compatibility
						.filter(coin => coin.compatible)
						//Adds volatillity param
						.map(data => {
							return {
								coin: data.coin,
								contract: data.contract,
								marketData: data.marketData,
								volatillity: null
							}
						})
					return compatibleCoins;
				});
		});
};

//5 Extract Low Volatility Coins

const calcVariance = (dailyHigh, dailyLow) => (dailyHigh - dailyLow) / dailyLow
const calcVolatility = (high, low) => Math.sqrt(252) * Math.sqrt(calcVariance(high, low));
const getVolatility = async(coin) => {
	const marketData = coin.marketData;
	// We might revist the idea of basing all volatility on another incredibly volatile asset like the dollar, but in theory, a day should not be enough to affect the vol metric significantly.
	const dailyHighUsd = marketData["high_24h"]["usd"];	
	const dailyLowUsd = marketData["low_24h"]["usd"];
	const coinVolatility = calcVolatility(dailyHighUsd, dailyLowUsd);
	return coinVolatility;
}

const getVolatilityCompliantCoins = async(coins) => {
	let _coins = coins.map(async(coin) => {
		return {
			coin: coin.coin,
			contract: coin.contract,
			volatility: await getVolatility(coin)
		}
	});
	return Promise.all(_coins)
		.then(__coins => {
			let totalVol = 0;
			__coins.forEach(coin => totalVol += coin.volatility);
			const upperThresh = 2;
			const avgVol = totalVol / __coins.length;
			const limit = avgVol * upperThresh;
			const getRelativeVol = (vol) => ((vol - avgVol) / avgVol) * 100
			const volCompliantCoins = __coins.filter(_coin => _coin.volatility <= limit).map(__coin => {
				return {
					name: __coin.coin,
					contract: __coin.contract,
					vol: __coin.volatility,
					relVol: getRelativeVol(__coin.volatility)
				}
			});

			return volCompliantCoins;
		});
};

// Send coin list to file

const translate = (network) => {
	const networks = {
		ethereum: "ethereum",
		polygon: "polygon-pos",
		binance: "binance-smart-chain",
		optimism: "optmistic-ethereum",
		harmony: "harmony-shard-0",
		avalance: "avalanche",
		sora: "sora",
		moonriver: "moonriver",
		aurora: "aurora",
		cronos: "cronos",
		fantom: "fantom",
		moonbeam: "moonbeam",
		syscoin: "syscoin",
		cosmos: "cosmos",
		arbitrum: "arbitrum-one",
		huobi: "huobi-token"
	}
	return network in networks ? networks[network] : '';
}

const composeCoins = async(network) => {
	console.info(`Composing coins for the ${network} network...`)
	const coins = await getCompatibleCoins(network);
	return Promise.all(coins)
		.then(coins => {
			console.log('Printing Coins')
			return getVolatilityCompliantCoins(coins)
		});
}

const printList = async(network) => {
	const list = await composeCoins(network);
	console.info(`Retrieved ${list.length} coins from the ${network} network.`)
	Promise.all(list).then(_list => {
		//console.log(_list) //Uncomment to print list
		fs.writeFile("./tokenList.json", JSON.stringify(_list), err => console.log(`File update ${err ? 'failed' : 'succeeded'}`))	
	});

};
printList(translate(network));
