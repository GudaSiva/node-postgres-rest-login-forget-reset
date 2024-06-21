"use strict"
const signUp = async (req, res, next) => {
  res.json({
    status: "Success",
    message: "Success Message",
  });
};

module.exports = { signUp };
