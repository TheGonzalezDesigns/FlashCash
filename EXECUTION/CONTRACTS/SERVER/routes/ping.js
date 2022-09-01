'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/ping', async function (request, reply) {
    let msg = { online: true }
	console.log("BLOCKCHAIN:\t", msg);
    return msg;
  })
}
