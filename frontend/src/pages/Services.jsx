// pages/Services.jsx
import { Link } from "react-router-dom";

const SERVICES = [
  {
    icon: "bi-mortarboard-fill",
    title: "Scholarship Discovery",
    desc: "Access hundreds of verified scholarships across Canada, Australia, USA, and UK — filtered by level, field, and funding tier.",
    features: ["Free, Premium & Gold tiers", "Degree, Masters, PhD", "Updated weekly"],
    color: "#eff6ff", accent: "var(--nw-blue)",
  },
  {
    icon: "bi-passport-fill",
    title: "Visa Assistance",
    desc: "Our visa advisors walk you through the entire process — from documentation to interview prep — with live tracking at every stage.",
    features: ["Full documentation support", "Interview preparation", "Real-time stage tracking"],
    color: "#f0fdf4", accent: "#16a34a",
  },
  {
    icon: "bi-briefcase-fill",
    title: "Career Placement",
    desc: "Browse curated job listings from top Nairobi and global employers. Upload your CV and apply in minutes.",
    features: ["Full-time, part-time & internships", "Easy document upload", "Application tracking"],
    color: "#fffbeb", accent: "#d97706",
  },
  {
    icon: "bi-person-lines-fill",
    title: "Student Mentorship",
    desc: "Get paired with Kenyan alumni who've studied abroad and can share real experience from your target institution.",
    features: ["1-on-1 mentorship", "Alumni network", "Application reviews"],
    color: "#fdf4ff", accent: "#7c3aed",
  },
  {
    icon: "bi-file-earmark-check-fill",
    title: "Document Review",
    desc: "Expert review of personal statements, CVs, recommendation letters, and all supporting application materials.",
    features: ["Personal statement editing", "CV/Resume polishing", "Recommendation guidance"],
    color: "#fff7ed", accent: "#ea580c",
  },
  {
    icon: "bi-cash-stack",
    title: "Flexible Payments",
    desc: "Unlock premium scholarships with M-Pesa, PayPal, or Visa — in Kenyan Shillings or US Dollars.",
    features: ["M-Pesa STK Push", "PayPal & Visa card", "KES & USD accepted"],
    color: "#f0fdf4", accent: "#16a34a",
  },
];

export default function Services() {
  return (
    <div style={{ paddingTop: "1px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "4rem 0 3rem" }}>
        <div className="container text-center">
          <h1 style={{ color: "white", fontSize: "2.5rem" }}>Our <span className="text-gold">Services</span></h1>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: ".75rem", maxWidth: 540, margin: ".75rem auto 0" }}>
            Everything you need to secure a scholarship, a visa, and your next career — all in one platform.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            {SERVICES.map((s) => (
              <div key={s.title} className="card fade-in-up" style={{ padding: "2rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: s.accent, marginBottom: "1.25rem" }}>
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 700, marginBottom: ".6rem" }}>{s.title}</h3>
                <p className="text-muted" style={{ marginBottom: "1.25rem", lineHeight: 1.7 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".4rem" }}>
                  {s.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".85rem", color: "#374151" }}>
                      <i className="bi bi-check-circle-fill" style={{ color: s.accent, flexShrink: 0 }}></i> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>
            Ready to Get <span className="text-gold">Started?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", marginBottom: "2rem" }}>
            Create your free NovaWings account and begin your journey today.
          </p>
          <div className="flex-center gap-2">
            <Link to="/register"    className="btn btn--primary btn--lg">Create Free Account</Link>
            <Link to="/scholarships" className="btn btn--outline btn--lg">Browse Scholarships</Link>
          </div>
        </div>
      </section>
    </div>
  );
}