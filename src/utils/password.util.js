const bcrypt = require("bcrypt");

const generateHash = bcrypt.hash(str, 10);

module.exports = { generateHash };
