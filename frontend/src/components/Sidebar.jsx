// components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";

const NAV_ITEMS = [
  { to: "/dashboard",              icon: "bi-grid-1x2",      label: "Overview"        },
  { to: "/dashboard/scholarships", icon: "bi-mortarboard",   label: "Scholarships"    },
  { to: "/dashboard/applications", icon: "bi-file-earmark-text", label: "My Applications" },
  { to: "/dashboard/jobs",         icon: "bi-briefcase",     label: "Job Listings"    },
  { to: "/dashboard/job-apps",     icon: "bi-send",          label: "Job Applications"},
  { to: "/dashboard/documents",    icon: "bi-folder2-open",  label: "My Documents"    },
  { to: "/dashboard/profile",      icon: "bi-person-circle", label: "Profile"         },
  { to: "/dashboard/notifications",icon: "bi-bell",          label: "Notifications"   },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="portal-sidebar">
      {/* Section label */}
      <p style={{
        padding: "0 1.5rem .75rem",
        fontSize: ".7rem",
        fontWeight: 700,
        letterSpacing: ".09em",
        textTransform: "uppercase",
        color: "#9ca3af",
      }}>
        Student Portal
      </p>

      <ul className="sidebar__nav">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <li key={to} className="sidebar__item">
            <NavLink
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <i className={`bi ${icon}`}></i>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #e5e7eb", margin: "1.5rem 1rem" }}></div>

      {/* Bottom quick links */}
      <ul className="sidebar__nav">
        <li className="sidebar__item">
          <NavLink to="/">
            <i className="bi bi-house"></i> Back to Site
          </NavLink>
        </li>
        <li className="sidebar__item">
          <NavLink to="/contact">
            <i className="bi bi-headset"></i> Support
          </NavLink>
        </li>
        <li className="sidebar__item">
          <button
            onClick={() => authService.logout()}
            style={{
              width: "100%", background: "none", border: "none",
              display: "flex", alignItems: "center", gap: ".75rem",
              padding: ".75rem 1.5rem",
              fontSize: ".9rem", fontWeight: 500,
              color: "#dc2626", cursor: "pointer",
              borderLeft: "3px solid transparent",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
            onMouseOut={(e)  => e.currentTarget.style.background = "transparent"}
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </li>
      </ul>

      {/* Upgrade CTA (for free tier users) */}
      <div style={{
        margin: "1.5rem 1rem",
        padding: "1.25rem",
        background: "linear-gradient(135deg, var(--nw-navy), var(--nw-blue))",
        borderRadius: "var(--radius-md)",
        color: "white",
      }}>
        <div style={{ fontSize: ".8rem", fontWeight: 700, marginBottom: ".5rem" }}>
          <i className="bi bi-star-fill" style={{ color: "var(--nw-gold)" }}></i> Upgrade to Gold
        </div>
        <p style={{ fontSize: ".75rem", opacity: .8, lineHeight: 1.6, marginBottom: "1rem" }}>
          Unlock exclusive scholarships with dedicated visa assistance.
        </p>
        <NavLink
          to="/scholarships?tier=gold"
          style={{
            display: "block",
            textAlign: "center",
            background: "var(--nw-gold)",
            color: "var(--nw-midnight)",
            padding: ".45rem",
            borderRadius: "var(--radius-sm)",
            fontSize: ".8rem",
            fontWeight: 700,
          }}
        >
          View Gold Scholarships
        </NavLink>
      </div>
    </aside>
  );
}