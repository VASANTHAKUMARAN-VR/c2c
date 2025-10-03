import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user.id) return;
      try {
        const res = await fetch(
          `https://c2c-4fy4.onrender.com/api/auth/profile/${user.id}`
        );
        if (!res.ok) {
          console.log("Profile not found");
          return;
        }
        const data = await res.json();
        const profileData = data?.profile || data || {};

        const cleanedProfile = { ...profileData };
        delete cleanedProfile._id;
        delete cleanedProfile.studentId;
        delete cleanedProfile.__v;

        cleanedProfile.semesterScores = Array.isArray(
          cleanedProfile.semesterScores
        )
          ? cleanedProfile.semesterScores
          : [];

        cleanedProfile.education = Array.isArray(cleanedProfile.education)
          ? cleanedProfile.education.map((edu) => {
              const { _id, ...rest } = edu || {};
              return rest;
            })
          : [];

        setProfile(cleanedProfile);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [user.id]);

  if (!profile || Object.keys(profile).length === 0)
    return <p>Loading profile...</p>;

  return (
    <div className="profile-view">
      <h2>Profile Details</h2>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <tbody>
          {Object.entries(profile).map(([key, value]) => (
            <tr key={key}>
              <td style={{ fontWeight: "bold", verticalAlign: "top" }}>
                {key}
              </td>
              <td>
                {key === "semesterScores"
                  ? (value || []).map((v) => (v === null ? "" : v)).join(", ")
                  : key === "education"
                  ? (value || []).map((edu, idx) => (
                      <div key={idx} style={{ marginBottom: "8px" }}>
                        {Object.entries(edu).map(([k, v]) => (
                          <div key={k}>
                            {k}: {v || "N/A"}
                          </div>
                        ))}
                      </div>
                    ))
                  : value || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/student")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default ViewProfilePage;
