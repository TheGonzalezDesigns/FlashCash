module.exports.compose = (route, name) => {
  return {
    route: route,
    name: name,
  };
};

module.exports.register = (origin, path) => {
  origin.route(`/${path.name}`, path.route);
};

module.exports.yell = (name, what) => {
  let t = "";
  const r = (d) => (t += d);
  r("\n\n\t\t                   ______________________                 ");
  r("\t\t         ___________________________________________          ");
  r("\t\t______________________________________________________________");
  r(
    `\t_________________________${name
      .split("")
      .join("_")
      .split("")
      .map((t) => t.toUpperCase())
      .join("_")}__________________________`
  );
  r("\t\t______________________________________________________________");
  r("\t\t", what);
  r("\t\t______________________________________________________________");
  r("\t\t         ___________________________________________          ");
  r("\t\t                   ______________________                 \n\n");
  console.info(t);
  return t;
};

module.exports.send = (path, ops) => {
  //console.log(`Sending [${path}]`, ops);
  return fetch(`http://localhost:3000${path}`, ops);
};

module.exports.hashify = (tokenIn, tokenOut, chain, amount) => {
  const cut = (o) => o.slice(-7, -1);
  const hexify = (num) => `0x${Number(num).toString(16)}`;
  return `${cut(tokenIn)}${cut(tokenOut)}${cut(chain)}${cut(hexify(amount))}`;
};

module.exports.sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));
