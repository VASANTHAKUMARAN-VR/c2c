const Student = require("../models/Student");
const Company = require("../models/Company");
const College = require("../models/College");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// --------------------------
// 🔹 Forgot Password - Send OTP
// --------------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user in Student, Company, or College
    let user =
      (await Student.findOne({ email })) ||
      (await Company.findOne({ email })) ||
      (await College.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------
// 🔹 Reset Password with OTP
// --------------------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user in any collection
    let user =
      (await Student.findOne({ email })) ||
      (await Company.findOne({ email })) ||
      (await College.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP expiry
    if (user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------
// 🔹 Automatic OTP Cleanup (run once in server.js)
// --------------------------
const cleanupExpiredOtps = async () => {
  const now = Date.now();
  await Student.updateMany(
    { resetOtpExpiry: { $lt: now } },
    { $set: { resetOtp: null, resetOtpExpiry: null } }
  );
  await Company.updateMany(
    { resetOtpExpiry: { $lt: now } },
    { $set: { resetOtp: null, resetOtpExpiry: null } }
  );
  await College.updateMany(
    { resetOtpExpiry: { $lt: now } },
    { $set: { resetOtp: null, resetOtpExpiry: null } }
  );
};

// Run cleanup every 1 minute
setInterval(cleanupExpiredOtps, 60 * 1000);
