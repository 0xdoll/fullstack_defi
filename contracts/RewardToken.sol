// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor() ERC20("Bank Reware Token", "$BRT") {}

    function mint(address _user, uint256 _amount) public onlyOwner {
        _mint(_user, _amount);
    }
}
