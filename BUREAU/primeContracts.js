const fs = require("fs");
const file = process.argv[2];
const network = process.argv[3]

console.log(`Retrieving ${network} flashloan data from:\t`, file);
console.log("\n__________________________________________________________\n")

const data = fs.readFileSync(file);
const FL = JSON.parse(data);

FL.pop(); // removes the empty object used to validate the json when generated via bash

const NFL = FL.filter(loan => loan.network === network);
let providers = [...NFL].map(loan => loan.provider);
providers = providers.filter((item, pos) => providers.indexOf(item)== pos);
const tokens = [...NFL].map(loan => loan.token)
const quantity = providers.length;
const report = {
    providers: providers,
    // largestOffering: [...NFL].map(loan => loan.provider);.
    quantity: quantity,
    tokens: tokens
} 

console.info(quantity ? report : "No flash loans available. Please add a provider to continue on this network.");
console.log("\n__________________________________________________________\n")
quantity || process.exit(1)
