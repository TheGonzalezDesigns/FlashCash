const { Hono } = require("hono");
const { compose } = require("./utils.js");
const { search } = require("./swapper.js");

const name = "onchain";

let route = [];

route[name] = new Hono();

let _ = route[name];

let state = {
  time: 0,
};

_.get("/", (c) => c.text(`_.:${name.toUpperCase()} READY:._`));

_.get("/ping", (c) => c.redirect("http://localhost:3000/ping"));

_.get("/contracts", (c) => c.redirect("http://localhost:3000/contracts"));

_.post("/test", async (c) => {
  const baggage = await c.req.parseBody();

  let getRandom = () => {
    let min = 1;
    let max = 60000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  let validate = () => getRandom() < state.time--;

  let res = validate() && state.time ? 1 : 0;

  console.log(res ? "SUCESS" : "FALIURE");
  console.log(baggage);

  return c.text(res);
});

_.post("/test/restart/:time", (c) => {
  const time = c.req.param("time");

  state.time = parseInt(time) * 1000;

  return c.text(`Timer set to ${state.time}`);
});

_.post("/test/tick", (c) => {
  state.time--;
  return c.text(state.time);
});

_.get("/test/time", (c) => {
  return c.text(state.time);
});

_.get("/kyberswap/:chainId/:from/:to", async (c) => {
  const p = (param) => c.req.param(param);
  const chainId = p("chainId");
  const tokenIn = p("from").toLowerCase();
  const tokenOut = p("to").toLowerCase();
  const rL = .1;
  const rT = 1; //.1 - .001
  try {
    // console.log("\tSearching...");
    const found = await search(chainId, tokenIn, tokenOut, rL, rT);
    // console.log("Found:", found);
    return c.json(found);
  } catch (e) {
    console.error("Onchain error!", e);
  }
  return c.json([]);
});

//export const path = compose(_, name);
module.exports.path = compose(_, name);

//
// [tokenIn, fiat(), fiat(), tokenIn], [fiat(), weth(), weth(), fiat()];
