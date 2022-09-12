'use strict'

//const fs = require("fs");
const repack = require('../baggage/suitcase.js');
const deliver = require("../baggage/deliver.js");
const call = require("../call.js")

module.exports = async function (fastify, opts) {
  fastify.post('/encrypt', async function (request, reply) {
	  const message = request.body;
	  const parcel = JSON.parse(message.envelope);

	  try {
	  	const enpaque = repack(parcel);
	  	const stats = message.stats;
	  	const profit = stats.profit
	  	const gas = stats.gas
	  	//const { transfer } = contract;
	  	//const report = deliver(profit, gas, transfer, enpaque)
	  	const report = deliver(profit, gas, call, enpaque)
		return report;
	  } catch (e) {
		return {status:500, error: e}
	  }
  })
}
