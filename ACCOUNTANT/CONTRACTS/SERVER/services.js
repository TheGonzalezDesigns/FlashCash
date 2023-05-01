const { deploy, getAccount, getBalance: getNativeBalance, getWETH, compress, getGasPrice: getgasprice, getOpenOceanChainTag, sendTransaction } = require("./blocktools.js")

const sleep = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

const gwei = int => Number(`${int}e9`);

const getInsuredGasPrice = async ({ chainID }) => {
    const quote = () => getgasprice(chainID);
    const accuracy = 3;
    const quotes = []
    for (i = 0; i < accuracy; i++) {
        quotes.push(quote());
        await sleep(1250)
    }
    const avgPrices = (await Promise.all(quotes)).filter(price => !isNaN(price));
    const avgPrice = [...avgPrices].reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0) / avgPrices.length;
    const insuredPrice = Math.round(avgPrice * 1.075)
    const gasPrice = gwei(insuredPrice);
    return gasPrice//{ avgPrice, avgPrices, insuredPrice }
}
// const getInsuredGasPrice = async ({ chainID }) => {
//     let error
//     let gasPrice
//     const quote = () => getgasprice(chainID);
//     try {
//         gasPrice = await quote(chainID)
//     } catch (e) {
//         error = JSON.stringify(e);
//         if (error.includes("underpriced")) {
//             let gasPrice
//             try {
//                 const accuracy = 3;
//                 const quotes = []
//                 for (i = 0; i < accuracy; i++) {
//                     quotes.push(quote());
//                     await sleep(1250)
//                 }
//                 const avgPrices = (await Promise.all(quotes)).filter(price => !isNaN(price));
//                 const avgPrice = [...avgPrices].reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0) / avgPrices.length;
//                 const insuredPrice = Math.round(avgPrice * 1.075)
//                 gasPrice = insuredPrice
//             } catch (e) {
//                 console.error("Central Bank Gas Estimation", e);
//                 throw Error("Central Bank Gas Estimation");
//             }
//             return (await (await WETH.deposit({ value: compress(amount), gasPrice: gwei(gasPrice) })).wait()).status;
//         }
//     }
//     // return insuredPrice//{ avgPrice, avgPrices, insuredPrice }

//     return gwei(gasPrice)
// }
const getGasPrice = async ({ chainID }) => await getgasprice(chainID)

const getBalance = async ({ chainID }) => {
    return getNativeBalance(chainID)
}

const getTokenBalance = async ({ token, chainID }) => {
    console.log("Getting balance...")
    const ERC20 = deploy(token, "ERC20", chainID);
    const { _hex: hex } = await ERC20.balanceOf(getAccount())
    return Number(BigInt(hex));
}

const getWrappedBalance = async ({ chainID }) => {
    const WETH = deploy(getWETH(chainID), "WETH", chainID);
    const { _hex: hex } = await WETH.balanceOf(getAccount())
    return Number(BigInt(hex));
}

const getDecimals = async ({ token, chainID }) => {
    console.log("Getting decimals...")
    const ERC20 = deploy(token, "ERC20", chainID);
    return await ERC20.decimals();
}

const getAllowance = async ({ token, spender, chainID }) => {
    console.log("Getting allowance...")
    const ERC20 = deploy(token, "ERC20", chainID);
    const { _hex: hex } = await ERC20.allowance(getAccount(), spender);
    return Number(BigInt(hex));
}

const transfer = async ({ token, amount, recipient, chainID }) => {
    console.log("Transfering...")
    const ERC20 = deploy(token, "ERC20", chainID);
    let error
    let gasPrice
    try {
        return (await (await ERC20.transfer(recipient, compress(amount), { gasPrice })).wait()).status;
    } catch (e) {
        error = JSON.stringify(e);
        if (error.includes("underpriced")) {
            try {
                gasPrice = await getgasprice({ chainID });
                console.log("Gas repiced at: ", gasPrice);
                gasPrice = gwei(gasPrice)
                return (await (await ERC20.transfer(recipient, compress(amount), { gasPrice })).wait()).status;
            } catch (e) {
                if (error.includes("underpriced")) {
                    try {
                        gasPrice = await getInsuredGasPrice({ chainID });
                        console.log("Insuring gas price to: ", gasPrice);
                        return (await (await ERC20.transfer(recipient, compress(amount), { gasPrice })).wait()).status;
                    } catch (e) {
                        console.error("Central Bank Gas Estimation", e);
                        throw Error("Central Bank Gas Estimation");
                    }
                }
            }
        } else throw Error(e);
    }
}

const transferAll = async ({ token, recipient, chainID }) => {
    const balance = await getTokenBalance({ token, chainID })
    const amount = Math.round(balance * .999)
    return await transfer({ token, amount, recipient, chainID: chainID });
}

const approve = async ({ token, amount, spender, chainID }) => {
    console.log("Approving...")
    const ERC20 = deploy(token, "ERC20", chainID);
    let error
    let gasPrice
    try {
        return (await (await ERC20.approve(spender, compress(amount), { gasPrice })).wait()).status;
    } catch (e) {
        error = JSON.stringify(e);
        if (error.includes("underpriced")) {
            try {
                gasPrice = await getgasprice({ chainID });
                console.log("Gas repiced at: ", gasPrice);
                gasPrice = gwei(gasPrice)
                return (await (await ERC20.approve(spender, compress(amount), { gasPrice })).wait()).status;
            } catch (e) {
                if (error.includes("underpriced")) {
                    try {
                        gasPrice = await getInsuredGasPrice({ chainID });
                        console.log("Insuring gas price to: ", gasPrice);
                        return (await (await ERC20.approve(spender, compress(amount), { gasPrice })).wait()).status;
                    } catch (e) {
                        console.error("Central Bank Gas Estimation", e);
                        throw Error("Central Bank Gas Estimation");
                    }
                }
            }
        } else throw Error(e);
    }
}
const approveAll = async ({ token, spender, chainID }) => {
    const balance = await getTokenBalance({ token, chainID })
    const amount = Math.round(balance * .999)
    return await approve({ token, amount, spender, chainID: chainID });
}

const unwrap = async ({ amount, chainID }) => {
    console.log("Unwrapping...")
    const WETH = deploy(getWETH(chainID), "WETH", chainID);
    let error
    let gasPrice
    try {
        return (await (await WETH.withdraw(compress(amount), { gasPrice })).wait()).status;
    } catch (e) {
        error = JSON.stringify(e);
        if (error.includes("underpriced")) {
            try {
                gasPrice = await getgasprice({ chainID });
                console.log("Gas repiced at: ", gasPrice);
                gasPrice = gwei(gasPrice)
                return (await (await WETH.withdraw(compress(amount), { gasPrice })).wait()).status;
            } catch (e) {
                if (error.includes("underpriced")) {
                    try {
                        gasPrice = await getInsuredGasPrice({ chainID });
                        console.log("Insuring gas price to: ", gasPrice);
                        return (await (await WETH.withdraw(compress(amount), { gasPrice })).wait()).status;
                    } catch (e) {
                        console.error("Central Bank Gas Estimation", e);
                        throw Error("Central Bank Gas Estimation");
                    }
                }
            }
        } else throw Error(e);
    }
}

const unwrapAll = async ({ chainID }) => {
    const balance = await getWrappedBalance({ chainID })
    const amount = Math.round(balance * .999)
    return await unwrap({ amount: amount, chainID: chainID });
}

const wrap = async ({ amount, chainID }) => {
    console.log("Wrapping...")
    const WETH = deploy(getWETH(chainID), "WETH", chainID);
    let error
    let gasPrice
    try {
        return (await (await WETH.deposit({ value: compress(amount) })).wait()).status;
    } catch (e) {
        error = JSON.stringify(e);
        if (error.includes("underpriced")) {
            try {
                gasPrice = await getgasprice({ chainID });
                console.log("Gas repiced at: ", gasPrice);
                gasPrice = gwei(gasPrice)
                return (await (await WETH.deposit({ value: compress(amount), gasPrice })).wait()).status;
            } catch (e) {
                if (error.includes("underpriced")) {
                    try {
                        gasPrice = await getInsuredGasPrice({ chainID });
                        console.log("Insuring gas price to: ", gasPrice);
                        return (await (await WETH.deposit({ value: compress(amount), gasPrice })).wait()).status;
                    } catch (e) {
                        console.error("Central Bank Gas Estimation", e);
                        throw Error("Central Bank Gas Estimation");
                    }
                }
            }
        } else throw Error(e);
    }
}
// const getInsuredGasPrice = async ({ chainID }) => {
//     let error
//     let gasPrice
//     const quote = () => getgasprice(chainID);
//     try {
//         gasPrice = await quote(chainID)
//     } catch (e) {
//         error = JSON.stringify(e);
//         if (error.includes("underpriced")) {
//             let gasPrice
//             try {
//                 const accuracy = 3;
//                 const quotes = []
//                 for (i = 0; i < accuracy; i++) {
//                     quotes.push(quote());
//                     await sleep(1250)
//                 }
//                 const avgPrices = (await Promise.all(quotes)).filter(price => !isNaN(price));
//                 const avgPrice = [...avgPrices].reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0) / avgPrices.length;
//                 const insuredPrice = Math.round(avgPrice * 1.075)
//                 gasPrice = insuredPrice
//             } catch (e) {
//                 console.error("Central Bank Gas Estimation", e);
//                 throw Error("Central Bank Gas Estimation");
//             }
//             return (await (await WETH.deposit({ value: compress(amount), gasPrice: gwei(gasPrice) })).wait()).status;
//         }
//     }
//     // return insuredPrice//{ avgPrice, avgPrices, insuredPrice }

//     return gwei(gasPrice)
// }


const swap = async ({ tokenIn, tokenOut, amount, chainID }) => {
    const recipient = getAccount();
    const gasPrice = await getGasPrice({ chainID })
    const chainTag = getOpenOceanChainTag(chainID);
    const slippage = 25
    const decimals = await getDecimals({ token: tokenIn, chainID });
    const quantity = Number(`${amount}e-${decimals}`)
    // console.log(`Quantity: ${quantity} / Amount: ${amount}`)
    console.log("Fetching quote...");
    const request = `https://open-api.openocean.finance/v3/${chainTag}/swap_quote?inTokenAddress=${tokenIn}&outTokenAddress=${tokenOut}&amount=${quantity}&gasPrice=${gasPrice}&slippage=${slippage}&account=${recipient}`
    const response = await fetch(request);
    // console.log("From: ", request);
    const { code, data } = await response.json();
    if (code !== 200) throw Error(`Failed to swap ${quantity} of ${tokenIn} to ${tokenOut} on ${chainTag}`);
    const { from, to, value, gasPrice: wei, data: tradeData } = data
    const allowance = await getAllowance({ token: tokenIn, spender: to, chainID })
    if (allowance < amount) await approve({ token: tokenIn, amount, spender: to, chainID });
    console.log("Swapping...")
    await sendTransaction({ from, to, value, gasPrice: wei, data: tradeData }, chainID);
    return true
}

const swapAll = async ({ tokenIn, tokenOut, chainID }) => {
    const amount = await getTokenBalance({ token: tokenIn, chainID })
    if (amount == 0) throw Error(`Primary account holds no ${tokenIn}`)
    return await swap({ tokenIn, tokenOut, amount, chainID });
}

const refuel = async ({ tokenIn, chainID }) => {
    console.log("Refueling...")
    const tokenOut = getWETH(chainID);
    await swapAll({ tokenIn, tokenOut, chainID });
    await unwrapAll({ chainID });
    return true;
}



module.exports = {
    getGasPrice,
    getBalance,
    getTokenBalance,
    getWrappedBalance,
    getAllowance,
    getDecimals,
    transfer,
    transferAll,
    unwrap,
    unwrapAll,
    approve,
    approveAll,
    wrap,
    swap,
    swapAll,
    refuel
}

//next build on the api layer
// - build rango api client
// - build quote proxy to swap on demand -| dont worry about multichain capabilities just DAI L1 to WBTC via Kyber, up to 10 M
// integrate stablecoin into ledger and "stabalization" capacities => swap any currency to a stablecoin provided by the ledger


//swap => add api layer to quote, get back swap data, contract approval address, and contract address


//migrateAssets();
//swapAllToGas();
//stabalizeAssets(); //Move all weth to Dai