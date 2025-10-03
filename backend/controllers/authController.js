const Student = require("../models/Student");
const College = require("../models/College");
const Company = require("../models/Company");
const StudentProfile = require("../models/StudentProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/sendEmail");
const mongoose = require("mongoose");

// Temporary in-memory OTP storage
const otpStore = {}; // { email: { otp, expiry, name, password, collegeCode } }


// Password validation
const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};


// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);


// ✅ Step 1: Student Signup → Send OTP
exports.studentSignup = async (req, res) => {
  const { name, email, password, collegeCode } = req.body;
  try {

    // Email & password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format" });
    if (!isValidPassword(password)) return res.status(400).json({ error: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character" });


    // Check email & college
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ error: "Email already exists" });

    const existingCollege = await College.findOne({ collegeCode });
    if (!existingCollege) return res.status(400).json({ error: "Invalid college code" });



    // Generate OTP & store temp data
    const otp = generateOtp();
    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000, // 5 minutes
      email,
      name,
      password,
      collegeCode
    };


    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Student Signup",
      text: `Hello ${name},\n\nYour OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent to email. Please verify to complete signup." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Step 2: Verify OTP → Create Account
exports.verifyStudentOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const tempData = otpStore[email];
    if (!tempData) return res.status(400).json({ error: "No signup request found" });

    if (Date.now() > tempData.expiry) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP expired. Please signup again." });
    }

    if (parseInt(otp) !== tempData.otp) return res.status(400).json({ error: "Invalid OTP" });


    // OTP correct → create student account
    const hashedPassword = await bcrypt.hash(tempData.password, 10);

    const student = await Student.create({
      name: tempData.name,
      email: tempData.email,
      password: hashedPassword,
      collegeCode: tempData.collegeCode,
    });

    delete otpStore[email]; // cleanup


    res.status(201).json({ message: "Account created successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ College Signup
exports.collegeSignup = async (req, res) => {
  try {
    const { name, email, collegeCode, password } = req.body;

    // Check if email or collegeCode exists
    const existingCollege = await College.findOne({ $or: [{ email }, { collegeCode }] });
    if (existingCollege) return res.status(400).json({ error: "Email or collegeCode already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const college = await College.create({
      name,
      email,
      collegeCode,
      password: hashedPassword,
    });

    res.status(201).json({ message: "College registered successfully", college });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Company Signup
exports.companySignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) return res.status(400).json({ error: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Company registered successfully", company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Step 1: Find user and determine role
    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      user = await College.findOne({ email });
      role = "college";
    }

    if (!user) {
      user = await Company.findOne({ email });
      role = "company";
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Step 2: Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Step 3: Generate JWT
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Step 4: Prepare response user object
    let responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
      profileImage: user.profileImage || null,
    };

    // ✅ Include collegeCode if role is student or college
    if (role === "student" || role === "college") {
      responseUser.collegeCode = user.collegeCode;
    }

    // Step 5: Send response
    res.json({
      message: "Login successful",
      token,
      role,
      user: responseUser,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// // Create / Update Profile
// exports.createOrUpdateProfile = async (req, res) => {
//     try {
//         const { studentId } = req.body;

//         // If profile already exists → update
//         let profile = await StudentProfile.findOne({ studentId });

//         if (profile) {
//             profile = await StudentProfile.findOneAndUpdate(
//                 { studentId },
//                 req.body,
//                 { new: true }
//             );
//             return res.json({ message: "Profile updated", profile });
//         }

//         // Else create new profile
//         const newProfile = new StudentProfile(req.body);
//         await newProfile.save();

//         res.status(201).json({ message: "Profile created", profile: newProfile });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


// Create or Update Profile
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(studentId))
            return res.status(400).json({ error: "Invalid studentId" });

        let profile = await StudentProfile.findOne({ studentId });

        if (profile) {
            profile = await StudentProfile.findOneAndUpdate({ studentId }, req.body, { new: true });
            return res.json({ msg: "Profile updated successfully", profile });
        }

        const newProfile = new StudentProfile(req.body);
        await newProfile.save();
        res.json({ msg: "Profile created successfully", profile: newProfile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get Profile by studentId
exports.getStudentProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ studentId: req.params.studentId });
        if (!profile) return res.status(404).json({ msg: "Profile not found" });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
