const { ethers, providers, Contract } = require("ethers");
const AbiCoder = require("ethers").utils.AbiCoder;
const source = require("./contract.json");
const path = "../.env";
const dotenv = require("dotenv").config({ path: path });

const { signERC2612Permit } = require("eth-permit");
const Web3Utils = require("web3-utils");
const {
  constructFullSDK,
  constructAxiosFetcher,
  constructEthersContractCaller,
  SwapSide,
} = require("@paraswap/sdk");
const axios = require("axios");

const env = (key) => process.env[key.toUpperCase()];

const quicknode = env("quicknode");
const ankr = env("ANKR_BTTC"); //env("ANKR_BTTC");
const account = env("private_gas");
const address = env("public_gas");

let nonce = 0;

const getProvider = () => quicknode;

const getLiveNonce = async () => {
  const provider = await new providers.JsonRpcProvider(getProvider());
  const _nonce = provider.getTransactionCount(address);
  return _nonce;
};

const getNonce = () => nonce;

const increaseNonce = async (tag) => {
  let _nonce = await getLiveNonce();
  //nonce = nonce >= _nonce ? nonce : _nonce;
  //nonce++;
  if (nonce == _nonce) {
    nonce++;
    console.log(`Flight ${tag} is one ahead of live @[${nonce}]`);
  } else if (nonce > _nonce) {
    nonce++;
    console.log(
      `Flight ${tag} is ${nonce - _nonce + 1} ahead of live @[${nonce}]`
    );
  } else {
    nonce = _nonce;
    nonce++;
    console.log(
      `Flight ${tag} was ${
        _nonce - nonce
      } ahead of live @[${_nonce}]; Now @[${nonce}]`
    );
  }
  return nonce;
};

let registry = [];

const register = async (foo, ...args) => {
  const registrant = { fn: foo, args: args };
  const execute = async (dossier) => await dossier.fn(...dossier.args);
  if (registry.length > 0) {
    const l = registry.length - 1;
    const n = registry.shift(0, l);
    const next = registry.push(registrant) - 1;
    return await execute(n);
  } else {
    return registry.push(registrant);
  }
};

const setContract = async () => {
  const provider = await new providers.JsonRpcProvider(getProvider());
  const wallet = new ethers.Wallet(account);
  const signer = wallet.connect(provider);
  const contract = await new Contract(source.address, source.abi, signer);
  return contract;
};

const initialize = async () => {
  const contract = await Promise.resolve(setContract()).then(
    (contract) => contract
  );
  nonce = await getLiveNonce();
  return contract;
};

const x = {
  initialize: initialize,
};

module.exports = x;

const utils = {
  getNonce: getNonce,
  getLiveNonce: getLiveNonce,
  increaseNonce: increaseNonce,
  register: register,
  getProvider: getProvider,
};

module.exports.utils = utils;

module.exports.permit = async (tokenAddress, spender) => {
  const value = Web3Utils.toWei("1", "ether"); //FLAG
  const provider = new providers.JsonRpcProvider(getProvider());
  const wallet = new ethers.Wallet(account, provider);
  const senderAddress = await wallet.getAddress();

  const result = await signERC2612Permit(
    wallet,
    tokenAddress,
    senderAddress,
    spender,
    value
  );

  const { owner, deadline, v, r, s } = result;

  const struct = [owner, spender, value, deadline, v, r, s];

  const types = [
    "address",
    "address",
    "uint256",
    "uint256",
    "uint8",
    "bytes32",
    "bytes32",
  ];

  const data = AbiCoder.prototype.encode(types, struct);

  //   console.info("Provider: ", provider);
  //   console.info("Wallet: ", wallet);
  //   console.info("Sender: ", senderAddress);
  //   console.info("value: ", value);
  //   console.log("Raw: ", result);

  return data;
};

module.exports.trade = async (tokenIn, tokenOut, srcAmount) => {
  const provider = new providers.JsonRpcProvider(getProvider());
  const wallet = new ethers.Wallet(account, provider);
  const sender = await wallet.getAddress();

  const contractCaller = constructEthersContractCaller({
    ethersProviderOrSigner: provider,
    EthersContract: ethers.Contract,
  });

  // const contractCaller = constructEthersContractCaller(wallet, sender); // alternatively constructWeb3ContractCaller
  const fetcher = () => {
    return {
      AugustusSwapper: "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57",
      AugustusRFQ: "0x2DF17455B96Dde3618FD6B1C3a9AA06D6aB89347",
      TokenTransferProxy: "0x216b4b4ba9f3e719726886d34a177484278bfcae",
    };
  }; // alternatively constructFetchFetcher

  const paraswap = constructFullSDK({
    network: 250,
    fetcher,
    contractCaller,
  });

  console.info("paraswap.swap.getRate", paraswap.swap.getRate);

  const priceRoute = await paraswap.swap.getRate({
    srcToken: tokenIn,
    destToken: tokenOut,
    amount: srcAmount,
    userAddress: sender,
    side: SwapSide.SELL,
  });
  console.info("priceRoute: ", priceRoute);
  // const txParams = await paraSwapMin.swap.buildTx({
  //   srcToken,
  //   destToken,
  //   srcAmount,
  //   destAmount,
  //   priceRoute,
  //   userAddress: senderAddress,
  //   partner: referrer,
  // });
  // console.info("txParams: ", txParams);
  // const transaction = {
  //   ...txParams,
  //   gasPrice: "0x" + new BigNumber(txParams.gasPrice).toString(16),
  //   gasLimit: "0x" + new BigNumber(5000000).toString(16),
  //   value: "0x" + new BigNumber(txParams.value).toString(16),
  // };
  // console.info("transaction: ", transaction);
};
