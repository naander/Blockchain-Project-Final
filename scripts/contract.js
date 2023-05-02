
const Web3 = require("web3");
const web3 = new Web3("https://eth-goerli.g.alchemy.com/v2/s1Q0CixH33Nz6mq-wPeALJvQaz0Ak3a0");
const {ethers} = require("hardhat");

const apiKey = process.env.API_KEY_ALCHEMY;
const privateKey = process.env.PRIVATE_KEY;

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractJSON = require("../artifacts/contracts/ProfReview.sol/ProfReview.json");

// Get Alchemy provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", apiKey);
// Get Signer
const signer = new ethers.Wallet(privateKey, alchemyProvider);



const contractAdd = new ethers.Contract(contractAddress, contractJSON.abi, signer);

// Function that is called to add a review to the blockchain

const addReview = async (profID, review, rating) => {
  try {

    console.log("Adding the review: " + review + "  Rating: " + rating);
    console.log("Hello Dobe");
    // const tx = await contractAdd.addReview(profID, review, rating).catch(error => {
    //   throw new Error('might not have enough gas for transactions');
    // });
    const tx = await contractAdd.addReview(profID, review, rating)
    console.log("The review has been added");
    
    return { success: true};

  } catch (error) {

    console.error("Error calling addReview: ", error);
    return { success: false, error: "Error calling addReview" };

  }
};


const contractGet = new web3.eth.Contract(contractJSON.abi, contractAddress);

// API that retrieves the specific reviews for the professor

const getReviews = async (profID) => {

  let reviewList = [];
  let average = 0;
  let sum = 0;
  let count = 0;

  await contractGet.getPastEvents('UpdateReviews',
    // This is the parameters for the API to search through the
    // events of that smart contract
    {
        filter: {profID: profID},
        fromBlock: 0,
        toBlock: 'latest'
    },
    (err, events) => {
        // For loop that goes through all the events captured and adds them 
        // to a list and calculates the average rating.
        events.forEach((event) => {
            reviewList.push(event.returnValues.newReviews);
            sum += parseInt(event.returnValues.newRating);
            count++;
        });
        average = (sum / count);
    });
    return {reviewList: reviewList, average: average};

};


addReview(2, "Professor Tseng was too harsh of a grader", 4);

// getReviews(2).then((result) => {
//   let myList = result.reviewList;
//   let myAvg = result.average;
//   console.log(myList);
//   console.log(myAvg);
// });


// module.exports = {
//   //updateDatabaseOnReviewAdded,
//   addReview,
//   getReviews
// };

