const inspect = (tag, res) =>
  false; /* && console.log(`Call response [${tag}]: `, typeof res); */
const board = async (tin, tout, chainId) => {
  const slug = `http://localhost:8888/onchain/kyberswap/${chainId}/${tin}/${tout}`;
  // console.log("Now boarding: ", slug);
  let package;
  const tag = "board"; //inspect needed
  try {
    package = await (await fetch(slug, { keepalive: true })).json();
    inspect(tag, package);
    // console.log("res: ", package);
  } catch (e) {
    console.log(e);
    throw "Flight Boarding Aborted"
  }
  try {
    const crate = [...package].map((op, i) => {
      let profit =
        op.length > 1 ? op.at(-1).USDout - op.at(0).USDin : op.at(-1).profit;
      let profitability = op.at(0).profitability;
      let price = op.at(0).USDin;
      let swaps = [...op].map((swap) => swap.data);
      let total = profit * 1000;
      let tin = op.at(0).tokenInAddress;
      let tout = op.at(-1).tokenOutAddress;
      // console.log("package-inst. keys:\t", Object.keys(op[0]));
      // console.log("package:\t", op);
      let data = {
        swaps: swaps,
        price: price,
        profit: profit,
        profitability: profitability,
        total: total,
        fiatCode: op.at(0).fiatCode,
        gas: {
          gwei: Math.round(
            [...op].map((y) => Number(y.gasPrice)).reduce((x, y) => x + y) /
            op.length
          ),
          // .reduce((x, y) => x + Number(y.gasPrice)) / op.length,
          amount: [...op].map((y) => y.gasCost).reduce((x, y) => x + y),
          // .reduce((x, y) => x + y.gasCost),
          cost: [...op].map((y) => y.gasTotal).reduce((x, y) => x + y),
          // .reduce((x, y) => x + y.gasTotal),
        },
        // trail: `[:> ${tin} => ${tout} <:]`,
        trail: [...op]
          .map((y) => [y.tokenInAddress, y.tokenOutAddress])
          .flat()
          .filter((v, i, a) => a[i - 1] !== a[i])
          .join(" > "),
        flow: [...op]
          .map((y) => [y.CRYin, y.CRYout])
          .flat()
          .join(" > "),
        tokens: [...op].map((y) => [y.tokenInAddress, y.tokenOutAddress]),
        amounts: [...op].map((y) => y.CRYin),
        tokenIn: tin,
        tokenOut: tout,
        loanAmount: op.at(0).CRYin,
        output: op.at(-1).CRYout,
      };
      return data;
    });
    // console.log("crate:\t", crate);
    return crate;
  } catch (e) {
    console.error(e);
  }
};

module.exports = board;
