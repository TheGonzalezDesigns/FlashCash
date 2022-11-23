"use strict";

const deliver = require("../baggage/deliver.js");
const board = require("../baggage/board.js");
const { utils: blockchain } = require("./../../interface.js");
const { Console } = require("console");
const { json } = require("stream/consumers");

module.exports = async function (fastify, opts) {
  fastify.post("/deploy", async function (request, reply) {
    const { send } = contract;
    const flight = request.body;
    try {
      const genOps = async () => {
        const options = {
          // gasPrice: 10000000000,
          gasPrice: 128995742777,
          // gasPrice: 189957427772,
          // gasLimit: 3000000,
          // gasLimit: "999999999999999999",
          // gasLimit: `0x${Number("9999999999999999999").toString(16)}`,
        };
        return options;
      };

      const flash = async (swaps) => {
        // console.log("Recieved swaps for deployment:", swaps);
        const options = await {};
        // const options = await genOps();
        // console.log("Generated options for deployment:", options);
        // console.log("A drop before midnight");
        const tx = await send(swaps, options);
        const receipt = await tx.wait();
        // console.log(`Confirmed Flight`);
        return await receipt;
      };
      const report = await Promise.resolve(flash(flight.swaps)).then(
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
            error = `[${err?.code}] ${err?.reason} (${err?.error?.reason}): ${err?.error?.reason}`;
          }
          error = error ? error : `Reason Unknown`;
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

          if (error.includes("Artemis"))
            console.error("Aborted:\t", JSON.stringify(flight.swaps));
          // if (error == "execution reverted") console.error("Aborted: ", err);
          if (error.includes("SERVER_ERROR"))
            console.error("Reg. error:\t", err);
          //  invalid swap amount
          // if (error.includes("invalid swap amount"))
          //   console.error("Invalid amount:\t", JSON.stringify(amounts));
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
