const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/forgetController");

router.post("/forgot-password", forgotPassword);   // Step 1: Send OTP
router.post("/reset-password", resetPassword);     // Step 2: Verify & Update

module.exports = router;
