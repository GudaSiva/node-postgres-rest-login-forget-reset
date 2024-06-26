const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require("./auth.controller");

module.exports = { signUp, login, forgotPassword, resetPassword };
