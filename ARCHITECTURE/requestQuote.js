const { exec } = require("child_process");
const hash = process.argv[2];
const contractA = process.argv[3];
const contractB = process.argv[4];
const price = process.argv[5];
const exchange = process.argv[6];
const chainID = process.argv[7];
const xName = process.argv[8];
let   map = process.argv[9];
const vol = process.argv[10];
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
    // console.info(`Retrieved: ${hash} @ ${map.block}`)
    return {
        "\"hash\"": `\"${hash}\"`,
        "\"block\"": access(data, map.block),
        "\"fiat\"": {
            "\"quote\"": access(data, map.fiat.quote),
            "\"bid\"": access(data, map.fiat.bid),
            "\"gas\"": access(data, map.fiat.gas)
        },
        "\"token\"": {
            "\"quote\"": access(data, map.token.quote),
            "\"bid\"": access(data, map.token.bid),
            "\"gas\"": access(data, map.token.gas)
        },
        "\"direction\"": `\"${access(data, map.direction)}\"`,
        // "\"raw\"": data
    }
};

const pause = () => {
    const cmnd = `./pause.sh ${exchange}`;
    exec(cmnd, (error, stdout, stderr) => {
        console.info(`${stdout}`);
    })
};

const resume = () => {
    const cmnd = `./resume.sh ${exchange}`;
    exec(cmnd, (error, stdout, stderr) => {
        stdout.length && console.info(`${stdout}`);
    })
};

const assess = code => {
    const _pause = code == 429;
    _pause || resume() && console.error(`Error:\t${code}`);
    _pause && pause()
}

const print = (hash, data) => {
    const cmnd = `rm -rf ${exchange}/DATA/QUOTES/${hash} && echo "${JSON.stringify(data)}" > ${exchange}/DATA/QUOTES/${vol}Vol/${hash}`;
    exec(cmnd)
}

exec(cmnd, (error, stdout, stderr) => {
    // stdout.length && console.log(stdout)
    const code = getCode(stdout)
    const data = code == 200 ? getRes(stdout) : null;
    if (data) {
        resume(); 
        print(hash, elucidate(data));
    }
    else assess(code);
});