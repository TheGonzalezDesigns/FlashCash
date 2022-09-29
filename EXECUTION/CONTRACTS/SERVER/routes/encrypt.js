'use strict'

//const fs = require("fs");
const repack = require('../baggage/suitcase.js');
const deliver = require("../baggage/deliver.js");
//const call = require("../call.js")

module.exports = async function (fastify, opts) {
  fastify.post('/encrypt', async function (request, reply) {
	  const message = request.body;
	  const parcel = message.envelope;
	  const { send } = contract;
		//console.log("step 1", parcel)
	  try 
	  {
	  	const enpaque = repack(parcel);
		//console.log("step 2", enpaque)
	  	const stats = message.stats;
		//console.log("step 3", stats)
	  	const profit = stats.profit
		//console.log("step 4", profit)
	  	const gas = stats.gas
		//Promise.resolve(getFiat()).then(fiat => console.log('Fiat:\t', fiat))
		//Promise.resolve(send(enpaque)).then(res => {console.log('Sent:\t', res)}, err => {console.error('Sent Failed:\t')});
		const options = {
			gasPrice: 3066995604, 
			gasLimit: 3000000,
		}
		const flash = async () => {
			const tx = await send(enpaque, options);
			try {
				const receipt = await tx.wait();
				console.log("Transaction Receipt: ", receipt);
				return receipt;
			} catch(e) {
				//throw Error(`Transaction Failed because: ${e?.reason !== undefined ? e.reason : e}`);
				throw Error(`Transaction Failed because: ${e}`);
			}
		}
		const report = await Promise.resolve(flash()).then(res => {console.log('Sent:\t', res)}, err => {console.error('Sent Failed:\t', err)});
	  	//const report = await deliver(profit, gas, flash);
		
		//console.log("-----------------------------------------------------------")
		console.log("------------------DELIVERY--WAS---SUCCESFUL----------------")
		//console.log("-----------------------------------------------------------")
		console.log("-", report);
		//console.log("-----------------------------------------------------------")
		console.log("------------------DELIVERY--WAS---SUCCESFUL----------------")
		//console.log("-----------------------------------------------------------")
		/*
		console.log("-", JSON.stringify(enpaque));
		console.log("-----------------------------------------------------------")
		console.log("------------------DELIVERY--WAS---SUCCESFUL----------------")
		console.log("-----------------------------------------------------------")
		console.log("-", JSON.stringify(parcel));
		console.log("-----------------------------------------------------------")
		console.log("------------------DELIVERY--WAS---SUCCESFUL----------------")
		console.log("-----------------------------------------------------------")
		*/
		return report;
	  } 
	  catch (e) 
	  {
		
		//console.error("***********************************************************")
		//console.error("****************DELIVERY**HAS***FAILED*********************")
		//console.error("***********************************************************")
		//console.error("*", JSON.stringify(parcel));
		//console.error("***********************************************************")
		console.error("****************DELIVERY**HAS***FAILED*********************")
		//console.error("***********************************************************")
		console.error("*", e);
		//console.error("***********************************************************")
		console.error("****************DELIVERY**HAS***FAILED*********************")
		//console.error("***********************************************************")
		
		return {status:500, error: e}
	  }
	  console.error(":::::::INTO THE VOID:::::")
	
  })
}
