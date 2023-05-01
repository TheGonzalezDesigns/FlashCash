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

    function decimals() external view returns (uint8);
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

library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x, "ds-math-sub-underflow");
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }
}

interface IPingPongLoan {
    function loan(
        address lentStablecoin,
        address repaymentStablecoin,
        uint256 loanAmount,
        bytes memory params
    ) external;
}

contract Main {
    using SafeMath for uint256;

    address public WETH = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;
    IPingPongLoan public PingPongLoan =
        IPingPongLoan(0x0DEdc667355ee712FDD972B3e1760a522BE623D3);

    struct TradeDesc {
        uint256 providerID;
        address tokenIn;
        bytes data;
    }

    receive() external payable {}

    fallback() external payable {}

    function send(
        address tokenIn,
        address tokenOut,
        uint256 loanAmount,
        TradeDesc[] calldata trades
    ) public {
        flashswap(loanAmount, tokenIn, tokenOut, trades);
    }

    function flashswap(
        uint256 loanAmount,
        address tokenIn,
        address tokenOut,
        TradeDesc[] calldata trades
    ) internal {
        PingPongLoan.loan(tokenIn, tokenOut, loanAmount, abi.encode(trades));
    }

    function onBorrow(
        IERC20 lentStablecoin,
        IERC20 repaymentStablecoin,
        uint256 loanAmount,
        uint256 minRepaymentAmount,
        bytes calldata params
    ) external {
        TradeDesc[] memory trades = abi.decode(params, (TradeDesc[]));

        for (uint256 i = 0; i < trades.length; i++)
            EnigmaV3.swap(
                trades[i].providerID,
                trades[i].tokenIn,
                trades[i].data
            );

        uint repaymentBalance = IERC20(repaymentStablecoin).balanceOf(
            address(this)
        );
        repaymentStablecoin.transfer(address(PingPongLoan), repaymentBalance);
    }
}
