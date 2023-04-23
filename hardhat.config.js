/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");


const { API_URL_ALCHEMY, PRIVATE_KEY } = process.env;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "goerli",
  networks: {
      hardhat: {},
      goerli: {
         url: API_URL_ALCHEMY,
         accounts: [`0x${PRIVATE_KEY}`]
      }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
}