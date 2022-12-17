"use strict";
const path = require("path");
const AutoLoad = require("@fastify/autoload");
const cors = require("@fastify/cors");
const ops = {
  origin: "http://127.0.0.1:8888",
  allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  maxAge: 600,
  credentials: true,
};

const I = require("./../interface.js");

const wave = () => console.info("\t🔌_.:BLOCKCHAIN TERMINAL READY:._");

module.exports = async function (fastify, opts) {
  const contract = await I.initialize();
  const blockchain = I;
  //console.log("Interface log:", Object.keys(I));
  //console.log("Blockchain log:", blockchain);
  // console.log("contract:", contract);
  // Place here your custom code!
  fastify.register(cors, ops);
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
  wave();
  setInterval(wave, 1800000);
};
