const Notice = require("../models/Notice");
const Student = require("../models/Student");

// 🔹 Company posts a notice
exports.uploadNotice = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? req.file.filename : null;

        const notice = await Notice.create({
            companyId: req.params.companyId,
            title,
            description,
            image,
            approvedColleges: [] // initially empty, colleges will approve
        });

        res.status(201).json({ message: "Notice posted successfully", notice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Get notices for Company Page (all notices by company)
exports.getCompanyNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ companyId: req.params.companyId });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get pending notices for a specific college
exports.getCollegeNotices = async (req, res) => {
  try {
    const { collegeCode } = req.params;

    const notices = await Notice.find({
      approvedColleges: { $ne: collegeCode },
      rejectedColleges: { $ne: collegeCode }
    }).populate("companyId");

    res.json(notices);
  } catch (err) {
    console.error("Error fetching college notices:", err);
    res.status(500).json({ error: "Server error" });
  }
};





exports.getStudentNotices = async (req, res) => {
  try {
    const { collegeCode } = req.params;

    const notices = await Notice.find({
      approvedColleges: { $in: [String(collegeCode)] },  // ✅ ensures match
    })
      .populate("companyId", "name")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student notices" });
  }
};




// 🔹 Update notice (Company updates, reflects to College and Student)
exports.updateNotice = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const notice = await Notice.findById(req.params.noticeId);
        if (!notice) return res.status(404).json({ message: "Notice not found" });

        notice.title = title || notice.title;
        notice.description = description || notice.description;
        if (image) notice.image = image;

        await notice.save();

        res.json({ message: "Notice updated successfully", notice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.noticeId);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    // Optional: Delete uploaded image file
    if (notice.image) {
      const fs = require("fs");
      const path = `uploads/${notice.image}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }

    // Fully delete the notice document
    await Notice.findByIdAndDelete(req.params.noticeId);

    // ✅ No need to touch approvedColleges or rejectedColleges arrays
    // Because deleting the document removes all references automatically

    res.json({ message: "Notice deleted successfully from Company, College, and Student pages" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// ✅ Approve notice
exports.approveNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { collegeCode } = req.body;

    const notice = await Notice.findById(noticeId);
    if (!notice) return res.status(404).json({ error: "Notice not found" });

    if (!notice.approvedColleges.includes(collegeCode)) {
      notice.approvedColleges.push(collegeCode);
    }

    await notice.save();
    res.json({ message: "Notice approved successfully", notice });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Reject notice
exports.rejectNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { collegeCode } = req.body;

    const notice = await Notice.findById(noticeId);
    if (!notice) return res.status(404).json({ error: "Notice not found" });

    if (!notice.rejectedColleges.includes(collegeCode)) {
      notice.rejectedColleges.push(collegeCode);
    }

    await notice.save();
    res.json({ message: "Notice rejected successfully", notice });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
