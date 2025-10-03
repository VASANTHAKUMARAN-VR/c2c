import React from "react";

const ShortlistPage = () => {
  const handleShortlist = async () => {
    const skill = prompt("Enter required skill:");
    const ugCgpa = prompt("Enter minimum UG CGPA:");

    if (!skill || !ugCgpa) return;

    try {
      const res = await fetch("https://c2c-4fy4.onrender.com/api/auth/eligible-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, ugCgpa: Number(ugCgpa) }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "eligible_students.xlsx";
        a.click();
        a.remove();
      } else {
        alert("No eligible students found");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="shortlist-page">
  <h2>Shortlist Eligible Students</h2>
  <div className="shortlist-container">
    <p className="shortlist-description">
      Download the list of eligible students based on skill and UG CGPA.
    </p>
    <button className="download-btn" onClick={handleShortlist}>
      Download Eligible Students Excel
    </button>
  </div>
</div>
  );
};

export default ShortlistPage;
