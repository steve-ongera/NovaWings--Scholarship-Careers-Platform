// pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";

export default function Login() {
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await authService.login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", padding: "1rem" }}>
        <div className="auth-card fade-in-up">
          <div className="auth-card__logo">
            <i className="bi bi-send-fill" style={{ color: "var(--nw-gold)", marginRight: ".4rem" }}></i>
            Nova<span>Wings</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-body)", fontSize: "1.25rem", fontWeight: 700, marginBottom: ".35rem", textAlign: "center" }}>Welcome back</h2>
          <p className="text-muted text-center mb-4">Sign in to your student portal</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: ".85rem 1rem", borderRadius: "var(--radius-sm)", fontSize: ".875rem", marginBottom: "1.25rem", display: "flex", gap: ".5rem", alignItems: "center" }}>
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username or Email</label>
              <input id="username" name="username" type="text" className="form-control" placeholder="your_username" value={form.username} onChange={handleChange} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn--primary btn--full mt-2" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Signing in…</> : <><i className="bi bi-box-arrow-in-right"></i> Sign In</>}
            </button>
          </form>

          <p className="text-center text-muted mt-3" style={{ fontSize: ".875rem" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--nw-blue)", fontWeight: 600 }}>Create one free</Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/" style={{ fontSize: ".82rem", color: "#9ca3af" }}>
              <i className="bi bi-arrow-left"></i> Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}