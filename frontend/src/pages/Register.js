import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";

import logo from "../assets/logo.png";
import bg from "../assets/foodbg.jpg";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("receiver");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
        role
      });

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="register-wrapper"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="register-card">

        <img src={logo} alt="logo" className="logo" />

        <h1 className="brand">SmartShare</h1>
        <p className="tagline">🍱 Share Food. Save Lives.</p>

        <h2>Create Account</h2>

        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="receiver">Receiver</option>
            <option value="donor">Donor</option>
          </select>

          <button disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;