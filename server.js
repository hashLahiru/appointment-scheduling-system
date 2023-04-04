const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");


const connect = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGO_URL}`)
      .then(() => console.log('Connected!'));
  } catch (error) {
    console.log(error);
  }
};




app.listen(8800, () => {
  connect();
  console.log('Connected to the backend!');
});