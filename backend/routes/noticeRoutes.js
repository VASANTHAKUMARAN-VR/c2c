const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // for image upload

const {
  uploadNotice,
  approveNotice,
  getCompanyNotices,
  getCollegeNotices,
  getStudentNotices,
  updateNotice,
  deleteNotice,
  rejectNotice

} = require("../controllers/noticeController");

// 🔹 Company posts a notice (with optional image)
router.post("/company/:companyId/notice", upload.single("image"), uploadNotice);

// 🔹 College approves a notice
router.post("/notice/:noticeId/approve", approveNotice);

// 🔹 Get all notices for a company page
router.get("/company/:companyId/notices", getCompanyNotices);

// 🔹 Get all notices approved for a college page
router.get("/college/:collegeCode/notices", getCollegeNotices);

// 🔹 Get notices for a student page
router.get("/student/:collegeCode/notices", getStudentNotices);

// 🔹 Update a notice (Company updates)
router.put("/notice/:noticeId", upload.single("image"), updateNotice);

// 🔹 Delete a notice (Company deletes)
router.delete("/notice/:noticeId", deleteNotice);

router.post("/notice/:noticeId/reject", rejectNotice);

module.exports = router;
