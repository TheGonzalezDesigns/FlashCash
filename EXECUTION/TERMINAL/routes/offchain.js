import { Hono } from 'hono'
import { compose, yell, send } from './utils.js'
import { audit, deliver } from './validate.js'

const name = "offchain";

let route = [];

route[name] = new Hono();

let _ = route[name];

_.get("/", c => c.text(`_.:${name.toUpperCase()} READY:._`))

_.post('/validate', async (c) => {	
	const baggage = await c.req.parseBody();
	const status = "Baggage " + (c._status == 200 ? "found" : "lost");
	if(c._status == 200) {
		if (baggage?.collection.length > 0) {
			console.log("Baggage", baggage)
			const path = `${process.env.PWD}/../${baggage.collection}`
			let collection;
			try {
				//console.log("baggage.collection:\t", path)
				//console.log("PWD:\t", process.env.PWD)
				collection = await Bun.file(path).json();
				//console.log("collection:\t", collection)
			} catch (e) {
				console.error("File error:\t", e);
			}
			if (Object.keys(collection).length > 0) {
				const audited = audit(baggage, collection)
				if (Object.keys(audited).length > 0) {
					return deliver(audited);
				}
				return c.json(audited);
			}
		}
		return c.text(baggage)
	}
	return c.text(status)
})

export const path = compose(_, name);
