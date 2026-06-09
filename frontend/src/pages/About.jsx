// pages/About.jsx
import { Link } from "react-router-dom";

const TEAM = [
  { name: "Amina Ochieng",  role: "Co-Founder & CEO",         initials: "AO" },
  { name: "Brian Mwangi",   role: "Head of Scholarships",     initials: "BM" },
  { name: "Cynthia Wanjiru",role: "Careers & Visa Advisor",   initials: "CW" },
  { name: "David Kamau",    role: "Lead Developer",           initials: "DK" },
];

const VALUES = [
  { icon: "bi-people-fill",   title: "Student First",   desc: "Every decision we make is rooted in the best interests of Kenyan and African students." },
  { icon: "bi-shield-check",  title: "Transparency",    desc: "No hidden fees. Clear pricing, honest guidance, and full application visibility." },
  { icon: "bi-globe2",        title: "Global Reach",    desc: "Partnerships with universities and employers across four continents." },
  { icon: "bi-lightbulb-fill",title: "Innovation",      desc: "Continuously improving the platform to serve students better every day." },
];

export default function About() {
  return (
    <div style={{ paddingTop: "var(--navbar-h)" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "5rem 0" }}>
        <div className="container text-center">
          <h1 style={{ color: "white", fontSize: "2.8rem" }}>About <span className="text-gold">NovaWings</span></h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.1rem", maxWidth: 580, margin: "1rem auto 0" }}>
            We exist to break down barriers between Kenyan students and the world's best academic and career opportunities.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>Our <span className="text-gold">Mission</span></h2>
              <p style={{ lineHeight: 1.9, color: "#4b5563", marginBottom: "1rem" }}>
                NovaWings was founded in Nairobi with one goal: to make world-class education accessible to every talented Kenyan student, regardless of financial background.
              </p>
              <p style={{ lineHeight: 1.9, color: "#4b5563", marginBottom: "1.5rem" }}>
                We partner with universities in Canada, Australia, the USA, and the UK to source scholarships spanning Degree, Masters, and PhD levels — and we guide each student from first application to visa approval.
              </p>
              <Link to="/scholarships" className="btn btn--primary">
                Explore Scholarships <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["500+","Scholarships Listed"],["2,400+","Students Helped"],["4","Destination Countries"],["95%","Visa Success Rate"]].map(([val, label]) => (
                <div key={label} style={{ background: "var(--nw-cream)", borderRadius: "var(--radius-md)", padding: "1.75rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--nw-navy)", fontWeight: 700 }}>{val}</div>
                  <div style={{ fontSize: ".82rem", color: "#6b7280", marginTop: ".35rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--alt">
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>Our <span className="text-gold">Values</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {VALUES.map((v) => (
              <div key={v.title} className="card" style={{ padding: "2rem" }}>
                <div style={{ fontSize: "2rem", color: "var(--nw-gold)", marginBottom: "1rem" }}>
                  <i className={`bi ${v.icon}`}></i>
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontWeight: 700, marginBottom: ".5rem" }}>{v.title}</h3>
                <p className="text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>Meet the <span className="text-gold">Team</span></h2>
            <p className="text-muted mt-1">The people behind NovaWings</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {TEAM.map((member) => (
              <div key={member.name} className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--nw-navy), var(--nw-blue))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                  color: "var(--nw-gold)", fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700,
                }}>
                  {member.initials}
                </div>
                <div style={{ fontWeight: 700 }}>{member.name}</div>
                <div className="text-muted" style={{ fontSize: ".82rem", marginTop: ".25rem" }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--nw-cream)", padding: "4rem 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "1.75rem", marginBottom: ".75rem" }}>Ready to <span className="text-gold">start?</span></h2>
          <p className="text-muted mb-4">Join thousands of students already using NovaWings.</p>
          <Link to="/register" className="btn btn--primary btn--lg">Create Free Account</Link>
        </div>
      </section>
    </div>
  );
}