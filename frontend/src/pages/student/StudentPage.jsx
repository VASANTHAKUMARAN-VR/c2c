import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaEdit, FaBell, FaSignOutAlt } from "react-icons/fa";

const StudentPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();   // ✅ initialize navigate here

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile">
          <img
            src={user.profileImage || "https://th.bing.com/th/id/OIP.F977i9e7dMrznvOT8q8azgHaEf?w=302&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
            alt={user.name}
            className="profile-img"
          />
          <h3>{user.name || "Student Name"}</h3>
          <p>{user.email || "student@example.com"}</p>
        </div>
        <nav>
          <ul>
          <li><FaTachometerAlt /> Dashboard</li>
<li onClick={() => navigate("/profile/view")}><FaUser /> My Profile</li>
<li onClick={() => navigate("/profile")}><FaEdit /> Update Profile</li>
<li onClick={() => navigate("/NoticePage")}><FaBell /> Post Approvals</li>
<li onClick={() => { localStorage.clear(); window.location.href = "/" }}>
  <FaSignOutAlt /> Log Out
</li>
            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-section">
          <h1>Welcome back, {user.name || "Student"}!</h1>
          <p className="welcome-subtitle">Here's what's happening with your career journey today.</p>
        </div>

        <div className="cards">
          <div className="card" onClick={() => navigate("/profile")}>
            <div className="card-icon">👤</div>
            <div className="card-title">update profile</div>
            <div className="card-description">
              Update your personal information, skills, and academic details
            </div>
            <div className="card-action">Manage Profile</div>
          </div>

       

          <div className="card" onClick={() => navigate("/profile/view")}>
        <div className="card-icon">📄</div>
        <div className="card-title">View Profile Data</div>
        <div className="card-description">
          Profile Details
        </div>
        <div className="card-action">View Now</div>
      </div>

      <div className="card" onClick={() => navigate("/NoticePage")}>
  <div className="card-icon">📝</div>
  <div className="card-title">Post Approvals</div>
  <div className="card-description">
    Approve or reject internship notices submitted by companies
  </div>
  <div className="card-action">Go to Approvals</div>
</div>

        </div>
      </main>
    </div>
  );
};

export default StudentPage;
