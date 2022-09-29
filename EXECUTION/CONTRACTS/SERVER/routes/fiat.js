'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/fiat', async function (request, reply) {
	  const { getFiat } = contract;
	  try 
	  {
		const flash = async () => {
			const tx = await getFiat();
			try {
				const receipt = await tx.wait();
				console.log("Transaction Receipt: ", receipt);
				return receipt;
			} catch(e) {
				throw Error(`Transaction Failed because: ${e}`);
			}
		}
		Promise.resolve(flash()).then(res => {console.log('Sent:\t', res)}, err => {console.error('Sent Failed:\t', err)});
		
	  } 
	  catch (e) 
	  {
		
		console.error("****************DELIVERY**HAS***FAILED*********************")
		console.error("*", e);
		console.error("****************DELIVERY**HAS***FAILED*********************")
		
		return {status:500, error: e}
	  }
	  console.error(":::::::INTO THE VOID:::::")
	
  })
}
