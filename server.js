"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3031;

app.get("/", (req, res) => {
  res.status(201).json({
    status: "Success!",
    message: "Wow API is running"
  })
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
