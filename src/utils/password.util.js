const bcrypt = require("bcrypt");

const generateHash = (str) => bcrypt.hash(str, 10);

module.exports = { generateHash };
