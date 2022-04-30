const hre = require("hardhat");

async function main() {
  // await hre.run('compile');

  const Contract = await hre.ethers.getContractFactory("Helloer");
  const contract = await Contract.deploy("Hello, Simon!");
  await contract.deployed();

  console.log("Contract deployed to:", helloer.address);

  // await hre.run("verify:verify", {
  //   address: contract.address,
  //   constructorArguments: [
  //       "Hello, Simon!",
  //   ],
  // });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
