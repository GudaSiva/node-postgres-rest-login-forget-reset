"use strict";
require("dotenv").config();
const express = require("express");
const globalConfig = require("./src/configs/global.config");
const app = express();

app.use("/api/v1", express.static("public"), require("./src/routes/api/v1"));

app.listen(globalConfig.port, () => {
  console.log(`Server is running on port ${globalConfig.port}`);
});

module.exports = app