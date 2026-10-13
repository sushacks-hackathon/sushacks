// src/pages/Login/Login.jsx
import React, { useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { login, setAuth } from "../../auth/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log In</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
