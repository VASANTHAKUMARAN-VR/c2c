// import React, { useEffect, useState } from "react";

// const CompanyDashboard = () => {
//   const user = JSON.parse(localStorage.getItem("user")) || {}; // company info
//   const companyId = user._id || user.id; // ensure correct ID

//   const [notices, setNotices] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // Fetch all notices posted by this company
//   const fetchNotices = async () => {
//     if (!companyId) return;
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/auth/company/${companyId}/notices`
//       );
//       const data = await res.json();
//       setNotices(data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchNotices();
//   }, [companyId]);

//   // Handle file selection
//   const handleFileChange = (e) => setImageFile(e.target.files[0]);

//   // Handle posting notice
//   const handlePostNotice = async (e) => {
//     e.preventDefault();
//     if (!title || !description) return alert("Title and description required");
//     if (!companyId) return alert("Company ID missing");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     if (imageFile) formData.append("image", imageFile);

//     setUploading(true);
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/auth/company/${companyId}/notice`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await res.json();
//       if (data.notice) {
//         alert("Notice posted successfully");
//         setTitle("");
//         setDescription("");
//         setImageFile(null);
//         fetchNotices(); // refresh list
//       } else {
//         alert("Failed to post notice");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//     setUploading(false);
//   };

//   // Delete a notice
//   const handleDelete = async (noticeId) => {
//     if (!window.confirm("Are you sure you want to delete this notice?")) return;

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/auth/notice/${noticeId}`,
//         { method: "DELETE" }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         alert(data.message);
//         fetchNotices(); // refresh list
//       } else {
//         alert("Failed to delete notice");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error while deleting notice");
//     }
//   };

//   // Shortlist eligible students (Excel download)
//   const handleShortlist = async () => {
//     const skill = prompt("Enter required skill:");
//     const ugCgpa = prompt("Enter minimum UG CGPA:");

//     if (!skill || !ugCgpa) return;

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/auth/eligible-students",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ skill, ugCgpa: Number(ugCgpa) }),
//         }
//       );

//       if (res.ok) {
//         const blob = await res.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "eligible_students.xlsx";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//       } else {
//         alert("No eligible students found");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error while fetching students");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Welcome, {user.name || "Company"}!</h1>

//       {/* Post Notice */}
//       <section style={{ marginBottom: "30px" }}>
//         <h2>Post a New Notice</h2>
//         <form onSubmit={handlePostNotice}>
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             style={{ display: "block", marginBottom: "10px", width: "300px" }}
//           />
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//             style={{
//               display: "block",
//               marginBottom: "10px",
//               width: "300px",
//               height: "100px",
//             }}
//           />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ marginBottom: "10px" }}
//           />
//           <button type="submit" disabled={uploading}>
//             {uploading ? "Posting..." : "Post Notice"}
//           </button>
//         </form>
//       </section>

//       {/* Notices List */}
//       <section>
//         <h2>Your Notices</h2>
//         <button
//           onClick={handleShortlist}
//           style={{ marginBottom: "15px", display: "block" }}
//         >
//           Shortlist Eligible Students
//         </button>

//         {notices.length === 0 ? (
//           <p>No notices posted yet</p>
//         ) : (
//           <ul style={{ listStyle: "none", padding: 0 }}>
//             {notices.map((notice) => (
//               <li
//                 key={notice._id}
//                 style={{
//                   border: "1px solid #ccc",
//                   padding: "15px",
//                   marginBottom: "15px",
//                   borderRadius: "5px",
//                 }}
//               >
//                 <h3>{notice.title || "No Title"}</h3>
//                 <p>{notice.description || "No Description"}</p>
//                 {notice.image && (
//                   <img
//                     src={`http://localhost:5000/uploads/${notice.image}`}
//                     alt={notice.title}
//                     style={{ maxWidth: "200px", marginTop: "10px" }}
//                   />
//                 )}
//                 <p>
//                   Approved by Colleges:{" "}
//                   {notice.approvedColleges?.length > 0
//                     ? notice.approvedColleges.join(", ")
//                     : "Pending"}
//                 </p>
//                 <button
//                   onClick={() => handleDelete(notice._id)}
//                   style={{
//                     background: "red",
//                     color: "#fff",
//                     padding: "5px 10px",
//                     border: "none",
//                     cursor: "pointer",
//                     borderRadius: "3px",
//                   }}
//                 >
//                   Delete Notice
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// };

// export default CompanyDashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaClipboardCheck, FaSignOutAlt,FaRegEdit } from "react-icons/fa";


const CollegePage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

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
          <h3>{user.name || "College Name"}</h3>
          <p>{user.email || "college@example.com"}</p>
        </div>
        <nav>
          <ul>
          <li>
    <FaTachometerAlt style={{ marginRight: "8px" }} /> Dashboard
  </li>
  <li onClick={() => navigate("/NoticePage")}>
    <FaRegEdit style={{ marginRight: "8px" }} /> Company Notice
  </li>
  <li onClick={() => navigate("/postapprove")}>
    <FaClipboardCheck style={{ marginRight: "8px" }} /> Post Approve
  </li>
  <li onClick={() => { localStorage.clear(); navigate("/"); }}>
    <FaSignOutAlt style={{ marginRight: "8px" }} /> Log Out
  </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-section">
          <h1>Welcome back, {user.name || "College"}!</h1>
          <p>Here's what's happening with your career journey today.</p>
        </div>

        <div className="cards">
        <div className="card" onClick={() => navigate("/postapprove")}>
    <div className="card-icon">📝</div>
    <div className="card-title">Company Notices</div>
    <div className="card-description">
      View and approve internship notices sent by companies
    </div>
    <div className="card-action">Go to Approval Page</div>
  </div>

        
  <div className="card" onClick={() => navigate("/NoticePage")}>
  <div className="card-icon">📝</div>
  <div className="card-title">Post Approvals</div>
  <div className="card-description">
    View and approve internship notices submitted by companies
  </div>
  <div className="card-action">Go to Approvals</div>
</div>

        </div>
      </main>
    </div>
  );
};

export default CollegePage;
