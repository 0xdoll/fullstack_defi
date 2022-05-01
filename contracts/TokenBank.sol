// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TokenBank is Initializable, OwnableUpgradeable {
    IERC20 public rewardToken;
    mapping(address => mapping(address => uint256)) public stakeTokenBalance;
    mapping(address => bool) public allowedTokensFlag;
    address[] public allowedTokens;
    mapping(address => address) public tokenPriceDataFeed;
    mapping(address => uint256) public uniqueTokenStaked;
    mapping(address => bool) public stakersFlag;
    address[] public stakers;

    // constructor(address _rewardTokenAddress) {
    //     rewardToken = IERC20(_rewardTokenAddress);
    // }

    function initialize(address _rewardTokenAddress) public initializer {
        __Context_init_unchained();
        __Ownable_init_unchained();
        rewardToken = IERC20(_rewardTokenAddress);
    }

    modifier tokenAllowed(address _token) {
        require(allowedTokensFlag[_token], "Token is not allowed!");
        _;
    }

    function issueRewards() public onlyOwner {
        for (uint256 stakerIdx = 0; stakerIdx < stakers.length; stakerIdx++) {
            address user = stakers[stakerIdx];
            if (stakersFlag[user]) {
                uint256 userTotalTokenvalue = getUserTotalTokenValue(user);
                rewardToken.transfer(user, userTotalTokenvalue);
            }
        }
    }

    function stakeTokens(address _token, uint256 _amount)
        public
        tokenAllowed(_token)
    {
        require(_amount > 0, "Staking token amount is less than zero!");
        IERC20 token = IERC20(_token);
        token.transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokenStaked(_token, msg.sender);
        stakeTokenBalance[_token][msg.sender] += _amount;
        if (uniqueTokenStaked[msg.sender] == 1) {
            stakersFlag[msg.sender] = true;
            stakers.push(msg.sender);
        }
    }

    function unStakeToken(address _token) public {
        require(
            stakeTokenBalance[_token][msg.sender] > 0,
            "Not enough balance to unstake."
        );

        IERC20(_token).transfer(
            msg.sender,
            stakeTokenBalance[_token][msg.sender]
        );
        stakeTokenBalance[_token][msg.sender] = 0;
        uniqueTokenStaked[msg.sender] -= 1;
        if (uniqueTokenStaked[msg.sender] == 0) {
            stakersFlag[msg.sender] = false;
        }
    }

    function updateUniqueTokenStaked(address _token, address _user) public {
        if (stakeTokenBalance[_token][_user] <= 0) {
            uniqueTokenStaked[_user] += 1;
        }
    }

    function addAlowedToken(address _token) public onlyOwner {
        require(
            allowedTokensFlag[_token] == false,
            "This Token has been allowed!"
        );
        allowedTokensFlag[_token] = true;
        allowedTokens.push(_token);
    }

    function remAlowedToken(address _token) public onlyOwner {
        allowedTokensFlag[_token] = false;
    }

    function getUserTotalTokenValue(address _user)
        public
        view
        returns (uint256)
    {
        uint256 totalValue = 0;
        for (
            uint256 tokenIdx = 0;
            tokenIdx < allowedTokens.length;
            tokenIdx++
        ) {
            address _token = allowedTokens[tokenIdx];
            if (
                allowedTokensFlag[_token] &&
                stakeTokenBalance[_token][_user] > 0
            ) {
                totalValue += getUserSingleTokenValue(_user, _token);
            }
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (stakeTokenBalance[_token][_user] * price) / 10**decimals;
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            tokenPriceDataFeed[_token]
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        return (uint256(price), uint256(decimals));
    }

    function setTokenPriceFeed(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceDataFeed[_token] = _priceFeed;
    }
}
