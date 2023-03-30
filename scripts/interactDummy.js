    const API_KEY = process.env.API_KEY;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    // This is where we need to input the previous address of the contract from 
    // the database.


    const {ethers} = require("hardhat");
    const contract = require("../artifacts/contracts/API_TEST.sol/DummyContract.json");

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);

    // Signier - us
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // Contract instance
    // This tells our script that anytime we interact with the already deployed 
    // it will be interacting with the contract at the specific address, will have the abi
    // interface, and it will be the woner of the metamask who is interacting with it.
    const dummyContract = new ethers.Contract("0xc003b4c0807c85337E4218c730F251746203A1b9", contract.abi, signer);

async function main() {



  

    



    // The course ID that corresponds with the review should already be in the 
    // input from the back end.
    const tx = await dummyContract.transfer("0x5E4B0eb0F38386b1d3585c7bB375774F3aec80E7", 27);
    await tx.wait();

    console.log("Current value is: " + 15);

    
}


main()
    .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });