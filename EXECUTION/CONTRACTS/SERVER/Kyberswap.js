const kyberuris = require("@kyberswap/aggregator-sdk").routerUri;
const express = require("express");
const axios = require("axios");
const { response } = require("express");
const app = express();
const ABI = require(`${process.cwd()}/../contract.json`);
const swapper = ABI.address;
const { RateLimiter } = require("limiter");
const Bottleneck = require("bottleneck");
const { Agent } = require("https");

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

// console.log("httpsAgent: ", httpsAgent);

const getRouter = (chain) => `${kyberuris[chain]}/encode`;

// console.log("getRouter: ", getRouter(250));

var state = {
  limited: false,
  available: {
    paraswap: true,
    kyberswap: true,
    zeroswap: true,
  },
};

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

app.get("/state-limit", async (req, res) => {
  res.send(state.limited);
  return 0;
});

app.post("/state-limit", async (req, res) => {
  const { limit } = req.query;
  // console.info("->> /state-limit: ", limit);
  state.limited = limit;
  res.send(state.limited);
  return 0;
});

app.get("/Kyberswap", async (req, res) => {
  // console.info("🔮");
  let { chain, tokenIn, tokenOut, amountIn } = req.query;
  const recipient = swapper;
  const to = recipient;
  const deadline = "0xffffffff";

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
    deadline,
  };
  // console.log("params: ", params);
  let response = {};

  let original;
  try {
    // console.error("params: ", params);
    if (tokenIn.toLowerCase() != tokenOut.toLowerCase()) {
      response = await axios.get(
        `https://aggregator-api.kyberswap.com/${chain}/route/encode`,
        { params }
      );
      // original = JSON.stringify(response);
      // console.error("Route Data: ", response);
    }
  } catch (e) {
    if (e?.response?.status == 429) {
      console.error("\t⛔ Kyberswap Limit Reached");
      res.send({ error: "kyberswap-LMT", status: true });
      return 0;
    } /* else console.error("Kyber Error: ", e); */
    res.send({ error: "kyberswap-NULL" });
    return 0;
    // console.error("Kyberswap fail: ", e.response);
  }

  let status = response?.status;
  let callData = response?.data?.encodedSwapData;
  let routerAddress = response?.data?.routerAddress;

  // console.log("Response Status: ", { status: status, data: response });

  if (status - 200 == 0) {
    // console.log("response.data: ", response.data); // <<---
    // console.log("response.data: ", response.data.tokens); // <<---

    let tokens = response.data.tokens;

    tokens = Object.keys(tokens).map((t) => tokens[t]);

    // console.log("tokens: ", tokens);

    tokens.forEach((x) => (x.address = x.address.toLowerCase()));

    // console.log("tokens: ", tokens);

    let copy = tokens;

    tokens = {};

    // console.log("tokens: ", tokens);

    copy.forEach((x) => (tokens[x.address] = x));

    // console.log("tokens: ", tokens);

    const tokenIndex = Object.keys(tokens);
    let tokenF;
    let tokenL;
    try {
      tokenF = tokens[tokenIn.toLowerCase()].name;
      tokenL = tokens[tokenOut.toLowerCase()].name;
    } catch (e) {
      console.error(e);
      console.error(tokenIndex);
      console.error({ tin: tokenIn, tout: tokenOut });

      res.send({ error: "kyberswap-NULL" });
      return 0;
    }
    // console.log("token index: ", tokenIndex); // <<---
    // console.log("tokenF: ", tokenF); // <<---
    // console.log("tokenL: ", tokenL); // <<---

    const data = response.data;
    const amountIn = data.inputAmount;
    const amountOut = data.outputAmount;
    const amountInUsd = data.amountInUsd;
    const amountOutUsd = data.amountOutUsd;
    const receivedUsd = data.receivedUsd;
    const gasUsd = data.gasUsd;
    const gwei = data.gasPriceGwei;
    const totalGas = data.totalGas;
    const netOutput = amountOutUsd - gasUsd;

    // const avgReturn = (amountOutUsd + receivedUsd) / 2;
    // const ROR = (1 - (amountInUsd - receivedUsd) / amountInUsd - 1) * 100;
    const profit = amountOutUsd - (amountInUsd + gasUsd);
    const profitability = (profit / amountInUsd) * 100;
    const profitable = profit > 0;
    // 10  - (11 + 2) = 10 - 13 = -3
    // (10 - 2) - 11) = 8 - 11 = -3
    // -2 + (10 - 11) = -2 + -1 = -3
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
      netOutput: netOutput,
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
    finalRes.tokenIn = tokenF;
    finalRes.tokenOut = tokenL;
    finalRes.tokenInAddress = tokenIn;
    finalRes.tokenOutAddress = tokenOut;

    finalRes.provider = "🔮 Kyberswap";
    finalRes.providerID = 0;
    finalRes.routerAddress = routerAddress;
    // console.log("routerAddress: ", routerAddress);
    finalRes.original = original;

    // if (profitability <= -0.5) {
    //   res.send({ error: "kyberswap-UNP" });
    //   return 0;
    // }
    // finalRes.tokens = tokens;
    // finalRes.tokenIndex = tokenIndex;
    // finalRes.params = params;

    // console.info("finalRes", finalRes);
    res.send({ data: finalRes });
    return 0;
  } else {
    // console.error("Second level");
    res.send({ error: "kyberswap-NULL" });
    return 0;
  } /* else res.send({ status: status }); */
});
app.get("/Paraswap", async (req, res) => {
  // console.info("⛱");
  let { network, srcToken, destToken, amount } = req.query;
  const recipient = swapper;
  const to = recipient;
  const deadline = "0xffffffff";

  try {
    amount = `${BigInt(amount)}`;
  } catch (e) {
    console.log(`❌ BigInt Conversion Error: ${amount}\n`, e);
  }

  let params = {
    network,
    srcToken,
    destToken,
    amount,
  };
  let response = {};

  try {
    // console.error("params: ", params);
    if (srcToken.toLowerCase() != destToken.toLowerCase()) {
      response = await axios.get(`https://apiv5.paraswap.io/prices?`, {
        params,
      });

      // console.error("Paraswap Quoting Success: ", response?.status);

      // console.error(
      //   "Paraswap Quoting Success: ",
      //   response?.status,
      //   response.data
      // );
    }
  } catch (e) {
    if (e?.response?.status == 429) {
      console.error("\t⛔ Paraswap Limit Reached");
      res.send({ error: "paraswap-LMT", status: true });
      return 0;
    }
    // console.error("Paraswap Quoting failure: ", e);
    // console.error("Paraswap Quoting failure: ", e.response.status, e.response);

    res.send({ error: "Paraswap-NULL" });
    return 0;
  }
  let status = response?.status;
  // console.log("Response Status: ", { status: status, data: callData });

  // response = response.data.priceRoute;
  // console.info("Route Data: ", callData);
  // res.send(callData);
  // return 0;

  if (status - 200 == 0) {
    let data = response?.data;
    const userAddress = recipient;
    const slippage = 10;
    const ignoreChecks = true;
    const onlyParams = false;
    params = {
      srcToken,
      destToken,
      amount,
      userAddress,
      slippage,
      ignoreChecks,
      onlyParams,
    };
    try {
      response = await fetch(
        `https://apiv5.paraswap.io/transactions/${network}?srcToken=${srcToken}&destToken=${destToken}&srcAmount=${amount}&userAddress=${userAddress}&slippage=${slippage}&ignoreChecks=${ignoreChecks}&onlyParams=${onlyParams}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      // console.error("Paraswap Encoding Success: ", response?.status);
      response = await response.json();
      // console.info("Response: ", response);
    } catch (e) {
      // console.error("First level");
      // console.error("Paraswap Encoding failure: ", e?.status);

      res.send({ error: "Paraswap-NULL" });
      return 0;
    }
    data = data.priceRoute;
    // console.info({ data: data, response: response });
    const amountIn = data.srcAmount;
    const amountOut = data.destAmount;
    const amountInUsd = Number(data.srcUSD);
    const amountOutUsd = Number(data.destUSD);
    const gasUsd = Number(data.gasCostUSD);
    const gwei = Math.round(Number(response.gasPrice) * 1e-9);
    const totalGas = data.gasCost;
    const netOutput = amountOutUsd - gasUsd;
    const profit = amountOutUsd - (amountInUsd + gasUsd);
    const profitability = (profit / amountInUsd) * 100;
    const profitable = profit > 0;
    // Math.round(Number('22200000000') * 1e-9)
    // "gas": {
    //         "gasUsd": 0.0019725733999999997,
    //         "gwei": "40",
    //         "totalGas": 245000
    //     }
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
      netOutput: netOutput,
      profitability: profitability,
      profiitable: profitable,
      profit: profit,
      crypto: crypto,
      gas: gas,
    };

    let finalRes = {};
    finalRes.data = response?.data;
    finalRes.stats = stats;
    finalRes.tokenIn = srcToken;
    finalRes.tokenOut = destToken;
    finalRes.tokenInAddress = srcToken;
    finalRes.tokenOutAddress = destToken;
    finalRes.provider = "⛱ Paraswap";
    finalRes.providerID = 2;

    // if (profitability <= 0) {
    //   res.send({ error: "paraswap-UNP" });
    //   return 0;
    // }

    res.send({ data: finalRes, status: false, tag: "PARA" });
    return 0;
  } else {
    // console.error("Second level");
    res.send({ status: status, error: "Paraswap-NULL" });
    return 0;
  }
});

app.get("/Zeroswap", async (req, res) => {
  // console.info("0x");
  let { chain, tokenIn, tokenOut, amountIn } = req.query;
  const recipient = swapper;
  const to = recipient;
  const deadline = "0xffffffff";

  try {
    amountIn = `${BigInt(amountIn)}`;
  } catch (e) {
    console.log(`❌ BigInt Conversion Error: ${amountIn}\n`, e);
  }

  const params = {
    sellToken: tokenIn,
    buyToken: tokenOut,
    sellAmount: amountIn,
  };
  // console.log("params: ", params);
  let response = {};

  try {
    // console.error("params: ", params);
    if (tokenIn.toLowerCase() != tokenOut.toLowerCase()) {
      response = await axios.get(`https://${chain}.api.0x.org/swap/v1/quote`, {
        params,
      });
      // console.error("Route Data: ", response);
    }
  } catch (e) {
    // console.error(e);
    if (e?.response?.status == 429) {
      console.error("\t⛔ Zeroswap Limit Reached");
      res.send({ error: "Zeroswap-LMT", status: true });
      return 0;
    }
    res.send({ error: "Zeroswap-NULL" });
    return 0;
    // console.error("Kyberswap fail: ", e.response);
  }

  let status = response?.status;
  let callData = response?.data?.data;
  // console.log("Response Status: ", { status: status, data: response });

  if (status - 200 == 0) {
    const data = response.data;
    const amountIn = data.sellAmount;
    const amountOut = data.buyAmount;
    const gwei = Number(data.gasPrice) * 1e-9;
    const totalGas = data.gas;
    const gasUsd = 0;

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
      crypto: crypto,
      gas: gas,
    };

    let finalRes = {};
    finalRes.data = callData;
    finalRes.stats = stats;
    finalRes.tokenInAddress = tokenIn;
    finalRes.tokenOutAddress = tokenOut;

    finalRes.provider = "🪢 Zeroswap";
    finalRes.providerID = 1;

    res.send({ data: finalRes });
    return 0;
  } else {
    // console.error("Second level");
    res.send({ error: "zeroswap-NULL" });
    return 0;
  } /* else res.send({ status: status }); */
});

app.get("/openocean", async (req, res) => {
  // console.info("🏖");
  let { chain, tokenIn, tokenOut, amountIn } = req.query;
  const recipient = swapper;
  const to = recipient;
  const deadline = "0xffffffff";
  const slippage = 1;
  const gasPrice = 50;

  try {
    amountIn = `${BigInt(amountIn)}`;
  } catch (e) {
    console.log(`❌ BigInt Conversion Error: ${amountIn}\n`, e);
  }

  const params = {
    inTokenAddress: tokenIn,
    outTokenAddress: tokenOut,
    amount: amountIn,
    slippage: slippage,
    gasPrice: gasPrice,
    account: to,
  };
  // console.log("params: ", params);
  let response = {};

  try {
    // console.error("params: ", params);
    if (tokenIn.toLowerCase() != tokenOut.toLowerCase()) {
      response = await axios.get(
        `https://open-api.openocean.finance/v3/${chain}/swap_quote`,
        {
          params,
        }
      );
      // console.error("Route Data: ", response);
    }
  } catch (e) {
    console.error(e);
    if (e?.response?.status == 429) {
      console.error("\t⛔ Openocean Limit Reached");
      res.send({ error: "Openocean-LMT", status: true });
      return 0;
    }
    res.send({ error: "Openocean-NULL" });
    return 0;
    // console.error("Kyberswap fail: ", e.response);
  }

  let status = response?.status;
  let callData = response?.data?.data.data;
  // console.log("Response Status: ", { status: status, data: response });

  if (status - 200 == 0) {
    const data = response.data.data;
    const amountIn = data.inAmount;
    const amountOut = data.outAmount;
    const gwei = data.gasPrice;
    const totalGas = data.estimatedGas;
    const gasUsd = 0;

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
      crypto: crypto,
      gas: gas,
    };

    let finalRes = {};
    finalRes.data = callData;
    finalRes.stats = stats;
    finalRes.tokenInAddress = tokenIn;
    finalRes.tokenOutAddress = tokenOut;

    finalRes.provider = "🏖 Openocean";
    finalRes.providerID = 3;

    res.send({ data: finalRes });
    return 0;
  } else {
    // console.error("Second level");
    res.send({ error: "openocean-NULL" });
    return 0;
  } /* else res.send({ status: status }); */
});
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const unlock = async (api, period) => {
  await wait(period);
  state.available[api] = true;
  // console.log(`Releasing ${api}...`);
};

const lock = (api) => {
  state.available[api] = false;
};

const bounce = async (api, period) => {
  lock(api);
  unlock(api, period);
};

const test = async (api, res, period) => {
  const { status } = res;
  if (status !== undefined && status === true) bounce(api, period);
};
const check = (api) => {
  if (!state.available[api]) {
    // console.error(`awaiting ${api}...\n`);
    throw Error("Unavailable");
  }
};
const inspect = (tag, res) =>
  false; /* && console.log(`Call response [${tag}]: `, typeof res); */
const Kyberswap = async (chain, chainId, tokenIn, tokenOut, amountIn) => {
  const tag = "kyberswap";
  try {
    check(tag);
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/Kyberswap?chain=${chain}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`;
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    inspect(tag, res);
    test(tag, res, 1000);
    return res;
  } catch (e) {
    return {};
  }
};

const limiterKyberswap = new Bottleneck({
  maxConcurrent: 10,
  minTime: 50,
});
const wKyberswap = limiterKyberswap.wrap(Kyberswap);
const Paraswap = async (chain, chainId, tokenIn, tokenOut, amountIn) => {
  const tag = "paraswap";
  try {
    check(tag);
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/Paraswap?network=${chainId}&srcToken=${tokenIn}&destToken=${tokenOut}&amount=${amountIn}`;
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    inspect(tag, res);
    test(tag, res, 120000);
    return res;
  } catch (e) {
    return {};
  }
};
const limiterParaswap = new Bottleneck({
  maxConcurrent: 10,
  minTime: 550,
});
const wParaswap = limiterParaswap.wrap(Paraswap);

const Zeroswap = async (chain, chainId, tokenIn, tokenOut, amountIn) => {
  const tag = "zeroswap";
  try {
    check(tag);
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/Zeroswap?chain=${chain}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`;
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    inspect(tag, res);
    test(tag, res, 30000);
    return res;
  } catch (e) {
    return {};
  }
};

const limiterZeroswap = new Bottleneck({
  maxConcurrent: 10,
  minTime: 500,
});
const wZeroswap = limiterZeroswap.wrap(Zeroswap);
const openocean = async (chain, chainId, tokenIn, tokenOut, amountIn) => {
  const tag = "openocean";
  try {
    check(tag);
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/openocean?chain=${chain}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`;
    // http://localhost:4444/Paraswap?network=250&srcToken=0x049d68029688eabf473097a2fc38ef61633a3c7a&destToken=0x1e4f97b9f9f913c46f1632781732927b9019c68b&amount=100000000
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    inspect(tag, res);
    test(tag, res, 30000);
    return res;
  } catch (e) {
    return {};
  }
};

const limiterOpenocean = new Bottleneck({
  maxConcurrent: 1,
  minTime: 55,
});
const wOpenocean = limiterOpenocean.wrap(Paraswap);

const describe = async (chain, chainId, srcToken, destToken, amount) => {
  try {
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `https://api.coingecko.com/api/v3/coins/${chain}/contract/${srcToken}`;
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    const detail_platforms = res.detail_platforms;
    const market_data = res.market_data;
    const current_price = market_data.current_price;
    const priceUSD = current_price.usd;
    const decimals = Object.keys(detail_platforms)
      .map((x) => detail_platforms[x])
      .filter(
        (y) => y.contract_address.toLowerCase() == srcToken.toLowerCase()
      )[0].decimal_place;

    const symbol = res.symbol.toUpperCase();

    const amountUSD = amount * Number(`1e-${decimals}`) * priceUSD;

    const description = {
      symbol: symbol,
      amountUSD: amountUSD,
      decimals: decimals,
      priceUSD: priceUSD,
      amount: amount,
    };
    const finalRes = description;
    return finalRes;
  } catch (e) {
    console.error("Describe error: ", e);
    return {};
  }
};

app.get("/describe", async (req, res) => {
  const { chain, chainId, srcToken, destToken, amount } = req.query;

  res.send(await describe(chain, chainId, srcToken, destToken, amount));
  return 0;
});

const getStats = (srcUSD, destUSD, gasCostUSD) => {
  const amountInUsd = Number(srcUSD);
  const amountOutUsd = Number(destUSD);
  const gasUsd = Number(gasCostUSD);
  const netOutput = amountOutUsd - gasUsd;
  const profit = amountOutUsd - (amountInUsd + gasUsd);
  const profitability = (profit / amountInUsd) * 100;
  const profitable = profit > 0;

  const stats = {
    amountIn: amountInUsd,
    amountOut: amountOutUsd,
    netOutput: netOutput,
    profitability: profitability,
    profiitable: profitable,
    profit: profit,
  };

  return stats;
};

app.get("/quote", async (req, res) => {
  const tag = "quote";
  const { chain, chainId, srcToken, destToken, amount } = req.query;
  try {
    // console.info("⚛");
    const queries = [
      // wOpenocean(chain, chainId, srcToken, destToken, amount),
      Kyberswap(chain, chainId, srcToken, destToken, amount),
      // wParaswap(chain, chainId, srcToken, destToken, amount),
      //Zeroswap(chain, chainId, srcToken, destToken, amount),
    ];
    const responses = await Promise.all(queries);

    inspect(tag, responses);

    // console.log("Responses: ", responses[0]);

    // console.log("All stats: ", allStats);

    const errors = [...responses].filter((x) => x?.error); //manage errors

    const overflow =
      [...errors].filter((x) => x.error.includes("LMT")).length > 0;

    if (overflow) {
      res.send({ error: "quote-LMT", status: true });
      return 0;
    }

    const references = [...responses].filter((x) => x?.data?.stats?.amountIn);

    let allStats;

    try {
      allStats = [...references].map((x) => x.data.stats);
    } catch (e) {
      console.log("null-responses: ", JSON.stringify(references));
      console.error("Quote error: ", e);
      res.send({ error: "quote-NULL-1" });
      return 0;
    }

    const responsive = references.length > 0;

    if (!responsive) {
      // console.log("Responses-N2: ", references);
      throw Error("quote-NULL-2");
    }

    const rates = [...references].map((quote) => {
      // console.log("quote: ", quote);
      let stats = quote.data.stats;
      const crypto = stats.crypto;
      stats.amountIn = Number(stats.amountIn);
      stats.amountOut = Number(stats.amountOut);
      stats.gas.gasUsd = Number(stats.gas.gasUsd);
      stats.gas.gwei = Number(stats.gas.gwei);
      stats.gas.totalGas = Number(stats.gas.totalGas);
      const gas = stats.gas;
      if (gas.totalGas * gas.gasUsd === 0)
        console.log("Gasless quote: ", quote?.original);
      // console.log("computative-Stats: ", stats);
      // console.log("computative-Stats-Crypto: ", stats.crypto);
      // console.log("computative-Stats-gas: ", stats.gas);

      const inRate = Number(stats.amountIn) / Number(crypto.amountIn);
      const outRate = Number(stats.amountOut) / Number(crypto.amountOut);
      const gasRate = gas.gasUsd / (gas.gwei * Number(1e9) * gas.totalGas);
      // if (isNaN(gasRate))
      //   console.log("gas.totalGas", {
      //     total: gas.totalGas,
      //     type: typeof gas.totalGas,
      //   });
      const rates = {
        inRate,
        outRate,
        gasRate,
      };
      // console.log("computative-rates: ", rates);
      return rates;
    });

    // console.log("Rates: ", rates);
    const { inRate, outRate, gasRate } = [...rates].reduce(
      (t, c) => {
        const inRate = t.inRate + c.inRate;
        const outRate = t.outRate + c.outRate;
        const gasRate = t.gasRate + c.gasRate;
        return {
          inRate,
          outRate,
          gasRate,
        };
      },
      {
        inRate: 0,
        outRate: 0,
        gasRate: 0,
      }
    );

    const rate = {
      inRate: inRate / rates.length,
      outRate: outRate / rates.length,
      gasRate: gasRate / rates.length,
    };
    // console.log("Rate: ", rate);

    const filtered = [...responses].filter((x) => x?.data?.stats?.crypto);

    const pre_identified = [...responses].filter((x) => x?.data?.tokenIn);
    const identified = [...pre_identified].filter(
      (y) => !y?.data?.tokenIn.includes("0x")
    )[0]; //get tokenIn

    // console.log("pre-identified: ", pre_identified);
    // console.log("identified: ", identified);

    if (identified?.data === undefined)
      console.log("undefined responses: ", responses);

    const tokenInSymbol = identified.data.tokenIn;
    const tokenOutSymbol = identified.data.tokenOut;

    // console.log("tokenInSymbol: ", tokenInSymbol);
    // console.log("tokenOutSymbol: ", tokenOutSymbol);

    const sorted = [...filtered].sort((x, y) => {
      const a = x?.data?.stats?.crypto?.amountOut;
      const b = y?.data?.stats?.crypto?.amountOut;
      return a < b ? 1 : a > b ? -1 : 0;
    });

    let optimal = sorted[0].data;

    // console.log("Optimal: ", optimal);

    const amountIn = optimal.stats.crypto.amountIn;
    const amountOut = optimal.stats.crypto.amountOut;

    // const tin = await describe(chain, chainId, srcToken, destToken, amountIn);
    // const tout = await describe(chain, chainId, destToken, srcToken, amountOut);
    // console.log("tin: ", tin);
    // console.log("tin: ", tout);

    // const tokenIn = tin.symbol;
    // const tokenOut = tout.symbol;
    const srcUSD = amountIn * rate.inRate;
    const destUSD = amountOut * rate.outRate;

    const allGwei = [...allStats]
      .filter((x) => x?.gas?.gwei)
      .map((y) => Number(y.gas.gwei));

    // console.log("gwei: ", allGwei);
    const gas = optimal.stats.gas;
    const gwei = [...allGwei].reduce((x, y) => x + y, 0) / allGwei.length;
    const totalGas = Number(gas.totalGas);
    const genGasCost = 0;
    const netGasCost = genGasCost + totalGas;
    const gasCostUSD = netGasCost * rate.gasRate * gwei * 1e9;
    const gasStats = {
      gasUsd: gasCostUSD,
      gwei,
      totalGas: netGasCost,
      gasRate: rate.gasRate,
    };

    // console.log("gasStats: ", gasStats);

    let stats = getStats(srcUSD, destUSD, gasCostUSD);

    stats.gas = gasStats;

    // if (isNaN(gasCostUSD)) {
    //   console.log("gas stats: ", {
    //     gas,
    //     gwei,
    //     totalGas,
    //     genGasCost,
    //     netGasCost,
    //     gasCostUSD,
    //     gasStats,
    //     rate,
    //   });
    // }
    // console.log("stats: ", [
    //   stats,
    //   {
    //     srcUSD,
    //     destUSD,
    //     gasCostUSD,
    //   },
    // ]);

    Object.keys(stats).forEach((x) => (optimal.stats[x] = stats[x]));

    // Object.keys(stats.gas).forEach(
    //   (x) => (optimal.stats.gas[x] = stats.gas[x])
    // );

    optimal.tokenIn = tokenInSymbol;
    optimal.tokenOut = tokenOutSymbol;

    // console.log("Optimal: ", optimal);

    const finalRes = optimal;

    if (finalRes.stats.profitability < -0.75) {
      //console.log(`\t📉 [:> ${optimal.tokenIn} => ${optimal.tokenOut}`);
      throw Error("Unprofitable");
    }
    // console.log("FinalRes: ", finalRes);
    // console.error("\t\t🪙");
    res.send(finalRes);
    return 0;
  } catch (e) {
    // console.error(`\t\t🪦\t[:> ${srcToken} => ${destToken}`); // Add
    // console.log(`\t\t📉 [:> ${optimal.tokenIn} => ${optimal.tokenOut}`); // something like this and check kyber error codes
    // console.error("Quote error: ", e);
    res.send({ error: "quote-NULL" });
    return 0;
  }
});

app.get("/sell", async (req, res) => {
  const tag = "sell";
  const { chain, chainId, srcToken, destToken, amount } = req.query;
  try {
    // console.info("⚛");
    const queries = [
      // wOpenocean(chain, chainId, srcToken, destToken, amount),
      Kyberswap(chain, chainId, srcToken, destToken, amount),
      Paraswap(chain, chainId, srcToken, destToken, amount),
      Zeroswap(chain, chainId, srcToken, destToken, amount),
    ];
    const responses = await Promise.all(queries);

    inspect(tag, responses);

    // console.log("Responses: ", responses);

    // console.log("All stats: ", allStats);

    const errors = [...responses].filter((x) => x?.error); //manage errors

    const overflow =
      [...errors].filter((x) => x.error.includes("LMT")).length > 0;

    if (overflow) {
      res.send({ error: "quote-LMT", status: true });
      return 0;
    }

    const references = [...responses].filter((x) => x?.data?.stats?.amountIn);
    const antireferences = [...responses].filter(
      (x) => !x?.data?.stats?.amountIn
    );

    let allStats;

    try {
      allStats = [...references].map((x) => x.data.stats);
    } catch (e) {
      console.log("null-responses: ", JSON.stringify(references));
      console.error("Quote error: ", e);
      res.send({ error: "quote-NULL-1" });
      return 0;
    }

    const responsive = references.length > 0;

    if (!responsive) {
      // console.log("Responses-N2: ", references);
      throw Error("quote-NULL-2");
    }

    // console.log("responses: ", responses);
    // console.log("antireferences: ", antireferences);
    // console.log("references: ", references);

    const cryptoful = [...responses].filter(
      (x) => x?.data?.stats?.crypto?.amountIn
    );

    // console.log("cryptoful: ", cryptoful);

    const kyberless = [...cryptoful].filter(
      (x) => true || !x?.data.provider.includes("Kyber")
    );

    // console.log("kyberless: ", kyberless);

    const tradable = kyberless.length > 0;

    if (!tradable) {
      // console.log("Responses-N2: ", references);
      throw Error("quote-NULL-3");
    } /* else console.log("kyberless: ", kyberless); */

    const rates = [...references].map((quote) => {
      // console.log("quote: ", quote);
      let stats = quote.data.stats;
      const crypto = stats.crypto;
      stats.amountIn = Number(stats.amountIn);
      stats.amountOut = Number(stats.amountOut);
      stats.gas.gasUsd = Number(stats.gas.gasUsd);
      stats.gas.gwei = Number(stats.gas.gwei);
      stats.gas.totalGas = Number(stats.gas.totalGas);
      const gas = stats.gas;
      if (gas.totalGas * gas.gasUsd === 0)
        console.log("Gasless quote: ", quote?.original);
      // console.log("computative-Stats: ", stats);
      // console.log("computative-Stats-Crypto: ", stats.crypto);
      // console.log("computative-Stats-gas: ", stats.gas);

      const inRate = Number(stats.amountIn) / Number(crypto.amountIn);
      const outRate = Number(stats.amountOut) / Number(crypto.amountOut);
      const gasRate = gas.gasUsd / (gas.gwei * Number(1e9) * gas.totalGas);
      // if (isNaN(gasRate))
      //   console.log("gas.totalGas", {
      //     total: gas.totalGas,
      //     type: typeof gas.totalGas,
      //   });
      const rates = {
        inRate,
        outRate,
        gasRate,
      };
      // console.log("computative-rates: ", rates);
      return rates;
    });

    // console.log("Rates: ", rates);
    const { inRate, outRate, gasRate } = [...rates].reduce(
      (t, c) => {
        const inRate = t.inRate + c.inRate;
        const outRate = t.outRate + c.outRate;
        const gasRate = t.gasRate + c.gasRate;
        return {
          inRate,
          outRate,
          gasRate,
        };
      },
      {
        inRate: 0,
        outRate: 0,
        gasRate: 0,
      }
    );

    const rate = {
      inRate: inRate / rates.length,
      outRate: outRate / rates.length,
      gasRate: gasRate / rates.length,
    };
    // console.log("Rate: ", rate);

    const filtered = kyberless; //[...responses].filter((x) => x?.data?.stats?.crypto);

    // console.log("filtered: ", filtered);

    // console.log("tokenInSymbol: ", tokenInSymbol);
    // console.log("tokenOutSymbol: ", tokenOutSymbol);

    const sorted = [...filtered].sort((x, y) => {
      const a = x?.data?.stats?.crypto?.amountOut;
      const b = y?.data?.stats?.crypto?.amountOut;
      return a < b ? 1 : a > b ? -1 : 0;
    });

    let optimal = sorted[0].data;

    // console.log("Optimal: ", optimal);

    const amountIn = optimal.stats.crypto.amountIn;
    const amountOut = optimal.stats.crypto.amountOut;

    // const tin = await describe(chain, chainId, srcToken, destToken, amountIn);
    // const tout = await describe(chain, chainId, destToken, srcToken, amountOut);
    // console.log("tin: ", tin);
    // console.log("tin: ", tout);

    // const tokenIn = tin.symbol;
    // const tokenOut = tout.symbol;
    const srcUSD = amountIn * rate.inRate;
    const destUSD = amountOut * rate.outRate;

    const allGwei = [...allStats]
      .filter((x) => x?.gas?.gwei)
      .map((y) => Number(y.gas.gwei));

    // console.log("gwei: ", allGwei);
    const gas = optimal.stats.gas;
    const gwei = [...allGwei].reduce((x, y) => x + y, 0) / allGwei.length;
    const totalGas = Number(gas.totalGas);
    const genGasCost = 0;
    const netGasCost = genGasCost + totalGas;
    const gasCostUSD = netGasCost * rate.gasRate * gwei * 1e9;
    const gasToTokenInRate = rate.gasRate / rate.inRate
    const gasToTokenOutRate = rate.gasRate / rate.outRate
    const gasAmount = gasCostUSD / rate.gasRate * 1e-18
    const gasCostTokenIn = gasToTokenInRate * gasAmount
    const gasCostTokenOut = gasToTokenOutRate * gasAmount
    const gasStats = {
      gasUsd: gasCostUSD,
      gwei,
      totalGas: netGasCost,
      gasAmount,
      gasRate: rate.gasRate,
      gasToTokenInRate,
      gasToTokenOutRate,
      gasCostTokenIn,
      gasCostTokenOut,
    };

    // console.log("gasStats: ", gasStats);

    let stats = getStats(srcUSD, destUSD, gasCostUSD);

    stats.gas = gasStats;

    // if (isNaN(gasCostUSD)) {
    //   console.log("gas stats: ", {
    //     gas,
    //     gwei,
    //     totalGas,
    //     genGasCost,
    //     netGasCost,
    //     gasCostUSD,
    //     gasStats,
    //     rate,
    //   });
    // }
    // console.log("stats: ", [
    //   stats,
    //   {
    //     srcUSD,
    //     destUSD,
    //     gasCostUSD,
    //   },
    // ]);

    Object.keys(stats).forEach((x) => (optimal.stats[x] = stats[x]));

    // Object.keys(stats.gas).forEach(
    //   (x) => (optimal.stats.gas[x] = stats.gas[x])
    // );

    const pre_identified = [...responses].filter((x) => x?.data?.tokenIn);
    const identified = [...pre_identified].filter(
      (y) => !y?.data?.tokenIn.includes("0x")
    )[0]; //get tokenIn

    // console.log("pre-identified: ", pre_identified);
    // console.log("identified: ", identified);

    let tokenInSymbol;
    let tokenOutSymbol;

    if (identified?.data === undefined) {
      // console.log("undefined responses: ", responses);

      tokenInSymbol = filtered[0].data.tokenInAddress;
      tokenOutSymbol = filtered[0].data.tokenOutAddress;
    } else {
      tokenInSymbol = identified.data.tokenIn;
      tokenOutSymbol = identified.data.tokenOut;
    }

    optimal.tokenIn = tokenInSymbol;
    optimal.tokenOut = tokenOutSymbol;
    optimal.rate = rate;

    // console.log("Optimal: ", optimal);

    const finalRes = optimal;

    if (finalRes.stats.profitability < -0.75) {
      //console.log(`\t📉 [:> ${optimal?.tokenIn} => ${optimal?.tokenOut}`);
      throw Error("Unprofitable");
    }
    // console.log("FinalRes: ", finalRes);

    // console.log("sorted[0]:  ", sorted[0]);
    // console.error("\t\t🪙");
    res.send(finalRes);
    return 0;
  } catch (e) {
    // console.error(`\t\t🪦\t[:> ${srcToken} => ${destToken}`); // Add
    // console.log(`\t\t📉 [:> ${optimal.tokenIn} => ${optimal.tokenOut}`); // something like this and check kyber error codes
    // console.error("Quote error: ", e);
    res.send({ error: "quote-NULL" });
    return 0;
  }
});

const PORT = 4444;
const wave = () => console.log("\t🔌_.:KYBERSWAP TERMINAL READY:._");
app.listen(PORT, () => {
  console.log(`\n\t🔌[KyberSwap@port:${PORT}]\n`);
  wave();
  setInterval(wave, 1800000);
});
