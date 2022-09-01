'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/test/:params', async function (request, reply) {
    	let msg = { online: true }
	console.log("BLOCKCHAIN:\t", msg);
	//console.log(request.body)
	  //console.log(request.query)
	  console.log(request.params)
	  //console.log(request.headers)
	  //console.log(request.raw)
	  //console.log(request.server)
	  //console.log(request.id)
	  //console.log(request.ip)
	  //console.log(request.ips)
	  //console.log(request.hostname)
	  //console.log(request.protocol)
	  //console.log(request.url)
	  //console.log(request.routerMethod)
	  //console.log(request.routerPath)
	  //request.log.info('some info')
	  return msg;
})
}
