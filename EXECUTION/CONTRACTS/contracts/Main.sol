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
pragma solidity >=0.5.0 <0.9.0;

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }
}

library console {
    function toString(uint256 value) internal pure returns (string memory) {
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

    function track(address base, address quote)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(hexify(base), " => ", hexify(quote)));
    }

    function concat(string calldata a, string calldata b)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    function concat(string calldata a, uint b)
        public
        pure
        returns (string memory)
    {
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
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

interface IUniswapV2Pair {
    function factory() external view returns (address);

    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );

    function swap(
        uint amount0Out,
        uint amount1Out,
        address to,
        bytes calldata data
    ) external;
}

interface IUniswap {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);
}

library BlackMagicLibraryProtofi {
    using SafeMath for uint256;
    bytes32 constant pairCodeHash =
        hex"5e47480f25da6d84d0437a474359e885cdb7dc9eb9f8fd61f3cb41d85a64a420";
    uint constant fee = 15;

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountOut) {
        require(amountIn > 0, "BlackMagicLibrary: INSUFFICIENT_INPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "BlackMagicLibrary: INSUFFICIENT_LIQUIDITY"
        );
        amountOut =
            (((1000000 - (fee * 100)) * amountIn * reserveOut) /
                ((1000 * reserveIn) + ((10000 - fee) * amountIn))) /
            1000;
    }

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountIn) {
        require(amountOut > 0, "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(998);
        amountIn = (numerator / denominator).add(1);
    }

    function sortTokens(address tokenA, address tokenB)
        internal
        pure
        returns (address token0, address token1)
    {
        require(tokenA != tokenB, "BlackMagicLibrary: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "BlackMagicLibrary: ZERO_ADDRESS");
    }

    function pairFor(
        address factory,
        address tokenA,
        address tokenB
    ) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            hex"ff",
                            factory,
                            keccak256(abi.encodePacked(token0, token1)),
                            pairCodeHash // init code hash
                        )
                    )
                )
            )
        );
    }

    function getReserves(
        address factory,
        address tokenA,
        address tokenB
    ) internal view returns (uint reserveA, uint reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(
            pairFor(factory, tokenA, tokenB)
        ).getReserves();
        (reserveA, reserveB) = tokenA == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    function getAmountsOut(
        address factory,
        uint amountIn,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "BlackMagicLibrary: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i],
                path[i + 1]
            );
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    function getAmountsIn(
        address factory,
        uint amountOut,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "UniswapV2Library: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i - 1],
                path[i]
            );
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    }

    function _swap(
        uint[] memory amounts,
        address[] memory path,
        address _to,
        address factory
    ) internal {
        // address factory = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).factory();
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = sortTokens(input, output);
            uint amountOut = amounts[i + 1];
            (uint amount0Out, uint amount1Out) = input == token0
                ? (uint(0), amountOut)
                : (amountOut, uint(0));
            address to = i < path.length - 2
                ? pairFor(factory, output, path[i + 2])
                : _to;
            IUniswapV2Pair(pairFor(factory, input, output)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
        }
    }

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
        _;
    }

    function estimateInput(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address factory
    ) external view returns (uint amount) {
        uint[] memory amounts = getAmountsIn(factory, amountOut, path);
        amount = amounts[0];
        require(
            amount <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
    }

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsIn(factory, amountOut, path);
        require(
            amounts[0] <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsOut(factory, amountIn, path);
        require(
            amounts[amounts.length - 1] >= amountOutMin,
            "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }
}

library BlackMagicLibrarySpookyswap {
    using SafeMath for uint256;
    bytes32 constant pairCodeHash =
        hex"cdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2";
    uint constant fee = 20;

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountOut) {
        require(amountIn > 0, "BlackMagicLibrary: INSUFFICIENT_INPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "BlackMagicLibrary: INSUFFICIENT_LIQUIDITY"
        );
        amountOut =
            (((1000000 - (fee * 100)) * amountIn * reserveOut) /
                ((1000 * reserveIn) + ((10000 - fee) * amountIn))) /
            1000;
    }

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountIn) {
        require(amountOut > 0, "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(998);
        amountIn = (numerator / denominator).add(1);
    }

    function sortTokens(address tokenA, address tokenB)
        internal
        pure
        returns (address token0, address token1)
    {
        require(tokenA != tokenB, "BlackMagicLibrary: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "BlackMagicLibrary: ZERO_ADDRESS");
    }

    function pairFor(
        address factory,
        address tokenA,
        address tokenB
    ) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            hex"ff",
                            factory,
                            keccak256(abi.encodePacked(token0, token1)),
                            pairCodeHash // init code hash
                        )
                    )
                )
            )
        );
    }

    function getReserves(
        address factory,
        address tokenA,
        address tokenB
    ) internal view returns (uint reserveA, uint reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(
            pairFor(factory, tokenA, tokenB)
        ).getReserves();
        (reserveA, reserveB) = tokenA == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    function getAmountsOut(
        address factory,
        uint amountIn,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "BlackMagicLibrary: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i],
                path[i + 1]
            );
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    function getAmountsIn(
        address factory,
        uint amountOut,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "UniswapV2Library: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i - 1],
                path[i]
            );
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    }

    function _swap(
        uint[] memory amounts,
        address[] memory path,
        address _to,
        address factory
    ) internal {
        // address factory = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).factory();
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = sortTokens(input, output);
            uint amountOut = amounts[i + 1];
            (uint amount0Out, uint amount1Out) = input == token0
                ? (uint(0), amountOut)
                : (amountOut, uint(0));
            address to = i < path.length - 2
                ? pairFor(factory, output, path[i + 2])
                : _to;
            IUniswapV2Pair(pairFor(factory, input, output)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
        }
    }

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
        _;
    }

    function estimateInput(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address factory
    ) external view returns (uint amount) {
        uint[] memory amounts = getAmountsIn(factory, amountOut, path);
        amount = amounts[0];
        require(
            amount <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
    }

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsIn(factory, amountOut, path);
        require(
            amounts[0] <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsOut(factory, amountIn, path);
        require(
            amounts[amounts.length - 1] >= amountOutMin,
            "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }
}

library BlackMagicLibrarySpiritswap {
    using SafeMath for uint256;
    bytes32 constant pairCodeHash =
        hex"e242e798f6cee26a9cb0bbf24653bf066e5356ffeac160907fe2cc108e238617";
    uint constant fee = 30;

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountOut) {
        require(amountIn > 0, "BlackMagicLibrary: INSUFFICIENT_INPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "BlackMagicLibrary: INSUFFICIENT_LIQUIDITY"
        );
        amountOut =
            (((1000000 - (fee * 100)) * amountIn * reserveOut) /
                ((1000 * reserveIn) + ((10000 - fee) * amountIn))) /
            1000;
    }

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountIn) {
        require(amountOut > 0, "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(998);
        amountIn = (numerator / denominator).add(1);
    }

    function sortTokens(address tokenA, address tokenB)
        internal
        pure
        returns (address token0, address token1)
    {
        require(tokenA != tokenB, "BlackMagicLibrary: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "BlackMagicLibrary: ZERO_ADDRESS");
    }

    function pairFor(
        address factory,
        address tokenA,
        address tokenB
    ) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            hex"ff",
                            factory,
                            keccak256(abi.encodePacked(token0, token1)),
                            pairCodeHash // init code hash
                        )
                    )
                )
            )
        );
    }

    function getReserves(
        address factory,
        address tokenA,
        address tokenB
    ) internal view returns (uint reserveA, uint reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(
            pairFor(factory, tokenA, tokenB)
        ).getReserves();
        (reserveA, reserveB) = tokenA == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    function getAmountsOut(
        address factory,
        uint amountIn,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "BlackMagicLibrary: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i],
                path[i + 1]
            );
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    function getAmountsIn(
        address factory,
        uint amountOut,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "UniswapV2Library: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i - 1],
                path[i]
            );
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    }

    function _swap(
        uint[] memory amounts,
        address[] memory path,
        address _to,
        address factory
    ) internal {
        // address factory = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).factory();
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = sortTokens(input, output);
            uint amountOut = amounts[i + 1];
            (uint amount0Out, uint amount1Out) = input == token0
                ? (uint(0), amountOut)
                : (amountOut, uint(0));
            address to = i < path.length - 2
                ? pairFor(factory, output, path[i + 2])
                : _to;
            IUniswapV2Pair(pairFor(factory, input, output)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
        }
    }

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
        _;
    }

    function estimateInput(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address factory
    ) external view returns (uint amount) {
        uint[] memory amounts = getAmountsIn(factory, amountOut, path);
        amount = amounts[0];
        require(
            amount <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
    }

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsIn(factory, amountOut, path);
        require(
            amounts[0] <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsOut(factory, amountIn, path);
        require(
            amounts[amounts.length - 1] >= amountOutMin,
            "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }
}

library BlackMagicLibrarySushiswap {
    using SafeMath for uint256;
    bytes32 constant pairCodeHash =
        hex"e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    uint constant fee = 30;

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountOut) {
        require(amountIn > 0, "BlackMagicLibrary: INSUFFICIENT_INPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "BlackMagicLibrary: INSUFFICIENT_LIQUIDITY"
        );
        amountOut =
            (((1000000 - (fee * 100)) * amountIn * reserveOut) /
                ((1000 * reserveIn) + ((10000 - fee) * amountIn))) /
            1000;
    }

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountIn) {
        require(amountOut > 0, "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(998);
        amountIn = (numerator / denominator).add(1);
    }

    function sortTokens(address tokenA, address tokenB)
        internal
        pure
        returns (address token0, address token1)
    {
        require(tokenA != tokenB, "BlackMagicLibrary: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "BlackMagicLibrary: ZERO_ADDRESS");
    }

    function pairFor(
        address factory,
        address tokenA,
        address tokenB
    ) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            hex"ff",
                            factory,
                            keccak256(abi.encodePacked(token0, token1)),
                            pairCodeHash // init code hash
                        )
                    )
                )
            )
        );
    }

    function getReserves(
        address factory,
        address tokenA,
        address tokenB
    ) internal view returns (uint reserveA, uint reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(
            pairFor(factory, tokenA, tokenB)
        ).getReserves();
        (reserveA, reserveB) = tokenA == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    function getAmountsOut(
        address factory,
        uint amountIn,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "BlackMagicLibrary: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i],
                path[i + 1]
            );
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    function getAmountsIn(
        address factory,
        uint amountOut,
        address[] memory path
    ) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, "UniswapV2Library: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves(
                factory,
                path[i - 1],
                path[i]
            );
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    }

    function _swap(
        uint[] memory amounts,
        address[] memory path,
        address _to,
        address factory
    ) internal {
        // address factory = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).factory();
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = sortTokens(input, output);
            uint amountOut = amounts[i + 1];
            (uint amount0Out, uint amount1Out) = input == token0
                ? (uint(0), amountOut)
                : (amountOut, uint(0));
            address to = i < path.length - 2
                ? pairFor(factory, output, path[i + 2])
                : _to;
            IUniswapV2Pair(pairFor(factory, input, output)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
        }
    }

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
        _;
    }

    function estimateInput(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address factory
    ) external view returns (uint amount) {
        uint[] memory amounts = getAmountsIn(factory, amountOut, path);
        amount = amounts[0];
        require(
            amount <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
    }

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsIn(factory, amountOut, path);
        require(
            amounts[0] <= amountInMax,
            "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline,
        address factory
    ) external ensure(deadline) returns (uint[] memory amounts) {
        amounts = getAmountsOut(factory, amountIn, path);
        require(
            amounts[amounts.length - 1] >= amountOutMin,
            "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        address token = path[0];
        IERC20(token).transfer(pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to, factory);
    }
}

contract Protofi {
    IUniswap constant uniswap = IUniswap(router);
    address public immutable weth = uniswap.WETH();
    address public constant factory =
        0x39720E5Fe53BEEeb9De4759cb91d8E7d42c17b76;
    address public constant router = 0xF491e7B69E4244ad4002BC14e878a34207E38c29; //0x31F63A33141fFee63D4B26755430a390ACdD8a4d | swap after one year. Factory might need updating as well.
    address public subbroker = address(0);
    string public ID = "PROTOFI";

    function getInput(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        amount = BlackMagicLibraryProtofi.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function getInputLong(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        amount = BlackMagicLibraryProtofi.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function swapTokensForTokens(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Short]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Short]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        if (forward) {
            BlackMagicLibraryProtofi.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibraryProtofi.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
        id = ID;
    }

    function swapTokensForTokensLong(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Long]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Long]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        if (forward) {
            BlackMagicLibraryProtofi.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibraryProtofi.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
        id = ID;
    }

    function setSubbroker(address _broker) public {
        subbroker = _broker;
    }
}

contract Spookyswap {
    IUniswap constant uniswap = IUniswap(router);
    address public immutable weth = uniswap.WETH();
    address public constant factory =
        0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3;
    address public constant router = 0xF491e7B69E4244ad4002BC14e878a34207E38c29; //0x31F63A33141fFee63D4B26755430a390ACdD8a4d | swap after one year. Factory might need updating as well.
    address public subbroker =
        address(0x1faeC97c526aD719CA8c59D8D7A7d8C81e5fBdCC);
    string public ID = "SPOOKYSWAP";

    function getInput(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        amount = BlackMagicLibrarySpookyswap.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function getInputLong(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        amount = BlackMagicLibrarySpookyswap.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function swapTokensForTokens(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Short]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Short]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        id = ID;
        if (forward) {
            BlackMagicLibrarySpookyswap.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibrarySpookyswap.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
    }

    function swapTokensForTokensLong(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Long]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Long]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        id = ID;
        if (forward) {
            BlackMagicLibrarySpookyswap.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibrarySpookyswap.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
    }
}

contract Spiritswap {
    IUniswap constant uniswap = IUniswap(router);
    address public immutable weth = uniswap.WETH();
    address public constant factory =
        0xEF45d134b73241eDa7703fa787148D9C9F4950b0;
    address public constant router = 0xF491e7B69E4244ad4002BC14e878a34207E38c29; //0x31F63A33141fFee63D4B26755430a390ACdD8a4d | swap after one year. Factory might need updating as well.
    address public subbroker = address(0);
    string public constant ID = "SPIRITSWAP";

    function getInput(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        amount = BlackMagicLibrarySpiritswap.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function getInputLong(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        amount = BlackMagicLibrarySpiritswap.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function swapTokensForTokens(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Short]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Short]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        id = ID;
        if (forward) {
            BlackMagicLibrarySpiritswap.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibrarySpiritswap.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
    }

    function swapTokensForTokensLong(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Long]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Long]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        id = ID;
        if (forward) {
            BlackMagicLibrarySpiritswap.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibrarySpiritswap.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint amount,
        address recipient,
        bool long
    ) public returns (bool success, string memory id) {
        bytes memory res;
        uint balance = IERC20(tokenIn).balanceOf(address(this));
        amount = balance >= amount ? amount : balance;
        IERC20(tokenIn).approve(subbroker, type(uint).max);
        (success, res) = subbroker.call(
            abi.encodeWithSelector(
                (
                    long
                        ? Spookyswap.swapTokensForTokensLong.selector
                        : Spookyswap.swapTokensForTokens.selector
                ),
                amount,
                tokenIn,
                tokenOut,
                0,
                recipient,
                true
            )
        );
        if (success) id = abi.decode(res, (string));
        balance = IERC20(tokenOut).balanceOf(recipient);
        success = balance > 0;
    }

    function setSubbroker(address _broker) public {
        subbroker = _broker;
    }
}

contract Sushiswap {
    IUniswap constant uniswap = IUniswap(router);
    address public immutable weth = uniswap.WETH();
    address public constant factory =
        0xc35DADB65012eC5796536bD9864eD8773aBc74C4;
    address public constant router = 0xF491e7B69E4244ad4002BC14e878a34207E38c29; //0x31F63A33141fFee63D4B26755430a390ACdD8a4d | swap after one year. Factory might need updating as well.
    address public subbroker = address(0);
    string public constant ID = "SUSHISWAP";

    function getInput(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        amount = BlackMagicLibrarySushiswap.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function getInputLong(
        uint amountOut,
        address tokenIn,
        address tokenOut,
        uint amountInMax
    ) public view returns (uint amount) {
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        amount = BlackMagicLibrarySushiswap.estimateInput(
            amountOut,
            amountInMax,
            path,
            factory
        );
    }

    function swapTokensForTokens(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Short]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Short]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        id = ID;
        if (forward) {
            BlackMagicLibrarySushiswap.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibrarySushiswap.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
    }

    function swapTokensForTokensLong(
        uint amountIn,
        address tokenIn,
        address tokenOut,
        uint amountOutMin,
        address recipient,
        bool forward
    ) public returns (string memory id) {
        uint balance = IERC20(tokenIn).balanceOf(recipient);
        IERC20(tokenIn).transferFrom(recipient, address(this), balance);
        balance = IERC20(tokenIn).balanceOf(address(this));
        amountIn = balance >= amountIn ? amountIn : balance;
        require(
            amountIn > 0,
            "Swapper [Long]: Insufficient balance on contract to commit the swap."
        );
        IERC20(tokenIn).approve(address(uniswap), type(uint).max);
        require(
            IERC20(tokenIn).allowance(address(this), address(uniswap)) >=
                amountIn,
            "Swapper [Long]: Insufficient allowance to commit the swap."
        );
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = weth;
        path[2] = tokenOut;
        id = ID;
        if (forward) {
            BlackMagicLibrarySushiswap.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        } else {
            BlackMagicLibrarySushiswap.swapTokensForExactTokens(
                amountIn,
                amountOutMin,
                path,
                recipient,
                type(uint).max,
                factory
            );
        }
    }

    function setSubbroker(address _broker) public {
        subbroker = _broker;
    }
}

abstract contract Swapper {
    address public stablecoin = 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75;
    Protofi proto = Protofi(0x305F9CA91a0c3a3ebAC190a00B91cBddC6B3624F);
    Spookyswap spooky = Spookyswap(0x2A78c465F72387F175314DA5796D086683dEe3FF);
    Spiritswap spirit = Spiritswap(0x02c1a5A6f9cFF20FC1475A7d9E46EE877Bf8b1a0);
    Sushiswap sushi = Sushiswap(0xad0488e529091A1c5F3DA7bFFdB94A72edbE6176);
    address public origin = address(this);
    uint public estimation;
    string public ID = "NONESET";

    function estimateInput(
        address tokenIn,
        address tokenOut,
        uint amountOut,
        uint amountInMax
    ) public returns (uint amount) {
        bool success = false;
        bytes memory res;
        (success, res) = address(proto).call(
            abi.encodeWithSelector(
                proto.getInput.selector,
                amountOut,
                tokenIn,
                tokenOut,
                amountInMax
            )
        );
        if (!success)
            (success, res) = address(proto).call(
                abi.encodeWithSelector(
                    proto.getInputLong.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        if (!success)
            (success, res) = address(spooky).call(
                abi.encodeWithSelector(
                    spooky.getInput.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        if (!success)
            (success, res) = address(spooky).call(
                abi.encodeWithSelector(
                    spooky.getInputLong.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        if (!success)
            (success, res) = address(spirit).call(
                abi.encodeWithSelector(
                    spirit.getInput.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        if (!success)
            (success, res) = address(spirit).call(
                abi.encodeWithSelector(
                    spirit.getInputLong.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        if (!success)
            (success, res) = address(sushi).call(
                abi.encodeWithSelector(
                    sushi.getInput.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );
        if (!success)
            (success, res) = address(sushi).call(
                abi.encodeWithSelector(
                    sushi.getInputLong.selector,
                    amountOut,
                    tokenIn,
                    tokenOut,
                    amountInMax
                )
            );

        if (!success) {
            string memory error = console.track(tokenIn, tokenOut);
            error = console.concat(error, " | ");
            error = console.concat(error, "Amount: ");
            error = console.concat(error, amountOut);
            revert(error);
        }
        amount = abi.decode(res, (uint));
        estimation = amount;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint amount
    ) public {
        bytes memory res;
        bool success;
        uint balance = IERC20(tokenIn).balanceOf(address(this));
        amount = balance >= amount ? amount : balance;
        IERC20(tokenIn).approve(address(proto), type(uint).max);
        (success, res) = address(proto).call( // -81.58%
            abi.encodeWithSelector(
                proto.swapTokensForTokens.selector,
                amount,
                tokenIn,
                tokenOut,
                0,
                address(this),
                true
            )
        );
        if (!success)
            (success, res) = address(proto).call(
                abi.encodeWithSelector(
                    proto.swapTokensForTokensLong.selector,
                    amount,
                    tokenIn,
                    tokenOut,
                    0,
                    address(this),
                    true
                )
            );
        if (!success) {
            IERC20(tokenIn).approve(address(spooky), type(uint).max);
            (success, res) = address(spooky).call(
                abi.encodeWithSelector(
                    spooky.swapTokensForTokens.selector,
                    amount,
                    tokenIn,
                    tokenOut,
                    0,
                    address(this),
                    true
                )
            );
            if (!success)
                (success, res) = address(spooky).call(
                    abi.encodeWithSelector(
                        spooky.swapTokensForTokensLong.selector,
                        amount,
                        tokenIn,
                        tokenOut,
                        0,
                        address(this),
                        true
                    )
                );
            if (!success) {
                IERC20(tokenIn).approve(address(spirit), type(uint).max);
                (success, res) = address(spirit).call(
                    abi.encodeWithSelector(
                        spirit.swapTokensForTokens.selector,
                        amount,
                        tokenIn,
                        tokenOut,
                        0,
                        address(this),
                        true
                    )
                );
                if (!success)
                    (success, res) = address(spirit).call(
                        abi.encodeWithSelector(
                            spirit.swapTokensForTokensLong.selector,
                            amount,
                            tokenIn,
                            tokenOut,
                            0,
                            address(this),
                            true
                        )
                    );
                if (!success) {
                    IERC20(tokenIn).approve(address(sushi), type(uint).max);
                    (success, res) = address(sushi).call(
                        abi.encodeWithSelector(
                            sushi.swapTokensForTokens.selector,
                            amount,
                            tokenIn,
                            tokenOut,
                            0,
                            address(this),
                            true
                        )
                    );
                    if (!success)
                        (success, res) = address(sushi).call(
                            abi.encodeWithSelector(
                                sushi.swapTokensForTokensLong.selector,
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
        balance = IERC20(tokenOut).balanceOf(address(this));
        require(balance > 0, "Trader: Internal Error.");
        IERC20(tokenOut).transfer(origin, balance);
        ID = abi.decode(res, (string));
    }

    function bridge(
        address tokenIn,
        address tokenOut,
        uint amount
    ) internal {
        uint balance = IERC20(tokenIn).balanceOf(address(this));
        if (amount >= balance && balance > 0) swap(tokenIn, tokenOut, amount);
    }

    function bridge(address tokenIn, address tokenOut) internal {
        uint balance = IERC20(tokenIn).balanceOf(address(this));
        bridge(tokenIn, tokenOut, balance);
    }

    function swapIn(address tokenOut) public {
        bridge(stablecoin, tokenOut);
    }

    function swapOut(address tokenIn) public {
        bridge(tokenIn, stablecoin);
    }

    function swapOut(address tokenIn, uint amount) public {
        bridge(tokenIn, stablecoin, amount);
    }

    function getID() public view returns (string memory id) {
        id = ID;
    }
}

contract Trader is Swapper {
    function originate(address _origin) public {
        Swapper.origin = _origin;
    }

    function getOrigin() public view returns (address origin) {
        origin = Swapper.origin;
    }

    function estimate(
        address tokenIn,
        address tokenOut,
        uint amountOut,
        uint amountInMax
    ) public returns (uint amount) {
        amount = Swapper.estimateInput(
            tokenIn,
            tokenOut,
            amountOut,
            amountInMax
        );
    }

    function crypto(address tokenOut) public {
        Swapper.swapIn(tokenOut);
    }

    function connect(
        address tokenIn,
        address tokenOut,
        uint entryAmount,
        uint exitAmount
    ) public returns (uint path) {
        Swapper.bridge(tokenIn, tokenOut, entryAmount);
        uint entryBalance;
        uint exitBalance = IERC20(tokenOut).balanceOf(address(this));
        uint excess;
        path = 0;
        if (
            exitBalance == exitAmount
        ) // Sceneraio 1: The bridge transported just enough tokens for the next swap.
        {
            path = 1;
            entryBalance = IERC20(tokenIn).balanceOf(address(this));

            if (
                entryBalance > 0
            ) // It will then check if any residual entry tokens are left, then convert them to fiat. Collecting the crumbs.
            {
                path = 2;
                fiat(tokenIn);
            }
        } else if (
            exitBalance > exitAmount
        ) // Sceneraio 2: The bridge transported more than necessary for the next swap.
        {
            path = 3;
            entryBalance = IERC20(tokenIn).balanceOf(address(this));

            if (
                entryBalance > 0
            ) // Once again we will collect any residual crumbs.
            {
                path = 4;
                // revert("Path: 4");
                fiat(tokenIn); // Check why this and only this fails
            }
            excess = exitBalance - exitAmount;
            if (exitBalance > 0 && exitBalance > exitAmount) {
                path = 5;
                fiat(tokenOut, excess); // But additionally, we will convert the excess into fiat.
            }
        } else if (
            exitBalance < exitAmount
        ) // Scenerio 3: Shit went wayside, and the bridge failed to supply enough for the next swap.
        {
            path = 6;
            entryBalance = IERC20(tokenIn).balanceOf(address(this));

            if (
                entryBalance > 0
            ) // Once again we will collect any residual crumbs. However we'll try to make up for the remaining amount with these crumbs.
            {
                path = 7;
                Swapper.bridge(tokenIn, tokenOut);
                exitBalance = IERC20(tokenOut).balanceOf(address(this));
                if (
                    exitBalance > 0 && exitBalance > exitAmount
                ) // Finally, if the rare scenerio where the breaadcumbs produced an excess of exit tokens, we'll process them into fiat.
                {
                    path = 8;
                    excess = exitBalance - exitAmount; //By calculating the excess, we ensure that there is enough left for the final swap.
                    fiat(tokenOut, excess);
                }
            }
            // else revert("Trader[S3B1]: Bridge collapsed with no support from breadcrumbs.");
        }
    }

    function fiat(address tokenIn) public {
        Swapper.swapOut(tokenIn);
    }

    function fiat(address tokenIn, uint amount) public {
        Swapper.swapOut(tokenIn, amount);
    }

    function liquidate() public {
        liquidate(msg.sender);
    }

    function liquidate(address reciever) public {
        IERC20 TOKEN = IERC20(getFiat());
        uint BALANCE = TOKEN.balanceOf(address(this));
        TOKEN.transfer(reciever, BALANCE);
    }

    function getFiat() public view returns (address _fiat) {
        _fiat = Swapper.stablecoin;
    }

    function setFiat(address _fiat) public {
        Swapper.stablecoin = _fiat;
    }

    function who() public view returns (string memory id) {
        id = Swapper.getID();
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

interface MetaAggregationRouter {
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
}

interface IKyber {
    function swap(
        address caller,
        MetaAggregationRouter.SwapDescription memory desc,
        bytes memory executorData,
        bytes memory clientData
    ) external payable returns (uint256 returnAmount, uint256 gasUsed);
}

library KyberSwap {
    address public constant Kyber = 0x617Dee16B86534a5d792A4d7A62FB491B544111E;
    uint256 private constant _SIMPLE_SWAP = 0x20;
    struct KyberStruct {
        address caller;
        MetaAggregationRouter.SwapDescription swapDes;
        bytes executorData;
        bytes clientData;
    }
    struct SimpleSwapData {
        address[] firstPools;
        uint256[] firstSwapAmounts;
        bytes[] swapDatas;
        uint256 deadline;
        bytes destTokenFeeData;
    }

    function Kyberfy(KyberStruct memory data)
        internal
        view
        returns (KyberStruct memory)
    {
        SimpleSwapData memory swapData = abi.decode(
            data.executorData,
            (SimpleSwapData)
        );
        swapData.deadline = (block.timestamp + 4);
        data.executorData = abi.encode(swapData);
        return data;
    }

    function transfer(MetaAggregationRouter.SwapDescription memory desc)
        internal
    {
        for (uint256 i = 0; i < desc.srcReceivers.length; i++) {
            IERC20(address(desc.srcToken)).transfer(
                desc.srcReceivers[i],
                desc.srcAmounts[i]
            );
        }
    }

    function swerve(KyberStruct memory data) internal {
        data.swapDes.flags = 0x0;
        transfer(data.swapDes);
    }

    function aloha(KyberStruct memory data) public returns (uint balance) {
        if (data.swapDes.flags & _SIMPLE_SWAP != 0) data = Kyberfy(data);
        else swerve(data);
        IERC20(data.swapDes.srcToken).approve(Kyber, type(uint).max);
        IKyber(Kyber).swap(
            data.caller,
            data.swapDes,
            data.executorData,
            data.clientData
        );
        balance = IERC20(data.swapDes.dstToken).balanceOf(
            data.swapDes.dstReceiver
        ); //test balance of reciever and this
        require(balance > 0, "Aloha: Reciever is dry");
    }
}

contract Main is Trader {
    using SafeMath for uint256;

    IPoolAddressesProvider private addressProvider =
        IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb);
    IPool immutable POOL;
    address Kyber = 0x617Dee16B86534a5d792A4d7A62FB491B544111E;
    KyberSwap.KyberStruct entry;
    KyberSwap.KyberStruct exit;
    KyberSwap.KyberStruct[] private swaps;
    bool private forward = true;
    uint loanAmount;
    uint strategy;
    bool public testing = false;
    uint public flag = 0;

    address entryToken;
    address exitToken;
    bool fiatEntry;
    bool fiatExit;

    address[] public vault = [
        0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83,
        0x74b23882a30290451A17c44f4F05243b6b58C76d,
        0x049d68029688eAbF473097a2fC38ef61633A3C7A,
        0x04068DA6C83AFCFA0e13ba15A6696662335D5B75,
        0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E,
        0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8,
        0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B,
        0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC,
        0x1E4F97b9f9F913c46F1632781732927B9019C68b,
        0x321162Cd933E2Be498Cd2267a90534A804051b11
    ];

    constructor() {
        POOL = IPool(addressProvider.getPool());
        require(verifyOrigin(), "Origin mismatch.");
    }

    function verifyOrigin() public view returns (bool verita) {
        verita = Trader.getOrigin() == address(this);
    }

    function activateTest(uint _flag) public {
        testing = true;
        flag = _flag;
    }

    function deactivateTest() public {
        testing = false;
        flag = 0;
    }

    function delta(uint a, uint b) public pure returns (uint y) {
        int d = ((int(b) - int(a)) * 10000) / int(a);
        y = (b > a) ? uint(d) : uint(d * -1);
    }

    function executeTrade() private returns (uint balance) {
        uint expected = 0;
        if (Trader.getFiat() != entryToken) crypto(entryToken);
        for (uint i = 0; i < swaps.length; i++) {
            expected = swaps[i].swapDes.amount;
            balance = IERC20(swaps[i].swapDes.srcToken).balanceOf(
                address(this)
            );
            console.warn(
                balance >= expected,
                "EXECUTION-UNDERFLOW: Delta: -",
                delta(expected, balance),
                "% | Failed at: ",
                i
            );
            balance = KyberSwap.aloha(swaps[i]);
            fiat(swaps[i].swapDes.srcToken);
        }
        delete swaps;
        if (Trader.getFiat() != exitToken) fiat(exitToken);
    }

    function executeOperation(
        address asset,
        uint amount,
        uint premium,
        address initiator,
        bytes calldata params
    ) external returns (bool fflag) {
        uint loan = IERC20(asset).balanceOf(address(this));
        executeTrade();
        uint balance = IERC20(asset).balanceOf(address(this));
        console.warn(
            balance >= loan,
            "REPAY-UNDERFLOW: delta: -",
            delta(loan, balance),
            "% | Loan: ",
            loan,
            " | Balance: ",
            balance
        );
        // console.warn(
        //     balance < loan,
        //     "REPAY-OVERFLOW: delta: +",
        //     delta(loan, balance),
        //     "% | Loan: ",
        //     loan,
        //     " | Balance: ",
        //     balance
        // );
        fflag = IERC20(asset).approve(address(POOL), type(uint).max);
    }

    function _flashLoanSimple(address asset, uint256 amount) internal {
        POOL.flashLoanSimple(address(this), asset, amount, "", 0);
    }

    function redeem(address recipient, address currency) internal {
        address stable = 0x049d68029688eAbF473097a2fC38ef61633A3C7A;
        if (stable != currency) {
            setFiat(stable);
            fiat(currency);
        }
        liquidate(recipient);
    }

    function initiate() internal {
        _flashLoanSimple(Trader.getFiat(), loanAmount);
    }

    function genLoan() internal {
        if (!forward && getFiat() == entryToken)
            setFiat(0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B);
        loanAmount = forward
            ? entry.swapDes.amount
            : estimateLoan(entryToken, entry.swapDes.amount);
    }

    function estimateLoan(address token, uint amount)
        public
        returns (uint loan)
    {
        loan = Trader.estimate(Trader.getFiat(), token, amount, type(uint).max);
        loan *= 105;
        loan /= 100; //Multiply the loan by 3
    }

    function isFiat(address token) private view returns (bool its) {
        for (uint i = 0; i < vault.length; i++) {
            its = vault[i] == token;
            i = !its ? i : vault.length;
        }
    }

    function strategize() private {
        entryToken = entry.swapDes.srcToken;
        exitToken = exit.swapDes.dstToken;
        fiatEntry = isFiat(entryToken);
        fiatExit = isFiat(exitToken);
        forward = false;

        if (fiatEntry) {
            setFiat(entryToken);
            forward = true;
        } else if (fiatExit) setFiat(exitToken);
    }

    function send(KyberSwap.KyberStruct[] memory _swaps) public {
        for (uint i = 0; i < _swaps.length; i++) {
            swaps.push(_swaps[i]);
        }
        entry = swaps[0];
        exit = swaps[swaps.length - 1];
        setFiat(0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B);
        strategize();
        genLoan();
        initiate();
        redeem(0x1E053796D7931E624Bd74c2cB4E4990bDcD8434A, getFiat());
        // revert("Artemis descent");
    }
}
