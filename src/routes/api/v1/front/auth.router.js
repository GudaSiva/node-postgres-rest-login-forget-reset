const express = require("express");
const { signUp, login } = require("../../../../controllers");
const { validateInput } = require("../../../../utils/validate.util");
const { signUpSchema } = require("../../../../validations/auth.validation");
const { forgotPassword } = require("../../../../controllers/auth.controller");
const router = express.Router();
router.post("/sign-up", validateInput(signUpSchema), signUp);
router.post("/log-in", login);
router.post("/forgot-password", forgotPassword)
module.exports = router;
