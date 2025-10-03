const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const cors = require("cors");
const mongoose = require("mongoose");
const Company = require("./models/Company");
const path = require("path");
// Load environment variables
dotenv.config();

// Connect to MongoDB first
connectDB().then(async () => {
  // Fetch companies after connection
  try {
    const companies = await Company.find({}, "_id name");
  } catch (err) {
    console.error(err);
  }
});

const app = express();
app.use(express.json());

// ✅ Enable CORS
app.use(
  cors({
    origin: "http://localhost:4000", // React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Register Routes
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const forgetRoutes = require("./routes/forgetRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/auth", companyRoutes);
app.use("/api/auth", noticeRoutes);
app.use("/api/auth", forgetRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
