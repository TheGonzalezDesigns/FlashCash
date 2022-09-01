'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/contracts', async function (request, reply) {
	  console.log(request.body);
	  const { getIdentifier } = contract;
	  const res = await getIdentifier();
    return res.toNumber();
  })
}
