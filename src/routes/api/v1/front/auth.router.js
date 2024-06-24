const express = require("express");
const { signUp } = require("../../../../controllers");
const router= express.Router()
router.post("/sign-up",signUp)

module.exports = router