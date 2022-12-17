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

  const crate = [...package].map((op, i) => {
    let profit =
      op.length > 1 ? op.at(-1).USDout - op.at(0).USDin : op.at(0).profit;
    let price = op.at(0).USDin;
    let swaps = [...op].map((swap) => swap.data);
    let total = profit * 1000;
    // console.log("package:\t", Object.keys(op[0]));
    return {
      swaps: swaps,
      price: price,
      profit: profit,
      total: total,
      fiatCode: op.at(0).fiatCode,
      gas: {
        gwei: op.at(0).gasPrice,
        amount: op.at(0).gasCost,
        cost: op.at(0).gasTotal,
      },
    };
  });
  // console.log("crate:\t", crate);
  return crate;
};

module.exports = board;
