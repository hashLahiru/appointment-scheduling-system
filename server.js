const express = require("express");
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const officerRoute = require("./routes/officersRoute");
const path = require("path");
const cors = require("cors");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/officer", officerRoute);

  // app.use("/", express.static("client/build"));

  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  // });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Node Express Server Started at ${port}!`)); 
