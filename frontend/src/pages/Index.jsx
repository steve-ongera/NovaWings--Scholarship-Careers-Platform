// pages/Index.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { scholarshipService, jobService } from "../services/api.js";

const DESTINATIONS = [
  { code: "CA", flag: "🍁", name: "Canada"    },
  { code: "AU", flag: "🦘", name: "Australia" },
  { code: "US", flag: "🗽", name: "USA"       },
  { code: "GB", flag: "🇬🇧", name: "UK"       },
];

const HOW_STEPS = [
  { icon: "bi-person-plus",    title: "Create Account",      desc: "Sign up free and build your NovaWings student profile in minutes." },
  { icon: "bi-search",         title: "Browse Opportunities", desc: "Filter scholarships by destination, level, and tier that match your goals." },
  { icon: "bi-lock-fill",      title: "Unlock & Apply",       desc: "Free scholarships apply directly. Premium/Gold unlock via M-Pesa, PayPal, or Visa." },
  { icon: "bi-graph-up-arrow", title: "Track Your Journey",   desc: "Follow real-time application stages from Submitted to Approved." },
];

export default function Index() {
  const [featured, setFeatured] = useState([]);
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      scholarshipService.list({ is_featured: true, page_size: 6 }),
      jobService.list({ is_featured: true, page_size: 4 }),
    ]).then(([sRes, jRes]) => {
      setFeatured(sRes.data.results || sRes.data);
      setJobs(jRes.data.results     || jRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <span className="hero__eyebrow fade-in">
              <i className="bi bi-geo-alt-fill"></i> Based in Nairobi, Kenya
            </span>
            <h1 className="fade-in-up delay-1">
              Your Wings to<br /><em>Global Education</em>
            </h1>
            <p className="hero__sub fade-in-up delay-2">
              NovaWings connects Kenyan students with scholarships to Canada, Australia, USA,
              and the UK — covering Degree, Masters, and PhD programmes. Visa assistance included.
            </p>
            <div className="hero__actions fade-in-up delay-3">
              <Link to="/scholarships" className="btn btn--primary btn--lg">
                <i className="bi bi-mortarboard-fill"></i> Browse Scholarships
              </Link>
              <Link to="/register" className="btn btn--outline btn--lg">
                Create Free Account
              </Link>
            </div>
            <div className="hero__flags fade-in-up delay-4">
              {DESTINATIONS.map((d) => (
                <div key={d.code} className="hero__flag-item">
                  <span>{d.flag}</span> {d.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "3rem 0", background: "var(--nw-cream)", borderBottom: "1px solid #e5e7eb" }}>
        <div className="container">
          <div className="stats-row">
            {[
              { icon: "bi-mortarboard-fill", val: "500+",   label: "Active Scholarships",   cls: "stat-card__icon--blue"   },
              { icon: "bi-briefcase-fill",   val: "200+",   label: "Job Listings",          cls: "stat-card__icon--green"  },
              { icon: "bi-people-fill",      val: "2,400+", label: "Students Helped",       cls: "stat-card__icon--gold"   },
              { icon: "bi-globe2",           val: "4",      label: "Destination Countries", cls: "stat-card__icon--orange" },
            ].map(({ icon, val, label, cls }) => (
              <div key={label} className="stat-card fade-in-up">
                <div className={`stat-card__icon ${cls}`}><i className={`bi ${icon}`}></i></div>
                <div>
                  <div className="stat-card__value">{val}</div>
                  <div className="stat-card__label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SCHOLARSHIPS */}
      <section className="section">
        <div className="container">
          <div className="flex-between mb-4">
            <div>
              <h2 style={{ fontSize: "2rem" }}>Featured <span className="text-gold">Scholarships</span></h2>
              <p className="text-muted mt-1">Hand-picked opportunities across all study levels</p>
            </div>
            <Link to="/scholarships" className="btn btn--ghost">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: "4rem" }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="scholarship-grid">
              {featured.map((s, i) => (
                <div key={s.id} className={`card fade-in-up delay-${i + 1}`}>
                  {s.cover_image && <img src={s.cover_image} alt={s.title} className="card__img" />}
                  <div className="card__body">
                    <div className="flex-between mb-2">
                      <span className={`tier-badge tier-badge--${s.tier}`}>
                        <i className={s.tier === "gold" ? "bi-star-fill" : s.tier === "premium" ? "bi-lock-fill" : "bi-unlock-fill"}></i>
                        {s.tier}
                      </span>
                      <span className="text-muted" style={{ fontSize: ".78rem" }}>{s.destination_flag} {s.destination_name}</span>
                    </div>
                    <h3 className="card__title">{s.title}</h3>
                    <div className="card__meta">
                      <span><i className="bi bi-building"></i> {s.university || "Various"}</span>
                      <span><i className="bi bi-award"></i> {s.level}</span>
                    </div>
                    <Link to={`/scholarships/${s.slug}`} className="btn btn--primary btn--sm btn--full">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section--alt">
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>How <span className="text-gold">It Works</span></h2>
            <p className="text-muted mt-2">Four simple steps to your dream scholarship</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="card fade-in-up" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--nw-navy), var(--nw-blue))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem", fontSize: "1.5rem", color: "var(--nw-gold)",
                }}>
                  <i className={`bi ${step.icon}`}></i>
                </div>
                <span style={{
                  display: "inline-block", background: "var(--nw-gold)", color: "var(--nw-midnight)",
                  borderRadius: 999, width: 24, height: 24, fontSize: ".75rem", fontWeight: 700,
                  lineHeight: "24px", textAlign: "center", marginBottom: ".75rem",
                }}>{i + 1}</span>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", marginBottom: ".5rem" }}>{step.title}</h3>
                <p className="text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="section">
        <div className="container">
          <div className="flex-between mb-4">
            <div>
              <h2 style={{ fontSize: "2rem" }}>Latest <span className="text-gold">Jobs</span></h2>
              <p className="text-muted mt-1">Career opportunities for students and graduates</p>
            </div>
            <Link to="/careers" className="btn btn--ghost">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {jobs.map((job, i) => (
              <div key={job.id} className={`card fade-in-up delay-${i + 1}`}>
                <div className="card__body">
                  <div className="flex gap-2 mb-2" style={{ alignItems: "center" }}>
                    {job.company_logo
                      ? <img src={job.company_logo} alt={job.company} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain", border: "1px solid #e5e7eb" }} />
                      : <div style={{ width: 40, height: 40, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><i className="bi bi-building" style={{ color: "#9ca3af" }}></i></div>
                    }
                    <div>
                      <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{job.company}</div>
                      <div style={{ fontSize: ".75rem", color: "#9ca3af" }}>{job.category_name}</div>
                    </div>
                  </div>
                  <h3 className="card__title" style={{ fontSize: "1rem" }}>{job.title}</h3>
                  <div className="card__meta">
                    <span><i className="bi bi-geo-alt"></i> {job.location || "Remote"}</span>
                    <span><i className="bi bi-clock"></i> {job.job_type.replace("_", " ")}</span>
                  </div>
                  <Link to={`/jobs/${job.slug}/apply`} className="btn btn--primary btn--sm btn--full">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "white", fontSize: "2.2rem", marginBottom: "1rem" }}>
            Ready to Take <span className="text-gold">Flight?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: 540, margin: "0 auto 2rem" }}>
            Join thousands of Kenyan students who have launched their global careers through NovaWings.
          </p>
          <div className="flex-center gap-2">
            <Link to="/register" className="btn btn--primary btn--lg">
              <i className="bi bi-rocket-takeoff-fill"></i> Start Your Journey
            </Link>
            <Link to="/contact" className="btn btn--outline btn--lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}