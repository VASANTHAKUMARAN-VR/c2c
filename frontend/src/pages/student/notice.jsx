import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("user"));
  const collegeCode = student?.collegeCode;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(
          `https://c2c-4fy4.onrender.com/api/auth/student/${collegeCode}/notices`
        );
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };

    if (collegeCode) fetchNotices();
  }, [collegeCode]);

  if (loading) {
    return (
      <div className="notices-page">
        <p className="notice-loading">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="notices-page">
      <h1>Approved Notices for Your College ({collegeCode})</h1>

      {notices.length === 0 ? (
        <p className="notice-empty">No approved notices available</p>
      ) : (
        <div className="notice-list">
          {notices.map((n) => (
            <div key={n._id} className="notice-item">
              <h3>{n.title}</h3>
              <p>{n.description}</p>

              {n.image && (
                <img
                  src={`https://c2c-4fy4.onrender.com/uploads/${n.image}`}
                  alt={n.title}
                />
              )}

              <span className="notice-company">
                <strong>Company:</strong> {n.companyId?.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticePage;
