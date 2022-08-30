'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/contracts', async function (request, reply) {
	  console.log(contract);
	  const { getIdentifier } = contract;
	  const res = await getIdentifier();
    return res.toNumber();
  })
}
