export const compose = (route, name) => {
	return {
		route: route,
		name: name
	}
}

export const register = (origin, path) => {
	origin.route(`/${path.name}`, path.route);
}

export const yell = (name, what) => {
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
	console.info(t);
	return t;
}

export const send = (path, ops) => {
	return fetch(`http://localhost:3000${path}`, ops)
}
