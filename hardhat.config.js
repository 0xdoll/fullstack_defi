require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require('dotenv').config(); // parse .env file

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALECHEMY_MAINNET_KEY}`,
      }
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFRA_KEY}`,
      accounts: [process.env.ETH_ACCOUNT_PK, process.env.ETH_ACCOUNT_PK1],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFRA_KEY}`,
      accounts: [process.env.ETH_ACCOUNT_PK, process.env.ETH_ACCOUNT_PK1],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFRA_KEY}`,
      accounts: [process.env.ETH_ACCOUNT_PK, process.env.ETH_ACCOUNT_PK1],
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALECHEMY_KOVAN_KEY}`, // `https://kovan.infura.io/v3/${process.env.INFRA_KEY}`,
      accounts: [process.env.ETH_ACCOUNT_PK, process.env.ETH_ACCOUNT_PK1],
    }
  },
  etherscan: {
    apiKey: {
      ropsten: process.env.ETH_APIKEY,
      mainnet: process.env.ETH_APIKEY,
      kovan: process.env.ETH_APIKEY,
      rinkeby: process.env.ETH_APIKEY
    },
  }
};
