async function main() {

    // This is what allows you to create instances of the contract ProfReview
    const api_test = await ethers.getContractFactory("DummyContract");

    // This is where you actually deploy the contract
    // The parameter profID is what is needed from the website 
    // For test I am just inputing a random profID
    const dummy_contract = await api_test.deploy();

    // This is just to show where this contract is being stored
    console.log("Contract deployed to address: ", dummy_contract.address);
    // Here we need to figure out how to send the address back to website
    // in order to save the address for that specific professor in database


}


 main()
     .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    })