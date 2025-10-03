const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  approvedColleges: { type: [String], default: [] },   // ✅ add this
  rejectedColleges: { type: [String], default: [] },   // ✅ add this
}, { timestamps: true });

module.exports = mongoose.model("Notice", NoticeSchema);
