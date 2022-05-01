const { artifacts, ethers } = require("hardhat");

(async () => {

    var signer0 = (await ethers.getSigners())[0];
    // signer.provider = new ethers.providers.JsonRpcProvider(); // for localhost node cli, remove if no need.

    var rewardTokenAddress = "0xe381ad995104C45B25D66CEA6645BaCA38A78A97";
    var mockV3AggregatorAddress = "0xCADD6eDF20A687411d375522eE98b09734FE8351";
    var tokenBankAddress = "0x62b5B6fbaF3b700c805a12460BceAA321Ba97e0B";
    var proxyAdminAddress = "0x9a58D46bEe7Cf8F7E5e477c84d6f70e128789029";
    var proxyAddress = "0x317c7E4A3F2c2181E53fd2a489574501Cfc8Aa18";
    var wethAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    var fauTokenAddress = "0xFab46E002BbF0b4509813474841E0716E6730136";


    const RewardToken = await artifacts.readArtifact("RewardToken");
    const TokenBank = await artifacts.readArtifact("TokenBank");
    const MockV3Aggregator = await artifacts.readArtifact("MockV3Aggregator");

    const rewardToken = new ethers.Contract(rewardTokenAddress, RewardToken.abi, signer0);
    const tokenBankProxy = new ethers.Contract(proxyAddress, TokenBank.abi, signer0);
    const mockV3Aggregator = new ethers.Contract(mockV3AggregatorAddress, MockV3Aggregator.abi, signer0);

    var tx = await rewardToken.mint(tokenBank.address, ethers.utils.parseUnits("10000000", 18))
    console.log(`rewardToken.mint -> tx ${tx.hash}`,);

    var tx = await tokenBankProxy.setTokenPriceFeed(rewardToken.address, mockV3Aggregator.address)
    console.log(`tokenBankProxy.setTokenPriceFeed -> tx ${tx.hash}`,);

    var tx = await tokenBankProxy.addAlowedToken(rewardTokenAddress); // rewardToken
    console.log(`tokenBankProxy.addAlowedToken -> tx ${tx.hash}`,);

    var tx = await tokenBankProxy.addAlowedToken("0xFab46E002BbF0b4509813474841E0716E6730136"); // FaucetToken (FAU)
    console.log(`tokenBankProxy.addAlowedToken -> tx ${tx.hash}`,);

    var tx = await tokenBankProxy.addAlowedToken(proxyAddress); // Wrapped ETH (wETH)
    console.log(`tokenBankProxy.addAlowedToken -> tx ${tx.hash}`,);
    var tx = await tokenBankProxy.setTokenPriceFeed(proxyAddress, "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e")
    console.log(`tokenBankProxy.setTokenPriceFeed -> tx ${tx.hash}`,);

    var tx = await tokenBankProxy.setTokenPriceFeed("0xFab46E002BbF0b4509813474841E0716E6730136", mockV3Aggregator.address)
    console.log(`tokenBankProxy.setTokenPriceFeed -> tx ${tx.hash}`,);
    await tx.wait(1);

    const IERC20 = await artifacts.readArtifact("IERC20");
    const wethToken = new ethers.Contract(wethAddress, IERC20.abi, signer0);

    var tx = await wethToken.approve(proxyAddress, ethers.utils.parseUnits("8786", 18));
    console.log(`wethToken.approve -> tx ${tx.hash}`,);
    await tx.wait();

    var tx = await tokenBankProxy.stakeTokens(wethToken.address, ethers.utils.parseUnits("8786", 18));
    console.log(`tokenBankProxy.stakeTokens -> tx ${tx.hash}`,);
    await tx.wait();
})();