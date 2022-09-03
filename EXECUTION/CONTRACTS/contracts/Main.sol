//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Main {

    uint private state = 0;

    function getState()
        public view returns(uint)
        {
            return state;
        }

    function increase()
        public
        {
            state++;
        }

    function multiply(uint x, uint y)
        public pure returns (uint result)
        {
            require(x > 100, "X should be more than 100");
            result = x * y;
        }
}
