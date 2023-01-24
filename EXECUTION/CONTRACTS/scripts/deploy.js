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
    // "contracts/Main.sol:Gas": "0xe3FD11A65734536CB0cFbCc43abc03E420f3f19A",
    // "contracts/Main.sol:console": "0x44Ef8f65e763cfe431f33216F656C1b4907bF988",
    // "contracts/Main.sol:Enigma": "0xf94207a70A74ebDb04D1aE0C9eA3f14e76f5F70a",
    // "contracts/Main.sol:EnigmaV2": "0x2004aC2CBEd48FB004Ee7e06027204725bf8Fb96",
    "contracts/Main.sol:EnigmaV3": "0xD308f33ff7FE083F1a6b94Ec717D4A05d1f6D157",
    // "contracts/Main.sol:Kyber": "0xB678A9358043F5548d2fd71b4729501f3b563067",
    // "contracts/Main.sol:Para": "0x3EdD0736D62F6A142340Fef16553a1304e6B8A12",
    // "contracts/Main.sol:Trader": "0x78588bebAC75194dce527d5B002336d833613a11",
    // "contracts/Main.sol:Router": "0x100591d86F1a66f27931Bf409ebC8e2a4253D931",
  };
  console.info(libs);
  const Contract = await hre.ethers.getContractFactory("Main", {
    libraries: libs,
  });
  const contract = await Contract.deploy({
    gasPrice: 85720430095,
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
