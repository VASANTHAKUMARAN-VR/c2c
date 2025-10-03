const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    collegeCode: { type: String, required: true },
    role: { type: String, default: "student" },
    resetOtp: String,
  resetOtpExpiry: Date
});

module.exports = mongoose.model("Student", studentSchema);

