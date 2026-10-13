// src/pages/Internships/Internships.jsx
import React, { useEffect, useState } from "react";
import internshipsData from "../../data/internships.json";
import InternshipCard from "./InternshipCard";
import Navbar from "../../components/Navbar";
import "./internships.css";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("All");

  useEffect(() => {
    setInternships(internshipsData);
    setFiltered(internshipsData);
  }, []);

  useEffect(() => {
    let results = internships.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (modeFilter !== "All") {
      results = results.filter((item) =>
        item.mode.toLowerCase() === modeFilter.toLowerCase()
      );
    }

    setFiltered(results);
  }, [searchTerm, modeFilter, internships]);

  const handleSaveInternship = (internship) => {
    const saved = JSON.parse(localStorage.getItem("savedInternships")) || [];
    const isAlreadySaved = saved.some((i) => i.id === internship.id);
    if (!isAlreadySaved) {
      const updated = [...saved, internship];
      localStorage.setItem("savedInternships", JSON.stringify(updated));
      alert("Internship saved!");
    } else {
      alert("This internship is already saved.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="internships-page">
        <h1>Internship Opportunities</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="internship-grid">
          {filtered.map((item, index) => (
            <InternshipCard
              key={index}
              internship={item}
              onSave={handleSaveInternship}
              isSavedPage={false}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Internships;
