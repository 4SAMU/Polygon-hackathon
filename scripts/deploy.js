/** @format */

const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const InteriorDesignMarketplace = await hre.ethers.getContractFactory(
    "InteriorDesignMarketplace"
  );
  const interiordesign = await InteriorDesignMarketplace.deploy();
  await interiordesign.deployed();
  console.log("interiordesign deployed to:", interiordesign.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const marketplaceAddress = "${interiordesign.address}"
  `
  );

  const data = {
    address: interiordesign.address,
    abi: JSON.parse(interiordesign.interface.format("json")),
  };

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync("./Marketplace.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
