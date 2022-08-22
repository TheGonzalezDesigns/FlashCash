import { Hono } from 'hono'
const app = new Hono()

const home = app.post('/claim', async (c) => {
	const baggage = await c.req.parseBody();
	const status = "Baggage " + (c._status == 200 ? "found" : "lost")
	return c.text(status)
})

export default {
	port: 8888,
	fetch: home.fetch
}
