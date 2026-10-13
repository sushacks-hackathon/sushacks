// src/pages/Internships/InternshipCard.jsx
import React from "react";
import "./internships.css";

const InternshipCard = ({ internship, onSave, isSavedPage, onUnsave }) => {
  return (
    <div className="internship-card">
      <h3>{internship.title}</h3>
      <p><strong>Company:</strong> {internship.company}</p>
      <p><strong>Location:</strong> {internship.location}</p>
      <p><strong>Industry:</strong> {internship.company_industry}</p>
      <p><strong>Salary:</strong> {internship.salary || "Not specified"}</p>
      <p><strong>Qualifications:</strong> {internship.qualifications}</p>

      <div className="btn-group">
        <a href={internship.apply} target="_blank" rel="noopener noreferrer">
          <button className="apply-btn">Apply Now</button>
        </a>

        {isSavedPage ? (
          <button className="save-btn" onClick={() => onUnsave(internship.id)}>
            Remove
          </button>
        ) : (
          <button className="save-btn" onClick={() => onSave(internship)}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
