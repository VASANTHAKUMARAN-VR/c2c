import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

const PostApprovePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);

  const college = JSON.parse(localStorage.getItem("user") || "{}");
  const collegeCode = college?.collegeCode;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/college/${collegeCode}/notices`
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

  const handleApprove = async (noticeId) => {
    setLoadingIds((prev) => [...prev, noticeId]);
    try {
      await fetch(`http://localhost:5000/api/auth/notice/${noticeId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeCode }),
      });
      setNotices((prev) => prev.filter((n) => n._id !== noticeId));
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== noticeId));
    }
  };

  const handleReject = async (noticeId) => {
    setLoadingIds((prev) => [...prev, noticeId]);
    try {
      await fetch(`http://localhost:5000/api/auth/notice/${noticeId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeCode }),
      });
      setNotices((prev) => prev.filter((n) => n._id !== noticeId));
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== noticeId));
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Clock size={48} style={{ marginBottom: "20px", opacity: 0.5 }} />
        <p>Loading pending notices...</p>
      </div>
    );
  }

  return (
    <div className="post-approve-container">
      <h2>
        <AlertCircle size={32} style={{ color: "#4a90e2" }} />
        Pending Notices for Approval ({collegeCode})
      </h2>

      {notices.length === 0 ? (
        <div className="no-notices">
          <CheckCircle size={64} style={{ marginBottom: "20px", opacity: 0.3 }} />
          <p>No pending notices at the moment</p>
          <p style={{ fontSize: "14px", marginTop: "10px", color: "#a0aec0" }}>
            All caught up! New notices will appear here for approval.
          </p>
        </div>
      ) : (
        notices.map((n) => (
          <div key={n._id} className="notice-card">
            <h3>{n.title}</h3>
            <p>{n.description}</p>
            
            {n.image && (
              <img
                src={`http://localhost:5000/uploads/${n.image}`}
                alt={n.title}
                width="200"
              />
            )}

            <div className="notice-actions">
              <button
                onClick={() => handleApprove(n._id)}
                disabled={loadingIds.includes(n._id)}
              >
                <CheckCircle size={16} style={{ marginRight: "8px", display: "inline" }} />
                {loadingIds.includes(n._id) ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={() => handleReject(n._id)}
                disabled={loadingIds.includes(n._id)}
              >
                <XCircle size={16} style={{ marginRight: "8px", display: "inline" }} />
                {loadingIds.includes(n._id) ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostApprovePage;