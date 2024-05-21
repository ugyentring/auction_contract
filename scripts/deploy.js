const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Counter = await hre.ethers.getContractFactory("Auction");
  const counter = await Counter.deploy();

  await counter.deployed();

  console.log("Counter deployed to:", counter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
