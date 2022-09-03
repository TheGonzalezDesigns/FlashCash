const execShPromise = require("exec-sh").promise;
const hash = process.argv[2];
const contractA = process.argv[3];
const contractB = process.argv[4];
const price = process.argv[5];
const exchange = process.argv[6];
const chainID = process.argv[7];
const xName = process.argv[8];
let   map = process.argv[9];
const vol = process.argv[10];
const network = process.argv[11];
const mrc = process.argv[12];
const spread = process.argv[13];
const trailLimit = process.argv[14];
const script = `${exchange}/API/QUERY/PAIR/aux`
const cmnd = `${script} ${xName} ${chainID} ${contractA} ${contractB} ${price} &` 

const objetify = str => JSON.parse(([...str].join("")))
const getRes = res => objetify([...res].splice(res.search(/{.+}/), res.length).join(""))
const getCode = res => parseInt([...res].splice(7, 10).join(""))
const access = (data, keys) => {
    keys.forEach(key => data = data[key]);
    return data;
}

map = objetify(map);

const elucidate = data => {
    // console.info(`Retrieved: ${hash} @ ${map.block}`)
    let o = {
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
	console.log(o);
	return o;
};

let exec = async (cmd, fn) => {
	let prcs;
	try {
    		prcs = await execShPromise(cmd, true);
		//console.log("PRCS:\t", prcs)
	} catch (e) {
		console.error(e?.stdout + e?.stderr);
		//console.error("Request Error:\t", e.stderr);
		//console.error("Request Error:\t", Object.keys(e));
		//return e;
	}
	let out = {
		stdout: "",
		stderr: ""
	}

	out.stderr = prcs?.stderr !== undefined ? prcs.stderr : "";
	out.stdout = prcs?.stdout !== undefined ? prcs.stdout : "";

    	return fn(out.stderr, out.stdout, out.stderr);
	//console.log('out: ', out.stdout, out.stderr);
}

const pause = () => {
    const cmnd = `./pause.sh ${exchange}`;
    exec(cmnd, (error, stdout, stderr) => {
        console.info(`${stdout}`);
    })
};

const resume = () => {
    const cmnd = `./resume.sh ${exchange} && ./wake`;
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
    exec(cmnd, (error, stdout, stderr) => {
        console.error(`${stderr}`);
    })
}

const parse = async (hash, data, mrc) => {	
	const cmnd = `./parse.sh "${hash}" "${JSON.stringify(JSON.stringify(data))}" "${mrc}" &`;
	await exec(cmnd, (error, stdout, stderr) => {
		//console.info(`${stdout}${stderr}`);
	});
}

const echo = (hash, data) => {	
    const cmnd = `echo "${JSON.stringify(JSON.stringify(data))}" > ./${hash}`;
    exec(cmnd, () => {})
}

const assemble = async () => {
	let code;
    	const cmnd = `./assemble.sh ${xName} ${network} ${vol} ${mrc} ${spread} ${trailLimit}`;
    	await exec(cmnd, (error, stdout, stderr) => {
        	//console.info(`\nASSEMBLE OUT:\t${stdout}`);
        	//console.info(`\nASSEMBLE ERR:\t${stderr}`);
		code = stdout;
	})
	return !code ? true : false;
}

const delivery = () => {
	const cmnd = `./delivery.sh ${exchange} ${vol}`;
		exec(cmnd, (error, stdout, stderr) => {
		console.info(`${stdout}`);
		console.info(`${stderr}`);
	})
};

const _process = (hash, data) => {
        print(hash, elucidate(data));
	Promise.resolve(assemble())
	.then(
		async (cont) => {
			if(!cont) {
				await parse(hash, data, mrc);
				delivery();
			}
		},
		(reason) => console.log("Real Error:\t", reason)
	)
}

exec(cmnd, (error, stdout, stderr) => {
    const code = getCode(stdout)
    const data = code == 200 ? getRes(stdout) : null;
    if (data) {
        resume();
	_process(hash, data);
    }
    else {
	assess(code);
    }
});
