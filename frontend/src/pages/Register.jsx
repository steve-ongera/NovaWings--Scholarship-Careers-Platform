// pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", first_name: "", last_name: "",
    phone: "", country: "Kenya", city: "", password: "", password2: "",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); setLoading(true);
    try {
      await authService.register(form);
      await authService.login({ username: form.username, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ["Registration failed. Please check your details."] });
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = "text", placeholder = "") => (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type}
        className={`form-control${errors[name] ? " form-control--error" : ""}`}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required
      />
      {errors[name] && <span className="form-error"><i className="bi bi-exclamation-circle"></i> {errors[name][0]}</span>}
    </div>
  );

  return (
    <div className="auth-page" style={{ padding: "2rem 0" }}>
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", padding: "1rem" }}>
        <div className="auth-card fade-in-up">
          <div className="auth-card__logo">
            <i className="bi bi-send-fill" style={{ color: "var(--nw-gold)", marginRight: ".4rem" }}></i>
            Nova<span>Wings</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-body)", fontSize: "1.25rem", fontWeight: 700, textAlign: "center", marginBottom: ".35rem" }}>Create your account</h2>
          <p className="text-muted text-center mb-4">Free to join — unlock opportunities worldwide</p>

          {errors.non_field_errors && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: ".85rem 1rem", borderRadius: "var(--radius-sm)", fontSize: ".875rem", marginBottom: "1.25rem" }}>
              <i className="bi bi-exclamation-circle-fill"></i> {errors.non_field_errors[0]}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              {field("first_name", "First Name", "text", "John")}
              {field("last_name",  "Last Name",  "text", "Kamau")}
            </div>
            {field("username", "Username", "text", "john_kamau")}
            {field("email",    "Email Address", "email", "john@example.com")}
            {field("phone",    "Phone Number",  "tel",   "+254712345678")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="country">Country</label>
                <select id="country" name="country" className="form-control" value={form.country} onChange={handleChange}>
                  {["Kenya","Uganda","Tanzania","Rwanda","Ethiopia","Ghana","Nigeria","South Africa","Zimbabwe","Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              {field("city", "City", "text", "Nairobi")}
            </div>
            {field("password",  "Password",        "password", "Min. 8 characters")}
            {field("password2", "Confirm Password", "password", "Repeat your password")}

            <button type="submit" className="btn btn--primary btn--full mt-2" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Creating account…</> : <><i className="bi bi-person-plus-fill"></i> Create Account</>}
            </button>
          </form>

          <p className="text-center text-muted mt-3" style={{ fontSize: ".875rem" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--nw-blue)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}