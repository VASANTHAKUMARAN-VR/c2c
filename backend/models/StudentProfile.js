const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    name: String,
    registerNumber: String,
    degreeBranch: String,
    dob: Date,
    gender: String,
    primaryEmail:String,
    secondaryEmail: String,
    mobileNumber: String,
    address: String,

    semesterScores: [Number],
    ugCgpa: Number,
    arrearStatus: String,
    noOfArrear: Number,
    education: [
        {
            course: String,
            institution: String,
            percentage: Number,
            yearOfPassing: String,
        }
    ],

    languagesKnown: String,
    skillset: String,
    profilePic: { type: String },
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
