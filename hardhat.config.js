/**
 * /* hardhat.config.js
 *
 * @format
 */
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");


const API_KEY = process.env.apiKey;

module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.privateKey],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.3",
      },
      {
        version: "0.8.17",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: API_KEY,
  },
};
