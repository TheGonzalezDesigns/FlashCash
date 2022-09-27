//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
pragma abicoder v2;
interface IERC20 {
	function totalSupply() external view returns (uint256);
	function balanceOf(address account) external view returns (uint256);
	function transfer(address recipient, uint256 amount) external returns (bool);
	function allowance(address owner, address spender) external view returns (uint256);
	function approve(address spender, uint256 amount) external returns (bool);
	function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);
}
interface IBlackMagicRouter {
	function swapOnUniswapV2Fork(
		address fromToken,
		address toToken,
        uint256 amountIn,
        uint256[] memory pools,
        address origin
	) external;
}
interface IUniswapV2Pair {
	function getReserves()
		external
		view
		returns (
			uint112 reserve0,
			uint112 reserve1,
			uint32 blockTimestampLast
		);
	function swap(
		uint256 amount0Out,
		uint256 amount1Out,
		address to,
		bytes calldata data
	) external;
    function token0() external pure returns (address);
    function token1() external pure returns (address);
}
library SafeMath {
	function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
		uint256 c = a + b;
		if (c < a) return (false, 0);
		return (true, c);
	}
	function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
		if (b > a) return (false, 0);
		return (true, a - b);
	}
	function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
		if (a == 0) return (true, 0);
		uint256 c = a * b;
		if (c / a != b) return (false, 0);
		return (true, c);
	}
	function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
		if (b == 0) return (false, 0);
		return (true, a / b);
	}
	function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
		if (b == 0) return (false, 0);
		return (true, a % b);
	}
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
	function div(uint256 a, uint256 b) internal pure returns (uint256) {
		require(b > 0, "SafeMath: division by zero");
		return a / b;
	}
	function mod(uint256 a, uint256 b) internal pure returns (uint256) {
		require(b > 0, "SafeMath: modulo by zero");
		return a % b;
	}
	function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b <= a, errorMessage);
		return a - b;
	}
	function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b > 0, errorMessage);
		return a / b;
	}
	function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b > 0, errorMessage);
		return a % b;
	}
}
library NewUniswapV2Lib {
	using SafeMath for uint256;
	function getReservesByPair(address pair, bool direction)
		internal
		view
		returns (uint256 reserveIn, uint256 reserveOut)
	{
		(uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pair).getReserves();
		(reserveIn, reserveOut) = direction ? (reserve0, reserve1) : (reserve1, reserve0);
	}
	function getAmountOut(
		uint256 amountIn,
		address pair,
		bool direction,
		uint256 fee
	) internal view returns (uint256 amountOut) {
		require(amountIn > 0, "UniswapV2Lib: INSUFFICIENT_INPUT_AMOUNT");
		(uint256 reserveIn, uint256 reserveOut) = getReservesByPair(pair, direction);
		uint256 amountInWithFee = amountIn.mul(fee);
		uint256 numerator = amountInWithFee.mul(reserveOut);
		uint256 denominator = reserveIn.mul(10000).add(amountInWithFee);
		amountOut = uint256(numerator / denominator);
	}
}
library TransferHelper {
	function safeTransferFrom(
		address token,
		address from,
		address to,
		uint256 value
	) internal {
		(bool success, bytes memory data) =
			token.call(abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, value));
		require(success && (data.length == 0 || abi.decode(data, (bool))), 'STF');
	}
	function safeTransfer(
		address token,
		address to,
		uint256 value
	) internal {
		(bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.transfer.selector, to, value));
		require(success && (data.length == 0 || abi.decode(data, (bool))), 'ST');
	}
	function safeApprove(
		address token,
		address to,
		uint256 value
	) internal {
		(bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.approve.selector, to, value));
		require(success && (data.length == 0 || abi.decode(data, (bool))), 'SA');
	}
}
contract BlackMagicRouter {
	using SafeMath for uint256;
	struct UniswapV2Data {
		address weth;
		uint256[] pools;
	}
    function getExactAmountOut(uint256 R_In, uint256 R_Out, uint256 MT)
        public
        pure 
        returns (uint256 O)
    {
        O = ((998000 * MT * R_Out)/((1000 * R_In) + (998 * MT)))/1000; //Billion Dollar Equation
    }
    function summonPrice(
		uint256 amountIn,
		address pair,
		bool direction,
		uint256 fee //3  = 3%
	) internal view returns (uint256 amountOut) {
		require(amountIn > 0, "BlackMagicRouter: INSUFFICIENT_INPUT_AMOUNT");
		(uint256 reserveIn, uint256 reserveOut) = NewUniswapV2Lib.getReservesByPair(pair, direction);
		amountOut = getExactAmountOut(reserveIn, reserveOut, amountIn);
        amountOut = ((amountOut * 1000) -  ((amountOut * fee * 1000)/100))/1000;
	}

	function swapOnUniswapV2Fork(
		address fromToken,
		address toToken,
		uint256 fromAmount,
		uint256[] memory pools,
        address origin
	) public {
		_swapOnUniswapV2Fork(fromToken, toToken, fromAmount, pools, origin);
	}

    function _swapOnUniswapV2Fork(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256[] memory pools,
    address origin
	) private returns (uint256 tokensBought) 
    {
        uint256 balance;
        address prevToken = tokenIn;
		uint256 pairs = pools.length;
		require(pairs != 0, "At least one pool required");
        balance = IERC20(tokenIn).balanceOf(address(this));

        TransferHelper.safeTransfer(tokenIn, address(uint160(pools[0])), amountIn);
			   
		tokensBought = amountIn;
		for (uint256 i = 0; i < pairs; ++i) 
        {
			uint256 p = pools[i];
			address pool = address(uint160(p));
            bool direction = IUniswapV2Pair(pool).token0() == prevToken; //If reserve0 is weth
            prevToken = !direction ? IUniswapV2Pair(pool).token0() : IUniswapV2Pair(pool).token1();

			tokensBought = summonPrice(tokensBought, pool, direction, 0);

			(uint256 amount0Out, uint256 amount1Out) = direction
			    ? (uint256(0), tokensBought)
			    : (tokensBought, uint256(0));
			IUniswapV2Pair(pool).swap(
			    amount0Out,
			    amount1Out,
			    i + 1 == pairs ? address(this) : address(uint160(pools[i + 1])),
			    ""
			);
		}
        balance = IERC20(tokenOut).balanceOf(address(this));
        TransferHelper.safeTransfer(tokenOut, origin, balance);
		balance = IERC20(tokenIn).balanceOf(address(this));
		if (balance > 0) TransferHelper.safeTransfer(tokenIn, origin, balance);
    }
}
interface IUniswap {
	function swapExactTokensForTokens(
		uint amountIn,
		uint amountOutMin,
		address[] calldata path,
		address to,
		uint deadline
	) 
	external 
	returns (uint[] memory amounts);
		function swapExactTokensForTokensSupportingFeeOnTransferTokens(
		uint amountIn,
		uint amountOutMin,
		address[] calldata path,
		address to,
		uint deadline
	) external;
	function WETH() external pure returns (address);
	function factory() external view returns (address);
}
library Swapper {
	IUniswap constant uniswap = IUniswap(router);
	address constant public router = 0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52;
	address constant public TETHER = 0x049d68029688eAbF473097a2fC38ef61633A3C7A;
	uint256 constant deadline = 2;
	function swapTokensForTokens(
		uint amountIn,
		address tokenIn,
		address tokenOut,
		uint amountOutMin
	) public
	{
		require(IERC20(tokenIn).balanceOf(address(this)) >= amountIn, "Insufficient balance on contract to commit the swap.");
		IERC20(tokenIn).approve(address(uniswap), amountIn);
		require(IERC20(tokenIn).allowance(address(this), address(uniswap)) >= amountIn, "Insufficient allowance to commit the swap.");
		address[] memory path = new address[](3);
		path[0] = tokenIn;
		path[1] = uniswap.WETH();
		path[2] = tokenOut;
		uniswap.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			amountIn,
			amountOutMin,
			path,
			address(this),
			(block.timestamp + deadline)
		);
	}
	function swapIn(
		address tokenOut
	) public 
	{
		swapTokensForTokens(IERC20(TETHER).balanceOf(address(this)), TETHER, tokenOut, 0);
	}
	function swapOut(
		address tokenIn
	) public 
	{
		swapTokensForTokens(IERC20(tokenIn).balanceOf(address(this)), tokenIn, TETHER, 0);
	}
}
contract Trader {
	function crypto(
		address tokenOut
	) public
	{
		Swapper.swapIn(tokenOut);
	}
	function fiat(
		address tokenIn
	) public
	{
		Swapper.swapOut(tokenIn);
	}
	function liquidate() public {
		IERC20 TOKEN = IERC20(Swapper.TETHER);
		uint BALANCE = TOKEN.balanceOf(address(this));
		TOKEN.approve(msg.sender, BALANCE);
		TOKEN.transfer(msg.sender, BALANCE);
	}
		function verifyBalance(address token, uint amount) public view {
		IERC20 TOKEN = IERC20(token);
		uint BALANCE = TOKEN.balanceOf(address(this));
		require(BALANCE >= amount, "Balance Verification failed: contract didn't have enough funds to proceed.");
	}
	function applyMRC(uint amount) 
	public pure returns (uint applied)
	{
		applied = ((amount * 18900)/100000) + amount; //MRC=.0209 or 2.09% - .09% as FL Interest
	}
	function getFiat()
	public pure returns (address _fiat)
	{
		_fiat = Swapper.TETHER;
	}
}
library Address {
    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            if (returndata.length > 0) {
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

library SafeERC20 {
    using Address for address;
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");

        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }
    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }
    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }
}
interface IERC20PermitLegacy {
    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}
interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}
library Utils {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    address private constant ETH_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    uint256 private constant MAX_UINT = type(uint256).max;
    struct Adapter {
        address payable adapter;
        uint256 percent;
        uint256 networkFee; 
        Route[] route;
    }
    struct Route {
        uint256 index; 
        address targetExchange; 
        uint256 percent;
        bytes payload;
        uint256 networkFee; 
    }
    function approve(
        address addressToApprove,
        address token,
        uint256 amount
    ) internal {
        if (token != ETH_ADDRESS) {
            IERC20 _token = IERC20(token);
            uint256 allowance = _token.allowance(address(this), addressToApprove);
            if (allowance < amount) {
                _token.safeApprove(addressToApprove, 0);
                _token.safeIncreaseAllowance(addressToApprove, MAX_UINT);
            }
        }
    }
    function transferTokens(
        address token,
        address payable destination,
        uint256 amount
    ) internal {
        if (amount > 0) {
            if (token == ETH_ADDRESS) {
                (bool result, ) = destination.call{ value: amount, gas: 10000 }("");
                require(result, "Failed to transfer Ether");
            } else {
                IERC20(token).safeTransfer(destination, amount);
            }
        }
    }
    function tokenBalance(address token, address account) internal view returns (uint256) {
        if (token == ETH_ADDRESS) {
            return account.balance;
        } else {
            return IERC20(token).balanceOf(account);
        }
    }
    function permit(address token, bytes memory permit) internal {
        if (permit.length == 32 * 7) {
            (bool success, ) = token.call(abi.encodePacked(IERC20Permit.permit.selector, permit));
            require(success, "Permit failed");
        }
        if (permit.length == 32 * 8) {
            (bool success, ) = token.call(abi.encodePacked(IERC20PermitLegacy.permit.selector, permit));
            require(success, "Permit failed");
        }

    }
}
interface IFantomAdapter {
    function swap(
        address fromToken,
        address toToken,
        uint256 fromAmount,
        uint256 networkFee,
        Utils.Route[] memory route
    ) external payable;
}
contract onFantom {
    using SafeERC20 for IERC20;
    address constant router = 0x564B759c1A7976476649452e804A13B963610065;
    IFantomAdapter fantomAdapter;
    constructor() {
        fantomAdapter = IFantomAdapter(router);
    }
    function safeSwap(
        address fromToken,
        address toToken,
        uint256 fromAmount,
        Utils.Route[] memory route
    ) public {
        uint balance = IERC20(fromToken).balanceOf(address(this));
        IERC20(fromToken).safeTransfer(router, balance);
        fantomAdapter.swap(fromToken, toToken, fromAmount, 0, route);
    }
    function getRouter() 
        public pure returns(address) 
    {
        return router;
    }
}
contract Unwrap {
    struct Meta {
        address from;
        address to;
        uint256 amount;
        uint256 loanAmount;
        address router;
    }
    struct AllData 
    {
        uint256 index;
        address targetExchange; 
        uint256 percent;
        address weth;
        uint256[] pools;
        int128 i;
        int128 j;
        uint256 iv2;
        uint256 jv2;
        uint256 deadline;
        bool underlyingSwap;
    }
    struct SomeData 
    {
        uint256 index;
        address targetExchange; 
        uint256 percent;
        address weth;
        int128 i;
        int128 j;
        uint256 iv2;
        uint256 jv2;
        uint256 deadline;
        bool underlyingSwap;
    }
    struct Batch
    {
        Meta meta;
        AllData[] transactions;
    }
    function transfer(bytes[][][] calldata transactions)
        public pure
        returns(Batch[] memory)
    {
        Batch[] memory unwrapped = new Batch[](transactions.length);
        uint count = transactions.length;
        for (uint i = 0; i < count; i++) {
            unwrapped[i] = unwrap(transactions[i]);
        }
        return unwrapped;
    }
    function unwrap(bytes[][] calldata transaction)
        private pure returns(Batch memory)
    {
        uint count = transaction[2].length;
        Meta memory meta = dMeta(transaction[0][0]);
        bytes[] memory bRoutes = transaction[1];
        bytes[] memory bPools = transaction[2];
        uint256[][] memory pools = new uint256[][](count);
        SomeData[] memory someData = new SomeData[](count);
        AllData[] memory unwrapped = new AllData[](count);
        Batch memory batch;
        for (uint256 i = 0; i < count; i++)
        {
            someData[i] = dSomeData(bRoutes[i]);
            pools[i] = dPool(bPools[i]);
            unwrapped[i] = cAllData(someData[i], pools[i]);
        }
        batch.meta = meta;
        batch.transactions = unwrapped;
        return batch;
    }
    function dMeta(bytes memory data)
        private pure returns(Meta memory)
    {
        return abi.decode(data, (Meta));
    }
    function dSomeData(bytes memory data)
        private pure returns(SomeData memory)
    {
        return abi.decode(data, (SomeData));
    }
    function dPool(bytes memory data)
        private pure returns(uint256[] memory)
    {
        return abi.decode(data, (uint256[]));
    }
    function cAllData(SomeData memory someData, uint256[] memory pools)
        private pure returns(AllData memory)
    {
        AllData memory allData;        
        allData.index = someData.index;
        allData.targetExchange = someData.targetExchange; 
        allData.percent = someData.percent;
        allData.weth = someData.weth;
        allData.pools = pools;
        allData.i = someData.i;
        allData.j = someData.j;
        allData.iv2 = someData.iv2;
        allData.jv2 = someData.jv2;
        allData.deadline = someData.deadline;
        allData.underlyingSwap = someData.underlyingSwap;
        return allData;
    }
}
contract Logistics is Unwrap {
    struct Map {
        Vessel vessel;
        Utils.Route[] routes;
        uint256[] pools;
        uint256 index;
    }
    struct Vessel
    {
        address fromToken;
        address toToken;
        uint256 fromAmount;
        uint256 loanAmount;
        address router;
    }
    function encode(AllData memory allData) 
        internal pure returns (bytes memory output) 
    {
        output = abi.encode(allData);
    }
    function decode(bytes memory input) 
        internal pure returns (AllData memory allData) 
    {
        allData = abi.decode(input, (AllData));
    }
    function encodeWFTMData(bytes memory input) 
        internal pure returns (bytes memory output)
    {
        output = input;
    }
    struct UniswapV2Data 
    {
        address weth;
        uint256[] pools;
    }
    function encodeUniswapV2Data(bytes memory input) 
        internal pure returns (bytes memory output)
    {
        AllData memory allData = decode(input);
        UniswapV2Data memory data = UniswapV2Data(
        {
            weth: allData.weth,
            pools: allData.pools
        });
        output = abi.encode(data);
    }
    struct CurveData 
    {
        int128 i;
        int128 j;
        uint256 deadline;
        bool underlyingSwap;
    }
    function encodeCurveData(bytes memory input) 
        internal pure returns (bytes memory output)
    {
        AllData memory allData = decode(input);
        CurveData memory data = CurveData(
        {
            i: allData.i,
            j: allData.j,
            deadline: allData.deadline,
            underlyingSwap: allData.underlyingSwap
        });
        output = abi.encode(data);
    }
    struct CurveV2Data 
    {
        uint256 i;
        uint256 j;
        bool underlyingSwap;
    }
    function encodeCurveV2Data(bytes memory input) 
        internal pure returns (bytes memory output)
    {
        AllData memory allData = decode(input);
        CurveV2Data memory data = CurveV2Data(
        {
            i: allData.iv2,
            j: allData.jv2,
            underlyingSwap: allData.underlyingSwap
        });
        output = abi.encode(data);
    }
    function encodeData(uint256 index, bytes memory input) 
        internal pure returns (bytes memory output)
    {
        require(index >= 1 && index <= 4 , "encodeData: Index is out of bounds");
        output = index == 1 ? encodeWFTMData(input) : 
            index == 2 ? encodeUniswapV2Data(input) : 
                index == 3 ? encodeCurveData(input) : encodeCurveV2Data(input);
    }
    function lay(uint256 index, address targetExchange, uint256 percent, bytes memory payload) 
        internal pure returns (Utils.Route memory route)
    {
        route = Utils.Route(
        {
            index: index,
            targetExchange: targetExchange,
            percent: percent,
            payload: encodeData(index, payload), 
            networkFee: 0
        });
    }
    function pave(AllData memory allData) 
        internal pure returns (Utils.Route memory route)
    {
        bytes memory payload = encode(allData);
        route = lay(allData.index, allData.targetExchange, allData.percent, payload);
    }
    function unload(bytes[] memory payload) 
        internal pure returns (AllData[] memory cargo)
    {
        cargo = new AllData[](payload.length);
        for (uint i = 0; i < payload.length; i++)
        {
            cargo[i] = decode(payload[i]);
        } 
    }
    function pack(AllData[] memory cargo)
        internal pure returns (Utils.Route[] memory path)
    {
        path = new Utils.Route[](cargo.length);
        for (uint i = 0; i < cargo.length; i++)
        {
            path[i] = pave(cargo[i]);
        }
    }
    function convertToVessel(Batch memory batch)
        internal pure returns (Vessel memory)
    {
        Vessel memory vessel;
        vessel.fromToken = batch.meta.from;
        vessel.toToken = batch.meta.to;
        vessel.fromAmount = batch.meta.amount;
        vessel.loanAmount = batch.meta.loanAmount;
        vessel.router = batch.meta.router;
        return vessel;
    }
}
contract Registry is Logistics {
    mapping(bytes32 => Logistics.Map) public Guide; 
    function registerTrade(Vessel memory vessel, Utils.Route[] memory routes, uint256[] memory pools, uint256 index) 
        public
        returns (bytes32 signature) 
    {
        uint miles = routes.length;
        uint depth = pools.length;
        signature = keccak256(abi.encodePacked(vessel.fromToken, vessel.toToken, vessel.fromAmount));
        Guide[signature].vessel = vessel;
        Guide[signature].index = index;
        for (uint route = 0; route < miles; route++)
        {
            Guide[signature].routes.push(routes[route]);
        }
        for (uint pool = 0; pool < depth; pool++)
        {
            Guide[signature].pools.push(pools[pool]);
        }
    }
    function getRoutes(bytes32 signature)
        public view returns (Utils.Route[] memory routes)
    {
        routes = Guide[signature].routes;
    }
    function getVessel(bytes32 signature)
        public view returns (Logistics.Vessel memory vessel)
    {
        vessel = Guide[signature].vessel;
    }
    function getPools(bytes32 signature)
        public view returns (uint256[] memory pools)
    {
        pools = Guide[signature].pools;
    }
    function getIndex(bytes32 signature)
        public view returns (uint256 index)
    {
        index = Guide[signature].index;
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

contract DeepBlue {
    uint256[] pools;
    uint256[] basins;
    uint256[] coves;
    uint256[] rivers;
    function lagoon(Unwrap.AllData[] memory ponds)
        public
        returns (uint256[] memory)
    {
        uint depth = ponds.length;
        if (pools.length > 0) delete pools;
        for (uint pond = 0; pond < depth; pond++)
        {
            uint pitch = ponds[pond].pools.length;
            for (uint puddle = 0; puddle < pitch; puddle++)
            {
                pools.push(ponds[pond].pools[puddle]);
            }
        }
        return pools;
    }
    function dive(Unwrap.AllData[] memory ponds)
        public
        pure
        returns (uint256 index)
    {
        uint decline = 0;
        uint depth = ponds.length;
        for (uint pond = 0; pond < depth; pond++)
        {
            if (ponds[pond].index == 2) decline++;
        }
        if (decline > 0) {
            if (decline * 100 > ((depth * 100)/2)) index = 2;
            else require(false, "Routes too complex to process.");
        } else index = 0;
    }
    function creek(uint256 pool)
        public
        pure
        returns (address t0, address t1)
    {
        t0 = IUniswapV2Pair(address(uint160(pool))).token0();
        t1 = IUniswapV2Pair(address(uint160(pool))).token1();
    }
    function basin(address In, address Out, uint256 pool)
        public
        pure
        returns (bool Is)
    {
        address t0 = IUniswapV2Pair(address(uint160(pool))).token0();
        address t1 = IUniswapV2Pair(address(uint160(pool))).token1();
        Is = ((t0 == In) || (t0 == Out)) && ((t1 == In) || (t1 == Out));
    }
    function riverbank(address In, address Out)
        public
        returns (bool wet)
    {
        address prev = In;
        address t0;
        address t1;
        bool closed = false;
        uint depth = coves.length;
        for (uint _cove = 0; _cove < depth && !closed; _cove++)
        {
            for (uint cove = 0; cove < depth && !closed; cove++)
            {
                (t0, t1) = creek(coves[cove]);
                if (t0 == prev) {
                    closed = t1 == Out;
                    prev = t1;
                    rivers.push(coves[cove]);
                } else if (t1 == prev) {
                    closed = t0 == Out;
                    prev = t0;
                    rivers.push(coves[cove]);
                }
            }
        }
        wet = closed;
    }
    function compass(address In, address Out)
        public
        returns (uint256[] memory)
    {
        uint depth = pools.length;
        for (uint pool = 0; pool < depth; pool++)
        {
            if (basin(In, Out, pools[pool])) basins.push(pools[pool]);
            else coves.push(pools[pool]);
        }
        if (coves.length > 0) if (riverbank(In, Out)) return rivers;
        return basins;
    }
}

contract Flashloan is Trader, onFantom, Registry {

    using SafeMath for uint256;
    IPoolAddressesProvider private addressProvider = IPoolAddressesProvider(0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb);
    IPool immutable POOL;
    bytes32 signature;
    bool debug = false;

    constructor() {
        POOL = IPool(addressProvider.getPool());
    }

    function executeOperation(
        address asset, 
        uint amount, 
        uint premium, 
        address initiator, 
        bytes calldata params
        ) 
        external 
        returns(bool flag)  
        {
        uint amountOwing = amount.add(premium);
        executeTrade(Registry.getVessel(signature), Registry.getRoutes(signature), Registry.getPools(signature), Registry.getIndex(signature));
        
        flag = IERC20(asset).approve(address(POOL), amountOwing);
    }

    function _flashLoanSimple(address asset, uint256 amount) internal {
        POOL.flashLoanSimple(
            address(this), 
            asset, 
            amount, 
            "", 
            0);
    }
    function run(address asset, uint256 amount, bytes32 _signature) public {
        signature = _signature;
        _flashLoanSimple(asset, amount);
    }
    function executeTrade(Logistics.Vessel memory vessel, Utils.Route[] memory routes, uint256[] memory pools, uint256 index)
        public
    { //merge
        uint balance = IERC20(Trader.getFiat()).balanceOf(address(this));
        if (address(vessel.fromToken) != address(Trader.getFiat())) crypto(address(vessel.fromToken));
        balance = IERC20(vessel.fromToken).balanceOf(address(this));
        verifyBalance(vessel.fromToken, vessel.fromAmount);
        balance = IERC20(vessel.fromToken).balanceOf(address(this));
        IERC20(vessel.fromToken).transfer(vessel.router, vessel.fromAmount);

        if (index == 2) {
            IBlackMagicRouter(vessel.router).swapOnUniswapV2Fork(vessel.fromToken, vessel.toToken, vessel.fromAmount, pools, address(this));
        }
        else safeSwap(vessel.fromToken, vessel.toToken, vessel.fromAmount, routes);


        if (IERC20(vessel.fromToken).balanceOf(address(this)) > 0 && address(vessel.fromToken) != address(Trader.getFiat())) fiat(vessel.fromToken); 
        balance = IERC20(vessel.toToken).balanceOf(address(this));
        fiat(vessel.toToken);
    }
}
contract Main is Flashloan, DeepBlue {
    function send(bytes[][][] calldata transactions)
        public
    {
        Logistics.Batch[] memory batches = transfer(transactions);
        distribute(batches);
        Trader.liquidate();
    }
    function distribute(Logistics.Batch[] memory batches)
        public
    {
        uint quantity = batches.length;
        for(uint i = 0; i < quantity; i++)
        {
            load(batches[i]);
        }
    }
    function load(Logistics.Batch memory batch)
        public
    {
        Logistics.Vessel memory vessel = Logistics.convertToVessel(batch);
        Utils.Route[] memory routes = Logistics.pack(batch.transactions);
        uint index = DeepBlue.dive(batch.transactions);
        uint256[] memory pools;
        if (index == 2) {
            lagoon(batch.transactions);
            pools = compass(vessel.fromToken, vessel.toToken);
        }
        bytes32 signature = Registry.registerTrade(vessel, routes, pools, index);
        trade(vessel, signature);
    }
    function trade(Logistics.Vessel memory vessel, bytes32 signature)
        public
    {  
        uint entryAmount = Trader.applyMRC(vessel.loanAmount); 
        Flashloan.run(Trader.getFiat(), entryAmount, signature);
    }
}
