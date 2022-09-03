const { ethers, providers, Contract } = require('ethers');
const source = require('./contract.json');
const path = "../.env"
const dotenv = require('dotenv').config({path: path});

const env = key => process.env[key.toUpperCase()];

const quicknode = env("quicknode");
const account = env("private_gas");

const setContract = async () => {
	const provider = await new providers.JsonRpcProvider(quicknode);
	const wallet = new ethers.Wallet(account);
	const signer = wallet.connect(provider);
	const contract = await new Contract(source.address, source.abi, signer);
	return contract;
}

const initialize = async () => {
	contract = await Promise.resolve(setContract())
		.then(contract => contract)
	return contract;
}

const x = {
	initialize: initialize,
}

module.exports = x;
