const ethers  = require("ethers");
const contractABI = require("../ABIs/ABI_GOERLI_TEST.json");
require('dotenv').config();



async function main() {
    const address = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

    const alchemyProvider = new ethers.providers.WebSocketProvider(
        `wss://eth-goerli.g.alchemy.com/v2/2weKkQ426LualTuW1XrCkDRyOOj284BH`
    );

    const contract = new ethers.Contract(address, contractABI, alchemyProvider);

    contract.on("Upgraded", (implementatino) => {
        let info = {      
            implementation: implementatino
        };

        console.log(JSON.stringify(info, null, 4));
    });


}

main()
   
