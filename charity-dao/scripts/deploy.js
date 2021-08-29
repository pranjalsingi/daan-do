const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const OpenCharity = await hre.ethers.getContractFactory("OpenCharity");
    const openCharity = await OpenCharity.deploy();

    await openCharity.deployed();
    console.log("Contract address:", openCharity.address);

    saveFrontendFiles(openCharity);

}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/abis";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    // fs.writeFileSync(
    //     contractsDir + "/contract-address.json",
    //     JSON.stringify({ OpenCharity: contract.address }, undefined, 2)
    // );

    const ContractArtifact = artifacts.readArtifactSync("OpenCharity");

    fs.writeFileSync(
        contractsDir + "/OpenCharity.json",
        JSON.stringify(ContractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });