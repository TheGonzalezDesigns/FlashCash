const { Hono } = require("hono");
const { compose, hashify, sleep } = require("./utils.js");
const { json } = require("stream/consumers");

const name = "balancer";

let route = [];

route[name] = new Hono();

let _ = route[name];

let blobal = [];
let state = {
  queue: [],
  registry: {},
  deadline: 
};
_.get("/", (c) => c.text(`_.:${name.toUpperCase()} READY:._`));
_.get("/access", (c) => c.text(JSON.stringify(blobal)));
_.post("/clear", (c) => {
  blobal = [];
  return c.json(blobal);
});
_.post("/push/:tag", (c) => {
  const p = (param) => c.req.param(param);
  const tag = () => Number(p("tag"));
  blobal.push({
    pos: blobal.length,
    tag: tag(),
    match: blobal.length == tag(),
  });
  return c.json(blobal);
});
_.post("/batch/:e", async (c) => {
  const p = (param) => c.req.param(param);
  const e = () => Number(p("e"));
  let slug = `http://localhost:8888/balancer/push`;
  console.log(`\t\t\t\t=> Proxying: ${slug}`);
  let push = async (tag) =>
    await (
      await fetch(`${slug}/${tag}`, { method: "POST", timeout: 6000000 })
    ).json();

  Array.from(Array(Number(`1e${e()}`)).keys()).forEach(
    async (_, i) => await push(i)
  );

  slug = `http://localhost:8888/balancer/access`;
  console.log(`\t\t\t\t=> Proxying: ${slug}`);
  res = await (await fetch(slug, { method: "GET" })).json();
  const offsync = res.filter((x) => x.match == false);

  let sum = 0;
  offsync.forEach((x) => {
    // console.log(`(${sum} += ${x.pos} - ${x.tag})`);
    sum += Math.abs(x.pos - x.tag);
  });
  const positions = [...offsync].map((x) => x.pos);
  console.log(positions);
  const start = Math.min(...positions);
  const end = Math.max(...positions);
  const dominance = offsync.length / res.length;

  let stats = {
    quantity: offsync.length,
    average: sum / offsync.length,
    start: start,
    end: end,
    dominance: dominance,
  };
  return c.json(stats);
});

_.post("/proxy/:chain/:chainId/:from/:to/:amount", async (c) => {
  let signature;
  try {
    const package = await c.req.json();
    // console.log("Package: ", package);
    signature = package;
  } catch (e) {
    console.error("Couldn't retrieve package from call: ", e);
  }
  const p = (param) => c.req.param(param);
  const data = {
    tokenIn: p("from").toLowerCase(),
    tokenOut: p("to").toLowerCase(),
    price: p("amount"),
    chain: p("chain"),
    chainId: p("chainId"),
  };
  const tokenIn = data.tokenIn;
  const tokenOut = data.tokenOut;
  const price = data.price;
  const chain = data.chain;
  const chainId = data.chainId;
  const hash = hashify(tokenIn, tokenOut, chain, price);
  const slug = `http://localhost:8888/balancer/register/${hash}/${chain}/${tokenIn}/${tokenOut}/${price}`;
  //   const slug = `http://localhost:8888/balancer/try/${chain}/${chainId}/${tokenIn}/${tokenOut}/${price}`;
  //   console.log(`\t\t\t\t=> Proxying: ${slug}`);
  const res = await (
    await fetch(slug, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signature),
      method: "POST",
    })
  ).json();
  return c.json(res);
});
_.post("/register/:hash/:chain/:from/:to/:amount", async (c) => {
  let signature;
  try {
    const package = await c.req.json();
    // console.log("Package: ", package);
    signature = package;
  } catch (e) {
    console.error("Couldn't retrieve package from call: ", e);
  }
  const p = (param) => c.req.param(param);
  const id = p("hash");
  const data = {
    tokenIn: p("from").toLowerCase(),
    tokenOut: p("to").toLowerCase(),
    price: p("amount"),
    chainId: p("chainId"),
    hash: id,
    signature: signature,
  };
  state.registry[id] = data;
  return c.json(state);
});
_.get("/try/:chain/:chainId/:from/:to/:amount", async (c) => {
  const p = (param) => c.req.param(param);
  const data = {
    tokenIn: p("from").toLowerCase(),
    tokenOut: p("to").toLowerCase(),
    price: p("amount"),
    chain: p("chain"),
    chainId: p("chainId"),
  };
  const tokenIn = data.tokenIn;
  const tokenOut = data.tokenOut;
  const price = data.price;
  const chain = data.chain;
  const chainId = data.chainId;
  const slug = `http://localhost:4444/api?chain=${chain}&chainId=${chainId}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${price}`;
  //   console.log(`\t\t\t\t\t=> Trying: ${slug}`);
  const res = await (await fetch(slug, {})).json();
  //   console.log("Call response: ", res);
  return c.json(res);
});

module.exports.path = compose(_, name);
