// pages/Careers.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobService } from "../services/api.js";

const JOB_TYPES = ["", "full_time", "part_time", "internship", "contract"];

export default function Careers() {
  const [jobs,       setJobs]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search, setSearchParams]   = useSearchParams();

  const filters = {
    type:     search.get("job_type") || "",
    category: search.get("category")  || "",
    q:        search.get("search")    || "",
  };

  const setFilter = (key, val) => {
    const p = Object.fromEntries(search.entries());
    if (val) p[key] = val; else delete p[key];
    setSearchParams(p);
  };

  useEffect(() => {
    jobService.categories().then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.type)     params.job_type           = filters.type;
    if (filters.category) params["category__slug"]  = filters.category;
    if (filters.q)        params.search             = filters.q;
    jobService.list(params)
      .then((r) => setJobs(r.data.results || r.data))
      .finally(() => setLoading(false));
  }, [search.toString()]);

  return (
    <div style={{ paddingTop: "var(--navbar-h)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "4rem 0 3rem" }}>
        <div className="container text-center">
          <h1 style={{ color: "white", fontSize: "2.5rem" }}>
            Career <span className="text-gold">Opportunities</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: ".75rem" }}>
            Find your next role — Nairobi and beyond
          </p>
          <div style={{ maxWidth: 480, margin: "1.5rem auto 0" }}>
            <div style={{ position: "relative" }}>
              <i className="bi bi-search" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}></i>
              <input
                type="search"
                className="form-control"
                placeholder="Search job title, company, location..."
                style={{ paddingLeft: "2.75rem", background: "rgba(255,255,255,.95)" }}
                value={filters.q}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <select className="form-control" style={{ width: "auto" }} value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {JOB_TYPES.map((t) => (
              <button
                key={t || "all"}
                onClick={() => setFilter("job_type", t)}
                className="btn btn--sm"
                style={{
                  background: filters.type === t ? "var(--nw-navy)" : "white",
                  color:      filters.type === t ? "white" : "var(--nw-navy)",
                  border: "1.5px solid var(--nw-navy)",
                }}
              >
                {t ? t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "All Types"}
              </button>
            ))}
          </div>
        </div>

        {/* Job list */}
        {loading ? (
          <div className="flex-center" style={{ padding: "5rem" }}><div className="spinner"></div></div>
        ) : jobs.length === 0 ? (
          <div className="text-center" style={{ padding: "5rem", color: "#9ca3af" }}>
            <i className="bi bi-briefcase" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}></i>
            No jobs found. Try adjusting your filters.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {jobs.map((job) => (
              <div key={job.id} className="card" style={{ flexDirection: "row", alignItems: "center", padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "1.5rem", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    {job.company_logo
                      ? <img src={job.company_logo} alt={job.company} style={{ width: 52, height: 52, borderRadius: 8, objectFit: "contain", border: "1px solid #e5e7eb", flexShrink: 0 }} />
                      : <div style={{ width: 52, height: 52, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="bi bi-building" style={{ color: "#9ca3af", fontSize: "1.25rem" }}></i></div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".65rem", flexWrap: "wrap", marginBottom: ".35rem" }}>
                        <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700 }}>{job.title}</h3>
                        {job.is_featured && <span className="badge badge--yellow"><i className="bi bi-star-fill"></i> Featured</span>}
                      </div>
                      <div style={{ fontSize: ".875rem", color: "#4b5563", marginBottom: ".5rem" }}>{job.company} &nbsp;·&nbsp; {job.location || "Remote"}</div>
                      <div style={{ display: "flex", gap: ".65rem", flexWrap: "wrap" }}>
                        <span className="badge badge--blue"><i className="bi bi-briefcase"></i> {job.job_type.replace("_", " ")}</span>
                        {job.category_name && <span className="badge badge--gray">{job.category_name}</span>}
                        {job.salary_range && <span className="badge badge--green"><i className="bi bi-cash"></i> {job.salary_range}</span>}
                        {job.deadline && <span className="badge badge--orange"><i className="bi bi-calendar3"></i> Closes {new Date(job.deadline).toLocaleDateString("en-KE")}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "1.5rem", flexShrink: 0 }}>
                  <Link to={`/jobs/${job.slug}/apply`} className="btn btn--primary">
                    Apply <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}