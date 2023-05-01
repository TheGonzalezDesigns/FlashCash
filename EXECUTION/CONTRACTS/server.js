const { serve } = require("@honojs/node-server");
const { Hono } = require("hono");
const { path: onchain } = require("./routes/onchain.js");
const { path: offchain } = require("./routes/offchain.js");
// const { path: balancer } = require("./routes/balancer.js");
const { register } = require("./routes/utils.js");
const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

const app = new Hono();
//console.log("offchain: ", offchain)
//console.log("onchain: ", onchain)
register(app, onchain);
register(app, offchain);
// register(app, balancer);

const home = app;
const PORT = 2222;
/*
export default {
	port: PORT,
	fetch: home.fetch
}
*/
serve({
  fetch: home.fetch,
  port: PORT,
});
console.log(`\t🔌[AMADO_API@PORT:${PORT}]\n`);
const flag = "\t🔌_.:DATA TERMINAL READY:._\n";
const wave = () => console.info(flag);

wave();
setInterval(wave, 1800000);
