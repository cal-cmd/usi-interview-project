// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/// @title Token contract for USI interview project

contract Token is ERC20PresetMinterPauser {

    uint public startTime;
    uint public endTime;

    constructor(uint _startTime, uint _endTime) ERC20PresetMinterPauser("USI Token", "USI") {
        startTime = _startTime;
        endTime = _endTime;
    }

    /// @notice Change the startTime
    /// @param _time New time in UNIX timestamp (seconds)
    function changeStartTime(uint _time) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        startTime = _time;
    }

    /// @notice Change the endTime
    /// @param _time New time in UNIX timestamp (seconds)
    function changeEndTime(uint _time) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender));
        endTime = _time;
    }

    /// @notice Timestamp dependency, but can only be manipulated up to ~900 seconds
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(block.timestamp >= startTime, "tokens cannot be transferred yet");
        require(block.timestamp <= endTime, "tokens cannot be transferred now");
    }
}
