console.time("\n\tInitiating Blockchain Interface");
const { ethers, providers, Contract } = require("ethers");
const source = require("./contract.json");
const path = "../.env";
const dotenv = require("dotenv").config({ path: path });
const vault = dotenv.parsed;
const allOperators = [...Object.keys(vault)].filter(x => x.includes("OPERATOR"));
const publicOperators = [...allOperators].filter(O => O.includes("PUBLIC"));
const privateOperators = [...allOperators].filter(O => O.includes("PRIVATE"));
const publicAccounts = [...publicOperators].map((O, i) => vault[O]);
const privateKeys = [...privateOperators].map((O, i) => vault[O]);
const operators = [...publicAccounts].map((O, i) => { return { public: publicAccounts[i], private: privateKeys[i], nonce: 0 } });
const env = (key) => process.env[key.toUpperCase()];

const quicknode = env("quicknode");
const bittorrent = env("ANKR_BTTC");
// const account = env("private_gas");
// const operators = [{ private: account }]

const getProvider = () => quicknode;

const getMethod = (pKey, method) => {
  const provider = new providers.JsonRpcProvider(getProvider());
  const wallet = new ethers.Wallet(pKey);
  const signer = wallet.connect(provider);
  return (new Contract(source.address, source.abi, signer))?.[method];
};

const operateOn = method => [...operators].map(O => getMethod(O.private, method));
const operations = operateOn("send");
let operator = 0;
const getNonce = async (op) => {
  const address = publicAccounts[op];
  let provider = new providers.JsonRpcProvider(getProvider());
  let lastNonce = await provider.getTransactionCount(address);
  delete provider
  // lastNonce = await provider.getTransactionCount(address);
  // console.info(`Nonce: ${lastNonce} / ACC: ${address}`)
  return lastNonce
}
const propagate = async () => {
  for (i = 0; i < operators.length; i++) {
    operators[i].nonce = await getNonce(i);
    // console.info(`operators[${i}].nonce = ${operators[i].nonce}`)
    operators[i].nonce += 1;
    // console.info(`operators[${i}].nonce + 1 = ${operators[i].nonce}`)
  }
  return operators;
}
module.exports.execute = async (...args) => {
  operator = ++operator % operations.length;
  let params = [...args];
  let settings = params.at(-1);
  params[params.length - 1] = settings
  let execution
  let error
  let reciept
  try {
    execution = await operations[operator](...params)
    reciept = await execution.wait()
    ++operator;
    return reciept;
  } catch (e) {
    error = e
    // console.warn("minerva-enterred trap")
    if (underpriced(error)) {
      try {
        reciept = attempt(operator, ...args)
      } catch (_e) {
        operators[operator].nonce--
        throw _e
      }
    }
    else {
      operators[operator].nonce--
      throw error
    }
  }
  return reciept;
}
const attempt = async (_operator, ...args) => {
  let error;
  do {
    try {
      const reciept = await retry(_operator, ...args)
      return reciept;
    } catch (e) {
      error = e
      if (!underpriced(error))
        throw error
    }
  } while (true);
}

const retry = async (_operator, ...args) => {
  let params = [...args];
  let settings = params.at(-1);
  settings.nonce = operators[_operator].nonce++
  params[params.length - 1] = settings
  try {
    const execution = await operations[_operator](...params)
    const reciept = execution.wait()
    return reciept;
  } catch (e) {
    throw e;
  }
}

const underpriced = e => {
  let error = e
  try {
    error = JSON.stringify(JSON.parse(JSON.stringify(error)))
    if (error.includes("REPLACEMENT_UNDERPRICED") || error.includes("nonce has already been used") || error.includes("transaction failed")) return true
    return false
  } catch (e) {
    return false
  }
}

Promise.resolve(propagate()).then(x => {
  // console.table(x);
  console.timeEnd("\n\tInitiating Blockchain Interface")
});



  // try {

  // } catch (e) {
  //   if (execution.timestamp !== null) {
  //     ++operator;
  //     throw `Transaction mined ${execution.timestamp} but failed.`
  //   }
  //   --operators[operator].nonce
  //   // console.error(`${operator} // ${address}: `, params);
  //   if (underpriced(e)) throw "This shit is underpiced son!"
  //   else throw "Somethings wack";
  // }