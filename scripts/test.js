const { artifacts, ethers } = require("hardhat");

(async () => {
    
    // npx hardhat run test/td.js --network <network>
    
    var signer = (await ethers.getSigners())[2]; // first signer.
    // signer.provider = new ethers.providers.JsonRpcProvider(); // for localhost node cli, remove if no need.
    const contract_addr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const tokenArtifact = await artifacts.readArtifact("Helloer");
    var contract = new ethers.Contract(contract_addr, tokenArtifact.abi, signer);

    console.log(await contract.greet());

})();