const express = require("express");
const cors = require("cors");
const app = express();

const { OAuth2Client } = require('google-auth-library');

// Nate changes: there are different exports now
const {
  addReview,
  getReviews,
} = require("./contract");

const { db } = require("./database");

const { isHateSpeech } = require("./ApiServices/index");

app.use(cors()); 
app.use(express.json());

//set-up google authentication
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

// verify user
const verifyUser = async (idToken, suffix) => {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    userEmail = payload.email;
    console.log(userEmail);

    if (!userEmail.endsWith(suffix)) {
      return null;
    }
    console.log("Email verification complete!");

  } catch (error) {
    console.log(error);
    return null;
  }
};

//start the server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

//propogate changes from the blockchain to the database
// updateDatabaseOnUserUpdated(); #deprecated

// Nate changes: should this be a different path, the function is in the contract.js
//receive a request to create a new review
app.post("/api/addReview", async (req, res) => {
  // Add review to blockchain contract
  // console.log(req);
  const {  profID, review, rating, googleToken } = req.body;
  console.log( profID, review, rating, googleToken);

  // googleToken - add back to above
  if (verifyUser(googleToken, "@bc.edu") == null) {
    console.log("You have to be signed into the right email");
    res.status(500).json({ success: false, error: "Invalid Google Token" });
    return;
  }
  // else {
  //   console.log("Email verification complete!")
  // }
  // Check if review is hate speech
  const isHate = await isHateSpeech(review);

  if (isHate === -1) {
    res.status(500).json({ success: false, error: "Error calling isHateSpeech" });
    return;
  } else if (isHate === 1) {
    res.status(500).json({ success: false, error: "Review contains hate speech" });
    return;
  }
  console.log("Finished checking hate review, the response is ", isHate); 
  const result = await addReview(profID, review, rating);

  // Nate changes: purpose of this?? Were not dealing with the transaction hash
  if (result.success) {
    res.status(200).json({ success: true, error: "Review successfully added" });
  } else {
    res.status(500).json({ success: false, error: "Error calling updateUser" });
  }
});

// Nate changes: the front end just needs to send a profID for this function, idk what :id is doing
// receive a request to get all reviews for a professor
// What is the point of this line, why do we need a list of all the professors?
// const professors = db.getProfessors(universityID);
// console.log(professors);

app.get("/api/getAllProfessors/", async (req, res) => {
  // Get Professors from the SQLite database
  try {
    const professors = await db.getAllProfessors();
    console.log(professors);
    res.status(200).json(professors);
  } catch (err) {
    console.log("Error in /api/getAllProfessors/:", err);
    res.status(500).json({ success: false, error: "Error getting professors" });
  }
});

app.get("/api/getUniversities", async (req, res) => {
  // Get universities from the SQLite database
  try {
    const universities = await db.getUniversities();
    res.status(200).json(universities);
  } catch (err) {
    console.log("Error in /api/getUniversities", err);
    res.status(500).json({ success: false, error: "Error getting universities" });
  }
});

app.get("/api/getReviews/:id", async (req, res) => {
  const profID = req.params.id;
  // Get reviews from the blockchain 
  try {
    const reviewInformation = await getReviews(profID);
    console.log(reviewInformation)
    res.status(200).json(reviewInformation);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Error getting reviews" });
  }
});
