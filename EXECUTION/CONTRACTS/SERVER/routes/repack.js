'use strict'

//const fs = require("fs");
const repack = require('../baggage/suitcase.js');
const deliver = require("../baggage/deliver.js");
const call = require("../call.js")

module.exports = async function (fastify, opts) {
  fastify.post('/repack', async function (request, reply) {
	  const message = request.body;
	  const parcel = JSON.parse(message);

	  try {
	  	const enpaque = repack(parcel);
		return enpaque;
	  } catch (e) {
		return {status:500, error: e}
	  }
  })
}
