const { ethers, providers, Contract } = require('ethers');
const source = require('./contract.json');
const path = "../.env"
const dotenv = require('dotenv').config({path: path});

const env = key => process.env[key.toUpperCase()];

const quicknode = env("quicknode");
const account = env("private_gas");
const address = env("public_gas");

let nonce = 0;

const getLiveNonce = async () => {
	const provider = await new providers.JsonRpcProvider(quicknode);
	const _nonce = provider.getTransactionCount(address);
	return _nonce;
}

const getNonce = () => nonce

const increaseNonce = async (tag) => {
	let _nonce = await getLiveNonce();
	//nonce = nonce >= _nonce ? nonce : _nonce;
	//nonce++;
	if (nonce == _nonce)
	{
		nonce++;
		console.log(`Flight ${tag} is one ahead of live @[${nonce}]`);
	} else if (nonce > _nonce)
	{
		nonce++;
		console.log(`Flight ${tag} is ${(nonce - _nonce) + 1} ahead of live @[${nonce}]`);
	} else
	{
		nonce = _nonce;
		nonce++;
		console.log(`Flight ${tag} was ${(_nonce - nonce)} ahead of live @[${_nonce}]; Now @[${nonce}]`);
	}
	return nonce;
}

let registry = [];

const register = async (foo, ...args) => {
	const registrant = {fn: foo, args: args}
	const execute = async dossier => await dossier.fn(...dossier.args)
	if (registry.length > 0)
	{
		const l = registry.length - 1;
		const n = registry.shift(0,l);
		const next = registry.push(registrant) - 1;
		return await execute(n);
	}
	else
	{
		return registry.push(registrant)
	}
}


const setContract = async () => {
	const provider = await new providers.JsonRpcProvider(quicknode);
	const wallet = new ethers.Wallet(account);
	const signer = wallet.connect(provider);
	const contract = await new Contract(source.address, source.abi, signer);
	return contract;
}

const initialize = async () => {
	contract = await Promise.resolve(setContract()).then(contract => contract)
	nonce = await getLiveNonce();
	return contract;
}

const x = {
	initialize: initialize,
}

module.exports = x;

const utils = {
	getNonce: getNonce,
	getLiveNonce: getLiveNonce,
	increaseNonce: increaseNonce,
	register: register
}

module.exports.utils = utils;
