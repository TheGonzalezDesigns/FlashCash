require("dotenv").config({ path: "../.env" });
const env = (key) => process.env[key.toUpperCase()];
const primaryAccountKey = env("private_gas");
const primaryAccount = env("public_gas");

const { ABI, RPC: providers, META: chains } = require("../ledger.json")
const getProvider = (chainID) => providers[chainID]
const getABI = (name) => require(`../${ABI.crossChain[name.toUpperCase()]}`)
const getMETA = (chainID) => chains[chainID]

exports.deploy = (address, ABI, chainID) => {
    const { providers, Wallet, Contract } = require("ethers");
    const signer = new Wallet(primaryAccountKey).connect(new providers.JsonRpcProvider(getProvider(chainID)));
    const contract = new Contract(address, getABI(ABI), signer);
    return contract;
};


exports.sendTransaction = async (args, chainID) => {
    try {
        const { providers, Wallet } = require("ethers");
        const signer = new Wallet(primaryAccountKey).connect(new providers.JsonRpcProvider(getProvider(chainID)));
        return await signer.sendTransaction(args);
    } catch (e) {
        const error = `${JSON.stringify(e).slice(0, 300)}...`
        const found = error.match(/(?=reverted: ).+code/g)[0].match(/(?=:).+(?=",)/)[0].slice(1, -1);
        throw Error(found);
    }

};

exports.getBalance = async (chainID) => {
    const { providers, Wallet, Contract } = require("ethers");
    const { _hex: hex } = await new providers.JsonRpcProvider(getProvider(chainID)).getBalance(primaryAccount);
    return Number(BigInt(hex))
};

exports.getAccount = () => primaryAccount


exports.getWETH = (chainID) => chains[chainID].WETH

exports.compress = (amount) => `0x${BigInt(amount).toString(16)}`

exports.getGasPrice = async (chainID) => {
    const chainData = getMETA(chainID)
    const gasTracker = chainData.GASTRACKER;
    const response = await fetch(gasTracker);
    const HTML = await response.text()
    const snippet = HTML.slice(0, 100);
    const found = snippet.match(/\d+\-\d+\sGwei/g)[0];
    const quotes = found.match(/(?!-)\d+/g);
    const gasPrice = [...quotes].reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0) / quotes.length
    return gasPrice
}

exports.getOpenOceanChainTag = (chainID) => chains[chainID].OOCT;


