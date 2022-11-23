const { Hono } = require('hono')
const { compose, yell, send } = require('./utils.js')
const { audit, deliver } = require('./validate.js')
const conversions = require('./conversions.json');

const name = "offchain";

let route = [];

route[name] = new Hono();

let _ = route[name];
let count = 0;
_.get("/", c => c.text(`_.:${name.toUpperCase()} READY:._`))

_.post('/validate', async (c) => {	
	const baggage = await c.req.json();
	const status = "Baggage " + (c._status == 200 ? "found" : "lost");
	//console.log("status: ", status);
	if(c._status == 200) {
		if (baggage?.collection.length > 0) {
			//console.log("Baggage", baggage)
			const path = `${process.env.PWD}/../${baggage.collection}`
			let collection;
			try {
				//console.log("baggage.collection:\t", path)
				//console.log("PWD:\t", process.env.PWD)
				//collection = await Bun.file(path).json();
				collection = require(path)
				//console.log("collection:\t", collection)
				console.log("Parcel #", count++);
			} catch (e) {
				console.error("File error:\t", e);
			}
			if (Object.keys(collection).length > 0) {
				const audited = audit(baggage, collection)
				//console.log("Audit finished", audited);
				if (Object.keys(audited).length > 0) {
					//console.log("Beggining delivery");
					let res = deliver(audited);
					//console.log("Delivery finished");
					return c.json(res);
				} else console.error("Audit failed:", audited)
				return c.json(audited);
			} else console.error("Invalid collection:", collection)
		}
		return c.text(baggage)
	}
	return c.text(status)
})

_.get('/convert/:address/:price', (c) => {
	const token = c.req.param("address").toLowerCase();
	const price = c.req.param("price");
	const rate = conversions[token];
	const amount = Math.round(price * rate);
	//console.log("token:", token)
	//console.log("rate:", rate)
	//console.warn(`${token} @ ${price} : ${rate} = ${amount}`);
	return c.text(amount)
})

module.exports.path = compose(_, name);
