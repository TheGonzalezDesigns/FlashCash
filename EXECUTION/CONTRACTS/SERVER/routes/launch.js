'use strict'

//const fs = require("fs");
//const repack = require('../baggage/suitcase.js');
const deliver = require("../baggage/deliver.js");
const board = require("../baggage/board.js");
const { utils:blockchain } = require("./../../interface.js");
//const call = require("../call.js")

module.exports = async function (fastify, opts) {
	fastify.post('/launch', async function (request, reply) {
		const { sendV1, sendV2, sendV3 } = contract;
		const { getNonce, getLiveNonce, increaseNonce, register } = blockchain;
		let nonce = await getLiveNonce();
		console.log("getNonce: ", nonce)
		const message = request.body;
		console.log("Message", Object.keys(message))
		try 
		{
			const genOps = async (tag) => {
				const options = {
					gasPrice: 306699560400, //2500000000 
					gasLimit: 3000000,
						nonce: await increaseNonce(tag)
				}
				return options;
			}

			const flash = async (flight, i) => {
				let tag = `#${nonce}-${i}-${getNonce()}`
				console.log(`Boarding Flight ${tag}`)
				const entry = flight.entry;
				const bridge = flight.bridge;
				const exit = flight.exit;
				const strategy = flight.strategy;

				let tx;
				let c = strategy;
				
				const options = await genOps(tag);
				
				tag = `#${nonce}-${i}-${getNonce()}`

				switch(strategy) {
					case(1):
						tx = await sendV1(entry, strategy, options);
						//console.log(`Executing strategy #${c}`, flight)
					break;
					case(2):
						tx = await sendV2(entry, bridge, strategy, options); 
						//console.log(`Executing strategy #${c}`, flight)
					break;
					case(3):
						tx = await sendV3(entry, bridge, exit, strategy, options); 
						//console.log(`Executing strategy #${c}`, flight)
					break;
					case(4):
						tx = await sendV2(entry, exit, strategy, options); 
						//console.log(`Executing strategy #${c}`, flight)
					break;
					case(5):
						tx = await sendV2(bridge, exit, strategy, options); 
						//console.log(`Executing strategy #${c}`, flight)
					break;
					case(6):
						tx = await sendV1(exit, strategy, options); 
						//console.log(`Executing strategy #${c}`, flight)
					break;
					case(7):
						tx = await sendV1(bridge, strategy, options); 
						//console.log(`Executing strategy #${c}`, flight)
					break;
				}
				try {
					//console.log("Transaction: ", tx);
					console.log(`Launching Flight ${tag}`)
					tx = await tx;
					const receipt = await tx.wait();
					//const receipt = await {};
					console.log("Transaction Waited: ", receipt);
					//console.log("Transaction Receipt: ", receipt);
					console.log(`Confirmed Flight ${tag}`)
					return await receipt;
				} catch(e) {
					console.log(`Reporting crash for Flight ${tag}`)
					//throw Error(`Transaction Failed because: ${e?.reason !== undefined ? e.reason : e}`);
					throw Error(`Transaction Failed because: ${e}`);
					//throw Error(`Transaction Failed`);
				}
			}
			const report = await Promise.resolve(flight).then(res => {console.log('Congrats:\t', res)}, err => {console.error('Sent Failed:\t', err)});
				
			return {status: 200, response: report};
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
			console.error("****************DELIVERY**HAS***FAILED*********************")
			//console.error("***********************************************************")
		
			return {status:500, error: e}
		}
	})
}
