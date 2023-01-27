const express = require("express");
const axios = require("axios");
const app = express();
const process = require('node:process');
process.centralstate = {}

const services = require("./services.js");
const { json } = require("stream/consumers");

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

const execute = (service) => {
  const method = services[service];
  if (!method) throw Error(`CentralBank Error: ${service} is not a registered service.`);
  return method;
};

app.post("/centralbank", async (req, res) => {
  let { service, payload } = req.body;
  try {
    payload.chainID ||= process.centralstate.chainID;
    console.log(`Payload for: ${service}`, payload)
    const feedback = await execute(service)(payload)
    res.send({ feedback });
  } catch (e) {
    console.error(e);
    res.send({ error: e })
  }
  return 0;
});

app.post("/centralstate", async (req, res) => {
  let state = req.query;
  try {
    console.log("CentralState: ", state)
    Object.keys(state).forEach(key => process.centralstate[key] = state[key])
    console.log("CentralState: ", process.centralstate)
    res.send(process.centralstate);
  } catch (e) {
    console.error("CentralBank Error: ", e);
    res.send({ error: "CentralBank Error" })
  }
  return 0;
});
app.get("/centralstate", async (req, res) => {
  let queries = req.query;
  try {
    let inquiry = {};
    [...Object.keys(queries)].filter(query => process.centralstate?.[query]).forEach(key => inquiry[key] = process.centralstate[key])
    res.send(inquiry);
  } catch (e) {
    console.error("CentralBank Error: ", e);
    res.send({ error: "CentralBank Error" })
  }
  return 0;
});

const PORT = 9999;
const wave = () => console.log("\t🔌_.:CENTRALBANK LEDGER READY:._");
app.listen(PORT, () => {
  console.log(`\n\t🔌[CentralBank@port:${PORT}]\n`);
  wave();
  setInterval(wave, 1800000);
});
