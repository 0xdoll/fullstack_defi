const ethers = require("ethers");

require('dotenv').config();

(async () => {

    const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFRA_KEY}`);

    const AggregatorV3Interface_abi = `[{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"}]`;

    const cny_usd = new ethers.Contract("0xeF8A4aF35cd47424672E3C590aBD37FBB7A7759a", AggregatorV3Interface_abi, provider);
    const usdt_usd = new ethers.Contract("0x3E7d1eAB13ad0104d2750B8863b489D65364e32D", AggregatorV3Interface_abi, provider);

    var [cny_usd_roundId, cny_usd_price] = await cny_usd.latestRoundData();
    var [usdt_usd_roundId, usdt_usd_price] = await usdt_usd.latestRoundData();
    var usdt_cny = usdt_usd_price / cny_usd_price;

    console.log(`usdt_cny ${usdt_cny} @ cny_usd_roundId ${cny_usd_roundId} usdt_usd_roundId ${usdt_usd_roundId}`);

})();