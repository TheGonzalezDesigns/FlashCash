// node ./requestQuote.js $hash $contract_A $contract_B price
const { exec } = require("child_process");
const hash = process.argv[2];
const contractA = process.argv[3];
const contractB = process.argv[4];
const price = process.argv[5];
const exchange = process.argv[6];
const chainID = process.argv[7];
const xName = process.argv[8];
const script = `${exchange}/API/QUERY/PAIR/aux`
const cmnd = `${script} ${xName} ${chainID} ${contractA} ${contractB} ${price} &` 

// console.warn(`cmnd:\t${cmnd}`)

exec(cmnd, (error, stdout, stderr) => {
    if (stdout) 
    {
        console.log(stdout);
    } else if (error) 
    {
        console.error(`error: ${error.message}`);
        return;
    } else if (stderr) 
    {
        console.error(`stderr: ${stderr}`);
        return;
    }
});

//then translate, then print to file with hash name

// aux=./API/QUERY/PAIR/aux
// $aux paraswap 137 0xc2132d05d31c914a87c6611c10748aeb04b58e8f 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 1000000