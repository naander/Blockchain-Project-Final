const Web3 = require('web3');
const web3 = new Web3("https://eth-goerli.g.alchemy.com/v2/2weKkQ426LualTuW1XrCkDRyOOj284BH");
const contractAddress = "0x1Aea9d1769D40A47caf68541cd8f8034FBcf55b7";
const contractAbi = require("../ABIs/ABI_TEST_DUMMY.json");

const contract = new web3.eth.Contract(contractAbi, contractAddress);


const PAST_EVENT = async () => {

  await contract.getPastEvents('UpdateReviews',
    // This is the parameters for the API to search through the
    // events of that smart contract
    {
        filter: {profID: 2},
        fromBlock: 0,
        toBlock: 'latest'
    },
    (err, events) => {
        let reviewList = [];
        let sum = 0;
        let count = 0;
        // For loop that goes through all the events captured and adds them 
        // to a list and calculates the average rating.
        events.forEach((event) => {
            reviewList.push(event.returnValues.newReviews);
            sum += parseInt(event.returnValues.newRating);
            count++;
        });
        console.log(reviewList);
        console.log("Average Rating: " + (sum / count));
    });
};


PAST_EVENT();
   
