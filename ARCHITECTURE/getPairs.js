const fs = require('fs');
const exchange = `./${process.argv[2]}`
const sourceFile = `${exchange}/${process.argv[3]}`
//const outputFile = `${exchange}${process.argv[4]}`
const file = fs.readFileSync(sourceFile, 'utf8')
const coins = JSON.parse(file);

//console.log(coins)


//2 Setup each coin as a pair

let binaryPairs = [];
let triangularPairs = [];
let quadraticPairs = [];
let _triPairs = [];
let _quadPairs = [];
let hash = null;

const sameCoin = (coinA, coinB) => {
	return (coinA.contract === coinB.contract)
};

const genHash = (a, b) => {
	return `${a}::${b}>>`;
}

const combineHash = (list) => {
	let hash = "";
	list.forEach(o => hash += o.hash)
	return hash;
}

const sameHash = (a, b) => {
	return a.hash === b.hash;
}


// So far, I've yet to detect any duplications... Which is good?
const prune = (list) => {
	const start = list.length;
	let end;

	const _list = list.filter((obj, index, array) =>
		{
			return array.map(mapObj => mapObj.hash).indexOf(obj.hash) === index;
		}
	);

	end = _list.length;
	end -= start;

	console.info(`Removed ${end} copies...`);
}

coins.forEach(coinA => {
	//console.log(`Pairing ${coinA.name}:`, coinA)
	coins.forEach(coinB => {
		if (!sameCoin(coinA, coinB)) binaryPairs.push({coinA: coinA, coinB: coinB, rate: null, hash: genHash(coinA.contract, coinB.contract)}) 
	})
})

//3 Setup triangular pairs and quadratic pairs

const samePair = (pairA, pairB) => {
	return sameCoin(pairA.coinA, pairB.coinA) || sameCoin(pairA.coinB, pairB.coinB);
}

const pairTrails = (pairA, pairB) => {
	return sameCoin(pairA.coinB, pairB.coinA)
}
let qc = 0;
binaryPairs.forEach(pairA => {
	binaryPairs.forEach(pairB => {
		if(!samePair(pairA, pairB) && pairTrails(pairA, pairB)) {
			_triPairs.push(pairA);
			_triPairs.push(pairB);
			binaryPairs.forEach(pairC => {
				if(!(samePair(pairA, pairC) || samePair(pairB, pairC)) && pairTrails(pairB, pairC)) {
					if (pairTrails(pairC, pairA)) {
						_triPairs.push(pairC);
						triangularPairs.push({pairs: _triPairs, hash: combineHash(_triPairs)});
						//console.warn(_triPairs)
					}
					_quadPairs.push(pairA);
					_quadPairs.push(pairB);
					_quadPairs.push(pairC);
					//console.log(`QDL:\t`, _quadPairs.length);
					binaryPairs.forEach(pairD => {
						if(!(samePair(pairA, pairD) || samePair(pairB, pairD) || samePair(pairC, pairD)) && pairTrails(pairC, pairD) && pairTrails(pairD, pairA)) {
							_quadPairs.push(pairD);
							quadraticPairs.push({pairs: _quadPairs, hash: combineHash(_quadPairs)});
							console.clear();
							console.log('Quaradtic Pairs:\t', ++qc);
						}
					});
					_quadPairs = [];
				}
			});
			_triPairs = [];
		}
	});
});

//4 Print status

const printSample = (list) => {
	const samples = [];
	const max = list.length - 1;
	samples.push(list[0]);
	samples.push(list[1]);
	samples.push(list[max]);
	
	samples.forEach(sample => {
		console.log('\nSample:\n--------------------------')
		console.info(sample)
	});
}

//console.log(typeof rmHashCopies(binaryPairs))

//prune(quadraticPairs);

printSample(quadraticPairs);

//console.log('QDP:\t', quadraticPairs[0]);


// Multi-tenant for future quadratic expansion
const printList = (file, pairs) => {
	fs.writeFileSync(file, JSON.stringify(pairs), err => console.log(`${file}.json update ${err ? 'failed' : 'succeded'}`));
}

//console.log(fs);

printList(`${exchange}/triangularPairs`, triangularPairs);
printList(`${exchange}/quadraticPairs`, quadraticPairs);

console.log(`\nPaired ${coins.length} coins into:\n>>\t${binaryPairs.length} binary pairs\n>>\t${triangularPairs.length} triangular pairs\n>>\t${quadraticPairs.length} quadratic pairs.\n`);
