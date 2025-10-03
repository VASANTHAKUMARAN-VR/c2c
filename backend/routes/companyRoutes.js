const express = require("express");
const router = express.Router();
const { getEligibleStudents } = require("../controllers/companyController");

router.post("/eligible-students", getEligibleStudents);

module.exports = router;
