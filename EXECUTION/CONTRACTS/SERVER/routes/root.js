'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/ping', async function (request, reply) {
    return 42;
  })
}
