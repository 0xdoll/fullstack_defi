# My first Fullstack Defi/Dapp Project

## Technology Stack

- Frondend: Vue.js
- Smart Contract: solidity

## Useful developing cli commands

```shell
# start hardhat node with mainnet-forking
npx hardhat node

# deploy contract
npx hardhat run --network localhost scripts/deploy.js

# publish & verify contract
npx hardhat run --network localhost scripts/verify.js

# link remix ide with local path.
remixd -s . -u https://remix.ethereum.org
```
