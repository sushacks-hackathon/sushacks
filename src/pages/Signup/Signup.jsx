// src/pages/SignUp/SignUp.jsx
import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";
import { signup, setAuth } from "../../auth/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signup(username, email, password);
      setAuth(result.token, result.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
