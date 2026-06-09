// pages/AppJob.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobService, jobApplicationService } from "../services/api.js";

export default function AppJob() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const [job,       setJob]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [appId,     setAppId]     = useState(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [files,       setFiles]       = useState([]);
  const [docType,     setDocType]     = useState("cv");

  useEffect(() => {
    jobService.detail(slug)
      .then((r) => setJob(r.data))
      .catch(() => navigate("/careers"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const appRes = await jobApplicationService.myList();
      // Check not already applied (handled server side too)
      const apply = await jobService.apply(slug, { job: job.id, cover_letter: coverLetter });
      const newId = apply.data.id;
      setAppId(newId);

      // Upload documents
      for (const file of files) {
        const fd = new FormData();
        fd.append("file",     file.file);
        fd.append("doc_type", file.type);
        await jobApplicationService.uploadDocument(newId, fd);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => [...prev, { file, type: docType, name: file.name }]);
      e.target.value = "";
    }
  };

  if (loading) return <div className="flex-center" style={{ padding: "5rem" }}><div className="spinner"></div></div>;
  if (!job)    return null;

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem", color: "#16a34a" }}>
          <i className="bi bi-check-lg"></i>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: ".75rem" }}>Application Submitted!</h2>
        <p className="text-muted" style={{ maxWidth: 420, margin: "0 auto 2rem" }}>
          Your application for <strong>{job.title}</strong> at {job.company} has been received.
          You can track its status from your dashboard.
        </p>
        <div className="flex-center gap-2">
          <Link to="/dashboard" className="btn btn--primary">Go to Dashboard</Link>
          <Link to="/careers"   className="btn btn--ghost">Browse More Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Job header */}
      <div className="card mb-4" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          {job.company_logo
            ? <img src={job.company_logo} alt={job.company} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "contain", border: "1px solid #e5e7eb" }} />
            : <div style={{ width: 60, height: 60, background: "#f3f4f6", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><i className="bi bi-building" style={{ fontSize: "1.5rem", color: "#9ca3af" }}></i></div>
          }
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.2rem" }}>{job.title}</h2>
            <div style={{ color: "#4b5563", fontSize: ".9rem", margin: ".35rem 0" }}>{job.company} &nbsp;·&nbsp; {job.location || "Remote"}</div>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              <span className="badge badge--blue">{job.job_type.replace("_", " ")}</span>
              {job.salary_range && <span className="badge badge--green"><i className="bi bi-cash"></i> {job.salary_range}</span>}
              {job.deadline && <span className="badge badge--orange">Closes {new Date(job.deadline).toLocaleDateString("en-KE")}</span>}
            </div>
          </div>
        </div>

        {job.description && (
          <div style={{ marginTop: "1.25rem", padding: "1rem", background: "#f9fafb", borderRadius: "var(--radius-sm)", fontSize: ".875rem", color: "#374151", lineHeight: 1.7 }}>
            <strong style={{ display: "block", marginBottom: ".5rem" }}>About This Role</strong>
            {job.description.slice(0, 400)}{job.description.length > 400 ? "..." : ""}
          </div>
        )}
      </div>

      {/* Application form */}
      <div className="card" style={{ padding: "2rem" }}>
        <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          <i className="bi bi-send" style={{ color: "var(--nw-blue)", marginRight: ".5rem" }}></i>
          Submit Your Application
        </h3>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: ".85rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: ".875rem" }}>
            <i className="bi bi-exclamation-circle-fill"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Cover Letter</label>
            <textarea
              className="form-control"
              placeholder="Introduce yourself and explain why you're a great fit for this role..."
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Document upload */}
          <div className="form-group">
            <label className="form-label">Upload Documents</label>
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
              <select className="form-control" style={{ width: "auto" }} value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="cv">CV / Resume</option>
                <option value="cover_letter">Cover Letter</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
              <label className="btn btn--ghost btn--sm" style={{ cursor: "pointer", border: "1.5px dashed #d1d5db" }}>
                <i className="bi bi-plus-circle"></i> Add File
                <input type="file" style={{ display: "none" }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileAdd} />
              </label>
            </div>
            {files.length > 0 && (
              <div style={{ marginTop: ".75rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".6rem .9rem", background: "#f9fafb", borderRadius: "var(--radius-sm)", border: "1px solid #e5e7eb" }}>
                    <i className="bi bi-file-earmark-text" style={{ color: "var(--nw-blue)" }}></i>
                    <span style={{ fontSize: ".875rem", flex: 1 }}>{f.name}</span>
                    <span className="badge badge--gray">{f.type}</span>
                    <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-muted mt-1" style={{ fontSize: ".78rem" }}>Accepted: PDF, DOC, DOCX, JPG, PNG (max 10MB per file)</p>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Submitting…</>
                : <><i className="bi bi-send-fill"></i> Submit Application</>
              }
            </button>
            <Link to="/careers" className="btn btn--ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}