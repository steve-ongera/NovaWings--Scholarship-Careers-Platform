// pages/Contact.jsx
import { useState } from "react";
import { contactService } from "../services/api.js";

export default function Contact() {
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await contactService.submit(form);
      setSuccess(true);
    } catch {
      setError("Failed to send. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "1px" }}>
      <div style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "4rem 0 3rem" }}>
        <div className="container text-center">
          <h1 style={{ color: "white", fontSize: "2.5rem" }}>Get in <span className="text-gold">Touch</span></h1>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: ".75rem" }}>We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "4rem", alignItems: "start" }}>
            {/* Info */}
            <div>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>Contact Information</h3>
              {[
                ["bi-geo-alt-fill",  "Location",     "Westlands, Nairobi, Kenya"],
                ["bi-envelope-fill", "Email",        "info@novawings.co.ke"],
                ["bi-telephone-fill","Phone",        "+254 700 000 000"],
                ["bi-clock-fill",    "Office Hours", "Mon–Fri, 8am–6pm EAT"],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--nw-blue)", flexShrink: 0 }}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
                    <div style={{ fontSize: ".9rem", color: "#374151", marginTop: ".2rem" }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="card" style={{ padding: "2.5rem" }}>
              {success ? (
                <div className="text-center" style={{ padding: "2rem" }}>
                  <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem", color: "var(--status-success)", display: "block", marginBottom: "1rem" }}></i>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: ".5rem" }}>Message Sent!</h3>
                  <p className="text-muted">Thank you. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: "1.5rem" }}>Send us a message</h3>
                  {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: ".75rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: ".875rem" }}>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input name="name" type="text" className="form-control" placeholder="John Kamau" value={form.name} onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input name="email" type="email" className="form-control" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone (optional)</label>
                      <input name="phone" type="tel" className="form-control" placeholder="+254..." value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input name="subject" type="text" className="form-control" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea name="message" className="form-control" rows={5} placeholder="Tell us more..." value={form.message} onChange={handleChange} required></textarea>
                    </div>
                    <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                      {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Sending…</> : <><i className="bi bi-send-fill"></i> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}