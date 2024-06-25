"use strict";
const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const UUID = require("uuid");
const { httpsStatusCodes, httpResponses } = require("../constants");
const { User, UserToken, ForgetPasswordToken } = require("../models/postgres");
const { successResponse, errorResponse } = require("../utils/response.util");
const { jwtConfig } = require("../configs/jwt.config");
const sendEmail = require("../utils/send-email.util");
const DateFormat = "YYYY-MM-DD HH:mm:ss";
function dayToInt(day) {
  return parseInt(day, 10);
}

// register User
const signUp = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    //jf user exists
    const userExits = await User.findOne({ where: { email } });
    if (userExits) {
      return res.json(errorResponse("USER_ALREADY_EXISTS"));
    }
    //creating user details to the database
    const userCreate = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      password,
    });
    // Prepare response data by excluding id, password, and deleted_at
    const responseData = {
      uuid: userCreate.uuid,
      gender: userCreate.gender,
      user_type: userCreate.user_type,
      status: userCreate.status,
      is_email_verified: userCreate.is_email_verified,
      first_name: userCreate.first_name,
      last_name: userCreate.last_name,
      email: userCreate.email,
      phone_number: userCreate.phone_number,
      updated_at: userCreate.updated_at,
      created_at: userCreate.created_at,
    };
    return res.json(
      successResponse(
        responseData,
        "USER_CREATED_SUCCESSFULLY",
        httpsStatusCodes.CREATED,
        httpResponses.CREATED
      )
    );
  } catch (error) {
    return res.json(
      errorResponse("SOME_THING_WENT_WRONG_WHILE_CREATING_SIGN_UP")
    );
  }
};

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Generate Unique Tokens
    const tokenUUID = crypto.randomUUID();
    const refreshTokenUUID = crypto.randomUUID();
    const userDetails = await User.findOne({ where: { email } });
    if (!userDetails) {
      return res.json(
        errorResponse(
          "INVALID_USER_DETAILS",
          httpsStatusCodes.NOT_FOUND,
          httpResponses.NOT_FOUND
        )
      );
    }
    const jwtToken = jwt.sign(
      {
        email: userDetails.email,
        id: userDetails.id,
        tokenUUID,
      },
      jwtConfig.jwtSecret,
      { expiresIn: jwtConfig.tokenExpiration }
    );
    // Calculate Access Token Expiration Time
    const expirationTime = moment(
      jwt.verify(jwtToken, jwtConfig.jwtSecret).exp * 1000
    ).format(DateFormat);

    // Calculate Access Token Expiration in Seconds
    const expiresIn =
      moment(jwt.verify(jwtToken, jwtConfig.jwtSecret).exp * 1000).unix() -
      moment().unix();

    // Generate Refresh Token with User Info and Refresh Token UUID
    const refreshToken = jwt.sign(
      { email: userDetails.email, id: userDetails.id, refreshTokenUUID },
      jwtConfig.refreshJwtSecretKey,
      {
        expiresIn: jwtConfig.refreshTokenExpiration,
      }
    );
    // Calculate Refresh Token Expiration Time
    const refreshTokenTime = moment(
      jwt.verify(refreshToken, jwtConfig.refreshJwtSecretKey).exp * 1000
    ).format(DateFormat);
    let response = {
      userDetails,
      token: jwtToken,
      refreshToken,
      expiresIn,
      expiresAt: expirationTime,
    };
    await UserToken.create({
      user_id: userDetails.id,
      token_uuid: tokenUUID,
      token_expireAt: expirationTime,
      refresh_token_uuid: refreshTokenUUID,
      refresh_token_expireAt: refreshTokenTime,
    });
    return res.json(successResponse(response, "LOGGED_IN_SUCCESSFULLY"));
  } catch (error) {
    return res.json(errorResponse("SOME_THING_WENT_WRONG_WHILE_LOGIN"));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Calculate Password Reset Token Expiration Time
    const todayDate = moment();
    const passwordExpiration = dayToInt(jwtConfig.forgotPasswordExpiration);
    const expiresAtDate = todayDate
      .add(passwordExpiration, "days")
      .format(DateFormat);
    const expiresAtResponse = moment(expiresAtDate).format(DateFormat);

    // Generate Unique Token UUID
    const tokenUUID = UUID.v4();

    // Find User based on Search Criteria
    const user = await User.findOne({ where: { email } });

    // Handle User Not Found
    if (!user) {
      return res.json(
        errorResponse(
          "USER_DOES_NOT_EXIST",
          httpsStatusCodes.NOT_FOUND,
          httpResponses.NOT_FOUND
        )
      );
    }
    // Generate Forgot Password JWT Token with User Email and Token UUID
    const jwtToken = jwt.sign(
      { email: user.email, tokenUUID },
      jwtConfig.forgotPasswordSecretKey,
      {
        expiresIn: jwtConfig.forgotPasswordExpiration,
      }
    );

    // Prepare Forgot Password Response
    const response = {
      token: jwtToken,
      expiresAt: expiresAtResponse,
    };

    // Construct Email Subject and Template
    const subject = "Password assistance";

    let resetPassUrl = `reset-password?token=${jwtToken}`;
    let emailTemplate = fs.readFileSync(
      "resources/views/template/forgot-password-email.template.html",
      "utf8"
    );
    // Personalize Email Template with User Name and Reset Link
    emailTemplate = emailTemplate.replace(
      "##first_name##",
      user.first_name !== undefined ? " " + user.first_name : ""
    );
    emailTemplate = emailTemplate.replace(
      "##last_name##",
      user.last_name !== undefined ? " " + user.last_name : ""
    );
    emailTemplate = emailTemplate.replace(
      /"##resetLink##"/g,
      resetPassUrl !== undefined ? resetPassUrl : ""
    );

    // Save Forgot Password Token Information
    await ForgetPasswordToken.create({
      token_uuid: tokenUUID,
      expiresAt: expiresAtDate,
      is_active: true,
    });

    // Send Forgot Password Email
    sendEmail(user.email, subject, emailTemplate);
    return res.json(
      successResponse(
        response,
        "RESET_PASSWORD_EMAIL_SENT_SUCCESSFULLY",
        httpsStatusCodes.SUCCESS
      )
    );
  } catch (error) {
    console.log(/error/, error);
    return res.json(
      errorResponse(
        error ? error.message : "SOME_ERR_OCCUR_WHILE_FORGOT_PASSWORD",
        httpsStatusCodes.INTERNAL_SERVER_ERROR,
        httpResponses.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

module.exports = { signUp, login, forgotPassword };
