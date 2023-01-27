const { writeFileSync } = require('fs');
// save("programming.txt", data);
const save = data => writeFileSync("./ledger.json", JSON.stringify(data));
const backup = () => writeFileSync("./ledger.bk.json", JSON.stringify(data));
const load = () => require("./ledger.json");


let ledger = load 

ledger.metadata["250"] = {}
ledger.metadata["250"].nativeToken = "0x0000000000000000000000000000000000000000"


