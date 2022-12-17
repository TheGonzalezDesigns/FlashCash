// const getSwapParameters = require("@kyberswap/aggregator-sdk").default;
const express = require("express");
const axios = require("axios");
const app = express();
const ABI = require(`${process.cwd()}/../contract.json`);
const swapper = ABI.address;

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
  } catch (e) {
    console.log(`❌ BigInt Conversion Error: ${amountIn}\n`, e);
  }

  const params = {
    tokenIn,
    tokenOut,
    amountIn,
    to,
  };
  // console.log("params: ", params);
  let response = {};

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
    res.send({});
    // console.error("Kyberswap fail: ", e.response);
  }

  let status = response?.status;
  let callData = response?.data?.encodedSwapData;
  // console.log("Response Status: ", { status: status, data: response });

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
    const profit = amountOutUsd - (amountInUsd + gasUsd);
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

    let finalRes = {};
    finalRes.data = callData;
    finalRes.stats = stats;

    console.info("finalRes", finalRes);
    res.send(finalRes);
  } else res.send({});
});

const PORT = 4444;
const wave = () => console.log("\t🔌_.:KYBERSWAP TERMINAL READY:._");
app.listen(PORT, () => {
  console.log(`\n\t🔌[KyberSwap@port:${PORT}]\n`);
  wave();
  setInterval(wave, 1800000);
});
