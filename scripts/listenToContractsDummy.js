const ethers  = require("ethers");
const contractABI = require("../ABIs/ABI_DOGE.json");
require('dotenv').config();



async function main() {
    const address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const alchemyProvider = new ethers.providers.WebSocketProvider(
        `wss://eth-mainnet.g.alchemy.com/v2/rvlsQBj2ktX3iFwme9pllv2ecTNZ6zRn`
    );

    const contract = new ethers.Contract(address, contractABI, alchemyProvider);

    contract.on("Transfer", (from, to, value, event) => {
        let info = {      
            value: ethers.utils.formatUnits(value,6)
        };

        console.log(JSON.stringify(info, null, 4));
    });


}

main()
   
