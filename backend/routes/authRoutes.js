const express = require("express");
const router = express.Router();
const { studentSignup,
        unifiedLogin,
        companySignup,
        collegeSignup,
        createOrUpdateProfile,
        getStudentProfile,
        verifyStudentOtp
    } = require("../controllers/authController"); 

//unifiedLogin
router.post("/login", unifiedLogin);
// Student
router.post("/student/signup", studentSignup);

// College
router.post("/college/signup", collegeSignup); // ✅ New

// Company
router.post("/company/signup", companySignup); // ✅ New


router.post("/profile", createOrUpdateProfile); // create or update
router.get("/profile/:studentId", getStudentProfile); // get profile

// Student OTP Signup
router.post("/student/verify-otp", verifyStudentOtp);


module.exports = router;
