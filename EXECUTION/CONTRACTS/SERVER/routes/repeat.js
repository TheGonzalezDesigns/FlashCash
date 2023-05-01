const deliver = require("../baggage/deliver.js");

const { execute: send } = require("../../interface.js");

module.exports = async function (fastify, opts) {
  fastify.post("/repeat", async function (request, reply) {
    let flight = request.body;
    const decentral = async (service, payload) => {
      const { feedback, error } = await (await fetch("http://localhost:9999/centralbank/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          keepalive: true
        },
        body: JSON.stringify({ service, payload }),
      })).json();
      return !!error ? error : feedback;
    }
    const getGasBalance = async () => decentral("getBalance", {});
    const getGasPrice = async () => decentral("getGasPrice", {});
    const getGasLimit = (vuelo) => Math.round(vuelo.gas.balance / vuelo.gas.cycles);
    const getGasLimiter = (vuelo) => {
      const gasRate = vuelo.gas.gwei;
      const gasCost = Math.round(vuelo.gas.amount * gasRate * 1e9)
      const gasLimiter = Math.round(vuelo.gas.limit / gasCost);
      // console.info(`\t${vuelo.gas.amount} * ${gasRate}\n\t=>\n\t${vuelo.gas.amount * gasRate} * 1e9\n\t=> Math.round(${vuelo.gas.amount * gasRate * 1e9})\n\t=> ${vuelo.gas.limit}/${gasCost}\n\t=> Math.round(${vuelo.gas.limit / gasCost})\n\t=> ${gasLimiter}`)
      return gasLimiter;
    }
    const despegar = async (vuelo) => {
      const limit = 1
      let loanAmount = `${Math.round(vuelo.loanAmount * limit)}`
      // loanAmount = '0xc243.bffffffff8'
      // console.info("LoanAmount: ", loanAmount);
      // console.info(`${vuelo.loanAmount} * ${limit} = ${loanAmount}`,);
      return (await send(
        vuelo.tokenIn,
        vuelo.tokenOut,
        loanAmount,
        vuelo.swaps,
        // Number(`${vuelo.gas.gwei}e9`),
        // "0x1e8FDd6a65b54954522DcDF3a2B92A4F84235C03",
        {
          gasPrice: Number(`${vuelo.gas.gwei}e9`),
          // gasPrice: Number(`${100}e9`),
          // gasLimit: `0x989680`
        }
      ))
    }/* .wait() */

    // const despegar = async (vuelo) => (await send(
    //   0,
    //   1,
    //   "0x27E611FD27b276ACbd5Ffd632E5eAEBEC9761E40",
    //   `0x${(10).toString(16)}`,
    //   "true",
    //   {
    //     gasPrice: Number(`${vuelo.gas.gwei}e9`),
    //   }
    // ))/* .wait() */

    // const despegar = async (vuelo) => (await send(
    //   "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    //   `0x${(1e23).toString(16)}`,
    //   "0x9c29247a73Fe3bB6ebe34285646b458906B575D7",
    //   {
    //     gasPrice: Number(`${vuelo.gas.gwei}e9`),
    //   }
    // ))/* .wait() */



    // const despegar = async (vuelo) => (await send(
    //   true,
    //   0,
    //   1,
    //   `0x${(1e18).toString(16)}`,
    //   "0x27E611FD27b276ACbd5Ffd632E5eAEBEC9761E40",
    //   "0x9c29247a73Fe3bB6ebe34285646b458906B575D7",
    //   {
    //     gasPrice: Number(`${vuelo.gas.gwei}e9`),
    //   }
    // ))/* .wait() */

    // send(
    //   bool flag,
    //   int128 i,
    //   int128 j,
    //   uint256 amount,
    //   address pool,
    //   address kPool
    // )



    // const despegar = async (vuelo) => (await send(
    //   "0x9c29247a73Fe3bB6ebe34285646b458906B575D7",
    //   `0x${(4e9).toString(16)}`,
    //   "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    //   {
    //     gasPrice: Number(`${vuelo.gas.gwei}e9`),
    //   }
    // ))/* .wait() */

    const prime = async (vuelo) => {
      // vuelo.gas.cycles = 3;
      // vuelo.gas.balance = await getGasBalance();
      // vuelo.gas.limit = getGasLimit(vuelo); // actual gas reference in wei
      // vuelo.gas.limiter = getGasLimiter(vuelo); //whole number aka cycles to be passed
      // vuelo.gas.ftmCost = vuelo.gas.amount * 1e18
      // vuelo.gas.ftmCostRounded = Math.round(vuelo.gas.amount * 1e18)
      return vuelo;
    }
    const refuel = async (vuelo) => {
      const response = await decentral("refuel", { tokenIn: vuelo.tokenOut })
      if (response.error !== undefined) throw "Failed to refuel"
    }
    const reachedGasLimit = async (vuelo) => {
      const newBalance = await getGasBalance();
      const oldBalance = vuelo.gas.balance;
      const gasUsed = oldBalance - newBalance;
      const gasUsageLimit = vuelo.gas.limit
      return gasUsed >= gasUsageLimit;
    }
    const reachedLimiter = async (vuelo) => vuelo.gas.limiter <= 0;
    const reachedLimit = async (vuelo) => {
      if (reachedLimiter(vuelo)) {
        return await reachedGasLimit(vuelo);
      }
      return false;
    }
    const rebalance = async (vuelo) => {
      const atLimit = await reachedLimit(vuelo);
      if (atLimit) {
        await refuel(vuelo);
        return await prime(vuelo);
      }
    }
    const extractStats = (vuelo) => {
      let stats = {}
      stats.gas = {}
      stats.gas = vuelo.gas;
      return stats;
    }
    const applyStats = (vuelo, stats) => {
      vuelo.gas.cycles = stats.gas.cycles;
      vuelo.gas.balance = stats.gas.balance;
      vuelo.gas.limit = stats.gas.limit;
      vuelo.gas.limiter = stats.gas.limiter;
      vuelo.grossProfit = 0.00032471064526855276;
      vuelo.gas.cost = 0.0001155639245328;
      return vuelo;
    }
    const buildQuote = async (vuelo) => {
      const body = JSON.stringify(vuelo.params);
      const ops = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          keepalive: true
        },
        body
      }
      const url = 'http://localhost:4444/buildQuote';
      const res = await fetch(url, ops);
      const finalRes = await res.json();
      // console.log("BQ: ", finalRes)
      const { quote, error } = finalRes;
      if (!!error) {
        throw `\t⚠  Rebuild: ${error}`;
      }
      // console.info("\t🔨 Succesfully rebuilt quote")
      return quote;
    }
    const volver = async (vuelo) => {
      const newFlight = await buildQuote(vuelo);
      // console.log("volver: ", newFlight)
      const stats = extractStats(vuelo);
      const finalFlight = applyStats(newFlight, stats);
      return finalFlight;
    }
    const execute = async (vuelo) => {
      // console.log("Executing...")
      try {
        vuelo = await volver(vuelo);
        const receipt = await despegar(vuelo);
        // vuelo.gas.limiter--;
        // const newFlight = await rebalance(vuelo)
        const data = {
          receipt,
          vuelo: vuelo//newFlight
        }
        return data
      } catch (e) { throw e; }
    }
    try {
      flight = await prime(flight)
      // console.log("Finish Priming...")
      const profit = 0.00032471064526855276//flight.grossProfit;
      const gas = 0.0001155639245328; //flight.gas.cost;
      deliver(profit, gas, execute, flight);
    } catch (e) {
      console.log("repeat err: ", e)
    }
    return 0
  });
};


/* const rebalance = async (vuelo, gasLimitUSD, liquidateLimitUSD) => {
      // const userBalanceUSD = await getBalanceUSD(vuelo);
      // if (userBalanceUSD >= (liquidateLimitUSD + gasLimitUSD)) stabalizeAssets(liquidateLimitUSD);
      // else if (userBalanceUSD <= gasLimitUSD && userBalanceUSD >= 50) await refuel(vuelo);
      // vuelo = await prime(vuelo);


      if (vuelo.gas.balanceUSD <= 1000) {
        if (vuelo.gas.balanceUSD > 50) {
          await refuel();
          return await prime(vuelo);
        }
      }

      // if (GasBalance <= $1k) {
      //   if (Math.round(totalUSD) >= $50) swapAllToGas()
      // } else if (Math.round(totalUSD) >= $2k) transfer()
      // else do nothing()
    } */