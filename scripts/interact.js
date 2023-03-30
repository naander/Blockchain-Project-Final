const API_KEY = process.env.API_KEY;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    // This is where we need to input the previous address of the contract from 
    // the database.
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;


    const {ethers} = require("hardhat");
    const contract = require("../artifacts/contracts/ProfReview.sol/ProfReview.json");

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);

    // Signier - us
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // Contract instance
    // This tells our script that anytime we interact with the already deployed 
    // it will be interacting with the contract at the specific address, will have the abi
    // interface, and it will be the woner of the metamask who is interacting with it.
    const profReviewContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {



    // Updates Rank 
    const rating = await profReviewContract.profRating();
    console.log("The current rating is: " + rating);

    // This is where we get the number of reviews and the new rank from the back end
    const num_reviews = 2;
    const newRating = 3;
    // Need to add one at the end because ints round down
    input_rating = (Math.floor(((rating * num_reviews) + newRating) / (num_reviews + 1)) + 1);



    console.log("Updating the reviews ...");
    // This is where we get the review from the website and create a variable
    // The course ID that corresponds with the review should already be in the 
    // input from the back end.
    const input_review = "I hate professor John. (CSCI3389)";
    const tx = await profReviewContract.addReview(input_review, input_rating);
    await tx.wait();

    const currentRating = await profReviewContract.profRating();
    console.log("The professors new rating is: " + currentRating);

    
}


main()
    .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });