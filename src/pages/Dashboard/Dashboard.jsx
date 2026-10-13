// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect } from "react";
import "./Dashboard.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getUsername } from "../../auth/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = getUsername();

  useEffect(() => {
    if (!username) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [navigate, username]);

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="welcome-section">
        <h1>Welcome, {username}</h1>
        <p>Here's an overview of your IP Drive activity</p>
      </div>

      <div className="cards-section">
        <div className="card">
          <h3>📂 Browse Internships</h3>
          <p>Explore and discover internship opportunities from leading companies.</p>
          <button onClick={() => navigate("/internships")}>View Internships</button>
        </div>
        <div className="card">
          <h3>💼 Browse Hiring</h3>
          <p>Find and apply to job opportunities that match your skills and experience.</p>
          <button onClick={() => navigate("/hiring")}>View Hiring</button>
        </div>
        <div className="card">
          <h3>📅 Upcoming Events</h3>
          <p>No upcoming events</p>
          <button onClick={() => navigate("/calendar")}>View Calendar</button>
        </div>
        <div className="card wide">
          <h3>⚙️ AI Quiz</h3>
          <p>Practice interview questions with our AI-powered quiz generator.</p>
          <button onClick={() => navigate("/quiz")}>Take a Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
