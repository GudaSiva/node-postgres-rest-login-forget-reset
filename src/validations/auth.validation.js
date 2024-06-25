const joi = require("joi");

const signUpSchema = joi.object({
  first_name: joi.string().min(2).max(30).required().messages({
    "string.base": "FIRST_NAME SHOULD BE A TYPE OF TEXT",
    "string.empty": "FIRST_NAME CANNOT BE AN EMPTY FIELD",
    "string.min": "FIRST_NAME SHOULD HAVE A MINIMUM LENGTH OF {#LIMIT}",
    "string.max": "FIRST_NAME SHOULD HAVE A MAXIMUM LENGTH OF {#LIMIT}",
    "any.required": "FIRST_NAME IS A REQUIRED FIELD",
  }),
  last_name: joi.string().min(2).max(30).required().messages({
    "string.base": "LAST_NAME SHOULD BE A TYPE OF TEXT",
    "string.empty": "LAST_NAME CANNOT BE AN EMPTY FIELD",
    "string.min": "LAST_NAME SHOULD HAVE A MINIMUM LENGTH OF {#LIMIT}",
    "string.max": "LAST_NAME SHOULD HAVE A MAXIMUM LENGTH OF {#LIMIT}",
    "any.required": "LAST_NAME IS A REQUIRED FIELD",
  }),
  email: joi.string().email().required().messages({
    "string.email": "PLEASE ENTER A VALID EMAIL",
    "any.required": "EMAIL IS A REQUIRED FIELD",
  }),
  phone_number: joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.pattern.base": "PHONE_NUMBER SHOULD CONTAIN ONLY DIGITS",
      "string.min": "PHONE_NUMBER SHOULD HAVE A MINIMUM LENGTH OF {#LIMIT}",
      "string.max": "PHONE_NUMBER SHOULD HAVE A MAXIMUM LENGTH OF {#LIMIT}",
      "any.required": "PHONE_NUMBER IS A REQUIRED FIELD",
    }),
  password: joi.string().min(6).required().messages({
    "string.min": "PASSWORD SHOULD HAVE A MINIMUM LENGTH OF {#LIMIT}",
    "any.required": "PASSWORD IS A REQUIRED FIELD",
  }),
});

module.exports = { signUpSchema };
