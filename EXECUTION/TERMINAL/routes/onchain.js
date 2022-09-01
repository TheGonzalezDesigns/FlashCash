import { Hono } from 'hono'
import { compose } from './utils.js'

const name = "onchain";

let route = [];

route[name] = new Hono();

let _ = route[name];

_.get("/", c => c.text(`_.:${name.toUpperCase()} READY:._`))

_.get("/ping", c => c.redirect("http://localhost:3000/ping"))

_.get("/contracts", c => c.redirect("http://localhost:3000/contracts"))

export const path = compose(_, name);
