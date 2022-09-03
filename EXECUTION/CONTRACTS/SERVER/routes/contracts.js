'use strict'

//const fs = require("fs");

module.exports = async function (fastify, opts) {
  fastify.post('/contracts', async function (request, reply) {
	  console.log(request.body);
	  //fs.writeFileSync("./dump.json", JSON.stringify(request.body))
	  const { getState, increase } = contract;
	  //Promise.resolve(increase())
	  //	.then(res => console.log("RES:\t", res), err => console.error("ERR:\t", err))
	  const res = await getState();
    return res.toNumber();
  })
}
