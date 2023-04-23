// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.18;

contract ProfReview {

    address private owner;

    event UpdateReviews(uint indexed profID, string newReviews, uint newRating);

    // Constructor grabs the contract creator's address
    constructor() {
        owner = msg.sender;
    }

    // What keeps other people from calling the addReview function
    modifier checkSender() { 
        require(msg.sender == owner, "Only the owner can call this function!");
        _;
        // Underscore is a convention to show no parameters being used
    }

   // Adding the individual reviews for a specific professor 
   function addReview(uint _profID, string memory _newReview, uint _newRating) public checkSender {
        emit UpdateReviews(_profID, _newReview, _newRating);
   }

   
}
