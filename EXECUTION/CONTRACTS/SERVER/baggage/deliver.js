const deliver = async (profit, gas, fn, ...data) => {
	const start = performance.now();

	let state = {
		transactions: 0,
		succeeded: 0,
		failed: 0,
		profit: 0,
		gas: 0,
		permitted: 0,
		allowance: 0,
		threshold: .125, //This ensures that it always remains profitible, the larger the number, the more transactions and potential earnings, the smaller the number, the lesser the expenses but also the lesser the profit
		profitable: false,
		runtime: 0
	}

	const init = () => {
		state.profit = profit;
		state.gas = gas;
		state.allowance = Math.floor((state.profit/state.gas) * state.threshold);
		state.permitted = state.allowance;

	}

	const next = () => {

		state.profitable = (state.permitted > 0) && (state.transactions < state.permitted)


		//console.log(`</${state.transactions}\\><[${state.transactions - state.permitted}]></${state.permitted}\\>`)

		//console.info(account());
	}
	
	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
			
	const addAllowance = () => state.permitted += state.allowance;
	
	const decAllowance = () => state.permitted -= Math.floor(state.allowance/5);

	const deploy = async () => {

		Promise.resolve(fn(...data)).then(x => {
			x && state.succeeded++;
			x && addAllowance();
			x || state.failed++;
			x || decAllowance();
		}, error => {
			//console.error("Entered Failure:", Object.keys(error))
			state.failed++
			decAllowance();
		});

		state.transactions++;
	}

	const account = () => {

		const nppt = state.profit - state.gas;
		const expenses = state.transactions * state.gas; //Note: Unlike state.succeeded in gross, state.failed is not exlpicitly used in calculating expenses, because every transaction succesful or not would inccur a gas fee, which state.transactions would account for.
		const gross = state.succeeded * state.profit;
		const net = gross - expenses;
		const aps = net/(state.runtime/1000)
		const ppm = aps * 60;
		const pph = ppm * 60;
		const ppd = pph * 60;
		const ppw = ppd * 7;
		const ppn = ppd * 30;
		const ppy = ppd * 365;
		//pp lol
		return {
			transactions: state.transactions,
			succeeded: state.succeeded,
			failed: state.failed,
			netProfitPerTransaction: nppt,
			gas: state.gas,
			expenses: expenses,
			gross: gross,
			net: net,
			averageProfitPerSec: aps,
			projectedProfitPer: {
				minute: ppm,
				hour: pph,
				day: ppd,
				week: ppw,
				month: ppn,
				year: ppy
			}
		}
	}
	
	if (profit > gas) {

		init();

		do {
			deploy();
	
			next();
			
			await sleep(1.5); //Soooo this is my work computer's limit may be able to remove this on an RTX

		} while (state.profitable);

		console.log(state)
	}

	const end = performance.now();

	state.runtime = end - start
	console.log(`Runtime: ${state.runtime/1000} seconds`)
	return account();
}

module.exports = deliver;
