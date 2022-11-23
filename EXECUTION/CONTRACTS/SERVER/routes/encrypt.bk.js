'use strict'

//const fs = require("fs");
//const repack = require('../baggage/suitcase.js');
const deliver = require("../baggage/deliver.js");
const board = require("../baggage/board.js");
const { utils:blockchain } = require("./../../interface.js");
//const call = require("../call.js")

module.exports = async function (fastify, opts) {
	fastify.post('/encrypt', async function (request, reply) {
		const { sendV1, sendV2, sendV3 } = contract;
		const { getNonce, getLiveNonce, increaseNonce, register } = blockchain;
		let nonce = await getLiveNonce();
		console.log("getNonce: ", nonce)
		//nonce = await increaseNonce();
		//console.log("increaseNonce: ", nonce)
		//console.log("BC: ", Object.keys(I))
		const message = request.body;
		//console.log(message)
		/*
		const parcel = message.envelope;
		const { send } = contract;
		const meta =  parcel[0].meta[1];
		*/
		const from = message.from;
		const to = message.to;
		const price = message.price
		const block = 99999999999999999999;
		//const block = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
	
		const ticket = {
			from: from,
			to: to,
			price: price,
			account: '0x73B0d3cfD2C8d3C4fC37B1a5de32C9C1CC99B006',
			//account: '0x46894f97CdA0104c2634BC6C4acf7e9C636C63E5',
			block: block
		}
	
		
		//console.log("parcel:", parcel)

		const flights = await board(ticket.from, ticket.to, ticket.price, ticket.block, ticket.account);
		const tradable = flights.length > 0;
		//console.log('Ticket', ticket)
		//console.log("Flights: ", flights);

		//if (flight.tradable) 

		if (tradable)
		{
			//console.clear()
			//console.log("Flights: ", flights);
			//console.log('Ticket', ticket)
	
			try 
			{
			  	//const profit = stats.profit
				//console.log("step 4", profit)
			  	//const gas = stats.gas
				//Promise.resolve(getFiat()).then(fiat => console.log('Fiat:\t', fiat))
				//Promise.resolve(send(enpaque)).then(res => {console.log('Sent:\t', res)}, err => {console.error('Sent Failed:\t')});
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
					// console.log("Entry: ", JSON.stringify(entry))
					// console.log("Bridge: ", JSON.stringify(bridge))
					// console.log("Exit: ", JSON.stringify(exit))
					// console.log("Strategy: ", strategy)

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
					//const tx = await plan();
					//const tx = await {};
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
				const takeOf = async (flight, i) => await Promise.resolve(flash(flight, i)).then(res => {console.log('Congrats:\t', res)}, err => {console.error('Sent Failed:\t', err)});
			  	//const report = await deliver(profit, gas, flash); // <<<<<----repeater!!
				//const attempts = [[...flights][0]].map(async (flight, i) => await takeOf(flight, i))
				const attempts = [...flights].map(async (flight, i) => await register(takeOf, flight, i))

				const report = await Promise.allSettled(attempts);
				

				//const report = await takeOf(flights[0])
					
				//console.log("-----------------------------------------------------------")
				//console.log("------------------DELIVERY--WAS---SUCCESFUL----------------")
				//console.log("-----------------------------------------------------------")
				//console.log("-", report);
				//console.log("-----------------------------------------------------------")
				//console.log("------------------DELIVERY--WAS---SUCCESFUL----------------")
				//console.log("-----------------------------------------------------------")
				
					
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
				//console.error("***********************************************************")
				console.error("****************DELIVERY**HAS***FAILED*********************")
				//console.error("***********************************************************")
			
				return {status:500, error: e}
			}
			console.error(":::::::INTO THE VOID:::::")
		}
		return {status: 500, error: {msg: "unprofitable"}}
	})
}
