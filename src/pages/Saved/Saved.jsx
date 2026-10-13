// src/pages/Saved/Saved.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import InternshipCard from "../Internships/InternshipCard";
import HiringCard from "../Hiring/HiringCard";

const Saved = () => {
  const [activeTab, setActiveTab] = useState("internships");
  const [savedInternships, setSavedInternships] = useState([]);
  const [savedHiring, setSavedHiring] = useState([]);

  useEffect(() => {
    const internships = JSON.parse(localStorage.getItem("savedInternships")) || [];
    const hiring = JSON.parse(localStorage.getItem("savedHiring")) || [];
    setSavedInternships(internships);
    setSavedHiring(hiring);
  }, []);

  const handleUnsaveInternship = (id) => {
    const updated = savedInternships.filter((item) => item.id !== id);
    setSavedInternships(updated);
    localStorage.setItem("savedInternships", JSON.stringify(updated));
  };

  const handleUnsaveHiring = (id) => {
    const updated = savedHiring.filter((item) => item.job_id !== id);
    setSavedHiring(updated);
    localStorage.setItem("savedHiring", JSON.stringify(updated));
  };

  return (
    <>
      <Navbar />
      <div className="internships-page">
        <h1>Saved</h1>

        {/* Tabs */}
        <div className="filters">
          <button
            onClick={() => setActiveTab("internships")}
            style={{
              backgroundColor: activeTab === "internships" ? "#5a00d1" : "#ddd",
              color: activeTab === "internships" ? "white" : "#333",
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Internships
          </button>
          <button
            onClick={() => setActiveTab("hiring")}
            style={{
              backgroundColor: activeTab === "hiring" ? "#5a00d1" : "#ddd",
              color: activeTab === "hiring" ? "white" : "#333",
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Hiring
          </button>
        </div>

        {/* Internship Section */}
        {activeTab === "internships" && (
          <div className="internship-grid">
            {savedInternships.length > 0 ? (
              savedInternships.map((item, index) => (
                <InternshipCard
                  key={index}
                  internship={item}
                  isSavedPage={true}
                  onUnsave={handleUnsaveInternship}
                />
              ))
            ) : (
              <p>No saved internships yet.</p>
            )}
          </div>
        )}

        {/* Hiring Section (to be implemented) */}
        {activeTab === "hiring" && (
          <div className="internship-grid">
            {savedHiring.length > 0 ? (
              savedHiring.map((item, index) => (
                <HiringCard
                  key={item.job_id || index}
                  hiring={item}
                  isSavedPage={true}
                  onUnsave={handleUnsaveHiring}
                />
              ))
            ) : (
              <p>No saved hiring items yet.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Saved;
