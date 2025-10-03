
const dotenv = require("dotenv");
require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // your 16-char App Password
    },
});

module.exports = transporter; // ✅ export correctly
