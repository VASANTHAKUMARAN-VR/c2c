const express = require("express");
const router = express.Router();
const { getEligibleStudents } = require("../controllers/collegeController");

// POST /api/auth/eligible-students
router.post("/eligible-students", getEligibleStudents);

module.exports = router;
