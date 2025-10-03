import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [profile, setProfile] = useState({
    studentId: user.id,
    name: user.name || "",
    registerNumber: "",
    degreeBranch: "",
    dob: "",
    gender: "",
    secondaryEmail: "",
    mobileNumber: "",
    address: "",
    semesterScores: Array(8).fill(""),
    ugCgpa: "",
    arrearStatus: "No",
    noOfArrear: 0,
    education: [
      { course: "", institution: "", percentage: "", yearOfPassing: "" },
    ],
    languagesKnown: "",
    valueAddedCourses: "",
    skillset: "",
    profilePic: "",
  });

  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://c2c-4fy4.onrender.com/api/auth/profile/${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setProfile((prev) => ({ ...prev, ...data }));
          setEditing(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user.id) fetchProfile();
  }, [user.id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSemesterChange = (index, value) => {
    const updatedScores = [...profile.semesterScores];
    updatedScores[index] = value;
    setProfile({ ...profile, semesterScores: updatedScores });
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...profile.education];
    updatedEducation[index][name] = value;
    setProfile({ ...profile, education: updatedEducation });
  };

  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        { course: "", institution: "", percentage: "", yearOfPassing: "" },
      ],
    });
  };

  // Submit to backend
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://c2c-4fy4.onrender.com/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (data.profile) {
      setProfile(data.profile);
      setEditing(true);
      setMessage(data.msg);
    } else {
      setMessage("Error saving profile");
    }
  };

  return (
    <div className="profile-page">
      <h2>{editing ? "Edit Profile" : "Create Profile"}</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleProfileSubmit}>
        <h3>Personal Info</h3>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="registerNumber"
          value={profile.registerNumber}
          onChange={handleChange}
          placeholder="Register Number"
        />
        <input
          name="degreeBranch"
          value={profile.degreeBranch}
          onChange={handleChange}
          placeholder="Degree & Branch"
        />
        <input
          type="date"
          name="dob"
          value={profile.dob ? profile.dob.substring(0, 10) : ""}
          onChange={handleChange}
        />
        <select name="gender" value={profile.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="secondaryEmail"
          value={profile.secondaryEmail}
          onChange={handleChange}
          placeholder="Secondary Email"
        />
        <input
          name="mobileNumber"
          value={profile.mobileNumber}
          onChange={handleChange}
          placeholder="Mobile Number"
        />
        <input
          name="address"
          value={profile.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <h3>Academic Background</h3>
        {profile.semesterScores?.map((score, i) => (
          <input
            key={i}
            type="number"
            value={score || ""}
            onChange={(e) => handleSemesterChange(i, e.target.value)}
            placeholder={`Sem ${i + 1}`}
          />
        ))}
        <input
          name="ugCgpa"
          type="number"
          value={profile.ugCgpa || ""}
          onChange={handleChange}
          placeholder="UG CGPA"
        />
        <select
          name="arrearStatus"
          value={profile.arrearStatus}
          onChange={handleChange}
        >
          <option value="No">No Arrears</option>
          <option value="Yes">Has Arrears</option>
        </select>
        <input
          name="noOfArrear"
          type="number"
          value={profile.noOfArrear || 0}
          onChange={handleChange}
          placeholder="No. of Arrears"
        />

        <h4>Education History</h4>
        {profile.education?.map((edu, i) => (
          <div key={i}>
            <input
              name="course"
              value={edu.course}
              onChange={(e) => handleEducationChange(i, e)}
              placeholder="Course"
            />
            <input
              name="institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(i, e)}
              placeholder="Institution"
            />
            <input
              name="percentage"
              value={edu.percentage}
              onChange={(e) => handleEducationChange(i, e)}
              placeholder="Percentage"
            />
            <input
              name="yearOfPassing"
              value={edu.yearOfPassing}
              onChange={(e) => handleEducationChange(i, e)}
              placeholder="Year of Passing"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddEducation}>
          Add Education
        </button>

        <h3>Other Details</h3>
        <input
          name="languagesKnown"
          value={profile.languagesKnown}
          onChange={handleChange}
          placeholder="Languages Known"
        />
        <input
          name="valueAddedCourses"
          value={profile.valueAddedCourses}
          onChange={handleChange}
          placeholder="Value Added Courses"
        />
        <input
          name="skillset"
          value={profile.skillset}
          onChange={handleChange}
          placeholder="Skillset"
        />

        <button type="submit">
          {editing ? "Update Profile" : "Submit Profile"}
        </button>
      </form>

      {/* Back Button */}
      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/student")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default CreateProfilePage;
