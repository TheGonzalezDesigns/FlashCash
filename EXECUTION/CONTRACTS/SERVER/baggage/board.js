const board = async (tin, tout) => {
  const slug = `http://localhost:8888/onchain/kyberswap/250/${tin}/${tout}`;
  // console.log("Now boarding: ", slug);
  let package;
  try {
    package = await (await fetch(slug, { keepalive: true })).json();
    // console.log("res: ", package);
  } catch (e) {
    console.log(e);
    throw Error("Flight Boarding Aborted");
  }

  const crate = [...package].map((op) => {
    let profit =
      op.length > 1 ? op.at(-1).USDout - op.at(0).USDin : op.at(0).profit;
    let price = op.at(0).USDin;
    let swaps = [...op].map((swap) => swap.data);
    let total = profit * 1000;
    return {
      swaps: swaps,
      price: price,
      profit: profit,
      total: total,
    };
  });
  // console.log(crate);
  return crate;
};

module.exports = board;
