// pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardService, applicationService, jobApplicationService, notificationService } from "../services/api.js";

const STAGE_ORDER = ["submitted", "under_review", "documents_verified", "visa_processing", "approved", "rejected"];
const STAGE_LABELS = {
  submitted:           "Submitted",
  under_review:        "Under Review",
  documents_verified:  "Docs Verified",
  visa_processing:     "Visa Processing",
  approved:            "Approved",
  rejected:            "Rejected",
};

function StageTracker({ stage }) {
  if (stage === "rejected") {
    return <span className="badge badge--red"><i className="bi bi-x-circle-fill"></i> Rejected</span>;
  }
  const activeIdx = STAGE_ORDER.indexOf(stage);
  return (
    <div className="stage-tracker">
      {STAGE_ORDER.filter((s) => s !== "rejected").map((s, i) => {
        const isDone   = i < activeIdx;
        const isActive = s === stage;
        return (
          <div key={s} className={`stage-step ${isDone ? "stage-step--done" : ""} ${isActive ? "stage-step--active" : ""}`}>
            <div className="stage-step__dot">
              {isDone ? <i className="bi bi-check-lg"></i> : i + 1}
            </div>
            <span className="stage-step__label">{STAGE_LABELS[s]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function StudentDashboard() {
  const [stats,         setStats]         = useState(null);
  const [scholarApps,   setScholarApps]   = useState([]);
  const [jobApps,       setJobApps]       = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab,     setActiveTab]     = useState("overview");
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.stats(),
      applicationService.myList(),
      jobApplicationService.myList(),
      notificationService.list(),
    ]).then(([sRes, aRes, jRes, nRes]) => {
      setStats(sRes.data);
      setScholarApps(aRes.data.results || aRes.data);
      setJobApps(jRes.data.results     || jRes.data);
      setNotifications(nRes.data.results || nRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-center" style={{ padding: "5rem" }}><div className="spinner"></div></div>;

  const tabs = [
    { id: "overview",      label: "Overview",          icon: "bi-grid"                  },
    { id: "scholarships",  label: "Scholarship Apps",  icon: "bi-mortarboard"           },
    { id: "jobs",          label: "Job Applications",  icon: "bi-briefcase"             },
    { id: "notifications", label: "Notifications",     icon: "bi-bell"                  },
  ];

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}>Student Dashboard</h2>
          <p className="text-muted mt-1">Track your applications and opportunities</p>
        </div>
        <Link to="/scholarships" className="btn btn--primary">
          <i className="bi bi-plus-lg"></i> New Application
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: ".5rem", borderBottom: "2px solid #e5e7eb", marginBottom: "2rem", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: ".75rem 1.25rem",
              fontSize: ".875rem", fontWeight: 600,
              color: activeTab === tab.id ? "var(--nw-navy)" : "#6b7280",
              borderBottom: `2px solid ${activeTab === tab.id ? "var(--nw-gold)" : "transparent"}`,
              marginBottom: -2, display: "flex", alignItems: "center", gap: ".5rem", whiteSpace: "nowrap",
            }}
          >
            <i className={`bi ${tab.icon}`}></i>
            {tab.label}
            {tab.id === "notifications" && unread > 0 && (
              <span style={{ background: "#ef4444", color: "white", borderRadius: 999, padding: "0 .45rem", fontSize: ".7rem", fontWeight: 700 }}>{unread}</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && stats && (
        <div>
          <div className="stats-row mb-4">
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--blue"><i className="bi bi-mortarboard-fill"></i></div>
              <div><div className="stat-card__value">{stats.scholarship_applications.total}</div><div className="stat-card__label">Scholarship Apps</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--green"><i className="bi bi-check-circle-fill"></i></div>
              <div><div className="stat-card__value">{stats.scholarship_applications.approved}</div><div className="stat-card__label">Approved</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--gold"><i className="bi bi-briefcase-fill"></i></div>
              <div><div className="stat-card__value">{stats.job_applications.total}</div><div className="stat-card__label">Job Applications</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--orange"><i className="bi bi-star-fill"></i></div>
              <div><div className="stat-card__value">{stats.unlocked_scholarships}</div><div className="stat-card__label">Unlocked</div></div>
            </div>
          </div>

          {/* Recent scholarship apps */}
          <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: "1rem" }}>Recent Applications</h3>
          {scholarApps.slice(0, 3).map((app) => (
            <div key={app.id} className="card mb-2" style={{ padding: "1.25rem" }}>
              <div className="flex-between mb-2">
                <div>
                  <div style={{ fontWeight: 700 }}>{app.scholarship.title}</div>
                  <div className="text-muted" style={{ fontSize: ".8rem" }}>{app.scholarship.destination_flag} {app.scholarship.destination_name} &nbsp;·&nbsp; {app.scholarship.level}</div>
                </div>
                <span className={`badge ${app.stage === "approved" ? "badge--green" : app.stage === "rejected" ? "badge--red" : "badge--blue"}`}>
                  {STAGE_LABELS[app.stage]}
                </span>
              </div>
              <StageTracker stage={app.stage} />
            </div>
          ))}
          {scholarApps.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", background: "#f9fafb", borderRadius: "var(--radius-md)" }}>
              <p className="text-muted">No scholarship applications yet.</p>
              <Link to="/scholarships" className="btn btn--primary btn--sm mt-2">Browse Scholarships</Link>
            </div>
          )}
        </div>
      )}

      {/* SCHOLARSHIP APPLICATIONS */}
      {activeTab === "scholarships" && (
        <div>
          <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: "1.25rem" }}>My Scholarship Applications</h3>
          {scholarApps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#f9fafb", borderRadius: "var(--radius-md)" }}>
              <i className="bi bi-mortarboard" style={{ fontSize: "3rem", color: "#d1d5db", display: "block", marginBottom: "1rem" }}></i>
              <p className="text-muted">You haven't applied to any scholarships yet.</p>
              <Link to="/scholarships" className="btn btn--primary btn--sm mt-2">Find Scholarships</Link>
            </div>
          ) : (
            scholarApps.map((app) => (
              <div key={app.id} className="card mb-3" style={{ padding: "1.5rem" }}>
                <div className="flex-between mb-3">
                  <div>
                    <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem" }}>{app.scholarship.title}</h4>
                    <div className="text-muted" style={{ fontSize: ".82rem", marginTop: ".25rem" }}>
                      {app.scholarship.destination_flag} {app.scholarship.destination_name} &nbsp;·&nbsp; {app.scholarship.level} &nbsp;·&nbsp; Applied {new Date(app.submitted_at).toLocaleDateString("en-KE")}
                    </div>
                  </div>
                  {app.needs_visa_help && (
                    <span className="badge badge--blue"><i className="bi bi-passport"></i> Visa Assist</span>
                  )}
                </div>
                <StageTracker stage={app.stage} />
                {app.documents.length > 0 && (
                  <div style={{ marginTop: "1rem", padding: ".75rem 1rem", background: "#f9fafb", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ fontSize: ".8rem", fontWeight: 600, marginBottom: ".5rem", color: "#374151" }}>
                      <i className="bi bi-paperclip"></i> Documents ({app.documents.length})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                      {app.documents.map((doc) => (
                        <a key={doc.id} href={doc.file} target="_blank" rel="noreferrer" className="badge badge--gray">
                          <i className="bi bi-file-earmark"></i> {doc.doc_type}
                          {doc.is_verified && <i className="bi bi-check-circle-fill" style={{ color: "var(--status-success)" }}></i>}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* JOB APPLICATIONS */}
      {activeTab === "jobs" && (
        <div>
          <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, marginBottom: "1.25rem" }}>My Job Applications</h3>
          {jobApps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#f9fafb", borderRadius: "var(--radius-md)" }}>
              <i className="bi bi-briefcase" style={{ fontSize: "3rem", color: "#d1d5db", display: "block", marginBottom: "1rem" }}></i>
              <p className="text-muted">No job applications yet.</p>
              <Link to="/careers" className="btn btn--primary btn--sm mt-2">Browse Jobs</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job</th><th>Company</th><th>Type</th><th>Status</th><th>Applied</th><th>Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApps.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600 }}>{app.job.title}</td>
                      <td>{app.job.company}</td>
                      <td><span className="badge badge--blue">{app.job.job_type.replace("_", " ")}</span></td>
                      <td>
                        <span className={`badge ${app.status === "hired" ? "badge--green" : app.status === "rejected" ? "badge--red" : app.status === "shortlisted" ? "badge--yellow" : "badge--gray"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="text-muted">{new Date(app.applied_at).toLocaleDateString("en-KE")}</td>
                      <td>
                        <span className="badge badge--gray">
                          <i className="bi bi-paperclip"></i> {app.documents.length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div>
          <div className="flex-between mb-3">
            <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700 }}>Notifications</h3>
            {unread > 0 && (
              <button onClick={async () => { await notificationService.markAllRead(); setNotifications((p) => p.map((n) => ({ ...n, is_read: true }))); }} className="btn btn--ghost btn--sm">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
              <i className="bi bi-bell-slash" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}></i>
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} style={{
                padding: "1rem 1.25rem",
                background: n.is_read ? "white" : "#f0f4ff",
                borderRadius: "var(--radius-sm)",
                border: "1px solid",
                borderColor: n.is_read ? "#e5e7eb" : "#bfdbfe",
                marginBottom: ".75rem",
                display: "flex", gap: "1rem", alignItems: "flex-start",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.is_read ? "transparent" : "var(--nw-blue)", marginTop: ".4rem", flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: ".9rem" }}>{n.title}</div>
                  <div style={{ fontSize: ".82rem", color: "#4b5563", marginTop: ".2rem" }}>{n.message}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}