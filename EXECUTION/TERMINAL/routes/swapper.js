const { Console } = require("console");
const chains = require("./chains.json");
const { hashify, sleep } = require("./utils.js")
const REM = 10;

const hexify = (num) => `0x${num.toString(16)}`;
let sign = (...initials) => {
  initials = [...initials]
    .map((i) => `${i}`.slice(-16, -1))
    .join("")
    .split("")
    .map((char) => char.charCodeAt(0))
    .join("");
  const signature = hexify(initials);
  return signature;
};
//`${`${[123123, "0x12312fFFFee"]}`.split('').map(char => char.charCodeAt(0)).join('')}`
const access = (chainId) => {
  const chain = chains[chainId];
  if (!chain)
    throw Error(
      `Swapper: Couldn't correlate chain ID #${chainId}, to any network on file.`
    );
  return chain;
};

const identify = (chainId) => access(chainId).name;

const weth = (chainId) => access(chainId).weth;

const vault = (chainId) => access(chainId).vault;

const hasFiat = (token, chainId) => vault(chainId).join("").includes(token);

const entryIsFiat = (data, chainId) => hasFiat(data.tokenIn, chainId);

const exitIsFiat = (data, chainId) => hasFiat(data.tokenOut, chainId);

const hasAnyFiat = (data, chainId) =>
  entryIsFiat(data, chainId) && exitIsFiat(data, chainId);

const fiatCode = (data, chainId) =>
  entryIsFiat(data, chainId) ? 0 : exitIsFiat(data, chainId) ? 1 : 2;

const inspect = (tag, res) =>
  false; /* && console.log(`Call response [${tag}]: `, typeof res); */

const getAmount = async (address, price) => {
  const path = `offchain/convert/${address}/${price}`;
  const ops = {
    method: "GET",
  };
  const amount = await fetch(`http://localhost:8888/${path}`, ops);
  return amount;
};

const updateLimit = async (limit, tag) => {
  // console.log(`Updating limit from ${tag}: `, limit);
  await fetch(`http://localhost:4444/state-limit/?limit=${limit}`, {
    method: "POST",
  });
  // console.info("limit updated.");
};
const pause = async (tag) => {
  // console.log("Pausing...");
  await updateLimit(true, tag);
  // throw Error("Limit Reached");
};

const resume = async (tag) => {
  // console.log("Resuming...");
  await updateLimit(false, tag);
};

const bounce = async () => {
  const status = JSON.parse(
    await (
      await fetch(`http://localhost:4444/state-limit/`, {
        method: "GET",
      })
    ).text()
  );
  console.log("Bounce: ", status);
  if (status) throw Error("BOUNCE");
};

const deploy = async (flight) => {
  const path = "deploy";
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
const wrap = (op, profit, profitability, runtime, gasRate, gasCost) => {
  let tokens = [...op].map((y) => [y.tokenInAddress, y.tokenOutAddress]);
  let price = op.at(0).USDin;
  let swapDatas = [...op].map((swap) => swap.data);
  let PIDS = [...op].map((swap) => swap.providerID);
  // let params = [...swapDatas].map((x, i) => [PIDS[i], tokens[i][0], swapDatas[i]])
  // let types = [...swapDatas].map((x, i) => ["uint", "address", "bytes"])
  let swaps = [...swapDatas].map((x, i) => [PIDS[i], tokens[i][0], swapDatas[i]])
  // swaps = swaps.flat();
  // types = types.flat();
  // console.log("swaps: ", swaps)
  // console.log("types: ", types)
  // let params =
  //   encode(types, swaps);
  let total = profit * 1000;
  let tin = op.at(0).tokenInAddress;
  let tout = op.at(-1).tokenOutAddress;
  let quote = op.at(-1).USDout;
  let time = `${runtime < 1000 ? "🔥" : "🐢"} ${runtime / 1000
    } seconds`
  let FLFee = 180000
  let gasAmount = [...op].map((y) => y.gasCost).reduce((x, y) => x + y) + FLFee
  // console.log("package-inst. keys:\t", Object.keys(op[0]));
  // console.log("package:\t", op);
  let data = {
    swaps: swaps,
    // params: params,
    price: price,
    quote: quote,
    profit: profit,
    profitability: profitability,
    total: total,
    fiatCode: op.at(0).fiatCode,
    gas: {
      gwei: Math.round(
        [...op].map((y) => Number(y.gasPrice)).reduce((x, y) => x + y) /
        op.length
      ),
      // .reduce((x, y) => x + Number(y.gasPrice)) / op.length,
      amount: gasAmount,
      // .reduce((x, y) => x + y.gasCost),
      cost: gasCost,
      // .reduce((x, y) => x + y.gasTotal),,
      gasRate: gasRate
    },
    // trail: `[:> ${tin} => ${tout} <:]`,
    trail: [...op]
      .map((y) => [y.tokenIn, y.tokenOut])
      .flat()
      .filter((v, i, a) => a[i - 1] !== a[i])
      .join(" > "),
    flow: [...op]
      .map((y) => [y.CRYin, y.CRYout])
      .flat()
      .join(" > "),
    providers: [...op]
      .map((y) => [y.provider, y.provider])
      .flat()
      .filter((v, i, a) => a[i - 1] !== a[i])
      .join(" > "),
    tokens: tokens,
    amounts: [...op].map((y) => y.CRYin),
    tokenIn: tin,
    tokenOut: tout,
    loanAmount: op.at(0).CRYin,
    output: op.at(-1).CRYout,
    runtime: time
  };
  return data;
}
const Kyberswap = async (
  signature,
  chain,
  chainId,
  tokenIn,
  tokenOut,
  amountIn
) => {
  try {
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/Kyberswap?chain=${chain}&chainId=${chainId}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`;
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    return res;
  } catch (e) {
    return {};
  }
};

const Paraswap = async (
  signature,
  chain,
  chainId,
  tokenIn,
  tokenOut,
  amountIn
) => {
  try {
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/Paraswap?network=${chainId}&srcToken=${tokenIn}&destToken=${tokenOut}&amount=${amountIn}`;
    // http://localhost:4444/Paraswap?network=250&srcToken=0x049d68029688eabf473097a2fc38ef61633a3c7a&destToken=0x1e4f97b9f9f913c46f1632781732927b9019c68b&amount=100000000
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (await fetch(slug, { timeout: 500 })).json();
    // console.log("Call response: ", res);
    return res;
  } catch (e) {
    return {};
  }
};

const Quote = async (
  signature,
  chain,
  chainId,
  tokenIn,
  tokenOut,
  amountIn
) => {
  const tag = "quote";
  try {
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/quote?chain=${chain}&chainId=${chainId}&srcToken=${tokenIn}&destToken=${tokenOut}&amount=${amountIn}`;
    // http://localhost:4444/Paraswap?network=250&srcToken=0x049d68029688eabf473097a2fc38ef61633a3c7a&destToken=0x1e4f97b9f9f913c46f1632781732927b9019c68b&amount=100000000
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (
      await fetch(slug, { timeout: 500 /* keepalive: true */ })
    ).json();

    inspect(tag, res);
    // console.log("Call response: ", res);
    return res;
  } catch (e) {
    return {};
  }
};
const Sell = async (signature, chain, chainId, tokenIn, tokenOut, amountIn) => {
  const tag = "sell";
  try {
    amountIn = BigInt(amountIn);
    //   console.log("Timestamp: ", new Date().toISOString());
    const slug = `http://localhost:4444/sell?chain=${chain}&chainId=${chainId}&srcToken=${tokenIn}&destToken=${tokenOut}&amount=${amountIn}`;
    // http://localhost:4444/Paraswap?network=250&srcToken=0x049d68029688eabf473097a2fc38ef61633a3c7a&destToken=0x1e4f97b9f9f913c46f1632781732927b9019c68b&amount=100000000
    // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
    const res = await (
      await fetch(slug, { timeout: 500 /* keepalive: true */ })
    ).json();

    inspect(tag, res);
    // console.log("Call response: ", res);
    return res;
  } catch (e) {
    return {};
  }
};

const providers = {
  // kyberswap: Kyberswap,
  // paraswap: Paraswap,
  // quote: Quote,
  sell: Sell,
};
const implement = (provider) => {
  const keys = Object.keys(providers);
  const implementation = providers[keys[provider % keys.length]];
  if (!implementation) throw Error(`${provider} is not a registered provider.`);
  // console.log(`cojiendo ${provider} => ${implementation}`);
  return implementation;
};

const call = async (
  signature,
  chain,
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
  provider
) => {
  const start = performance.now();
  try {
    // await bounce();
    const cojer = implement(provider);
    const res = await cojer(
      signature,
      chain,
      chainId,
      tokenIn,
      tokenOut,
      amountIn
    );

    const { data, status, error, tag } = res;
    // if (status !== undefined) {
    //   // console.log("tag: ", tag);
    //   // if (!!!tag) console.log(res);
    //   if (!!status) await pause(tag);
    //   else await resume(tag);
    // }
    if (!!error) throw Error(error);
    // console.log("call: ", res);

    const end = performance.now();
    const runtime = end - start;
    // console.log(
    //   `\t\t⌚${runtime < 1000 ? "🔥" : "🐢"} Call Runtime: ${runtime / 1000
    //   } seconds`)
    return res;
  } catch (e) {
    throw Error(e);
  }
};

const estimatePrice = async (tokenIn, price) => {
  try {
    const res = await getAmount(tokenIn, price);
    const amount = await res.text();
    return amount;
  } catch (e) {
    throw Error("Price Estimation Failed");
  }
};

const good = () => "\u2705";
const up = () => "📈";
const bad = () => "\u274C";
const down = () => "📉";

const delta = (a, b) => ((b - a) / Math.abs(a)) * 100;
const zelta = (a, b) => {
  const zel = delta(a, b) > 0 ? up() : down();
  //   console.log(`\t\t\t [-:}> zelta(${a}, ${b}) > 0 <:-] == ${zel}`);
  return zel;
};
const profitability = (USDin, USDout) => delta(USDin, USDout); // al three into one function
const profit = (USDin, USDout) => USDout - USDin;
const tradable = (
  profit,
  profitability,
  expectedProfit,
  expectedProfitability,
  gasProfitability,
  expectedGasProfitability
) => {
  const acceptableProfitability = profitability >= expectedProfitability;
  const acceptableGasProfitability = gasProfitability >= expectedGasProfitability;
  // const acceptableProfit = profit(USDin, USDout) >= expectedProfit;
  const acceptableProfit = profit >= expectedProfit && acceptableGasProfitability;
  //   console.log(
  //     `\t=> (${USDin}, ${USDout}) :: acceptableProfitability: ${acceptableProfitability} || acceptableProfit: ${acceptableProfit}`
  //   );
  return acceptableProfitability && acceptableGasProfitability && acceptableProfit;
};
const profitable = (profit, profitability, price, gasProfitability) => {
  const expectedProfitability = 0.0005; //.05
  const expectedProfit = 0.0;
  const expectedGasProfitability = 20
  price = price >= 1 ? `$${Number(price).toLocaleString()}` : `${price * 100}¢`;
  if (tradable(profit, profitability, expectedProfit, expectedProfitability, gasProfitability, expectedGasProfitability)) {
    console.log(`\t${good()} [:>> ${price} 💸 ${profit}<<:]`);
    return true;
  } else {
    // console.log(
    //   `tradable()`
    // );
    let reasons = "";

    // if (profit > 0) { // eventually redesign
    //   reasons += "∵ Lacking profit";
    //   if (profitability < expectedProfitability)
    //     reasons += " and profitability. ";
    //   else reasons += ". ";
    //   reasons += `∵ $${profit} | ${profitability.toPrecision(3)}%`;
    // }
    // const stats = `${profit} : ${profititability} : ${expectedProfit} : ${expectedProfititability}`;
    // console.log(`\t${bad()} [:> ${price} ${reasons}`);
    return false;
  }
};

const flow = (type, ...movements) => {
  let movement = movements[0];
  let f = `[:> Flow of ${type}:\t\t${movement} `;
  for (let i = 1; i < movements.length; i++) {
    movement = movements[i];
    f += `=> ${movement} `;
  }
  const start = movements.at(0);
  const end = movements.at(-1);
  const _profit = profit(start, end);
  f += `:: ${_profit} <:]`;
  f = "\t\t" + (_profit > 0 ? good() : bad()) + " " + f;
  console.log(f);
};

const consumption = (type, ...movements) => {
  // console.info("⛽", movements);
  let movement = movements[0];
  let f = `[:> Flow of ${type}:\t\t${movement}`;
  for (let i = 1; i < movements.length; i++) {
    movement += movements[i];
    f += ` => ${movement}`;
  }
  const gasUsed = movement;
  f += `:: ${gasUsed} <:]`;
  f = "\t\t" + "⛽" + " " + f;
  console.log(f);
};

const deltas = (type, ...movements) => {
  //   console.log("deltas: ", movements);
  let movement = movements[0];
  let f = `[:> Delta Flow of ${type}:\t${delta(movement, movements[1])} `;
  //   let r = "";
  //   movements.forEach((x, i) => (r += `movem #${i}: ${movements[i]}\n`));
  //   console.log(r);
  //   console.log("movements[1]: ", movements[1]);
  for (let i = 2; i < movements.length; i++) {
    movement = movements[i];
    f += `=> ${delta(movements[i - 1], movements[i])} `;
    // console.log(`=> \${delta(${movements[i - 1]}, ${movements[i]})} `);
    // console.log(`=> \${delta(movement[${i - 1}], movements[${i}]}) `);
  }
  const start = movements.at(0);
  const end = movements.at(-1);
  const _profitability = profitability(start, end);
  f += `:: ${_profitability} <:]\t`;
  f = "\t\t" + (_profitability > 0 ? good() : bad()) + " " + f;
  console.log(f);
};

const heatmap = (type, ...movements) => {
  //   console.log("heatmap: ", movements);
  let movement = movements[0];
  let f = `[:> Heatmap of ${type}:\t${zelta(movement, movements[1])} `;
  //   let r = "";
  //   movements.forEach((x, i) => (r += `movem #${i}: ${movements[i]}\n`));
  //   console.log(r);
  //   console.log("movements[1]: ", movements[1]);
  for (let i = 2; i < movements.length; i++) {
    movement = movements[i];
    f += `=> ${zelta(movements[i - 1], movements[i])} `;
    // console.log(`=> \${zelta(${movements[i - 1]}, ${movements[i]})} `);
    // console.log(`=> \${zelta(movement[${i - 1}], movements[${i}]}) `);
  }
  const start = movements.at(0);
  const end = movements.at(-1);
  const _zelta = zelta(start, end);
  f += `:: ${_zelta} <:]`;
  f = "\t\t" + (_zelta == up() ? up() : down()) + " " + f;
  console.log(f);
};

const follow = (...addresses) => {
  addresses = addresses.filter((v, i, a) => a[i - 1] !== a[i]);
  let address = addresses[0];
  let f = `\t\t💱 [:> Flow of tokens:\t${address} `;
  for (let i = 1; i < addresses.length; i++) {
    address = addresses[i];
    f += `=> ${address} `;
  }
  f += " <:]";
  console.log(f);
};

const trail = (...providers) => {
  let provider = providers[0];
  let f = `\t\t🚚 [:> Providers:\t\t${provider} `;
  for (let i = 1; i < providers.length; i++) {
    provider = providers[i];
    f += `=> ${provider} `;
  }
  f += " <:]";
  console.log(f);
};

const track = (...movements) => {
  // console.log("Movements: ", movements);
  flow("🪙 ", ...movements);

  deltas("🪙 ", ...movements);

  heatmap("🪙  Deltas", ...movements);
};

const trace = (...strategy) => {
  // console.log("Trace Strategy: ", strategy);
  let movements = [];
  let addresses = [];
  let providers = [];
  let cryptos = [];
  let gas = [];
  [...strategy].forEach((movement) => {
    // console.log("Movement: ", movement);
    addresses.push(movement.tokenIn);
    addresses.push(movement.tokenOut);
    providers.push(movement.provider);
    movements.push(movement.USDin);
    movements.push(movement.USDout);
    gas.push(movement.gasTotal);
    cryptos.push(movement.CRYin);
    cryptos.push(movement.CRYout);
  });
  follow(...addresses);
  trail(...providers);
  consumption("Gas", ...gas);
  track(...movements);
  // deltas("CRYPTO", ...cryptos);
  // flow("CRYPTO", ...cryptos);
};

const swap = async (
  signature,
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
  provider
) => {
  let _;
  let trade = {};
  try {
    const chain = identify(chainId);
    // console.log(
    //   `\t\t\t\t\t=> call(tokenIn: ${tokenIn}, tokenOut: ${tokenOut}, amountIn: ${amountIn}, provider: ${provider})`
    // );
    _ = await call(
      signature,
      chain,
      chainId,
      tokenIn,
      tokenOut,
      amountIn,
      provider
    ); //Minerva
    // console.log("Swap: ", _);
    if (!_?.data || Object.keys(_.data).length < 1) {
      throw Error("Trade Data Missing");
    }

    trade.data = _.data;
    trade.profit = _.stats.profit;
    trade.profitability = _.stats.profitability;
    trade.USDin = _.stats.amountIn;
    trade.USDout = _.stats.amountOut;
    trade.netOutput = _.stats.netOutput;
    trade.CRYin = _.stats.crypto.amountIn;
    trade.CRYout = _.stats.crypto.amountOut;
    trade.gasPrice = _.stats.gas.gwei;
    trade.gasCost = _.stats.gas.totalGas;
    trade.gasTotal = _.stats.gas.gasUsd;
    trade.tokenIn = _.tokenIn;
    trade.tokenOut = _.tokenOut;
    trade.tokenInAddress = _.tokenInAddress;
    trade.tokenOutAddress = _.tokenOutAddress;
    trade.provider = _.provider;
    trade.providerID = _.providerID;
    trade.rate = _.rate;
    // trade.entryIsFiat = entryIsFiat(trade.data, chainId);
    // trade.exitIsFiat = exitIsFiat(trade.data, chainId);
    // trade.hasAnyFiat = hasAnyFiat(trade.data, chainId);

    // console.log("swap: ", trade);
    return trade;
  } catch (e) {
    // console.log("_: ", _);
    // console.log("Trade: ", trade);
    // console.error(e);
    throw Error(e);
    // throw Error("Swapper: Invalid or Unresolved Trade");
  }
};

const fuse = async (
  signature,
  tokenIn,
  tokenOut,
  amount,
  chainId,
  provider
) => {
  let fused;
  try {
    // console.log(
    //   `\t\t\t\t=> swap(${chainId}, ${tokenIn}, ${tokenOut}, ${amount})`
    // );
    fused = await swap(signature, chainId, tokenIn, tokenOut, amount, provider);
    // const USDin = _.USDin;
    // const USDout = _.USDout;
    // _.profit = profit(USDin, USDout);
    // _.profit = profit(USDin, USDout);
    // _.profitability = profitability(USDin, USDout);
    // _.profitability = profitability(USDin, USDout);

    // console.log("fused: ", fused);
    return fused;
  } catch (e) {
    // console.log("Error fused: ", e);
    throw Error(e);
  }
};

const weave = async (signature, chainId, entryAmount, slippage, ...tokens) => {
  let index = 0;
  try {
    let strategy = [];
    let _ = {};
    let tokenIn, tokenOut;
    let amount = entryAmount;
    for (let i = 1; i < tokens.length; i++) {
      tokenIn = tokens[i - 1];
      tokenOut = tokens[i];
      // console.log(
      //   `\t\t\t=> ${i}) fuse(${tokenIn}, ${tokenOut}, ${amount}, ${chainId})`
      // );
      //   console.log("fuse_sig: ", [
      //     ...signature,
      //     sign(tokenIn, tokenOut, amount, chainId),
      //   ]);
      index = i - 1;
      _ = await fuse(
        [...signature, sign(tokenIn, tokenOut, amount, chainId)],
        tokenIn,
        tokenOut,
        amount,
        chainId,
        i - 1
      );
      strategy.push(_);
      amount = Math.round(_.CRYout - _.CRYout * slippage);
      //   console.log(
      //     `\t\t\t-:> ${i}) ${amount} = ${_.CRYout} - ${_.CRYout} * ${slippage}`
      //   );
      await sleep(REM);
    }
    return strategy;
  } catch (e) {
    // console.error("Weave: ", e);
    // console.error("Weave tokens: ", tokens.length);
    // console.error("Weave index: ", index);
    return [];
    // throw Error(e);
  }
};

let getGas = (gwei, gasRate, ...strategy) => {
  const flashLoanGasUsage = 180000 * gasRate * gwei * 1e9
  const traderGasUsage = 405000 * gasRate * gwei * 1e9 * 0
  const extraGasUsage = 300000 * gasRate * gwei * 1e9 * 0
  const gasUsage = [...strategy].map((y) => y.gasTotal).reduce((x, y) => x + y)
  const totalGasUsage = gasUsage + flashLoanGasUsage + traderGasUsage + extraGasUsage
  // console.log(`totalGasUsage: ${totalGasUsage} = + gasUsage: ${gasUsage} + flashLoanGasUsage: ${flashLoanGasUsage}`)
  return totalGasUsage;
};

let getGrossProfit = (...strategy) => {
  const input = strategy.at(0).USDin;
  const output = strategy.at(-1).USDout;
  const grossProfit = output - input;
  return grossProfit;
};

let getNetProfit = (grossProfit, gasUsage, ...strategy) => {
  const netProfit = grossProfit - gasUsage;
  return netProfit;
};

const getGasrate = strategy => {
  const rates = [...strategy].map(x => x.rate.gasRate);
  const gasRate = rates.reduce((x, y) => x + y) / rates.length
  return gasRate
}

const getGasProfitability = (gas, profit) => {
  const gasProfitability = delta(profit, gas) * -1;
  return gasProfitability;
}

const getGwei = strategy => {
  const gwei = Math.round(
    [...strategy].map((y) => Number(y.gasPrice)).reduce((x, y) => x + y) /
    strategy.length
  )
  return gwei
}

const getProfitability = (profit, input) => profit / input;

const interlace = async (signature, chainId, price, slippage, ...tokens) => {
  // console.log("Interlace tokens: ", tokens);
  try {
    const entryToken = tokens[0];
    const entryAmount = hexify(
      BigInt(
        Math.round(Number(await (await getAmount(entryToken, price)).text()))
      )
    );
    const start = performance.now();
    const strategy = await weave(
      [...signature, sign(chainId, entryAmount, slippage, sign(...tokens))],
      chainId,
      entryAmount,
      slippage,
      ...tokens
    ); // Here fix it all
    // console.log("interlace-strategy: ", strategy);
    if (!Object.keys(strategy).length) return [];
    const entry = strategy.at(0);
    const exit = strategy.at(-1);
    const input = entry.USDin;
    const grossProfit = getGrossProfit(...strategy);
    // console.log("Interlacing profit: ", profit);
    const profitability = getProfitability(grossProfit, input);

    const gasRate = getGasrate(strategy);

    const gwei = getGwei(strategy);

    const gasUsage = getGas(gwei, gasRate, ...strategy);

    const netProfit = getNetProfit(grossProfit, gasUsage, ...strategy);
    // console.log("Interlacing profitability: ", profitability);
    const gasProfitability = getGasProfitability(gasUsage, grossProfit);
    const tradable = profitable(netProfit, profitability, price, gasProfitability);
    // const tradable = profitable(grossProfit, profitability, price); //switch this back!!
    // const tokens = ;
    strategy.at(0).fiatCode = fiatCode(
      { tokenIn: entry.tokenIn, tokenOut: exit.tokenOut },
      chainId
    );

    // console.log("Interlacing strat: ", strategy);
    // return [];

    // if (!tradable) return [];
    const end = performance.now();
    const runtime = end - start;
    const flight = wrap(strategy, netProfit, profitability, runtime, gasRate, gasUsage);

    // console.log("strategy: ", strategy)
    console.log("flight: ", flight)

    // deploy(flight);
    trace(...strategy);
    console.log(
      `\t\t⌚ [:> Runtime:\t\t\t${runtime < 1000 ? "🔥" : "🐢"} ${runtime / 1000
      } seconds`
    );

    // throw Error(`Interlace: Unprofitable swap @ -$${profit * -1}`);
    // else console.log("interlace/strategy:", strategy);
    // trace(...strategy);
    return [];
    // return strategy;
  } catch (e) {
    const params = {
      chainId: chainId,
      price: price,
      slippage: slippage,
      tokens: tokens,
    };
    console.error("Controlled: ", e);
    // console.error("Params: ", params);
    return [];
  }
};

const braid = async (
  signature,
  chainId,
  slippage,
  tLimit,
  bLimit,
  ...tokens
) => {
  [bLimit, tLimit] = [tLimit, bLimit].sort();
  const prices = Array.from(
    Array(Math.log10(tLimit) + 1 + Math.log10(bLimit) * -1).keys()
  )
    .map((x) => 10 ** (x + Math.log10(bLimit)))
    .map((x) => Array.from([3, 5, 7, 8, 9], (y) => Number((y * x).toPrecision(1))))
    .flat();
  let trades = [];
  for (let i = 0, price, res; i < prices.length; i++) {
    price = prices[i];
    // console.log(
    //   `\t\t\t=> ${i}) interlacing(${price}, ${tLimit}, ${bLimit}, ${chainId})`
    // );
    res = await interlace(
      [...signature, sign(chainId, price, slippage, sign(...tokens))],
      chainId,
      price,
      slippage,
      ...tokens //.filter((v, i, a) => a[i - 1] !== a[i])
    );
    trades.push(res);
    await sleep(REM);
  }
  // console.log("Trades: ", trades);
  return trades;
};

//---- done with low level calls and interbraiding now create the arch for the fiat to many strategies design

const fiat = () => "0xF1AT";
const isFiat = (token) => token == fiat();

const plug = (fiat, ...tokens) =>
  [...tokens].map((token) => (isFiat(token) ? fiat : token));

const interweave = async (
  chainId,
  slippage,
  tLimit,
  bLimit,
  fiat,
  ...strategies
) => {
  // await bounce();
  const plugged = [...strategies].map((strategy) => plug(fiat, ...strategy));
  let interwoven = [];
  const start = performance.now();
  for (let i = 0, strategy, res; i < plugged.length; i++) {
    strategy = plugged[i];
    strategy = [...strategy]; //.filter((v, i, a) => a[i - 1] !== a[i]);
    // console.log("Interweaving Strategy: ", strategy);
    const signature = sign(
      chainId,
      slippage,
      tLimit,
      bLimit,
      sign(...strategy)
    );
    res = await braid(
      [signature],
      chainId,
      slippage,
      tLimit,
      bLimit,
      ...strategy
    ); //hung up
    // console.log("int-res: ", res);
    interwoven.push(res);
    await sleep(REM);
  }
  const end = performance.now();

  const runtime = end - start;
  // console.log(`\tRuntime: ${runtime / 1000} seconds`);
  const finalRes = interwoven.flat().filter((weave) => weave.length);

  // console.log("finalRes: ", finalRes); // we get to this point
  return finalRes;
};

const entwine = async (chainId, tokenIn, tokenOut, b, t) => {
  const WETH = weth(chainId);
  const fiats = vault(chainId);

  let entwined = [];

  for (let i = 0, res; i < fiats.length; i++) {
    // console.log("Entwining: ", fiats[i]);
    res = await interweave(
      chainId,
      0.005,
      b,
      t, //100k // .0001
      fiats[i],
      [fiat(), WETH, fiat()],
      [fiat(), tokenOut, fiat()],
      [fiat(), tokenIn, fiat()]
      // [fiat(), tokenIn, tokenOut, fiat()],
      // [fiat(), tokenOut, tokenIn, fiat()],
      // [WETH, fiat(), WETH],
      // [fiat(), tokenIn, WETH, tokenOut, fiat()],
      // [fiat(), tokenOut, WETH, tokenIn, fiat()],
      // [WETH, tokenOut, fiat(), tokenIn, WETH]
    );
    entwined.push(res);
    // console.log("Entwined inter Res: ", res);
    await sleep(REM);
  }
  const finalRes = entwined.flat();
  // console.log("Entwined Final Res: ", finalRes);
  return finalRes;
};

const tangle = async (chainId, tokenIn, tokenOut, b, t) => {
  const WETH = weth(chainId);

  let entangled = await interweave(
    chainId,
    0.005,
    b,
    t, //100k // .0001
    "0x",
    [WETH, tokenIn, WETH],
    [WETH, tokenOut, WETH]
    // [WETH, tokenIn, tokenOut, WETH],
    // [WETH, tokenOut, tokenIn, WETH]
  );
  const finalRes = entangled;
  // console.log("Entangled Final Res: ", finalRes);
  return finalRes;
};

const search = async (chainId, tokenIn, tokenOut, b, t) => {
  const start = performance.now();
  // await bounce();
  const [entangled, entwined] = await Promise.all([
    tangle(chainId, tokenIn, tokenOut, b, t),
    entwine(chainId, tokenIn, tokenOut, b, t),
  ]);
  // console.log("Entangled: ", entangled);
  // console.log("Entwined: ", entwined);
  const found = [entangled, entwined].flat();
  const end = performance.now();
  const runtime = end - start;
  // console.log(`\tSearch: ${runtime / 1000} seconds`);
  // console.log("found: ", found);
  return found;
};

module.exports.search = search;
//
// 0.01,
// 0.1,
// 0.0001, //100k // .0001
