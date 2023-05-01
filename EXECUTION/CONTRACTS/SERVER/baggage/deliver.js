const deliver = async (profit, gas, fn, data) => {
	const start = performance.now();
	// console.log("Delivering...")

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
		runtime: 0,
		data: {}
	}

	const init = () => {
		// console.log("Initializing...")
		state.profit = profit;
		state.gas = gas;
		state.allowance = Math.floor((state.profit / state.gas) * state.threshold);
		state.permitted = state.allowance;
		state.data = data
	}

	const printState = () => {
		try {
			console.log(`</${state.transactions}\\><[${state.transactions - state.permitted}]></${state.permitted}\\>`)

			// console.info(`𐂲 T-${state.transactions}: `, state);
			const copy = JSON.stringify(state)
			let stats = JSON.parse(copy)
			delete stats.data

			let data = JSON.parse(copy)?.data
			delete data.swaps
			let gas = data?.gas
			delete data.gas
			let params = data?.params
			delete data.params
			let tokens = data?.tokens
			delete data.tokens

			// console.log("Stats:")
			// console.table(stats)
			// console.log("Data:")
			console.log(data.trail)
			// console.log("Gas:")
			// console.table(gas)
			// console.log("Params:")
			// console.table(params)
			// console.log("Tokens:")
			// console.table(tokens)
		} catch (e) {
			console.error("printState Error: ", e)
		}
	}

	const next = () => {

		state.profitable = (state.permitted > 0) && (state.transactions < state.permitted)
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

	const addAllowance = () => state.permitted += state.allowance;

	const decAllowance = () => state.permitted -= Math.floor(state.allowance / 5);

	const decipherError = err => {
		let error = undefined;
		try {
			error = JSON.parse(err.error?.error?.body)?.error?.message;
		} catch (e) {
			error = err.reason;
		}
		error = error ? error : `Reason Unknown`;
		if (error == "execution reverted")
			error = `${err.code} | ${err.reason}`;

		// if (
		// 	error.includes("SERVER_ERROR") ||
		// 	error === "execution reverted" ||
		// 	error === "underflow" ||
		// 	error === "overflow" ||
		// 	error.includes("transaction failed")
		// )
		// 	console.error("SERVER ERROR:\t", err);
		// if (error.includes("CALL_EXCEPTION") || error.includes("UNPREDICTABLE_GAS_LIMIT"))
		// 	console.error("CALL_EXCEPTION:\t", "err");
		if (error === `Reason Unknown`) {
			// error = JSON.stringify(err)
			console.error(err);
		}

		if (
			error == "processing response error"
		) {
			console.error(err)
			// console.error(Object.keys(err))
		}
		// console.error(err);
		return error;
	}

	const deploy = async () => {
		Promise.resolve(fn(state.data)).then(x => {
			!!x && state.succeeded++;
			!!x && addAllowance();
			!!x || state.failed++;
			!!x || decAllowance();
			console.error("\t🚀 Entered Success");
			// console.error("\t🚀 Entered Success:", x);
			printState()
			state.data = x.vuelo;
		}, error => {
			const err = decipherError(error);
			if (err.includes("Swap")) {
				if (err.includes("+")) {
					console.error(`\t🚀 Entered Success: ${err}`);
				} else console.error("\t☔ Entered Failure:", err);
				printState();
			} else if (err.includes("UNPREDICTABLE_GAS_LIMIT") || err.includes("cannot estimate gas") || err.includes("value out-of-bounds") || err.includes("failed to get consistent fee data") || err.includes("bad response") || err.includes("could not detect network")) {
				if (err.includes("value out-of-bounds") || err.includes("failed to get consistent fee data") || err.includes("bad response") || err.includes("value out-of-bounds") || err.includes("failed to get consistent fee data") || err.includes("bad response") || err.includes("could not detect network"))
					console.error("\t☔ Entered Server Failure:", err);
				else
					console.error("\t☔ Entered Server Failure:", err);
				// printState();
			} else if (err.includes("replacement fee too low")) {
				console.error("\t☔ Entered Execution Failure:", err);
			} else if (err.includes("Insufficient balance") || err.includes("Insufficient repayment") || err.includes("Reason Unknown")) {
				// console.error("\t☔ Entered Execution Failure:", err);
				// printState()
			} /* if (err.includes("insufficient funds for intrinsic transaction cost")) {
				if (error?.reciept !== null) console.error("\t☔ Entered Alternative Failure:", error?.reciept);
				else console.error("\t☔ Entered Alternative Failure:", error);
				// printState();
			} else {
				console.error("\t☔ Entered Failure:", error);
				// console.error("\t☔ Entered Failure:", error);
				// printState();
			} */
			console.error("\t☔ Entered Failure:", err);
			// console.error("\t☔ Entered Failure:", err);
			state.failed++;
			decAllowance();
		});

		state.transactions++;
	}

	const account = () => {

		const nppt = state.profit - state.gas;
		const expenses = state.transactions * state.gas; //Note: Unlike state.succeeded in gross, state.failed is not exlpicitly used in calculating expenses, because every transaction succesful or not would inccur a gas fee, which state.transactions would account for.
		const gross = state.succeeded * state.profit;
		const net = gross - expenses;
		const aps = net / (state.runtime / 1000)
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

	if (profit > gas || true) {
		// console.log("Repetition is profitable...")
		init();

		do {
			deploy();

			next();

			await sleep(10); //Soooo this is my work computer's limit may be able to remove this on an RTX

		} while (state.profitable);
	} else console.log("Gas is higher than profit")

	const end = performance.now();

	state.runtime = end - start
	// console.log(`Runtime: ${state.runtime / 1000} seconds`)
	return account();
}

module.exports = deliver;
