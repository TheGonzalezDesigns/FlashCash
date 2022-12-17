"use strict";

const deliver = require("../baggage/deliver.js");
// const board = require("../baggage/board.js");
const { initialize } = require("./../../interface.js");
// const { Console } = require("console");
// const { json } = require("stream/consumers");

module.exports = async function (fastify, opts) {
  fastify.post("/retry", async function (request, reply) {
    const contract = await initialize();
    const { send } = contract;
    // console.info("contract: ", contract);
    const flight = request.body;
    // console.info("Flight:", flight);
    try {
      const genOps = async (gasPrice, gasCost) => {
        const price = Math.round((Number(gasPrice) / 1.1) * 1e9);
        const limit = 1500000; //1.5;
        const options = {
          gasPrice: price, //< 100 ? price : 50,
          gasLimit: limit,
        };
        return options;
      };
      const dec = (n, s) => `0x${BigInt(Math.round(n * 10 ** s)).toString(16)}`;

      const flash = async (swaps, fiatCode, gas) => {
        const fiat = "0x04068da6c83afcfa0e13ba15a6696662335d5b75";
        const WETH = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";
        const DAI = "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e";
        const cost = dec(gas.cost, 18);
        const price = dec(gas.gwei, 9);
        // console.log("Cost: ", cost);
        // console.log("Recieved swaps for deployment:", swaps);
        // const options = await {};
        const options = await genOps(gas.gwei, gas.amount);
        // console.log("Generated options for deployment:", options);
        // console.log("A drop before midnight");
        const tx = await send(swaps[0], fiatCode, price, DAI, options);
        // const tx = await send();
        // console.log("TX:\t", tx);
        const receipt = await tx.wait();
        // console.log(`Confirmed Flight`);
        return await receipt;
      };
      const report = await Promise.resolve(
        flash(flight.swaps, flight.fiatCode, flight.gas)
      ).then(
        (res) => {
          // console.log("Congrats:\t", res);
          return { status: 200, response: res };
        },
        (err) => {
          let error = undefined;
          try {
            error = JSON.parse(err.error?.error?.body)?.error?.message;
          } catch (e) {
            // console.error("error: ", err);
            // error = `[${err?.code}] ${err?.reason} (${err?.error?.reason}): ${err?.error?.reason}`;
            error = err.reason;
          }
          error = error ? error : `Reason Unknown`;
          if (error == "execution reverted")
            error = `${err.code} | ${err.reason}`;
          // if (error == "processing response error")
          //   error = `Server Error: ${
          //     JSON.parse(err.error?.error?.body)?.error?.message
          //   }`;
          // throw Error(error);
          // if (error) console.log(JSON.stringify(flight));
          const swaps = [...flight.swaps]
            .map((swap) => [swap[1][0], swap[1][1]])
            .flat()
            .filter((item, index, arr) => arr.indexOf(item) === index);
          const follow = (...addresses) => {
            let address = addresses[0];
            let f = `[:> Flow of tokens: ${address} `;
            for (let i = 1; i < addresses.length; i++) {
              address = addresses[i];
              f += `=> ${address} `;
            }
            f += " <:]";
            return f;
          };

          // const amounts = [...flight.swaps].map((x) => x[1]);

          // if (error.includes("Artemis"))
          //   console.error("Aborted:\t", JSON.stringify(flight.swaps));
          // if (error == "execution reverted")
          // console.error("Aborted: ", err);
          // console.log("Error Keys: ", Object.keys(err));
          if (
            error.includes("SERVER_ERROR") ||
            error === "execution reverted" ||
            error === "underflow" ||
            error === "overflow"
          )
            console.error("SERVER ERROR:\t", err);
          // //  invalid swap amount

          // if (error.includes("processing response "))
          //   console.error("Process Error:\t", err);
          if (error.includes("transaction failed"))
            console.error("Transaction Failiure:\t", err);
          // else console.error("Reg. error:\t", err);
          // // if (error.includes("invalid swap amount"))
          // //   console.error("Invalid amount:\t", JSON.stringify(amounts));
          // if (error.toLowerCase().includes("transfer"))
          //   console.log(flight.swaps);

          return {
            status: 500,
            error: error,
            // swaps: swaps,
            trail: follow(...swaps),
          };
        }
      );
      // console.log("Report finished");

      return report;
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
