import { Hono } from 'hono'
import { cors } from 'hono/cors'


const app = new Hono()
app.use(
 '/contracts/*',
 cors({
      origin: 'http://127.0.0.1:3000',
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    })
)

let i = 0;
let c = 0;
let silent = true
let check  = (marker) => !silent && console.log(`\n\r-->>> Check #${c++}: ${marker}`);
let reset = () => c = 0;

let process = (b, c) => {
		check("Entered process");
	let cargo = {
		baggage: b,
		collection: c
	}
	
	check("Formed cargo");
	
	cargo.collection = [...cargo.collection].filter(load => load.stats.profitable)
	
	check("Curated cargo collection");
	
	let collection = {};
	let profits = {};
		//console.log("Cargo:\t", cargo);	
	[...cargo.collection].forEach(load => collection[load.id.hash] = load)
	
	check("Iterated through collection");
	profits = [...cargo.collection]
		.map(load => load?.stats)

	check("Iterated through profits");
	yell("Profits", profits)
	
	let audited = [...cargo.baggage.ledger]
		.filter(bag => collection[bag.hash].id.block == bag.block).map(bag => collection[bag.hash].load)
	
	check("Audit formed");
	//console.clear();
	//console.error(`Audit #${i++}:\t`, audited)
	//console.error(`Cargo #${i++}:\t`, cargo)
	check("Process end");
	//Bun.write("./cargo.json", JSON.stringify(cargo))
	return audited;
}

let deliver = crates => {
	check("Beggining delivery");
	yell("crates", crates)
}


let yell = (name, what) => {
	let t = "";
	const r = d => t += d;
	r("\n\n\t\t                   ______________________                 ")
	r("\t\t         ___________________________________________          ")
	r("\t\t______________________________________________________________")
	r(`\t_________________________${name.split('').join("_").split('').map(t => t.toUpperCase()).join('_')}__________________________`)
	r("\t\t______________________________________________________________")
	r("\t\t",what)
	r("\t\t______________________________________________________________")
	r("\t\t         ___________________________________________          ")
	r("\t\t                   ______________________                 \n\n")
	console.log(r);
}

console.info("Server initiated...");

let ld = 0;

setInterval(() => {
	console.log(`#${ld++}: Server listening...`);
}, 2000);

app.post('/claim', async (c) => {
	reset();
	const baggage = await c.req.parseBody();
	check("Recieve req body");
	yell("BAGGAGE", baggage);
	const status = "Baggage " + (c._status == 200 ? "found" : "lost");
	check("Establish Status");
	if (baggage?.collection.length > 0) {
		check("Entered first conditional: (baggage?.collection.length > 0)");
		const collection = await Bun.file(baggage.collection).json();
		check("Retrieved collection");
		if (Object.keys(collection).length > 0) {
			check("Entered second conditional: (Object.keys(collection) > 0)");
			let audited = process(baggage, collection)

			if (Object.keys(audited).length > 0) {
				deliver(audited);
			}
			check("Exited process");
		}
	}
	check("Exited all conditionals;")
	return c.text(status)
})
.get('/contracts', (c) => c.redirect('http://127.0.0.1:3000/contracts'))

const home = app;

export default {
	port: 8888,
	fetch: home.fetch
}
