const hre = require("hardhat");

async function main() {

  var contract_addr = "0x37c4cE63Be473e4274Ee7D1Bb876F46690c2bF94";
  await hre.run("verify:verify", {
    address: contract_addr,
    constructorArguments: [
      "Hello, Coder!",
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
