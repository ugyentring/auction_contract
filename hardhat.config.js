require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to

// https://hardhat.org/guides/create-task.html

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config

// Go to https://hardhat.org/config/ to learn more

/** 

 * @type import('hardhat/config').HardhatUserConfig 

 */

const SEPOLIA_PRIVATE_KEY =
  "f84f28305451e17ee99be53d485d897a4aacf7fa3871c7717e8057a951242970";

module.exports = {
  solidity: "0.8.0",

  networks: {
    SEPOLIA: {
      url: "https://eth-sepolia.g.alchemy.com/v2/IrP_Op9E6odxlblJ4oU5jJ1sEeNuPBbN",

      accounts: [`${SEPOLIA_PRIVATE_KEY}`],
    },
  },
};
