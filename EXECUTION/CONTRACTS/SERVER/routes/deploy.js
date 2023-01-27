"use strict";

const deliver = require("../baggage/deliver.js");
// const board = require("../baggage/board.js");
const { initialize } = require("./../../interface.js");

const repeat = async (flight) => {
  const path = "repeat";
  const ops = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flight),
  };
  return await fetch(`http://localhost:3000/${path}`, ops);
};

module.exports = async function (fastify, opts) {
  fastify.post("/deploy", async function (request, reply) {
    const contract = await initialize();
    const { send } = contract;
    // console.info("contract: ", contract);
    const flight = request.body;
    try {
      // console.info("Flight 🛪:", flight);
      const genOps = async (gasPrice, gasCost) => {
        const price = (Number(gasPrice) * 1e9);
        const limit = `0x${BigInt(12500000).toString(16)}`;
        const options = {
          gasPrice: price,
          // gasLimit: limit,
        };
        return options;
      };
      const dec = (n, s) => `0x${BigInt(Math.round(n * 10 ** s)).toString(16)}`;

      const flash = async (swaps, fiatCode, gas, multiplier) => {
        const DAI = "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e";
        const cost = dec(gas.cost, 18);
        const price = dec(gas.gwei, 9);
        const options = await genOps(gas.gwei, gas.amount);
        const payment = DAI;
        const tokenIn = flight.tokenIn;
        const tokenOut = flight.tokens[0][1];
        const loanAmount = flight.loanAmount;
        const intro = flight.swaps[0];
        const outro = flight.swaps[1];
        const account = "0x1e053796d7931e624bd74c2cb4e4990bdcd8434a";
        false && console.warn(`const tx = await send(
          ${payment},
          ${tokenIn},
          ${tokenOut},
          ${account},
          ${loanAmount},
          ${price},
          ${intro},
          ${outro}
          options
        );`)
        // throw Error("Testing")
        // console.log("\t📧 Sending Transaction to blockchain...");
        const start = performance.now();
        const tx = await send(
          tokenIn,
          tokenOut,
          loanAmount,
          intro,
          outro,
          options
        );
        console.log("\t📪 Transaction sent to blockchain...");
        const receipt = await tx.wait();
        const end = performance.now();
        const runtime = end - start;
        console.log(`\t📬  Blockchain responded after ${runtime / 1000}s...`)
        return await receipt;
      };
      const report = async call => await Promise.resolve(
        call
      ).then(
        (res) => {
          return { status: 200, response: res };
        },
        (err) => {
          let error = undefined;
          try {
            error = JSON.parse(err.error?.error?.body)?.error?.message;
          } catch (e) {
            error = err.reason;
          }
          error = error ? error : `Reason Unknown`;
          if (error == "execution reverted")
            error = `${err.code} | ${err.reason}`;

          if (
            error.includes("SERVER_ERROR") ||
            error === "execution reverted" ||
            error === "underflow" ||
            error === "overflow"
          )
            console.error("SERVER ERROR:\t", err);
          if (error.includes("CALL_EXCEPTION") || error.includes("UNPREDICTABLE_GAS_LIMIT"))
            console.error("CALL_EXCEPTION:\t", err);
          if (error === `Reason Unknown`) {
            error = err
          }

          const errorReport = {
            status: 500,
            error: error,
          };
          return errorReport;
        }
      );
      let response = JSON.parse(JSON.stringify(flight));
      delete response.swaps
      let M = 1;
      let res
      for (let x = 0; x < M; x++) {

        res = await report(flash(flight.swaps, flight.fiatCode, flight.gas, x));

        let { status, error } = res;

        if (status !== 200) response.error = error;
        else {
          response.multiplier = x;
          console.log(`${status === 200 ? `🚀` : `☔`} M-${x} Response: `, response);
          await repeat(flight);
        }
      }

      return "report";
    } catch (e) {
      console.error(
        "****************DELIVERY**HAS***FAILED*********************"
      );
      console.error("*", e);
      console.error(
        "****************DELIVERY**HAS***FAILED*********************"
      );

      return { status: 500, error: e };
    }
  });
};
