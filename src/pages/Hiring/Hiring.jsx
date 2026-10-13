import React, { useMemo, useState } from "react";
import hiringData from "../../data/hiring.json";
import HiringCard from "./HiringCard";
import Navbar from "../../components/Navbar";
import "../Internships/internships.css";

const CARDS_PER_BATCH = 24;

const Hiring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_BATCH);

  const filtered = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedMode = modeFilter.toLowerCase();

    return hiringData.filter((item) => {
      const title = (item.job_title || "").toLowerCase();
      const mode = (item.remote_onsite || "").toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 || title.includes(normalizedSearch);
      const matchesMode = normalizedMode === "all" || mode === normalizedMode;
      return matchesSearch && matchesMode;
    });
  }, [searchTerm, modeFilter]);

  const visibleHiring = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const handleSaveHiring = (item) => {
    const saved = JSON.parse(localStorage.getItem("savedHiring")) || [];
    const isAlreadySaved = saved.some((i) => i.job_id === item.job_id);
    if (!isAlreadySaved) {
      const updated = [...saved, item];
      localStorage.setItem("savedHiring", JSON.stringify(updated));
      alert("Hiring opportunity saved!");
    } else {
      alert("Already saved.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="internships-page">
        <h1>Hiring Opportunities</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(CARDS_PER_BATCH);
            }}
          />
          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              setVisibleCount(CARDS_PER_BATCH);
            }}
          >
            <option value="All">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="internship-grid">
          {visibleHiring.map((item) => (
            <HiringCard
              key={item.job_id}
              hiring={item}
              onSave={handleSaveHiring}
              isSavedPage={false}
            />
          ))}
        </div>
        {filtered.length > visibleCount && (
          <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
            <button
              className="save-btn"
              onClick={() => setVisibleCount((prev) => prev + CARDS_PER_BATCH)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Hiring;
