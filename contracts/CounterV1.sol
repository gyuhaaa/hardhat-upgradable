// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract CounterV1 {
    uint256 public count;

    function inc() external {
        count += 1;
    }
}
