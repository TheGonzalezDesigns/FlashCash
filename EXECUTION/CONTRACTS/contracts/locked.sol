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

// contract Main {
//     using SafeMath for uint256;
//     address public WETH = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;

//     struct fullParams {
//         address loanedAsset;
//         uint256 loanedAmount;
//         address repaymentAsset;
//         uint256 repaymentDebt;
//         uint256 repaymentAmount;
//         address repaymentPool;
//         address swappedAsset;
//         TradeDesc[] trades;
//         uint chunks;
//         uint loanChunks;
//         uint loanChunk;
//     }

//     struct TradeDesc {
//         uint256 providerID;
//         address tokenIn;
//         bytes data;
//     }

//     struct offers {
//         uint at1;
//         uint at10;
//         uint at100;
//         uint at1000;
//     }

//     receive() external payable {}

//     fallback() external payable {}

//     function delta(uint256 a, uint256 b) internal pure returns (uint256 y) {
//         int256 d = ((int256(b) - int256(a)) * 10000) / int256(a == 0 ? 1 : a);
//         y = (a * b) == 0 ? 818 : (b > a) ? uint256(d) : uint256(d * -1);
//     }

//     function send(
//         address tokenIn,
//         address tokenOut,
//         uint256 loanAmount,
//         TradeDesc[] calldata trades,
//         uint8 gasPrice,
//         uint chunks,
//         uint loanChunks
//     ) public {
//         uint gasUsed = gasleft();
//         flashswap(loanAmount, tokenIn, tokenOut, trades, chunks, loanChunks);

//         // uint G = IERC20(WETH).balanceOf(address(this));
//         // uint P = IERC20(tokenOut).balanceOf(address(this));
//         // console.warn(false, "G: ", G, " // P: ", P);

//         // if (tokenOut == WETH) {
//         uint G = IERC20(WETH).balanceOf(address(this));
//         require(G > 0, "NO-G");
//         gasUsed -= gasleft();
//         gasUsed *= gasPrice;
//         gasUsed *= 1e9;
//         console.warn(G > gasUsed, "G: ", G, " // gasUsed: ", gasUsed);
//         IWETH(WETH).withdraw(G);
//         payable(msg.sender).transfer(G);
//         // } else {
//         //     uint P = IERC20(tokenOut).balanceOf(address(this));
//         //     require(P > 0, "NO-P");
//         //     IERC20(tokenOut).transfer(msg.sender, P);
//         // }
//     }

//     function flashswap(
//         uint256 loanAmount,
//         address tokenIn,
//         address tokenOut,
//         TradeDesc[] calldata trades,
//         uint chunks,
//         uint loanChunks
//     ) internal {
//         (address repaymentPool, uint256 repaymentAmount) = PoolAggregator
//             .findLiquidity(loanAmount / loanChunks, tokenIn, WETH);

//         fullParams memory FP = fullParams(
//             tokenIn,
//             loanAmount,
//             WETH,
//             repaymentAmount,
//             repaymentAmount,
//             repaymentPool,
//             tokenOut,
//             trades,
//             chunks,
//             loanChunks,
//             0
//         );

//         IUniswapV2Pool(FP.repaymentPool).swap(
//             FP.loanedAsset == IUniswapV2Pool(FP.repaymentPool).token0()
//                 ? FP.loanedAmount
//                 : 0,
//             FP.loanedAsset == IUniswapV2Pool(FP.repaymentPool).token1()
//                 ? FP.loanedAmount
//                 : 0,
//             address(this),
//             abi.encode(FP)
//         );
//         //Asset Y and maybe WETH;
//     }

//     function uniswapV2Call(
//         address _sender,
//         uint256 _amount0,
//         uint256 _amount1,
//         bytes calldata _data
//     ) external {
//         fullParams memory FP = abi.decode(_data, (fullParams));
//         // asset X

//         if (FP.loanChunk < (FP.loanChunks - 1)) {
//             (address repaymentPool, uint256 repaymentAmount) = PoolAggregator
//                 .findLiquidity(
//                     FP.loanedAmount / FP.loanChunks,
//                     FP.loanedAsset,
//                     WETH
//                 );

//             fullParams memory FP2 = fullParams(
//                 FP.loanedAsset,
//                 FP.loanedAmount,
//                 FP.repaymentAsset,
//                 (FP.repaymentAmount + repaymentAmount),
//                 repaymentAmount,
//                 repaymentPool,
//                 FP.swappedAsset,
//                 FP.trades,
//                 FP.chunks,
//                 FP.loanChunks,
//                 (FP.loanChunk + 1)
//             );

//             IUniswapV2Pool(FP2.repaymentPool).swap(
//                 FP2.loanedAsset == IUniswapV2Pool(FP.repaymentPool).token0()
//                     ? FP2.loanedAmount
//                     : 0,
//                 FP2.loanedAsset == IUniswapV2Pool(FP.repaymentPool).token1()
//                     ? FP2.loanedAmount
//                     : 0,
//                 address(this),
//                 abi.encode(FP2)
//             );
//         } else {
//             uint256 q = FP.trades.length;

//             for (uint256 i = 0; i < q; i++)
//                 EnigmaV3.swap(
//                     FP.trades[i].providerID,
//                     FP.trades[i].tokenIn,
//                     FP.trades[i].data
//                 );
//             // asset Y

//             uint swappedAssetBalance = IERC20(FP.swappedAsset).balanceOf(
//                 address(this)
//             );

//             (address LP, uint expectedWETHAmount) = BlackAggregator
//                 .findLiquidity(
//                     swappedAssetBalance / FP.chunks,
//                     FP.swappedAsset,
//                     0x04068DA6C83AFCFA0e13ba15A6696662335D5B75
//                 );

//             for (uint8 i; i < FP.chunks; i++) {
//                 IERC20(FP.swappedAsset).transfer(
//                     LP,
//                     swappedAssetBalance / FP.chunks
//                 );

//                 IUniswapV2Pool(LP).swap(
//                     0x04068DA6C83AFCFA0e13ba15A6696662335D5B75 ==
//                         IUniswapV2Pool(LP).token0()
//                         ? expectedWETHAmount
//                         : 0,
//                     0x04068DA6C83AFCFA0e13ba15A6696662335D5B75 ==
//                         IUniswapV2Pool(LP).token1()
//                         ? expectedWETHAmount
//                         : 0,
//                     address(this),
//                     ""
//                 );
//                 (LP, expectedWETHAmount) = BlackAggregator.findLiquidity(
//                     swappedAssetBalance / FP.chunks,
//                     FP.swappedAsset,
//                     WETH
//                 );
//             }

//             swappedAssetBalance = IERC20(
//                 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75
//             ).balanceOf(address(this));

//             console.warn(
//                 false,
//                 "balance: ",
//                 swappedAssetBalance,
//                 ", at10: ",
//                 FP.repaymentAmount,
//                 ", repaymentDebt: ",
//                 FP.repaymentDebt
//             );
//         }

//         IERC20(FP.repaymentAsset).transfer(
//             FP.repaymentPool,
//             FP.repaymentAmount
//         );
//     }
// }
