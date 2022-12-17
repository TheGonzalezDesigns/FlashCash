const { Console } = require("console");
const chains = require("./chains.json");
const { hashify, sleep } = require("./utils.js");

const REM = 0.05;

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

const entryIsFiat = (data, chainId) => hasFiat(data[1][0], chainId);

const exitIsFiat = (data, chainId) => hasFiat(data[1][1], chainId);

const hasAnyFiat = (data, chainId) =>
  entryIsFiat(data, chainId) && exitIsFiat(data, chainId);

const fiatCode = (data, chainId) =>
  entryIsFiat(data, chainId) ? 0 : exitIsFiat(data, chainId) ? 1 : 2;

const getAmount = async (address, price) => {
  const path = `offchain/convert/${address}/${price}`;
  const ops = {
    method: "GET",
  };
  const amount = await fetch(`http://localhost:8888/${path}`, ops);
  return amount;
};

const call = async (signature, chain, chainId, tokenIn, tokenOut, amountIn) => {
  amountIn = BigInt(amountIn);
  //   console.log("Timestamp: ", new Date().toISOString());
  const slug = `http://localhost:4444/api?chain=${chain}&chainId=${chainId}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`;
  // console.log(`\t\t\t\t\t=> Trying: ${slug}`);
  const res = await (await fetch(slug, {})).json();
  // console.log("Call response: ", res);
  return res;
  //   const slug = `http://localhost:8888/balancer/proxy/${chain}/${chainId}/${tokenIn}/${tokenOut}/${amountIn}`;
  //   //   console.log(`\t\t\t=> Calling: ${slug} \n\t\t\twith amount: `, amountIn);
  //   //   console.log(`\t\t\t=> Calling: ${slug}`);
  //   //   return await {};
  //   const res = await (
  //     await fetch(slug, {
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(signature),
  //       method: "POST",
  //     })
  //   ).json();
  //   console.log(`Call response ${Object.keys(res.registry).length}: `, res);
  //   //   console.log(signature);
  //   //   return res;
  //   return [];
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
  const zel = delta(a, b) > 0 ? up() : "-";
  //   console.log(`\t\t\t [-:}> zelta(${a}, ${b}) > 0 <:-] == ${zel}`);
  return zel;
};
const profitability = (USDin, USDout) => delta(USDin, USDout); // al three into one function
const profit = (USDin, USDout) => USDout - USDin;
const tradable = (
  profit,
  profitability,
  expectedProfit,
  expectedProfititability
) => {
  const acceptableProfitability = profitability >= expectedProfititability;
  // const acceptableProfit = profit(USDin, USDout) >= expectedProfit;
  const acceptableProfit = profit >= expectedProfit;
  //   console.log(
  //     `\t=> (${USDin}, ${USDout}) :: acceptableProfitability: ${acceptableProfitability} || acceptableProfit: ${acceptableProfit}`
  //   );
  return acceptableProfitability && acceptableProfit;
};
const profitable = (profit, profititability, price) => {
  const expectedProfititability = 0.0; //.05
  const expectedProfit = 0.0;
  price = price >= 1 ? `$${Number(price).toLocaleString()}` : `${price * 100}¢`;
  if (
    tradable(profit, profititability, expectedProfit, expectedProfititability)
  ) {
    console.log(`\t${good()} [:>> ${price} <<:]`);
    return true;
  } else {
    // console.log(
    //   `tradable(${USDin}, ${USDout}, ${expectedProfit}, ${expectedProfititability})`
    // );
    console.log(`\t${bad()} [:> ${price}`);
    return false;
  }
};

const flow = (type, ...movements) => {
  let movement = movements[0];
  let f = `[:> Flow of ${type}: ${movement} `;
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

const deltas = (type, ...movements) => {
  //   console.log("deltas: ", movements);
  let movement = movements[0];
  let f = `[:> Delta Flow of ${type}: ${delta(movement, movements[1])} `;
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
  let f = `[:> Heatmap of ${type}: ${zelta(movement, movements[1])} `;
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
  f = "\t\t" + (_zelta == up() ? up() : bad()) + " " + f;
  console.log(f);
};

const follow = (...addresses) => {
  let address = addresses[0];
  let f = `\t\t[:> Flow of tokens: ${address} `;
  for (let i = 1; i < addresses.length; i++) {
    address = addresses[i];
    f += `=> ${address} `;
  }
  f += " <:]";
  console.log(f);
};

const track = (...movements) => {
  // console.log("Movements: ", movements);
  flow("USD", ...movements);

  deltas("USD", ...movements);

  heatmap("USD Deltas", ...movements);
};

const trace = (...strategy) => {
  // console.log("Strategy: ", strategy);
  let movements = [];
  let addresses = [];
  let cryptos = [];
  [...strategy].forEach((movement) => {
    // console.log("Movement: ", movement);
    addresses.push(movement.data[1][0]);
    addresses.push(movement.data[1][1]);
    movements.push(movement.USDin); //fix this
    movements.push(movement.USDout); //fix this //recieved ? or just change it all together
    cryptos.push(movement.CRYin);
    cryptos.push(movement.CRYout);
  });
  //   flow("CRYPTO", ...cryptos);
  //   deltas("CRYPTO", ...cryptos);
  follow(...addresses);
  track(...movements);
};

const swap = async (signature, chainId, tokenIn, tokenOut, amountIn) => {
  try {
    const chain = identify(chainId);
    // console.log(
    //   `\t\t\t\t\t=> call(${chain}, ${chainId}, ${tokenIn}, ${tokenOut}, ${amountIn})`
    // );
    const _ = await call(
      signature,
      chain,
      chainId,
      tokenIn,
      tokenOut,
      amountIn
    );
    let trade = {};
    trade.data = _.data;
    if (Object.keys(trade.data).length < 1) {
      throw Error();
    }
    trade.profit = _.stats.profit;
    trade.profitability = _.stats.profitability;
    trade.USDin = _.stats.amountIn;
    trade.USDout = _.stats.recieved;
    trade.CRYin = _.stats.crypto.amountIn;
    trade.CRYout = _.stats.crypto.amountOut;
    trade.gasPrice = _.stats.gas.gwei;
    trade.gasCost = _.stats.gas.totalGas;
    trade.gasTotal = _.stats.gas.gasUsd;
    // trade.entryIsFiat = entryIsFiat(trade.data, chainId);
    // trade.exitIsFiat = exitIsFiat(trade.data, chainId);
    // trade.hasAnyFiat = hasAnyFiat(trade.data, chainId);
    trade.fiatCode = fiatCode(trade.data, chainId);

    // console.log("swap: ", trade);
    return trade;
  } catch (e) {
    // console.log("Trade: ", trade);
    // console.error(e);
    throw Error("Swapper: Invalid or Unresolved Trade");
  }
};

const fuse = async (signature, tokenIn, tokenOut, amount, chainId) => {
  try {
    // console.log(
    //   `\t\t\t\t=> swap(${chainId}, ${tokenIn}, ${tokenOut}, ${amount})`
    // );
    let _ = await swap(signature, chainId, tokenIn, tokenOut, amount);
    // const USDin = _.USDin;
    // const USDout = _.USDout;
    // _.profit = profit(USDin, USDout);
    // _.profit = profit(USDin, USDout);
    // _.profitability = profitability(USDin, USDout);
    // _.profitability = profitability(USDin, USDout);

    // console.log("_: ", _);
    return _;
  } catch (e) {
    throw Error(e);
  }
};

const weave = async (signature, chainId, entryAmount, slippage, ...tokens) => {
  try {
    let strategy = [];
    let _ = {};
    let tokenIn, tokenOut;
    let amount = entryAmount;
    for (let i = 1; i < tokens.length; i++) {
      tokenIn = tokens[i - 1];
      tokenOut = tokens[i];
      //   console.log(
      //     `\t\t\t=> ${i}) fuse(${tokenIn}, ${tokenOut}, ${amount}, ${chainId})`
      //   );
      //   console.log("fuse_sig: ", [
      //     ...signature,
      //     sign(tokenIn, tokenOut, amount, chainId),
      //   ]);
      _ = await fuse(
        [...signature, sign(tokenIn, tokenOut, amount, chainId)],
        tokenIn,
        tokenOut,
        amount,
        chainId
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
    throw Error(e);
  }
};

const interlace = async (signature, chainId, price, slippage, ...tokens) => {
  try {
    const entryToken = tokens[0];
    const entryAmount = hexify(
      BigInt(
        Math.round(Number(await (await getAmount(entryToken, price)).text()))
      )
    );
    const strategy = await weave(
      [...signature, sign(chainId, entryAmount, slippage, sign(...tokens))],
      chainId,
      entryAmount,
      slippage,
      ...tokens
    );
    const entry = strategy.at(0);
    const exit = strategy.at(-1);
    // const USDin = entry.USDin;// swith to profit and
    // const USDout = exit.USDout;
    // const tProfit = profit(USDin, USDout);
    // const tProfitability = profitability(USDin, USDout);profitability
    const profit = entry.profit;
    const profitability = entry.profitability;
    const tradable = profitable(profit, profitability, price);

    if (!tradable)
      throw Error(`Interlace: Unprofitable swap @ -$${profit * -1}`);
    // else console.log("interlace/strategy:", strategy);
    trace(...strategy);
    return strategy;
  } catch (e) {
    const params = {
      chainId: chainId,
      price: price,
      slippage: slippage,
      tokens: tokens,
    };
    // console.error(e);
    // console.error("Params: ", params);
    return await [];
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
    .map((x) => Array.from([1], (y) => Number((y * x).toPrecision(1))))
    .flat();
  let trades = [];
  for (let i = 0, price, res; i < prices.length; i++) {
    price = prices[i];
    res = await interlace(
      [...signature, sign(chainId, price, slippage, sign(...tokens))],
      chainId,
      price,
      slippage,
      ...tokens.filter((v, i, a) => a[i - 1] !== a[i])
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
  const plugged = [...strategies].map((strategy) => plug(fiat, ...strategy));
  let interwoven = [];
  const start = performance.now();
  for (let i = 0, strategy, res; i < plugged.length; i++) {
    strategy = plugged[i];
    strategy = [...strategy].filter((v, i, a) => a[i - 1] !== a[i]);
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
    );
    interwoven.push(res);
    await sleep(REM);
  }
  const end = performance.now();

  const runtime = end - start;
  // console.log(`\tRuntime: ${runtime / 1000} seconds`);
  return interwoven.flat().filter((weave) => weave.length);
};

const entwine = async (chainId, tokenIn, tokenOut, b, t) => {
  const WETH = weth(chainId);
  const fiats = vault(chainId);

  let entwined = [];

  for (let i = 0, res; i < fiats.length; i++) {
    // console.log("Entwining: ", fiats[i]);
    res = await interweave(
      chainId,
      0.01,
      b,
      t, //100k // .0001
      fiats[i],
      [fiat(), tokenIn],
      [fiat(), tokenOut],
      [fiat(), WETH],
      [tokenIn, fiat()],
      [tokenOut, fiat()]
    );
    entwined.push(res);
    await sleep(REM);
  }
  return entwined.flat();
};

const tangle = async (chainId, tokenIn, tokenOut, b, t) => {
  const WETH = weth(chainId);

  let entangled = await interweave(
    chainId,
    0.01,
    b,
    t, //100k // .0001
    "0x",
    [tokenIn, WETH],
    [tokenOut, WETH],
    [WETH, tokenIn],
    [WETH, tokenOut],
    [tokenIn, tokenOut],
    [tokenOut, tokenIn]
    // [tokenIn, tokenOut, WETH],
    // [tokenOut, tokenIn, WETH],
    // [tokenIn, WETH, tokenOut]
  );
  return entangled;
};

const search = async (chainId, tokenIn, tokenOut, b, t) => {
  const start = performance.now();
  const entangled = await tangle(chainId, tokenIn, tokenOut, b, t);
  const entwined = await entwine(chainId, tokenIn, tokenOut, b, t);
  const found = [entangled, entwined].flat();
  const end = performance.now();
  const runtime = end - start;
  // console.log(`\tSearch: ${runtime / 1000} seconds`);
  return found;
};

module.exports.search = search;
//
// 0.01,
// 0.1,
// 0.0001, //100k // .0001
