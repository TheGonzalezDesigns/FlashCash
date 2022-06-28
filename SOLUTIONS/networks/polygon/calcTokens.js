const { permutations } = require('mathjs');
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
const sourceFile = `${exchange}/cleanTokenData.json`;
const outputFiles = {
	high: `${exchange}/hiVolTokens.json`,
	low: `${exchange}/loVolTokens.json`,
	highRel: `${exchange}/hiCTVTokens.json`,
	lowRel: `${exchange}/loCTVTokens.json`,
	report: `${exchange}/report.txt`
};
const file = fs.readFileSync(sourceFile, "utf8");
const tokens = JSON.parse(file);

//1 Format tokens to contain only contract andd market data;

const formatTokens = tokens => {
	return tokens.map(token => {
		return {
			contract: token.contract,
			marketData: token.data.market_data
		}	
	});
}

//2 Extract Low Volatility Coins

const calcVariance = (dailyHigh, dailyLow) => (dailyHigh - dailyLow) / dailyLow
const calcVolatility = (high, low) => Math.sqrt(252) * Math.sqrt(calcVariance(high, low));
const getVol = token => {
	const marketData = token.marketData;
	//console.log(`Market data for ${token.contract}`);
	//console.info(marketData);
	// We might revist the idea of basing all volatility on another incredibly volatile asset like the dollar, but in theory, a day should not be enough to affect the vol metric significantly.
	const dailyHighUsd = marketData["high_24h"]["usd"];	
	const dailyLowUsd = marketData["low_24h"]["usd"];
	const coinVolatility = calcVolatility(dailyHighUsd, dailyLowUsd);
	return coinVolatility;
}

//2 Extract Market Capa data
const getCap = token => token.marketData.market_cap.usd;

let purged = 0;
let relPurged = 0;
let capped = 0;
let relCapped = 0;
let initQuantity = 0;
let totalLoss = 0;
let relTotalLoss = 0;
const MIN_CAP = 1000000

const getCalcTokens = coins => {
	relPurged = coins.length
	initQuantity = coins.length;
	let _coins = coins.map(coin => {
		return {
			contract: coin.contract,
			volatility: getVol(coin),
			cap: getCap(coin)
		}
	}).filter(token => {
		let state = !isNaN(token.volatility)
		if (state) purged++;
		return state;
	});
	relPurged = ((relPurged  - _coins.length)/relPurged) * 100;
	let totalVol = 0;
	let totalCap = 0;
	const MAX_TOKENS = 840;
	const __coins = _coins;
	//__coins.forEach(token => console.log(token))
	__coins.forEach(coin => totalVol += coin.volatility);
	__coins.forEach(coin => totalCap += coin.cap);
	const upperThresh = 1.2;
	const avgVol = totalVol / __coins.length;
	const avgCap = totalCap / __coins.length;
	const limit = avgVol * upperThresh;
	const getRelativeVol = (vol) => ((vol - avgVol) / avgVol) * 100
	const getRelativeCap = cap => ((cap - avgCap) / avgCap) * 100;
	const legible = num => [...[...JSON.stringify(num)].reverse().join("").replaceAll(/(\d{3})/g, '$1,')].reverse().join("");
	const lowVolCoins = __coins.filter(_coin => _coin.volatility <= limit)
		.map(__coin => {
			return {
				contract: __coin.contract,
				vol: __coin.volatility,
				relVol: getRelativeVol(__coin.volatility),
				cap: __coin.cap,
				relCap: getRelativeCap(__coin.cap)
			}
		})
		.filter(t => {
			let state = t.cap > MIN_CAP;
			if (!state) capped++;
			return state;
		})
		.map(__coin => {
			return {
				contract: __coin.contract,
				ctv: __coin.relVol * __coin.relCap,
				vol: __coin.vol,
				relVol: __coin.relVol,
				cap: legible(__coin.cap),
				relCap: __coin.relCap
			}
		})
		.sort((a,b) => a.ctv - b.ctv)
		.splice(0, MAX_TOKENS);
	const hiVolCoins = __coins.filter(_coin => _coin.volatility > limit)
		.map(__coin => {
			return {
				contract: __coin.contract,
				vol: __coin.volatility,
				relVol: getRelativeVol(__coin.volatility),
				cap: __coin.cap,
				relCap: getRelativeCap(__coin.cap)
			}
		})
		.filter(t => {
			let state = t.cap > MIN_CAP;
			if (!state) capped++;
			return state;
		})
		.map(__coin => {
			return {
				contract: __coin.contract,
				ctv: __coin.relVol * __coin.relCap,
				vol: __coin.vol,
				relVol: __coin.relVol,
				cap: legible(__coin.cap),
				relCap: __coin.relCap
			}
		})
		.sort((a,b) => b.ctv - a.ctv)
		.splice(0, MAX_TOKENS)

	relCapped = ((purged - capped)/purged) * 100;
	totalLoss = (initQuantity - capped);
	relTotalLoss = (totalLoss/initQuantity) * 100;

	return {
		highVol: {
			relData: hiVolCoins,
			primed: {
				quantity: hiVolCoins.length,
				binaries: permutations(hiVolCoins.length, 2),
				trinaries: permutations(hiVolCoins.length, 3),
				quadratics: permutations(hiVolCoins.length, 4),
				contracts: hiVolCoins.map(__coin => __coin.contract)
			}
		},
		lowVol: {
			relData: lowVolCoins,
			primed: {
				quantity: lowVolCoins.length,
				binaries: permutations(lowVolCoins.length, 2),
				trinaries: permutations(lowVolCoins.length, 3),
				quadratics: permutations(lowVolCoins.length, 4),
				contracts: lowVolCoins.map(__coin => __coin.contract)
			}
		}
	};
};

// Send coin list to file

const calcTokens = getCalcTokens(formatTokens(tokens));

const hiVolTokens = calcTokens.highVol;
const lowVolTokens = calcTokens.lowVol;

const printTokens = (output, tokens) => fs.writeFile(output, JSON.stringify(tokens), err => console.log(`${output} calculation and update ${err ? 'failed' : 'succeeded'}`));


const variants = (tokens, level) => tokens.filter(token => token.ctv === Math[level](...tokens.map(t => t.ctv)))[0];

let reportData = "";
const report = (line, stringify) => {
	console.info(line);
	if (stringify) line = JSON.stringify(line).replaceAll(/([{])/g, '$1\n  ').replaceAll(/(})/g, '\n$1').replaceAll(/(:)/g, '$1 ').replaceAll(/(,")/g, ',\n  "');
	reportData += "\n" + line;
}
const printReport = (file, data) => fs.writeFile(file, data, err => console.log(`${file} update ${err ? 'failed' : 'succeeded'}`));
//const printReport = (file, data) => fs.writeFile(file, JSON.stringify(data), err => console.log(`${file} update ${err ? 'failed' : 'succeeded'}`));


printTokens(outputFiles.high, hiVolTokens.primed);
printTokens(outputFiles.low, lowVolTokens.primed);
printTokens(outputFiles.highRel, hiVolTokens.relData);
printTokens(outputFiles.lowRel, lowVolTokens.relData);

report(`\n       Calculation Report for ${exchange} on ${network}`)
report('________________________________________________________________\n')
report('\nVolatility Stats:')
report('________________________________________________________________\n')
report(`High Vol Tokens:\t${hiVolTokens.primed.quantity}`);
report(`High Vol Binaries:\t${hiVolTokens.primed.binaries}`);
report(`High Vol Trinaries:\t${hiVolTokens.primed.trinaries}`);
report(`High Vol Quadratics:\t${hiVolTokens.primed.quadratics}`);
report('----------------------------------------------------------------\n')
report(`Low Vol Tokens: \t${lowVolTokens.primed.quantity}`);
report(`Low Vol Binaries:\t${lowVolTokens.primed.binaries}`);
report(`Low Vol Trinaries:\t${lowVolTokens.primed.trinaries}`);
report(`Low Vol Quadratics:\t${lowVolTokens.primed.quadratics}`);
report('----------------------------------------------------------------\n')
report(`Dataless Tokens:\t${purged}`);
report(`Relative Loss:  \t%${relPurged}`);
report('................................................................\n')
report(`Undercapped Tokens:\t${capped}`);
report(`Relative Loss:  \t%${relCapped}`);
report(`Min Market Cap:  \t$${MIN_CAP} USD`);
//console.log('................................................................\n') // Calcs are off, maybe initQuantity is wrong -\(-_-)/-
//console.log(`Total Tokens Lost:\t${totalLoss}`);
//console.log(`Relative Loss:    \t%${relTotalLoss}`);
report('----------------------------------------------------------------\n')
report('\nMarket Cap to Volatility Stats:')
report('________________________________________________________________\n')
report('Highest CTV Token:');
report(variants(hiVolTokens.relData, "max"), true);
report('----------------------------------------------------------------\n')
report('Lowest CTV Token:');
report(variants(lowVolTokens.relData, "min"), true);
report('________________________________________________________________')

printReport(outputFiles.report, reportData);
