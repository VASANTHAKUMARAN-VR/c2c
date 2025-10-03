const StudentProfile = require("../models/StudentProfile");
const ExcelJS = require("exceljs");

// Get eligible students and optionally export Excel
exports.getEligibleStudents = async (req, res) => {
    try {
        const { skill, ugCgpa } = req.body;

        if (!skill || !ugCgpa) {
            return res.status(400).json({ error: "Skill and UG CGPA are required" });
        }

        // Find eligible students
        const eligibleStudents = await StudentProfile.find({
            skillset: { $regex: `\\b${skill}\\b`, $options: "i" },
            ugCgpa: { $gte: ugCgpa }
        }).populate("studentId", "name email mobileNumber");

        if (!eligibleStudents.length) {
            return res.status(404).json({ message: "No eligible students found" });
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Eligible Students");

        // Define columns
        worksheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Mobile", key: "mobile", width: 15 },
            { header: "Skillset", key: "skillset", width: 50 },
            { header: "UG_CGPA", key: "ugCgpa", width: 10 }
        ];

        // Add rows
        eligibleStudents.forEach(student => {
            worksheet.addRow({
                name: student.name,
                email: student.email,
                mobile: student.mobileNumber,
                skillset: student.skillset,
                ugCgpa: student.ugCgpa
            });
        });

        // Send Excel file as response
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=eligible_students.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

