// pages/Scholarship.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { scholarshipService, destinationService } from "../services/api.js";

const TIERS   = ["", "free", "premium", "gold"];
const LEVELS  = ["", "degree", "masters", "phd"];

export default function Scholarship() {
  const [scholarships, setScholarships] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearchParams] = useSearchParams();

  const filters = {
    tier:  search.get("tier")        || "",
    level: search.get("level")       || "",
    dest:  search.get("destination") || "",
    q:     search.get("search")      || "",
  };

  const setFilter = (key, val) => {
    const p = Object.fromEntries(search.entries());
    if (val) p[key] = val; else delete p[key];
    setSearchParams(p);
  };

  useEffect(() => {
    destinationService.list().then((r) => setDestinations(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.tier)  params.tier                   = filters.tier;
    if (filters.level) params.level                   = filters.level;
    if (filters.dest)  params["destination__code"]    = filters.dest;
    if (filters.q)     params.search                  = filters.q;
    scholarshipService.list(params)
      .then((r) => setScholarships(r.data.results || r.data))
      .finally(() => setLoading(false));
  }, [search.toString()]);

  return (
    <div style={{ paddingTop: "var(--navbar-h)" }}>
      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "4rem 0 3rem" }}>
        <div className="container text-center">
          <h1 style={{ color: "white", fontSize: "2.5rem" }}>
            Explore <span className="text-gold">Scholarships</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: ".75rem", fontSize: "1.05rem" }}>
            Degree, Masters and PhD opportunities in Canada, Australia, USA, and the UK
          </p>
          <div style={{ maxWidth: 500, margin: "1.5rem auto 0" }}>
            <div style={{ position: "relative" }}>
              <i className="bi bi-search" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}></i>
              <input
                type="search"
                className="form-control"
                placeholder="Search university, field, destination..."
                style={{ paddingLeft: "2.75rem", background: "rgba(255,255,255,.95)" }}
                value={filters.q}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        {/* Filters row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          {/* Destination */}
          <select className="form-control" style={{ width: "auto" }} value={filters.dest} onChange={(e) => setFilter("destination", e.target.value)}>
            <option value="">All Destinations</option>
            {destinations.map((d) => <option key={d.code} value={d.code}>{d.flag_emoji} {d.name}</option>)}
          </select>

          {/* Level */}
          <select className="form-control" style={{ width: "auto" }} value={filters.level} onChange={(e) => setFilter("level", e.target.value)}>
            <option value="">All Levels</option>
            {LEVELS.slice(1).map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>

          {/* Tier */}
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {TIERS.map((t) => (
              <button
                key={t || "all"}
                onClick={() => setFilter("tier", t)}
                className="btn btn--sm"
                style={{
                  background: filters.tier === t ? "var(--nw-navy)" : "white",
                  color:      filters.tier === t ? "white" : "var(--nw-navy)",
                  border: "1.5px solid var(--nw-navy)",
                }}
              >
                {t ? t.charAt(0).toUpperCase() + t.slice(1) : "All Tiers"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex-center" style={{ padding: "5rem" }}><div className="spinner"></div></div>
        ) : scholarships.length === 0 ? (
          <div className="text-center" style={{ padding: "5rem", color: "#9ca3af" }}>
            <i className="bi bi-search" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}></i>
            <p>No scholarships found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="scholarship-grid">
            {scholarships.map((s) => (
              <div key={s.id} className="card">
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
                    {s.university && <span><i className="bi bi-building"></i> {s.university}</span>}
                    <span><i className="bi bi-award"></i> {s.level}</span>
                    {s.deadline && (
                      <span style={{ color: s.is_expired ? "#dc2626" : "inherit" }}>
                        <i className="bi bi-calendar3"></i> {s.is_expired ? "Expired" : new Date(s.deadline).toLocaleDateString("en-KE")}
                      </span>
                    )}
                  </div>
                  {s.visa_assistance && (
                    <p style={{ fontSize: ".78rem", color: "var(--nw-blue)", marginBottom: ".75rem" }}>
                      <i className="bi bi-patch-check-fill"></i> Visa assistance available
                    </p>
                  )}
                  <Link to={`/scholarships/${s.slug}`} className="btn btn--primary btn--sm btn--full">
                    View Details
                  </Link>
                </div>
                {s.is_paid && (
                  <div className="scholarship-card__unlock">
                    <span><i className="bi bi-lock-fill"></i> Unlock for ${s.amount_usd}</span>
                    <span style={{ fontSize: ".75rem", color: "#9ca3af" }}>M-Pesa / PayPal / Card</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}