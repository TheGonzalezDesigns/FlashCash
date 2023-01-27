const deliver = require("../baggage/deliver.js");
const { initialize } = require("../../interface.js");

module.exports = async function (fastify, opts) {
  fastify.post("/repeat", async function (request, reply) {
    const contract = await initialize();
    const { send } = contract;
    const flight = request.body;
    const decentral = async (service, payload) => {
      fetch("http://localhost:9999/centralbank/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service, payload }),
      })
    }
    const getGasBalance = async () => {
      const { feedback: balance } = await decentral("getBalance", {});
      return balance
    }
    const getGasLimit = (vuelo) => Math.round(vuelo.gas.balance / vuelo.gas.cycles);
    const getGasLimiter = async (vuelo) => {
      const gasCost = Math.round(vuelo.gas.gasAmount * 1e18)
      const gasLimiter = Math.round(vuelo.gas.limit / gasCost);
      return gasLimiter;
    }
    const despegar = async (vuelo) => (await send(
      vuelo.tokenIn,
      vuelo.tokenOut,
      vuelo.loanAmount,
      vuelo.swaps[0],
      vuelo.swaps[1],
      {
        gasPrice: vuelo.gas.gwei,
      }
    )).wait()
    const prime = async (vuelo) => {
      vuelo.gas.cycles = 3;
      vuelo.gas.balance = await getGasBalance();
      vuelo.gas.limit = getGasLimit(vuelo); // actual gas reference in wei
      vuelo.gas.limiter = getGasLimiter(vuelo); //whole number aka cycles to be passed
      return vuelo;
    }
    const refuel = async (vuelo) => {
      const response = await decentral("refuel", { tokenIn: vuelo.tokenOut })
      if (response.error !== undefined) throw Error("Failed to refuel");
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
        await refuel();
        return await prime(vuelo);
      }
    }
    const execute = async (vuelo) => {
      await despegar(vuelo);
      vuelo.gas.limiter--;
      return await rebalance(vuelo)
    }
    flight = await prime(flight)
    const profit = flight.profit;
    const gas = flight.gas.cost;
    await deliver(profit, gas, execute, flight);
    return 0
  });
};
//const deliver = async (profit, gas, fn, ...data) => {


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