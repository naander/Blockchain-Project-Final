// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.18;

contract ProfReview {

    // I just added the indexed part, that isn't in the contract I deployed
    // Idk if that is going to have an effect
    event UpdateReviews(string indexed newReviews, uint newRating);

    // state variable
    uint public profID;
    uint public profRating;

    // The only variable that is required when deploying the contract is profID
    constructor (uint initprofID) {
        profID = initprofID;
        profRating = 4;
    }



   // updating the reviews by just replacing the last review
   function addReview(string memory _newReview, uint _newRating) public {
        emit UpdateReviews(_newReview, _newRating);
        profRating = _newRating;
   }

   


}
