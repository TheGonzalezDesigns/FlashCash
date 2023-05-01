// /*
//     ¥=========================================================================================================€
//     $| ███╗██████╗  ██╗    ██╗  ██╗      ███╗   ███╗ ██████╗ ██╗  ██╗     ███╗   ███╗███╗   ██╗██╗   ██╗███╗ |$
    
//     $| ██║  ██████╔╝██║     █████╔╝█████╗██╔████╔██║██║  ███╗█████╔╝█████╗██╔████╔██║██╔██╗ ██║ ╚████╔╝  ██║ |$
//     $| ██║  ██╔══██╗██║     ██╔═██╗╚════╝██║╚██╔╝██║██║   ██║██╔═██╗╚════╝██║╚██╔╝██║██║╚██╗██║  ╚██╔╝   ██║ |$
    
//     $| ╚══╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══╝ |$
//     $| ███╗██████╗  ██╗    ██╗  ██╗      ███╗   ███╗ ██████╗ ██╗  ██╗     ███╗   ███╗███╗   ██╗██╗   ██╗███╗ |$
//     $| ██╔╝ ██╔══██╗██║     ██║ ██╔╝     ████╗ ████║██╔════╝ ██║ ██╔╝     ████╗ ████║████╗  ██║╚██╗ ██╔╝╚██║ |$
//     $| ██║  ██████╔╝██║     █████╔╝█████╗██╔████╔██║██║  ███╗█████╔╝█████╗██╔████╔██║██╔██╗ ██║ ╚████╔╝  ██║ |$
//     $| ██║  ██╔══██╗██║     ██╔═██╗╚════╝██║╚██╔╝██║██║   ██║██╔═██╗╚════╝██║╚██╔╝██║██║╚██╗██║  ╚██╔╝   ██║ |$
//     $| ███╗██████╔╝███████╗██║  ██╗     ██║ ╚═╝ ██║╚██████╔╝██║  ██╗      ██║ ╚═╝ ██║██║ ╚████║   ██║   ███║ |$
//     $| ╚══╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══╝ |$
//     $| ███╗██████╗  ██╗    ██╗  ██╗      ███╗   ███╗ ██████╗ ██╗  ██╗     ███╗   ███╗███╗   ██╗██╗   ██╗███╗ |$
    
//     $| ██║  ██████╔╝██║     █████╔╝█████╗██╔████╔██║██║  ███╗█████╔╝█████╗██╔████╔██║██╔██╗ ██║ ╚████╔╝  ██║ |$

//     $| ███╗██████╔╝███████╗██║  ██╗     ██║ ╚═╝ ██║╚██████╔╝██║  ██╗      ██║ ╚═╝ ██║██║ ╚████║   ██║   ███║ |$
//     $| ╚══╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══╝ |$
//     €=========================================================================================================¥
//     This code was produced by Black Magic Money.
// */
// //SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.8.0;
// pragma experimental ABIEncoderV2;

// library console {
//     function toString(uint256 value) public pure returns (string memory) {
//         if (value == 0) {
//             return "0";
//         }
//         uint256 temp = value;
//         uint256 digits;
//         while (temp != 0) {
//             digits++;
//             temp /= 10;
//         }
//         bytes memory buffer = new bytes(digits);
//         while (value != 0) {
//             digits -= 1;
//             buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
//             value /= 10;
//         }
//         return string(buffer);
//     }

//     function hexify(address addy) internal pure returns (string memory) {
//         bytes memory buffer = abi.encodePacked(addy);
//         // Fixed buffer size for hexadecimal convertion
//         bytes memory converted = new bytes(buffer.length * 2);

//         bytes memory _base = "0123456789abcdef";

//         for (uint256 i = 0; i < buffer.length; i++) {
//             converted[i * 2] = _base[uint8(buffer[i]) / _base.length];
//             converted[i * 2 + 1] = _base[uint8(buffer[i]) % _base.length];
//         }

//         return string(abi.encodePacked("0x", converted));
//     }

//     function track(
//         address base,
//         address quote
//     ) public pure returns (string memory) {
//         return string(abi.encodePacked(hexify(base), " => ", hexify(quote)));
//     }

//     function concat(
//         string calldata a,
//         string calldata b
//     ) public pure returns (string memory) {
//         return string(abi.encodePacked(a, b));
//     }

//     function concat(
//         string calldata a,
//         uint256 b
//     ) public pure returns (string memory) {
//         return string(abi.encodePacked(a, toString(b)));
//     }

//     function warn(
//         bool condition,
//         string calldata a,
//         uint256 b,
//         string calldata c,
//         uint256 d,
//         string calldata e,
//         uint256 f
//     ) public pure {
//         require(
//             condition,
//             string(
//                 abi.encodePacked(a, toString(b), c, toString(d), e, toString(f))
//             )
//         );
//     }

//     function warn(
//         bool condition,
//         string calldata a,
//         uint256 b,
//         string calldata c,
//         uint256 d
//     ) public pure {
//         require(
//             condition,
//             string(abi.encodePacked(a, toString(b), c, toString(d)))
//         );
//     }

//     function warn(bool condition, string calldata a, uint256 b) public pure {
//         require(condition, string(abi.encodePacked(a, toString(b))));
//     }

//     function decode(
//         bytes memory _returnData
//     ) internal pure returns (string memory) {
//         assembly {
//             _returnData := add(_returnData, 0x04)
//         }
//         return abi.decode(_returnData, (string));
//     }
// }

// interface IERC20 {
//     function balanceOf(address account) external view returns (uint256);

//     function transfer(
//         address recipient,
//         uint256 amount
//     ) external returns (bool);

//     function allowance(
//         address owner,
//         address spender
//     ) external view returns (uint256);

//     function approve(address spender, uint256 amount) external returns (bool);

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint256 amount
//     ) external returns (bool);

//     function decimals() external view returns (uint8);
// }

// library EnigmaV3 {
//     address private constant Kyber = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;
//     address private constant Para = 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57;
//     address private constant Zero = 0xDEF189DeAEF76E379df891899eb5A00a94cBC250;

//     address private constant ParaProxy =
//         0x216B4B4Ba9F3e719726886d34a177484278Bfcae;

//     function swap(
//         uint256 provider,
//         address tokenIn,
//         bytes memory swapParams
//     ) external returns (bool success, bytes memory error) {
//         IERC20(tokenIn).approve(Kyber, type(uint256).max);
//         if (provider == 0) (success, error) = Kyber.call(swapParams);
//         else if (provider == 1) {
//             IERC20(tokenIn).approve(Zero, type(uint256).max);
//             (success, error) = Zero.call(swapParams);
//         } else if (provider == 2) {
//             IERC20(tokenIn).approve(Para, type(uint256).max);
//             IERC20(tokenIn).approve(ParaProxy, type(uint256).max);
//             (success, error) = Para.call(swapParams);
//         } else revert("Provider Uknown");
//         require(success, string(error));
//     }
// }

// interface IWETH {
//     function withdraw(uint256 amount) external;

//     function balanceOf(address account) external view returns (uint256);
// }

// interface IUniswapV2Pool {
//     function swap(
//         uint256 amount0Out,
//         uint256 amount1Out,
//         address to,
//         bytes calldata data
//     ) external;

//     function token0() external view returns (address);

//     function token1() external view returns (address);

//     function getReserves()
//         external
//         view
//         returns (
//             uint112 _reserve0,
//             uint112 _reserve1,
//             uint32 _blockTimestampLast
//         );

//     function kLast() external view returns (uint256);
// }

// interface IUniswapV2Factory {
//     function getPair(
//         address tokenA,
//         address tokenB
//     ) external view returns (address pair);
// }

// interface IUniswapV2Callee {
//     function uniswapV2Call(
//         address sender,
//         uint256 amount0,
//         uint256 amount1,
//         bytes calldata data
//     ) external;
// }

// library SafeMath {
//     function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
//         require((z = x + y) >= x, "ds-math-add-overflow");
//     }

//     function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
//         require((z = x - y) <= x, "ds-math-sub-underflow");
//     }

//     function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
//         require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
//     }
// }

// library PoolAggregator {
//     using SafeMath for uint256;

//     function getAmountIn(
//         uint256 amountOut,
//         uint256 reserveIn,
//         uint256 reserveOut
//     ) internal pure returns (uint256 amountIn) {
//         require(amountOut > 0, "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT");
//         require(
//             reserveIn > 0 && reserveOut > 0,
//             "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
//         );
//         uint256 numerator = reserveIn.mul(amountOut).mul(1000);
//         uint256 denominator = reserveOut.sub(amountOut).mul(995);
//         amountIn = (numerator / denominator).add(1);
//     }

//     function getFactory(uint8 index) internal pure returns (address factory) {
//         factory = [
//             0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3,
//             0xEF45d134b73241eDa7703fa787148D9C9F4950b0,
//             0xE236f6890F1824fa0a7ffc39b1597A5A6077Cfe9,
//             0xc35DADB65012eC5796536bD9864eD8773aBc74C4,
//             0xDc745E09fC459aDC295E2e7baACe881354dB7F64,
//             0x7d82F56ea0820A9d42b01C3C28F1997721732218,
//             0x39720E5Fe53BEEeb9De4759cb91d8E7d42c17b76,
//             0xc5bC174CB6382FbAB17771d05e6a918441deCeea,
//             0x9C454510848906FDDc846607E4baa27Ca999FBB6,
//             0x08b3CCa975a82cFA6f912E0eeDdE53A629770D3f,
//             0x733A9D1585f2d14c77b49d39BC7d7dd14CdA4aa5,
//             0x7Ba73c99e6f01a37f3e33854c8F544BbbadD3420,
//             0xc0719a9A35a2D9eBBFdf1C6d383a5E8E7b2ef7a8,
//             0xf6488205957f0b4497053d6422F49e27944eE3Dd,
//             0xd9820a17053d6314B20642E465a84Bf01a3D64f5,
//             0x349D953cA03C9D63c040d463545E21Fe4b713C2e,
//             0x5eF0153590D4a762F129dCf3c59186D91365e4e1
//         ][index];
//     }

//     function getQuote(
//         uint256 loanAmount,
//         address tokenIn,
//         address tokenOut,
//         address pool
//     ) internal view returns (uint256 quote) {
//         IUniswapV2Pool LP = IUniswapV2Pool(pool);

//         (uint256 R1, uint256 R2, ) = LP.getReserves();
//         quote = LP.token0() == tokenIn
//             ? getAmountIn(loanAmount, R2, R1)
//             : getAmountIn(loanAmount, R1, R2);
//     }

//     function findLiquidity(
//         uint256 loanAmount,
//         address tokenIn,
//         address tokenOut
//     ) public view returns (address, uint256) {
//         address factory;
//         uint256 quote = type(uint256).max;
//         address LP = address(0);
//         uint256 BestQuote = type(uint256).max;
//         address BestLP = address(0);

//         for (uint8 i = 0; i < 17; i++) {
//             factory = getFactory(i);
//             LP = IUniswapV2Factory(factory).getPair(tokenIn, tokenOut);
//             if (
//                 LP != address(0) && loanAmount <= IERC20(tokenIn).balanceOf(LP)
//             ) {
//                 quote = getQuote(loanAmount, tokenIn, tokenOut, LP);
//                 require(quote != 0, "IN-LQ");
//                 if (quote < BestQuote) {
//                     BestLP = LP;
//                     BestQuote = quote;
//                 }
//             }
//         }

//         require(BestLP != address(0), "NO-LP");

//         return (BestLP, BestQuote);
//     }
// }

// library BlackAggregator {
//     using SafeMath for uint256;

//     function getAmountOut(
//         uint256 amountIn,
//         uint256 reserveIn,
//         uint256 reserveOut
//     ) internal pure returns (uint256 amountOut) {
//         require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
//         require(
//             reserveIn > 0 && reserveOut > 0,
//             "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
//         );
//         uint256 amountInWithFee = amountIn.mul(997);
//         uint256 numerator = amountInWithFee.mul(reserveOut);
//         uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
//         amountOut = numerator / denominator;
//     }

//     function getFactory(uint8 index) internal pure returns (address factory) {
//         factory = [
//             0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3,
//             0xEF45d134b73241eDa7703fa787148D9C9F4950b0,
//             0xE236f6890F1824fa0a7ffc39b1597A5A6077Cfe9,
//             0xc35DADB65012eC5796536bD9864eD8773aBc74C4,
//             0xDc745E09fC459aDC295E2e7baACe881354dB7F64,
//             0x7d82F56ea0820A9d42b01C3C28F1997721732218,
//             0x39720E5Fe53BEEeb9De4759cb91d8E7d42c17b76,
//             0xc5bC174CB6382FbAB17771d05e6a918441deCeea,
//             0x9C454510848906FDDc846607E4baa27Ca999FBB6,
//             0x08b3CCa975a82cFA6f912E0eeDdE53A629770D3f,
//             0x733A9D1585f2d14c77b49d39BC7d7dd14CdA4aa5,
//             0x7Ba73c99e6f01a37f3e33854c8F544BbbadD3420,
//             0xc0719a9A35a2D9eBBFdf1C6d383a5E8E7b2ef7a8,
//             0xf6488205957f0b4497053d6422F49e27944eE3Dd,
//             0xd9820a17053d6314B20642E465a84Bf01a3D64f5,
//             0x349D953cA03C9D63c040d463545E21Fe4b713C2e,
//             0x5eF0153590D4a762F129dCf3c59186D91365e4e1
//         ][index];
//     }

//     function getQuote(
//         uint256 swapAmount,
//         address tokenIn,
//         address tokenOut,
//         address pool
//     ) internal view returns (uint256 quote) {
//         IUniswapV2Pool LP = IUniswapV2Pool(pool);

//         (uint256 R1, uint256 R2, ) = LP.getReserves();
//         quote = LP.token0() == tokenIn
//             ? getAmountOut(swapAmount, R1, R2)
//             : getAmountOut(swapAmount, R2, R1);
//     }

//     function findLiquidity(
//         uint256 swapAmount,
//         address tokenIn,
//         address tokenOut
//     ) public view returns (address BestLP, uint256 BestQuote) {
//         address factory;
//         uint256 quote = 0;
//         address LP = address(0);
//         BestQuote = 0;
//         BestLP = address(0);

//         for (uint8 i = 0; i < 16; i++) {
//             LP = IUniswapV2Factory(getFactory(i)).getPair(tokenIn, tokenOut);
//             if (
//                 LP != address(0) && swapAmount <= IERC20(tokenIn).balanceOf(LP)
//             ) {
//                 quote = getQuote(swapAmount, tokenIn, tokenOut, LP);
//                 require(quote != 0, "IN-LQ");
//                 if (quote > BestQuote) {
//                     BestLP = LP;
//                     BestQuote = quote;
//                 }
//             }
//         }

//         require(BestLP != address(0), "NO-LP");
//     }
// }

// interface IPoolAddressesProvider {
//     function getPool() external view returns (address);
// }

// interface IPool {
//     function flashLoanSimple(
//         address receiverAddress,
//         address asset,
//         uint256 amount,
//         bytes calldata params,
//         uint16 referralCode
//     ) external;
// }

// contract Main {
//     using SafeMath for uint256;
//     address public WETH = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;

//     address internal immutable AAVE =
//         IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb)
//             .getPool();

//     struct TradeDesc {
//         uint256 providerID;
//         address tokenIn;
//         bytes data;
//     }

//     struct basicParams {
//         address loanedAsset;
//         uint256 loanAmount;
//         address tokenIn;
//         address tokenOut;
//         TradeDesc[] trades;
//         address repaymentPool;
//         uint256 repaymentAmount;
//         uint256 balance;
//     }

//     receive() external payable {}

//     fallback() external payable {}

//     // function delta(uint256 a, uint256 b) internal pure returns (uint256 y) {
//     //     int256 d = ((int256(b) - int256(a)) * 10000) / int256(a == 0 ? 1 : a);
//     //     y = (a * b) == 0 ? 818 : (b > a) ? uint256(d) : uint256(d * -1);
//     // }

//     function paybackGas(
//         uint8 gasPrice,
//         uint gasUsed,
//         address gasToken
//     ) internal returns (uint gas) {
//         // uint balance;
//         gas = gasleft();
//         gasUsed -= gas;
//         gasUsed -= 50000;
//         gasUsed *= gasPrice;
//         gasUsed *= 1e9;

//         if (gasToken != WETH) {
//             (
//                 address gasTokenRepaymentPool,
//                 uint gasTokenRepaymentAmount
//             ) = PoolAggregator.findLiquidity(gasUsed, WETH, gasToken);

//             // balance = IERC20(gasToken).balanceOf(address(this));

//             // console.warn(
//             //     balance >= gasTokenRepaymentAmount,
//             //     "pre-entry-swap: -",
//             //     delta(gasTokenRepaymentAmount, balance),
//             //     ", gasUsed: ",
//             //     gasUsed,
//             //     ", gasCost: ",
//             //     gas
//             // );
//             IERC20(gasToken).transfer(
//                 gasTokenRepaymentPool,
//                 gasTokenRepaymentAmount
//             );
//             IUniswapV2Pool(gasTokenRepaymentPool).swap(
//                 WETH == IUniswapV2Pool(gasTokenRepaymentPool).token0()
//                     ? gasUsed
//                     : 0,
//                 WETH == IUniswapV2Pool(gasTokenRepaymentPool).token1()
//                     ? gasUsed
//                     : 0,
//                 address(this),
//                 ""
//             );
//         }
//         IWETH(WETH).withdraw(gasUsed);
//         payable(msg.sender).transfer(gasUsed);
//     }

//     function send(
//         address tokenIn,
//         address tokenOut,
//         uint256 loanAmount,
//         TradeDesc[] calldata trades,
//         uint8 gasPrice,
//         address recipient
//     ) public {
//         uint gasUsed = gasleft();
//         recipient = recipient == address(0) ? msg.sender : recipient;
//         flashswap(loanAmount, tokenIn, tokenOut, trades);
//         gasUsed -= paybackGas(gasPrice, gasUsed, tokenOut);
//         if (tokenOut != WETH) {
//             uint balance = IERC20(tokenOut).balanceOf(address(this));
//             require(balance > 0, "NO NET PROFIT ;(");
//             IERC20(tokenOut).transfer(
//                 recipient,
//                 IERC20(tokenOut).balanceOf(address(this))
//             );
//         }
//     }

//     function flashswap(
//         uint256 loanAmount,
//         address tokenIn,
//         address tokenOut,
//         TradeDesc[] calldata trades
//     ) internal {
//         basicParams memory BP = basicParams(
//             WETH,
//             loanAmount,
//             tokenIn,
//             tokenOut,
//             trades,
//             address(0),
//             0,
//             0
//         );

//         (BP.repaymentPool, BP.repaymentAmount) = PoolAggregator.findLiquidity(
//             BP.loanAmount,
//             BP.tokenIn,
//             BP.loanedAsset
//         );

//         // BP.repaymentAmount *= 11;
//         // BP.repaymentAmount /= 10;

//         IPool(AAVE).flashLoanSimple(
//             address(this),
//             BP.loanedAsset,
//             BP.repaymentAmount,
//             abi.encode(BP),
//             0
//         );
//     }

//     function executeOperation(
//         address asset,
//         uint256 amount,
//         uint256 premium,
//         address initiator,
//         bytes calldata params
//     ) external returns (bool) {
//         basicParams memory BP = abi.decode(params, (basicParams));

//         // BP.balance = IERC20(BP.loanedAsset).balanceOf(address(this));
//         // console.warn(
//         //     BP.balance >= BP.repaymentAmount,
//         //     "pre-entry-swap: -",
//         //     delta(BP.repaymentAmount, BP.balance)
//         // );

//         // console.warn(
//         //     BP.balance >= BP.repaymentAmount,
//         //     "pre-gas-swap | amount: ",
//         //     amount,
//         //     ", BP.repaymentAmount: ",
//         //     BP.repaymentAmount,
//         //     ", BP.balance: ",
//         //     BP.balance
//         // );
//         // require(IERC20(BP.loanedAsset).balanceOf(address(this)) >= BP.repaymentAmount, "pre-entry-swap");

//         IERC20(BP.loanedAsset).transfer(BP.repaymentPool, BP.repaymentAmount);
//         IUniswapV2Pool(BP.repaymentPool).swap(
//             BP.tokenIn == IUniswapV2Pool(BP.repaymentPool).token0()
//                 ? BP.loanAmount
//                 : 0,
//             BP.tokenIn == IUniswapV2Pool(BP.repaymentPool).token1()
//                 ? BP.loanAmount
//                 : 0,
//             address(this),
//             ""
//         );
//         // BP.balance = IERC20(BP.tokenIn).balanceOf(address(this));
//         // console.warn(
//         //     BP.balance >= BP.loanAmount,
//         //     "pre-main-swap: -",
//         //     delta(BP.loanAmount, BP.balance)
//         // );
//         // require(BP.balance >= BP.loanAmount, "pre-main-swap:");

//         for (uint256 i = 0; i < BP.trades.length; i++)
//             EnigmaV3.swap(
//                 BP.trades[i].providerID,
//                 BP.trades[i].tokenIn,
//                 BP.trades[i].data
//             );

//         BP.loanAmount = amount.add(premium);

//         if (BP.tokenOut != BP.loanedAsset) {
//             uint gasUsed = gasleft();
//             (BP.repaymentPool, BP.repaymentAmount) = PoolAggregator
//                 .findLiquidity(BP.loanAmount, BP.loanedAsset, BP.tokenOut);

//             // BP.balance =
//             // console.warn(
//             //     BP.balance >= BP.repaymentAmount,
//             //     "pre-exit-swap: -",
//             //     delta(BP.repaymentAmount, BP.balance)
//             // );
//             // console.warn(
//             //     BP.balance >= BP.repaymentAmount,
//             //     "pre-exit-swap: -",
//             //     delta(BP.repaymentAmount, BP.balance)
//             // );
//             // require(
//             //     IERC20(BP.tokenOut).balanceOf(address(this)) >=
//             //         BP.repaymentAmount,
//             //     "pre-exit-swap"
//             // );
//             IERC20(BP.tokenOut).transfer(BP.repaymentPool, BP.repaymentAmount);
//             IUniswapV2Pool(BP.repaymentPool).swap(
//                 BP.loanedAsset == IUniswapV2Pool(BP.repaymentPool).token0()
//                     ? BP.loanAmount
//                     : 0,
//                 BP.loanedAsset == IUniswapV2Pool(BP.repaymentPool).token1()
//                     ? BP.loanAmount
//                     : 0,
//                 address(this),
//                 ""
//             );
//             gasUsed -= gasleft();
//             // console.warn(false, "gas-metric: ", gasUsed);
//         }

//         // BP.balance = IERC20(BP.loanedAsset).balanceOf(address(this));
//         // console.warn(
//         //     BP.balance >= BP.loanAmount,
//         //     "pre-loan-exit: -",
//         //     delta(BP.loanAmount, BP.balance)
//         // );

//         return IERC20(BP.loanedAsset).approve(AAVE, type(uint256).max);
//     }
// }
