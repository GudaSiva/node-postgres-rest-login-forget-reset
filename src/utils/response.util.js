"use strict";
const i18n = require("i18n");
const { httpStatusCode } = require("../constants");

const successResponse = (
  data,
  message,
  statusCode = httpStatusCode.SUCCESS
) => {
  const result = {};
  result.meta = {
    message: i18n.__(message),
    statusCode,
    messageCode: message,
    status: httpStatusCode.SUCCESS,
  };
  if (data) {
    result.data = data;
  }
  return result;
};

const failedResponse = (
  message,
  error = "",
  statusCode = httpStatusCode.ERROR,
  errorType = httpStatusCode.ERROR
) => {
  const result = {};
  result.meta = {
    message: i18n__(message),
    errorType,
    statusCode,
    status: httpStatusCode.ERROR,
    error: error || i18n.__(message),
  };
  return result;
};

module.exports = { successResponse, failedResponse };
