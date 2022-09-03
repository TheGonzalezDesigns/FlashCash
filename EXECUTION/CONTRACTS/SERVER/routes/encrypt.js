'use strict'

//const fs = require("fs");
const repack = require('../baggage/suitcase.js');

module.exports = async function (fastify, opts) {
  fastify.post('/encrypt', async function (request, reply) {
	  const parcel = repack(request.body)
	  //const { transfer } = contract;
	  //console.log(parcel);
	  //fs.writeFileSync("./dump.json", JSON.stringify(parcel))
	  //Promise.resolve(transfer(parcel))
	  //	.then(res => console.log("RES:\t", res), err => console.error("ERR:\t", err))
	  //const res = await getParcel();
    return parcel;
  })
}
