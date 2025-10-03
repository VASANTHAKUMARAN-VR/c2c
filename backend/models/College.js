const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    collegeCode: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "college" },
    resetOtp: String,
  resetOtpExpiry: Date
});

module.exports = mongoose.model("College", collegeSchema);
