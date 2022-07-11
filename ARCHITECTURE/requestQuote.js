const { exec } = require("child_process");
const hash = process.argv[2];
const contractA = process.argv[3];
const contractB = process.argv[4];
const price = process.argv[5];
const exchange = process.argv[6];
const chainID = process.argv[7];
const xName = process.argv[8];
let   map = process.argv[9];
const script = `${exchange}/API/QUERY/PAIR/aux`
const cmnd = `${script} ${xName} ${chainID} ${contractA} ${contractB} ${price} &` 

const objetify = str => JSON.parse(([...str].join("")))
const getRes = res => objetify([...res].splice(res.search(/{.+}/), res.length).join(""))
const getCode = res => objetify([...res].splice(0, res.search(/$/m)).splice(res.search(/(?<=HTTP\/2\s)\d+/), res.search(/$/m)).join("").replace(/\s/, ''))
const access = (data, keys) => {
    keys.forEach(key => data = data[key]);
    return data;
}
map = objetify(map);

const elucidate = data => {
    return {
        "hash": hash,
        "block": access(data, map.block),
        "fiat": {
            "quote": access(data, map.fiat.quote),
            "bid": access(data, map.fiat.bid),
            "gas": access(data, map.fiat.gas)
        },
        "token": {
            "quote": access(data, map.token.quote),
            "bid": access(data, map.token.bid),
            "gas": access(data, map.token.gas)
        },
        "direction": access(data, map.direction)
    }
};
const assess = code => console.error(`Error:\t${code}`); // send to assesor to review error header

const print = (hash, data) => {
    const cmnd = `echo "${JSON.stringify(data)}" >> ${exchange}/DATA/QUOTES/${hash}`;
    // console.log(cmnd)
    exec(cmnd)
}

exec(cmnd, (error, stdout, stderr) => {
    const code = getCode(stdout)
    const data = code == 200 ? getRes(stdout) : null;
    if (data) print(hash, elucidate(data));
    else assess(code);
    // else elucidate(map);
});

//then translate, then print to file with hash name

// aux=./API/QUERY/PAIR/aux
// $aux paraswap 137 0xc2132d05d31c914a87c6611c10748aeb04b58e8f 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 1000000