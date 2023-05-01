require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
const dotenv = require("dotenv").config();

const env = (key) => process.env[key.toUpperCase()];

const quicknode = env("quicknode");
const ankr = env("ANKR_BTTC");
const account = env("PRIVATE_FOREMAN");

exports = {
  solidity: "0.8.16",
  networks: {},
  settings: {
    optimizer: {
      enabled: true,
      runs: 2000,
    },
  },
};

const connect = (key, url, account) =>
  (exports.networks[key] = { url: url, accounts: [account] });

const register = (key, url) => connect(key, url, account);

register("fantom", quicknode);
register("bittorrent", ankr);//
module.exports = exports;
