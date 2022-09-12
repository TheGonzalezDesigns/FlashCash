import { Hono } from 'hono'
import { compose } from './utils.js'

const name = "onchain";

let route = [];

route[name] = new Hono();

let _ = route[name];

let state = {
	time: 0,
}

_.get("/", c => c.text(`_.:${name.toUpperCase()} READY:._`))

_.get("/ping", c => c.redirect("http://localhost:3000/ping"))

_.get("/contracts", c => c.redirect("http://localhost:3000/contracts"))

_.post("/test", async (c) => {
	
	const baggage = await c.req.parseBody();
	
	let getRandom = () => {
		let min = 1;
		let max = 60000;
		return Math.floor(Math.random() * (max - min + 1) + min); 
	}

	let validate = () => getRandom() < state.time--;

	let res = validate() && state.time ? 1 : 0;

	console.log(res ? "SUCESS" : "FALIURE")
	console.log(baggage);

	return c.text(res)
})

_.post("/test/restart/:time", c => {

	const time = c.req.param('time')

	state.time = parseInt(time) * 1000;

	return c.text(`Timer set to ${state.time}`)

})

_.post("/test/tick", c => {
	state.time--;
	return c.text(state.time)
})

_.get("/test/time", c => {
	return c.text(state.time)
})

export const path = compose(_, name);
