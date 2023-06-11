require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
// const { ETHERSCAN } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
    gasReporter: {
        enabled: true,
        currency: 'USD',
        coinmarketcap:process.env.ETHERSCAN_API_KEY,
      },
};
