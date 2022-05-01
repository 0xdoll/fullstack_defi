const { ethers } = require("hardhat");
const hre = require("hardhat");

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

async function deployAndVerify() {
  // await hre.run('compile');

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();

  console.log("rewardToken deployed to:", rewardToken.address);

  const TokenBank = await hre.ethers.getContractFactory("TokenBank");
  const tokenBank = await TokenBank.deploy();
  await tokenBank.deployed();

  console.log("tokenBank deployed to:", tokenBank.address);

  const ProxyAdmin = await hre.ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  await proxyAdmin.deployed();
  console.log("proxyAdmin deployed to:", proxyAdmin.address);


  const MockV3Aggregator = await hre.ethers.getContractFactory("MockV3Aggregator");
  const mockV3Aggregator = await MockV3Aggregator.deploy(8, ethers.utils.parseUnits("3000", 8));
  await mockV3Aggregator.deployed();
  console.log("mockV3Aggregator deployed to:", mockV3Aggregator.address);

  const TransparentUpgradeableProxy = await hre.ethers.getContractFactory("TransparentUpgradeableProxy");
  const tokenBankProxy = await TransparentUpgradeableProxy.deploy(tokenBank.address, proxyAdmin.address, TokenBank.interface.encodeFunctionData("initialize", [rewardToken.address,]));
  await tokenBankProxy.deployed();
  console.log("tokenBankProxy deployed to:", tokenBankProxy.address);

  await sleep(10000);

  await hre.run("verify:verify", {
    address: tokenBank.address,
  });

  await hre.run("verify:verify", {
    address: proxyAdmin.address,
  });


  await hre.run("verify:verify", {
    address: tokenBankProxy.address,
    constructorArguments: [
      tokenBank.address, proxyAdmin.address, TokenBank.interface.encodeFunctionData("initialize", [rewardToken.address,]),
    ],
  });

  await hre.run("verify:verify", {
    address: rewardToken.address,
  });

  await hre.run("verify:verify", {
    address: mockV3Aggregator.address,
    constructorArguments: [
      8, ethers.utils.parseUnits("3000", 8)
    ],
  });
}

async function main() {
  await deployAndVerify();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
