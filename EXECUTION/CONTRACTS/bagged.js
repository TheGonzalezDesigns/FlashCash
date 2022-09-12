const repack = require('./SERVER/baggage/suitcase.js');
let transactions = require('./dump.json')

const transaction = transactions[0];

//transactions = [transaction, ...transactions]

console.clear()
repack(transactions)
