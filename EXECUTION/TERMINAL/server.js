import { Hono } from 'hono'
import { path as onchain } from './routes/onchain.js'
import { path as offchain } from './routes/offchain.js'
import { register } from './routes/utils.js'

const app = new Hono()
register(app, onchain);
register(app, offchain);

const home = app;

export default {
	port: 8888,
	fetch: home.fetch
}

const flag = "_.:DATA TERMINAL READY:._";
const wave = () => console.info(flag);

wave();
setInterval(wave, 10000);
