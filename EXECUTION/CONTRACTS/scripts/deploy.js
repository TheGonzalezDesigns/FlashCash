// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

let params = [];

const _ = (param) => params.push(param);

const link = async (name, ...params) => {
  console.log(`Linking '${name}'`);
  const Contract = await hre.ethers.getContractFactory(name);
  const contract = await Contract.deploy(...params);
  const address = contract.address;
  console.log(`Contract '${name}' linked @ address: ${contract.address}`);

  await contract.deployed();
  return { name: name, address, address };
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const prebalance = await deployer.getBalance();

  const value = hre.ethers.utils.parseEther("0");

  _({ value: value });

  const libs = {
    // "contracts/Main.sol:Gas": "0xe2F60B18A63Dc6b5D0F82D2811B769Ff0248F4DA",
    "contracts/Main.sol:console": "0xa9e1b00e08448b2493cE04D1680516dFB32eEF61",
    "contracts/Main.sol:KyberSwap":
      "0x44B917CB3d905242e15Ef8980b48efcF430E238F",
    "contracts/Main.sol:Trader": "0x7a9260024d801aaeae2ee0d759349555c27c8ff2",
    // "contracts/Main.sol:Router": "0x100591d86F1a66f27931Bf409ebC8e2a4253D931",
  };
  console.info(libs);
  const Contract = await hre.ethers.getContractFactory("Main", {
    libraries: libs,
  });
  const contract = await Contract.deploy({
    gasPrice: 20720430095,
    // gasLimit: 2000000,
  });

  await contract.deployed();

  const metadata = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format("json")),
  };
  fs.writeFileSync("./contract.json", JSON.stringify(metadata));

  const balance = await deployer.getBalance();
  const cost = prebalance - balance;
  const relative = (cost / balance) * 100;
  console.log(`Account balance: ${balance.toString()}`);
  console.log(`Contract address: ${contract.address}`);
  console.log(`Deployment Cost: ${Number(relative).toPrecision(2)}%`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
