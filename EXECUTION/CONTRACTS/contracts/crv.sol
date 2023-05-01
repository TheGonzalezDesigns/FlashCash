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
// }

// interface IFlashCallback {
//     /// @notice Called to `msg.sender` after flash loaning to the recipient from IPool#flash.
//     /// @dev This function's implementation must send the loaned amounts with computed fee amounts
//     /// The caller of this method must be checked to be a Pool deployed by the canonical Factory.
//     /// @param feeQty0 The token0 fee to be sent to the pool.
//     /// @param feeQty1 The token1 fee to be sent to the pool.
//     /// @param data Data passed through by the caller via the IPool#flash call
//     function flashCallback(
//         uint256 feeQty0,
//         uint256 feeQty1,
//         bytes calldata data
//     ) external;
// }

// interface IKyberLP {
//     function flash(
//         address recipient,
//         uint256 qty0,
//         uint256 qty1,
//         bytes memory data
//     ) external;

//     function token0() external view returns (address);

//     function token1() external view returns (address);
// }

// interface IWCurveLP {
//     function exchange_underlying(
//         int128 i,
//         int128 j,
//         uint256 _dx,
//         uint256 _min_dy
//     ) external returns (uint256);

//     function get_dy_underlying(
//         int128 i,
//         int128 j,
//         uint256 _dx
//     ) external view returns (uint256);

//     function underlying_coins(uint256 arg0) external view returns (address);
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

// contract Main {
//     address internal constant WETH = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;
//     address private constant WCurveLP =
//         0x0fa949783947Bf6c1b171DB13AEACBB488845B3f;

//     struct TradeDesc {
//         uint256 providerID;
//         address tokenIn;
//         bytes data;
//     }

//     struct parameters {
//         address loanedAsset;
//         uint loanAmount;
//         address lender;
//         TradeDesc[] trades;
//         int128 i;
//         int128 j;
//         uint8 direction;
//     }

//     function send(
//         address tokenIn,
//         address tokenOut,
//         uint256 loanAmount,
//         TradeDesc[] calldata trades,
//         uint8 gasPrice,
//         address profiteur
//     ) public {
//         // uint gasUsed = gasleft();
//         trade(tokenIn, tokenOut, loanAmount, trades);
//         // paybackGas(gasPrice, gasUsed, tokenIn);
//         // transferProfits(tokenIn, profiteur);
//     }

//     function trade(
//         address tokenIn,
//         address tokenOut,
//         uint256 loanAmount,
//         TradeDesc[] calldata trades
//     ) public {
//         parameters memory params;
//         params.loanedAsset = tokenIn;
//         params.loanAmount = loanAmount;
//         params.lender = getKyberLoanPool(tokenIn, loanAmount);
//         params.trades = trades;
//         params.i = getWCurveLPCoins(tokenOut);
//         params.j = getWCurveLPCoins(tokenIn);
//         params.direction = IKyberLP(params.lender).token0() == tokenIn ? 0 : 1;
//         IKyberLP(params.lender).flash(
//             address(this),
//             params.direction == 0 ? params.loanAmount : 0,
//             params.direction == 1 ? params.loanAmount : 0,
//             abi.encode(params)
//         );
//     }

//     function getKyberLP(uint8 index) private pure returns (address pool) {
//         pool = [
//             0x8dcF5FeD6aE6bf0bEFB5e4f0C9414C2cb9A4ED01,
//             0x9c29247a73Fe3bB6ebe34285646b458906B575D7,
//             0x36232EC88ccd3Ed03c2c03E42f0c4eC2DE463bE7
//         ][index];
//     }

//     function getKyberLoanPool(
//         address asset,
//         uint256 loanAmount
//     ) internal view returns (address) {
//         address KyberLP;
//         uint8 LPs = 3;
//         for (uint8 i = 0; i < LPs; i++) {
//             //--
//             KyberLP = getKyberLP(i);
//             if (IERC20(asset).balanceOf(KyberLP) >= loanAmount) {
//                 return KyberLP;
//             }
//         }
//         revert("NO-LP");
//         // require(pool != address(0), "NO-LP");
//     }

//     function getWCurveLPCoins(address token) internal pure returns (int128 i) {
//         if (token == 0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E) i = 0;
//         else if (token == 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75) i = 1;
//         else if (token == 0x049d68029688eAbF473097a2fC38ef61633A3C7A) i = 2;
//         else revert("NO-C");
//     }

//     function flashCallback(
//         uint256 feeQty0,
//         uint256 feeQty1,
//         bytes calldata data
//     ) external {
//         parameters memory params = abi.decode(data, (parameters));

//         EnigmaV3.swap(
//             params.trades[0].providerID,
//             params.trades[0].tokenIn,
//             params.trades[0].data
//         );
//         // revert("swapped");
//         (, uint balance) = wCurveSwap(params.i, params.j, WCurveLP); //---
//         revert("swapped");

//         // uint fee = params.direction == 0 ? feeQty0 : feeQty1; //-
//         // uint repaymentAmount = params.loanAmount + fee; //--

//         // if (balance < repaymentAmount)
//         //     log(
//         //         "Balance: ",
//         //         balance,
//         //         ", loanAmount: ",
//         //         params.loanAmount,
//         //         ", repaymentAmount: ",
//         //         repaymentAmount
//         //     );
//         // else
//         //     log(
//         //         "Artemis: Balance: ",
//         //         balance,
//         //         ", loanAmount: ",
//         //         params.loanAmount,
//         //         ", repaymentAmount: ",
//         //         repaymentAmount
//         //     );
//         // IERC20(params.loanedAsset).transfer(params.lender, repaymentAmount);
//     }

//     function wCurveSwap(
//         int128 i,
//         int128 j,
//         address pool
//     ) internal returns (uint256 dy, uint256 balance) {
//         IWCurveLP LP = IWCurveLP(WCurveLP);

//         address tokenIn = LP.underlying_coins(uint256(uint128(i)));

//         address tokenOut = LP.underlying_coins(uint256(uint128(j)));

//         uint256 dx = IERC20(tokenIn).balanceOf(address(this));

//         IERC20(tokenIn).approve(pool, dx);

//         // dy = getWrappedDy(i, j, dx, pool);

//         dy = 0;

//         LP.exchange_underlying(i, j, dx, dy);

//         balance = IERC20(tokenOut).balanceOf(address(this));
//     }

//     // function getWrappedDy(
//     //     int128 i,
//     //     int128 j,
//     //     uint256 dx,
//     //     address pool
//     // ) internal view returns (uint256 dy) {
//     //     dy = IWCurveLP(pool).get_dy_underlying(i, j, dx);
//     // }

//     // function toString(uint256 value) internal pure returns (string memory) {
//     //     if (value == 0) {
//     //         return "0";
//     //     }

//     //     uint256 temp = value;

//     //     uint256 digits;

//     //     while (temp != 0) {
//     //         digits++;

//     //         temp /= 10;
//     //     }

//     //     bytes memory buffer = new bytes(digits);

//     //     while (value != 0) {
//     //         digits -= 1;

//     //         buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));

//     //         value /= 10;
//     //     }

//     //     return string(buffer);
//     // }

//     // function log(
//     //     string memory a,
//     //     uint256 b,
//     //     string memory c,
//     //     uint256 d,
//     //     string memory e,
//     //     uint256 f
//     // ) internal pure {
//     //     revert(
//     //         string(
//     //             abi.encodePacked(a, toString(b), c, toString(d), e, toString(f))
//     //         )
//     //     );
//     // }

//     // function delta(uint256 a, uint256 b) internal pure returns (uint256 y) {
//     //     int256 d = ((int256(b) - int256(a)) * 10000) / int256(a == 0 ? 1 : a);
//     //     y = (a * b) == 0 ? 818 : (b > a) ? uint256(d) : uint256(d * -1);
//     // }

//     // receive() external payable {}

//     // fallback() external payable {}

//     // function paybackGas(
//     //     uint8 gasPrice,
//     //     uint gasUsed,
//     //     address gasToken
//     // ) internal returns (uint gas) {
//     //     uint balance;
//     //     gas = gasleft();
//     //     gasUsed -= gas;
//     //     gasUsed -= 50000;
//     //     gasUsed *= gasPrice;
//     //     gasUsed *= 1e9;

//     //     if (gasToken != WETH) {
//     //         (
//     //             address gasTokenRepaymentPool,
//     //             uint gasTokenRepaymentAmount
//     //         ) = PoolAggregator.findLiquidity(gasUsed, WETH, gasToken);

//     //         balance = IERC20(gasToken).balanceOf(address(this));

//     //         if (balance >= gasTokenRepaymentAmount)
//     //             log(
//     //                 "Pre-Gas-Swap: -",
//     //                 delta(gasTokenRepaymentAmount, balance),
//     //                 ", gasUsed: ",
//     //                 gasUsed,
//     //                 ", gasCost: ",
//     //                 gas
//     //             );
//     //         IERC20(gasToken).transfer(
//     //             gasTokenRepaymentPool,
//     //             gasTokenRepaymentAmount
//     //         );
//     //         IUniswapV2Pool(gasTokenRepaymentPool).swap(
//     //             WETH == IUniswapV2Pool(gasTokenRepaymentPool).token0()
//     //                 ? gasUsed
//     //                 : 0,
//     //             WETH == IUniswapV2Pool(gasTokenRepaymentPool).token1()
//     //                 ? gasUsed
//     //                 : 0,
//     //             address(this),
//     //             ""
//     //         );
//     //     }
//     //     IWETH(WETH).withdraw(gasUsed);
//     //     payable(msg.sender).transfer(gasUsed);
//     // }

//     // function transferProfits(address asset, address profiteur) private {
//     //     uint balance = IERC20(asset).balanceOf(address(this));
//     //     require(balance > 0, "NO-PROFIT");
//     //     IERC20(asset).transfer(profiteur, balance);
//     // }
// }
// //0x1E053796D7931E624Bd74c2cB4E4990bDcD8434A
