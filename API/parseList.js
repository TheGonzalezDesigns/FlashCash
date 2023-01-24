const fs = require("fs");
const exchange = `./${process.argv[2]}`.toLowerCase();
const network = `./${process.argv[3]}`.toLowerCase();
const output = `${exchange}/DATA/contracts.ba`;
const run = async () => {
  const slug = `https://open-api.openocean.finance/v3/${network}/tokenList`;
  const { data: tokens, code } = await (await fetch(slug)).json();

  if (code !== 200) throw Error(`Failed to fetch token list @ ${slug}`);

  let contracts = "";

  console.log(`\nParsing ${exchange} for token contracts...`);
  console.log("_____________________________________________________");
  try {
    tokens.forEach((token) => {
      contracts += token.address + " ";
    });

    fs.writeFileSync(output, contracts);
    // console.info("Contracts: ", contracts);
  } catch (e) {
    console.info("code: ", code);
    console.info("Tokens: ", tokens);
    throw Error(e);
  }
};
run();
