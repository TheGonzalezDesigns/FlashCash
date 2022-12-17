/*
    ¥=========================================================================================================€
    $| ███╗██████╗  ██╗    ██╗  ██╗      ███╗   ███╗ ██████╗ ██╗  ██╗     ███╗   ███╗███╗   ██╗██╗   ██╗███╗ |$
    
    $| ██║  ██████╔╝██║     █████╔╝█████╗██╔████╔██║██║  ███╗█████╔╝█████╗██╔████╔██║██╔██╗ ██║ ╚████╔╝  ██║ |$
    $| ██║  ██╔══██╗██║     ██╔═██╗╚════╝██║╚██╔╝██║██║   ██║██╔═██╗╚════╝██║╚██╔╝██║██║╚██╗██║  ╚██╔╝   ██║ |$
    
    $| ╚══╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══╝ |$
    $| ███╗██████╗  ██╗    ██╗  ██╗      ███╗   ███╗ ██████╗ ██╗  ██╗     ███╗   ███╗███╗   ██╗██╗   ██╗███╗ |$
    $| ██╔╝ ██╔══██╗██║     ██║ ██╔╝     ████╗ ████║██╔════╝ ██║ ██╔╝     ████╗ ████║████╗  ██║╚██╗ ██╔╝╚██║ |$
    $| ██║  ██████╔╝██║     █████╔╝█████╗██╔████╔██║██║  ███╗█████╔╝█████╗██╔████╔██║██╔██╗ ██║ ╚████╔╝  ██║ |$
    $| ██║  ██╔══██╗██║     ██╔═██╗╚════╝██║╚██╔╝██║██║   ██║██╔═██╗╚════╝██║╚██╔╝██║██║╚██╗██║  ╚██╔╝   ██║ |$
    $| ███╗██████╔╝███████╗██║  ██╗     ██║ ╚═╝ ██║╚██████╔╝██║  ██╗      ██║ ╚═╝ ██║██║ ╚████║   ██║   ███║ |$
    $| ╚══╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══╝ |$
    $| ███╗██████╗  ██╗    ██╗  ██╗      ███╗   ███╗ ██████╗ ██╗  ██╗     ███╗   ███╗███╗   ██╗██╗   ██╗███╗ |$
    
    $| ██║  ██████╔╝██║     █████╔╝█████╗██╔████╔██║██║  ███╗█████╔╝█████╗██╔████╔██║██╔██╗ ██║ ╚████╔╝  ██║ |$

    $| ███╗██████╔╝███████╗██║  ██╗     ██║ ╚═╝ ██║╚██████╔╝██║  ██╗      ██║ ╚═╝ ██║██║ ╚████║   ██║   ███║ |$
    $| ╚══╝╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══╝ |$
    €=========================================================================================================¥
    This code was produced by Black Magic Money.
*/
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

library console {
    function toString(uint256 value) public pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function hexify(address addy) internal pure returns (string memory) {
        bytes memory buffer = abi.encodePacked(addy);
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(buffer.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < buffer.length; i++) {
            converted[i * 2] = _base[uint8(buffer[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(buffer[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }

    function track(
        address base,
        address quote
    ) public pure returns (string memory) {
        return string(abi.encodePacked(hexify(base), " => ", hexify(quote)));
    }

    function concat(
        string calldata a,
        string calldata b
    ) public pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function concat(
        string calldata a,
        uint b
    ) public pure returns (string memory) {
        return string(abi.encodePacked(a, toString(b)));
    }

    function warn(
        bool condition,
        string calldata a,
        uint b,
        string calldata c,
        uint d,
        string calldata e,
        uint f
    ) public pure {
        require(
            condition,
            string(
                abi.encodePacked(a, toString(b), c, toString(d), e, toString(f))
            )
        );
    }

    function warn(
        bool condition,
        string calldata a,
        uint b,
        string calldata c,
        uint d
    ) public pure {
        require(
            condition,
            string(abi.encodePacked(a, toString(b), c, toString(d)))
        );
    }

    function warn(bool condition, string calldata a, uint b) public pure {
        require(condition, string(abi.encodePacked(a, toString(b))));
    }

    function decode(
        bytes memory _returnData
    ) internal pure returns (string memory) {
        assembly {
            _returnData := add(_returnData, 0x04)
        }
        return abi.decode(_returnData, (string));
    }
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

library Trader {
    function estimate(
        address tokenIn,
        address tokenOut,
        uint amountOut,
        uint amountInMax
    ) public returns (uint) {
        bool success = false;
        bytes memory res;
        // (success, res) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
        //     abi.encodeWithSelector(
        //         0xe719283e,
        //         amountOut,
        //         tokenIn,
        //         tokenOut,
        //         amountInMax
        //     )
        // );
        // if (!success) {
        //     (success, res) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
        //         abi.encodeWithSelector(
        //             0xea270cba,
        //             amountOut,
        //             tokenIn,
        //             tokenOut,
        //             amountInMax
        //         )
        //     );
        //     if (!success) {
        //         (success, res) = 0x2A78c465F72387F175314DA5796D086683dEe3FF
        //             .call(
        //                 abi.encodeWithSelector(
        //                     0xe719283e,
        //                     amountOut,
        //                     tokenIn,
        //                     tokenOut,
        //                     amountInMax
        //                 )
        //             );
        //         if (!success) {
        //             (success, res) = 0x2A78c465F72387F175314DA5796D086683dEe3FF
        //                 .call(
        //                     abi.encodeWithSelector(
        //                         0xea270cba,
        //                         amountOut,
        //                         tokenIn,
        //                         tokenOut,
        //                         amountInMax
        //                     )
        //                 );
        //             if (!success) {
        //                 (
        //                     success,
        //                     res
        //                 ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0.call(
        //                     abi.encodeWithSelector(
        //                         0xe719283e,
        //                         amountOut,
        //                         tokenIn,
        //                         tokenOut,
        //                         amountInMax
        //                     )
        //                 );
        //                 if (!success) {
        //                     (
        //                         success,
        //                         res
        //                     ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0.call(
        //                         abi.encodeWithSelector(
        //                             0xea270cba,
        //                             amountOut,
        //                             tokenIn,
        //                             tokenOut,
        //                             amountInMax
        //                         )
        //                     );
        // if (!success)
        (success, res) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176.call(
            abi.encodeWithSelector(
                0xe719283e,
                amountOut,
                tokenIn,
                tokenOut,
                amountInMax
            )
        );
        if (!success)
            (success, res) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176.call(
                abi.encodeWithSelector(
                    0xea270cba,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        return abi.decode(res, (uint));
    }

    function swap(address tokenIn, address tokenOut) public {
        bool success;
        uint amount = IERC20(tokenIn).balanceOf(address(this));
        // IERC20(tokenIn).approve(
        //     0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F,
        //     type(uint).max
        // );
        // (success, ) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call( // -81.58%
        //     abi.encodeWithSelector(
        //         0x5a5b7990,
        //         amount,
        //         tokenIn,
        //         tokenOut,
        //         0,
        //         address(this),
        //         true
        //     )
        // );
        // if (!success)
        //     (success, ) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
        //         abi.encodeWithSelector(
        //             0x976c89bb,
        //             amount,
        //             tokenIn,
        //             tokenOut,
        //             0,
        //             address(this),
        //             true
        //         )
        //     );
        // if (!success) {
        //     IERC20(tokenIn).approve(
        //         0x2A78c465F72387F175314DA5796D086683dEe3FF,
        //         type(uint).max
        //     );
        //     (success, ) = 0x2A78c465F72387F175314DA5796D086683dEe3FF.call(
        //         abi.encodeWithSelector(
        //             0x5a5b7990,
        //             amount,
        //             tokenIn,
        //             tokenOut,
        //             0,
        //             address(this),
        //             true
        //         )
        //     );
        //     if (!success) {
        //         (success, ) = 0x2A78c465F72387F175314DA5796D086683dEe3FF.call(
        //             abi.encodeWithSelector(
        //                 0x976c89bb,
        //                 amount,
        //                 tokenIn,
        //                 tokenOut,
        //                 0,
        //                 address(this),
        //                 true
        //             )
        //         );
        //         if (!success) {
        //             IERC20(tokenIn).approve(
        //                 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0,
        //                 type(uint).max
        //             );
        //             (success, ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0
        //                 .call(
        //                     abi.encodeWithSelector(
        //                         0x5a5b7990,
        //                         amount,
        //                         tokenIn,
        //                         tokenOut,
        //                         0,
        //                         address(this),
        //                         true
        //                     )
        //                 );
        //             if (!success) {
        //                 (success, ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0
        //                     .call(
        //                         abi.encodeWithSelector(
        //                             0x976c89bb,
        //                             amount,
        //                             tokenIn,
        //                             tokenOut,
        //                             0,
        //                             address(this),
        //                             true
        //                         )
        //                     );
        //                 if (!success) {
        IERC20(tokenIn).approve(
            0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176,
            type(uint).max
        );
        (success, ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176.call(
            abi.encodeWithSelector(
                0x5a5b7990,
                amount,
                tokenIn,
                tokenOut,
                0,
                address(this),
                true
            )
        );
        if (!success)
            (success, ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176.call(
                abi.encodeWithSelector(
                    0x976c89bb,
                    amount,
                    tokenIn,
                    tokenOut,
                    0,
                    address(this),
                    true
                )
            );
    }
    // }
    //             }
    //         }
    //     }
    // }
}

interface IPoolAddressesProvider {
    function getPool() external view returns (address);
}

interface IPool {
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

library KyberSwap {
    struct SwapDescription {
        address srcToken;
        address dstToken;
        address[] srcReceivers;
        uint256[] srcAmounts;
        address dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 flags;
        bytes permit;
    }
    struct KyberStruct {
        address caller;
        SwapDescription swapDes;
        bytes executorData;
        bytes clientData;
    }

    function aloha(KyberStruct calldata data) external returns (bool s) {
        (s, ) = 0x617Dee16B86534a5d792A4d7A62FB491B544111E.call(
            abi.encodeWithSignature(
                "swap(address,(address,address,address[],uint256[],address,uint256,uint256,uint256,bytes),bytes,bytes)",
                data.caller,
                data.swapDes,
                data.executorData,
                data.clientData
            )
        );
        if (!s) {
            (s, ) = 0x617Dee16B86534a5d792A4d7A62FB491B544111E.call(
                abi.encodeWithSignature(
                    "swapExecutor1Inch(address,(address,address,address[],uint256[],address,uint256,uint256,uint256,bytes),bytes,bytes)",
                    data.caller,
                    data.swapDes,
                    data.executorData,
                    data.clientData
                )
            );
            if (!s) {
                (s, ) = 0x617Dee16B86534a5d792A4d7A62FB491B544111E.call(
                    abi.encodeWithSignature(
                        "swapRouter1Inch(address,(address,address,address[],uint256[],address,uint256,uint256,uint256,bytes),bytes,bytes)",
                        data.caller,
                        data.executorData,
                        data.swapDes,
                        data.clientData
                    )
                );
                if (!s) {
                    (s, ) = 0x617Dee16B86534a5d792A4d7A62FB491B544111E.call(
                        abi.encodeWithSignature(
                            "swapSimpleMode(address,(address,address,address[],uint256[],address,uint256,uint256,uint256,bytes),bytes,bytes)",
                            data.caller,
                            data.swapDes,
                            data.executorData,
                            data.clientData
                        )
                    );
                }
            }
        }
        require(s, "KF");
    }
}

interface UniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        );
}

interface UniswapV2Router02 {
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut);
}

library Gas {
    uint public constant inate = 147700;
    uint public constant camila = 23260;

    function estimate(
        uint price,
        uint gasUsed
    ) public view returns (uint cost) {
        uint fee = price * ((gasUsed - gasleft()) - camila);
        (uint WFTM_RESERVES, uint DAI_RESERVES, ) = UniswapV2Pair(
            0xe120ffBDA0d14f3Bb6d6053E90E63c572A66a428
        ).getReserves();
        cost = UniswapV2Router02(0xF491e7B69E4244ad4002BC14e878a34207E38c29)
            .getAmountOut(fee, WFTM_RESERVES, DAI_RESERVES);
    }

    function measure(uint gasUsed) public view {
        revert(
            string(
                abi.encodePacked(
                    "Gas Usage: ",
                    console.toString((gasUsed - gasleft()) - inate)
                )
            )
        );
    }

    function guage(
        uint limit,
        string memory tag,
        uint gasUsed
    ) public view returns (uint gas) {
        gas = (gasUsed - gasleft()) - inate;
        require(
            gasUsed < limit,
            string(
                abi.encodePacked(
                    "@[ ",
                    tag,
                    " ] / Usage: ",
                    console.toString(gasUsed)
                )
            )
        );
    }
}

contract Main {
    address internal immutable pool =
        IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb)
            .getPool();

    function delta(uint a, uint b) internal pure returns (uint y) {
        int d = ((int(b) - int(a)) * 10000) / int(a == 0 ? 1 : a);
        y = (a * b) == 0 ? 818 : (b > a) ? uint(d) : uint(d * -1);
    }

    function executeOperation(
        address asset,
        uint amount,
        uint premium,
        address initiator,
        bytes calldata params
    ) external returns (bool approved) {
        (KyberSwap.KyberStruct memory swap, address fiat) = abi.decode(
            params,
            (KyberSwap.KyberStruct, address)
        ); //6785
        IERC20(swap.swapDes.srcToken).approve(
            0x617Dee16B86534a5d792A4d7A62FB491B544111E,
            type(uint).max
        );

        if (fiat != swap.swapDes.srcToken)
            Trader.swap(fiat, swap.swapDes.srcToken);
        // uint gasUsed = gasleft();
        KyberSwap.aloha(swap);
        // KyberSwap.aloha(swap);
        // KyberSwap.aloha(swap);
        // KyberSwap.aloha(swap);
        // KyberSwap.aloha(swap);
        // KyberSwap.aloha(swap);
        // Gas.measure(gasUsed);
        if (fiat != swap.swapDes.dstToken)
            Trader.swap(swap.swapDes.dstToken, fiat);
        approved = IERC20(asset).approve(pool, type(uint).max);
    }

    function send(
        KyberSwap.KyberStruct calldata swap,
        uint256 branch,
        uint256 price,
        address payment
    ) public returns (uint256 balance) {
        uint gasUsed = gasleft();
        if (branch == 0) {
            IPool(pool).flashLoanSimple(
                address(this),
                swap.swapDes.srcToken,
                swap.swapDes.amount,
                abi.encode(swap, swap.swapDes.srcToken),
                0
            );
            if (
                (payment != swap.swapDes.srcToken) &&
                (IERC20(swap.swapDes.srcToken).balanceOf(address(this)) > 0)
            ) {
                Trader.swap(swap.swapDes.srcToken, payment);
            }
        } else if (branch == 1) {
            IPool(pool).flashLoanSimple(
                address(this),
                swap.swapDes.dstToken,
                ((Trader.estimate(
                    swap.swapDes.dstToken,
                    swap.swapDes.srcToken,
                    swap.swapDes.amount,
                    type(uint).max
                ) * 105) / 100),
                abi.encode(swap, swap.swapDes.dstToken),
                0
            );
            if (
                (payment != swap.swapDes.dstToken) &&
                (IERC20(swap.swapDes.dstToken).balanceOf(address(this)) > 0)
            ) {
                Trader.swap(swap.swapDes.dstToken, payment);
            }
        } else {
            IPool(pool).flashLoanSimple(
                address(this),
                payment,
                ((Trader.estimate(
                    payment,
                    swap.swapDes.srcToken,
                    swap.swapDes.amount,
                    type(uint).max
                ) * 105) / 100),
                abi.encode(swap, payment),
                0
            );
        }
        // revert("Artemis");
        // balance ;
        gasUsed -= gasleft();
        console.warn(
            false,
            "Minerva' Balance: ",
            IERC20(payment).balanceOf(address(this)),
            " | Gas: ",
            gasUsed
        );
        // IERC20(payment).transfer(
        //     0x1E053796D7931E624Bd74c2cB4E4990bDcD8434A,
        //     balance
        // );
    }
}
