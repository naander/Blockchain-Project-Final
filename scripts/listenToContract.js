
const ethers  = require("ethers");
const contractABI = require("../ABIs/ABI_TEST_1.json");
require('dotenv').config();
const utils = require("util")

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ALCHEMY_WEBSOCKET = process.env.ALCHEMY_WEBSOCKET;


async function main() {
    const address  = CONTRACT_ADDRESS;

    const alchemyProvider = new ethers.providers.WebSocketProvider(
        `wss://eth-goerli.g.alchemy.com/v2/2weKkQ426LualTuW1XrCkDRyOOj284BH`
    );

    const profReviewContract = new ethers.Contract(address, contractABI, alchemyProvider);


    // I still haven't gotten this to work
    const init = async () => {
        await profReviewContract.on("UpdateReviews", (newReviews, newRating, event) => {
        
            console.log("Test Message");

            let info = { 
                newReviews: newReviews,
                newRating: newRating,
                data: event
            };

        console.log(JSON.stringify(info, null, 3));
        });
    };
    console.log("Test Message");

}

main()

// By using filters I can get all of the data from the events in etherscan
    // but it is not like listening for events.

    // console.log(profReviewContract.filters);

    // const filter = profReviewContract.filters.UpdateReviews(null, null);
    // console.log(filter);

    // const results = await profReviewContract.queryFilter(filter);
    // console.log(results);

    // filter = {
    //     address: 
    //     CONTRACT_ADDRESS,
    //     topics: [("UpdateReviews(string,uint)")]
    // }