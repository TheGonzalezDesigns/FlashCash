// const execShPromise = require("exec-sh").promise;
// const hash = process.argv[2];
const contractA = process.argv[3];
const contractB = process.argv[4];
let price = process.argv[5];
// const exchange = process.argv[6];
const chainID = process.argv[7];
// const xName = process.argv[8];
// let map = process.argv[9];
// const vol = process.argv[10];
// const network = process.argv[11];
// const mrc = process.argv[12];
// const spread = process.argv[13];
// const trailLimit = process.argv[14];
// const script = `${exchange}/API/QUERY/PAIR/aux`;
const updateChainID = async () => {
  const path = `centralstate?chainID=${chainID}`;
  const ops = {
    method: "POST"
  };
  try {
    await fetch(`http://localhost:9999/${path}`, ops);
  } catch (e) { }
};
const _process = async (data) => {
  const path = `queue?chainId=${chainID}`;
  const ops = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    keepalive: true,
  };
  try {
    await updateChainID()
    const res = await fetch(`http://localhost:3000/${path}`, ops);
  } catch (e) { }
};
const req = {
  from: contractA,
  to: contractB,
  price: price,
};
_process(req);
