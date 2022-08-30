require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
const dotenv = require('dotenv').config();

const env = key => process.env[key.toUpperCase()];

const quicknode = env("quicknode");
const account = env("private_gas");

exports = {
	solidity: "0.8.9",
	networks: {}
};

const connect = (key, url, account) => exports.networks[key] = {url: url, accounts: [account]};

const register = (key, url) => connect(key, url, account);

register("fantom", quicknode)
module.exports = exports;
