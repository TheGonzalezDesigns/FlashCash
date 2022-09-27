// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

let params = []

const _ = param => params.push(param)

const link = async (name, ...params) =>
{
	console.log(`Linking '${name}'`);
	const Contract = await hre.ethers.getContractFactory(name);
  	const contract = await Contract.deploy(...params);
	const address = contract.address;
	console.log(`Contract '${name}' linked @ address: ${contract.address}`);

 	await contract.deployed();
	return {name: name, address, address};
}

async function main() {
	const [deployer] = await hre.ethers.getSigners();
	console.log(`Deploying contracts with the account: ${deployer.address}`);

	const balance = await deployer.getBalance();
	console.log(`Account balance: ${balance.toString()}`);

	const value = hre.ethers.utils.parseEther("0");
	
	_({value: value})

	const libraries = {
		"contracts/Main.sol:Swapper": "0xBb4093699316e2731D091D384F5F6d2e1A825698"
	}
	const biblio = {"libraries": libraries};
	console.info("libraries", biblio);
	const Contract = await hre.ethers.getContractFactory("Main", biblio);
	const contract = await Contract.deploy(...params);
	console.log(`Contract address: ${contract.address}`);

	await contract.deployed();
	
	const metadata = {
		address: contract.address,
		abi: JSON.parse(contract.interface.format('json'))
	};
	fs.writeFileSync("./contract.json", JSON.stringify(metadata))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
