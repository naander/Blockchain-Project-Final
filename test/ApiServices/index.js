const express = require("express")
const {OpenAIApi, Configuration} = require("openai");

// load .env variables
const dotenv = require("dotenv");
dotenv.config();

// set-up OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// console.log(openai);
const isHateSpeech = async (text) => {
  console.log("text:" + text);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "Respond with Yes or No: Does the following text contain hate speech?\n" +
        text,
      max_tokens: 150,
      temperature: 0.4, //lower temperature = more conservative, higher temperature = more creative
    });

    console.log(response.data.choices[0].text);
    return response.data.choices[0].text.trim() === "Yes" ? 1 : 0;
  } catch (error) {
    console.log(error);
    return -1;
  }
};


module.exports = {
  isHateSpeech
};