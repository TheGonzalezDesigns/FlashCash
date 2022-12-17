const getSwapParameters = require("@kyberswap/aggregator-sdk").default;
const express = require("express");
const axios = require("axios");
const app = express();
const ABI = require(`${process.cwd()}/../contract.json`);
const swapper = ABI.address;
const { permit } = require("../interface.js");
app.use(express.json());
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.log("\t❌ Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

const getPermit = (srcToken, kyberswapper, value) => {
  // import permit utility from contracts/scripts/deploy
  const permit = "0x";
  return permit;
};

const modify = async (data) => {
  const round = (n) => {
    const g = n + "";
    let r = g;
    if (!g.includes("+")) r = `${g}`.replace(/(?=\.).+/g, "");
    const y = Number(r) + "";
    // console.log(`${n} => ${r} => ${y}`)
    return y;
  };

  const numberfy = (n) => `0x${BigInt(Math.round(round(n))).toString(16)}`;
  // console.log("Unmodieified/: ", data);
  // let orignal = [...data.args];
  // console.log("Original", orignal);
  let modified = [...data.args];
  const SwapDescription = modified[1];
  const clientData = // eventually we might want to randamize this signature to prevent tracking
    "0x7b22536f75726365223a226b7962657273776170222c2244617461223a227b5c22736f757263655c223a5c226b79626572737761705c227d222c22416d6f756e74496e555344223a22302e393939393337222c22416d6f756e744f7574555344223a22302e39393933333739363435363330383137222c22526566657272616c223a22222c22496e74656772697479496e666f223a6e756c6c7d";
  modified[1][3] = [...SwapDescription[3]].map((n) => numberfy(n)); //this might be failing if n is too long/too big
  // console.log("SwapDescription[3]:", SwapDescription[3]);
  // console.log("modified[1][3]:", modified[1][3]);
  modified[1][5] = numberfy(SwapDescription[5]);
  // console.log("modified[1][5]:", modified[1][5]);
  const swapType = SwapDescription[7];
  const SIMPLE = 0x20;
  const whitelisted =
    ((SIMPLE & swapType) != 0 || true) && (modified[2].length < 7170 || true); //remove true
  const _SHOULD_CLAIM = 0x04;

  const srcToken = modified[1][0];
  const kyberswapper = `0x617Dee16B86534a5d792A4d7A62FB491B544111E`; //this address is valid cross-chain : (https://blockscan.com/address/0x617Dee16B86534a5d792A4d7A62FB491B544111E)
  // const value = modified[1][5];
  // try {
  //   modified[1][8] = await permit(srcToken, kyberswapper);
  // } catch (e) {
  //   console.error("permit err: ", e);
  // }
  // console.log("SwapDescription[5]:", SwapDescription[5]);
  // console.log("modified[1][5]:", modified[1][5]);
  modified.push(clientData);
  // modified[0] = "0x93131EFeE501d5721737C32576238F619548edda";
  // console.log("Modified[0]", modified[0]);
  console.info("Call Data: ", modified);
  return whitelisted ? modified : {};
};
//0x617Dee16B86534a5d792A4d7A62FB491B544111E
//0x20dd72ed959b6147912c2e529f0a0c651c33c9ce8e82e904dd9cb298d324c2c27929ca473d3e9bb00001
//0x20dd72ed959b6147912c2e529f0a0c651c33c9ce6feb4c8aaa24838a30feb3ffbc561957ff886a86000100000
const handleApiResponse = async ({
  data,
  chainId,
  tokenIn,
  tokenOut,
  recipient,
  slippage,
  deadline,
}) => {
  const { tokens, inputAmount, swaps } = data;
  //console.log("handleApiResponse: ", data);
  //console.log("Swaps: ", swaps);
  let minOut;
  try {
    minOut = Math.floor(swaps[0][0].amountOut / (1 + Number(slippage) * 0.01));
  } catch (e) {
    // console.log(`Couldn't compute ${slippage} with ${JSON.stringify(data)}`);
    throw Error(e);
  }
  //const dIn = tokens[tokenIn].decimals)
  //console.log(`Token In / [${tokenIn}]: `, tokens[tokenIn])
  //console.log(`Token Out / [${tokenOut}]: `, tokens[tokenOut.toLowerCase])
  //console.log("Token Out:", tokens[tokenOut].decimals)
  //console.log("Tokens:", tokens)
  const swapParameters = await getSwapParameters({
    chainId: chainId,
    currencyInAddress: tokenIn,
    currencyInDecimals: tokens[tokenIn.toLowerCase()].decimals,
    amountIn: inputAmount,
    currencyOutAddress: tokenOut,
    currencyOutDecimals: tokens[tokenOut.toLowerCase()].decimals,
    tradeConfig: {
      minAmountOut: minOut,
      recipient: recipient,
      deadline: deadline, // = Date.now() + 20 * 60 * 1000
    },
    feeConfig: {
      isInBps: true,
      feeAmount: "8", // 0.08%
      feeReceiver: `0x93131EFeE501d5721737C32576238F619548edda`, //0xfA9dA51631268A30Ec3DDd1CcBf46c65FAD99251
      // chargeFeeBy: "currency_in",
    },
    customTradeRoute: JSON.stringify(swaps),
  });
  // console.log("Rec: ", recipient);
  return swapParameters;
};
app.get("/api", async (req, res) => {
  let { chain, chainId, tokenIn, tokenOut, amountIn } = req.query;
  const recipient = swapper;
  const to = recipient;
  const slippage = 2;
  const deadline = "fffffffffffffffff";
  try {
    amountIn = `${BigInt(amountIn)}`;
    // console.log(`adaboop: ${amountIn}`);
  } catch (e) {
    console.log(`❌ BigInt Conversion Error: ${amountIn}\n`, e);
  }
  // console.log(`adaboop: ${amountIn} / ${BigInt(Number(amountIn))}`);
  // amountIn = BigInt(Number(amountIn));
  //recipient = '0x202675F7bDD7ED0Aed1214d4375BcA75530B011F';
  // console.log("API: ", req.query);
  const params = {
    tokenIn,
    tokenOut,
    amountIn,
    to,
  };
  // console.log("params: ", params);
  let response = {};
  let callData = {};

  try {
    console.error("params: ", params);
    if (tokenIn.toLowerCase() != tokenOut.toLowerCase()) {
      response = await axios.get(
        `https://aggregator-api.kyberswap.com/${chain}/route/encode`,
        { params }
      );
      console.error("Route Data: ", response);
    }
  } catch (e) {
    // console.error("Kyberswap fail: ", e.response);
    //console.error(`\n[>>> No valid swap available for ${tokenIn} => ${tokenOut} <<<]\n`)
  }

  let status = response?.status;
  // console.log("Response Status: ", { status: status, data: response });
  let failed = false;

  if (status - 200 == 0) {
    // console.log("response.data: ", response.data); // <<---
    const data = response.data;
    const amountIn = data.inputAmount;
    const amountOut = data.outputAmount;
    const amountInUsd = data.amountInUsd;
    const amountOutUsd = data.amountOutUsd;
    const receivedUsd = data.receivedUsd;
    const gasUsd = data.gasUsd;
    const gwei = data.gasPriceGwei;
    const totalGas = data.totalGas;

    // const avgReturn = (amountOutUsd + receivedUsd) / 2;
    // const ROR = (1 - (amountInUsd - receivedUsd) / amountInUsd - 1) * 100;
    const profit = amountOutUsd - amountInUsd; /* + gasUsd */
    const profitability = (profit / amountInUsd) * 100;
    const profitable = profit > 0;

    const crypto = {
      amountIn: amountIn,
      amountOut: amountOut,
    };
    const gas = {
      gasUsd: gasUsd,
      gwei: gwei,
      totalGas: totalGas,
    };

    const stats = {
      amountIn: amountInUsd,
      amountOut: amountOutUsd,
      recieved: receivedUsd,
      profitability: profitability,
      profiitable: profitable,
      profit: profit,
      crypto: crypto,
      gas: gas,
    };

    // if (stats.profitability === Infinity) console.log("Infinte Warning!");
    // else console.log("good", stats.profitability);
    if (stats.profitability !== Infinity && profitable) {
      //console.log("PROFITABLE: ", profitable);
      //console.log("Profiting...");
      try {
        callData = await handleApiResponse({
          data: response.data,
          chainId,
          tokenIn,
          tokenOut,
          recipient,
          slippage,
          deadline,
        });
        try {
          //console.log("Trying...");
          let finalRes = {};
          finalRes.data = await modify(callData);
          finalRes.stats = stats;
          //console.log("finalRes: ", finalRes)
          if (Object.keys(finalRes).length > 0) {
            //console.log("Modified...");
            const estProfit = stats.average - stats.amountIn;
            if (estProfit >= 0.005 || true) {
              //console.clear()
              /*console.warn(
                `[>>> Profitability /${tokenIn}/${tokenOut}/: ${ROR}% | +$${
                  stats.average - stats.amountIn
                } <<<]`
              );*/
              // console.info(finalRes);
              res.send(finalRes);
            } else failed = true;
          } else failed = true;
          //else console.error(`\n[>>> No supported swap available for ${tokenIn} => ${tokenOut} <<<]\n`)
        } catch (e) {
          failed = true;
          console.error(e);
          // console.error(`\n[>>> No supported swap available for ${tokenIn} => ${tokenOut} <<<]\n`)
        }
      } catch (error) {
        // console.error(error);
        //console.error(`\n[>>> No swap available for ${tokenIn} => ${tokenOut} <<<]\n`)
        //console.error("Reason", error)
        failed = true;
      }
    } else {
      // console.error(
      //   `\n[>>> No profitable swap available for ${tokenIn} => ${tokenOut} <<<]\n`
      // );
      //console.error(`\n[>>> Stats for ${tokenIn} => ${tokenOut} ::: `, stats)
      failed = true;
    }
  } else {
    // console.error("Kyberswap fail: ", response);
    failed = true;
  }
  if (failed) res.send({});
});

const PORT = 4444;
const wave = () => console.log("\t🔌_.:KYBERSWAP TERMINAL READY:._");
app.listen(PORT, () => {
  console.log(`\n\t🔌[KyberSwap@port:${PORT}]\n`);
  wave();
  setInterval(wave, 1800000);
});
