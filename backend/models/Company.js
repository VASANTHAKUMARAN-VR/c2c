const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "company" },
    resetOtp: String,
  resetOtpExpiry: Date
});

module.exports = mongoose.model("Company", companySchema);
