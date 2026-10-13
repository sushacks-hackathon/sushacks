import React, { memo } from "react";
import "../Internships/internships.css";

const HiringCard = memo(({ hiring, onSave, isSavedPage, onUnsave }) => {
  return (
    <div className="internship-card">
      <h3>{hiring.job_title}</h3>
      <p><strong>Company:</strong> {hiring.company_name}</p>
      <p><strong>Location:</strong> {hiring.job_location}</p>
      <p><strong>Type:</strong> {hiring.job_type}</p>
      <p><strong>Skills:</strong> {hiring.skills_required}</p>
      <p><strong>Mode:</strong> {hiring.remote_onsite}</p>
      <p><strong>Salary:</strong> {hiring.salary_range || "Not specified"}</p>
      <p><strong>Experience:</strong> {hiring.experience_required}</p>
      <p><strong>Posted:</strong> {hiring.posted_date}</p>
      <p><strong>Deadline:</strong> {hiring.application_deadline}</p>
      <p><strong>Applicants:</strong> {hiring.number_of_applicants}</p>
      <p><strong>Education:</strong> {hiring.education_requirement}</p>
      <p><strong>Company Size:</strong> {hiring.company_size}</p>
      <div className="btn-group">
        <a href="https://www.naukri.com/jobs-in-india?expJD=true" target="_blank" rel="noopener noreferrer">
          <button className="apply-btn">Apply Now</button>
        </a>
        {isSavedPage ? (
          <button className="save-btn" onClick={() => onUnsave(hiring.job_id)}>Remove</button>
        ) : (
          <button className="save-btn" onClick={() => onSave(hiring)}>Save</button>
        )}
      </div>
    </div>
  );
});

export default HiringCard;
