const fs = require("fs");
const repack = require('./baggage/suitcase.js');
let transactions = require('./dump.json')

const transaction = transactions[0];

transactions = [transaction, ...transactions]

console.log(repack(transactions))
