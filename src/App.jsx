// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, logout, verifyAuth } from "./auth/auth";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/login/login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Internships from "./pages/Internships/Internships";
import Hiring from "./pages/Hiring/Hiring";
import Calendar from "./pages/Calendar/Calendar";
import ResourcesPage from "./pages/Resources/ResourcesPage";
import Quiz from "./pages/Quiz/Quiz";
import Saved from "./pages/Saved/Saved";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isAuthenticated()) {
        if (isMounted) {
          setIsValid(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        await verifyAuth();
        if (isMounted) setIsValid(true);
      } catch {
        logout();
        if (isMounted) setIsValid(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Checking session...</div>;
  }

  return isValid ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/internships" element={<ProtectedRoute element={<Internships />} />} />
      <Route path="/hiring" element={<ProtectedRoute element={<Hiring />} />} />
      <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} />} />
      <Route path="/resources" element={<ProtectedRoute element={<ResourcesPage />} />} />
      <Route path="/quiz" element={<ProtectedRoute element={<Quiz />} />} />
      <Route path="/saved" element={<ProtectedRoute element={<Saved />} />} />
    </Routes>
  );
}

export default App;


