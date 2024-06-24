"use strict";
const { User } = require("../models/postgres");
const signUp = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    //jf user exists
    const userExits = await User.findOne({ where: { email } });
    if (userExits) {
      return res.json({
        message: "User already Exists",
      });
    }
    //creating user sign up to the database
    const userCreate = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      password,
    });
    if (!userCreate) {
      return res.status(400).json({
        status: "failed",
        message: "Some thing went wrong",
      });
    }
    return res.json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "Some thing went wrong while creating user",
    });
  }
};

module.exports = { signUp };
