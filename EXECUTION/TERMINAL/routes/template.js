import { Hono } from 'hono'
import { compose } from './utils.js'

const name = "offchain";

let route = [];

route[name] = new Hono();

let _ = route[name];

_.get("/", c => c.text(`_.:${name.toUpperCase()} READY:._`))

export const path = compose(_, name);
