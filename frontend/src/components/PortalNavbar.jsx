// components/PortalNavbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, notificationService } from "../services/api.js";

export default function PortalNavbar() {
  const [user,          setUser]          = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const navigate    = useNavigate();
  const notifRef    = useRef(null);
  const profileRef  = useRef(null);

  useEffect(() => {
    authService.getProfile()
      .then((r) => setUser(r.data))
      .catch(() => {});
    notificationService.list()
      .then((r) => setNotifications(r.data.results || r.data))
      .catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.is_read).length;

  const handleMarkAll = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <nav className="portal-navbar">
      {/* Logo */}
      <Link to="/" className="navbar__logo" style={{ fontSize: "1.3rem" }}>
        <i className="bi bi-send-fill" style={{ color: "var(--nw-gold)" }}></i>
        Nova<span style={{ color: "var(--nw-gold)" }}>Wings</span>
      </Link>

      <div className="flex gap-2" style={{ alignItems: "center" }}>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            style={{
              background: "rgba(255,255,255,.08)",
              border: "none",
              borderRadius: "50%",
              width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", cursor: "pointer", position: "relative",
            }}
            aria-label="Notifications"
          >
            <i className="bi bi-bell" style={{ fontSize: "1.15rem" }}></i>
            {unread > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                width: 16, height: 16,
                background: "#ef4444",
                borderRadius: "50%",
                fontSize: ".65rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700,
              }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: 48, right: 0,
              width: 340,
              background: "white",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 999,
              overflow: "hidden",
            }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: ".9rem", color: "var(--nw-navy)" }}>Notifications</strong>
                {unread > 0 && (
                  <button onClick={handleMarkAll} style={{ background: "none", border: "none", color: "var(--nw-blue)", fontSize: ".8rem", cursor: "pointer" }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#9ca3af", fontSize: ".875rem" }}>
                    <i className="bi bi-bell-slash" style={{ fontSize: "2rem", display: "block", marginBottom: ".5rem" }}></i>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: ".9rem 1.25rem",
                        borderBottom: "1px solid #f9fafb",
                        background: n.is_read ? "white" : "#f0f4ff",
                        cursor: n.link ? "pointer" : "default",
                      }}
                      onClick={() => { if (n.link) navigate(n.link); setNotifOpen(false); }}
                    >
                      <div style={{ fontSize: ".875rem", fontWeight: n.is_read ? 400 : 600, color: "#111827" }}>{n.title}</div>
                      <div style={{ fontSize: ".78rem", color: "#6b7280", marginTop: ".2rem" }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            style={{
              background: "rgba(255,255,255,.08)",
              border: "none",
              borderRadius: 999,
              padding: ".35rem .9rem .35rem .5rem",
              display: "flex", alignItems: "center", gap: ".6rem",
              color: "white", cursor: "pointer",
            }}
          >
            {user?.profile_photo ? (
              <img src={user.profile_photo} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <span style={{
                width: 30, height: 30,
                borderRadius: "50%",
                background: "var(--nw-gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--nw-midnight)", fontWeight: 700, fontSize: ".85rem",
              }}>
                {user?.first_name?.[0]?.toUpperCase() || "U"}
              </span>
            )}
            <span style={{ fontSize: ".875rem", fontWeight: 500 }}>{user?.first_name || "Account"}</span>
            <i className="bi bi-chevron-down" style={{ fontSize: ".7rem", opacity: .7 }}></i>
          </button>

          {profileOpen && (
            <div style={{
              position: "absolute", top: 48, right: 0,
              width: 200,
              background: "white",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 999,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}>
              {[
                ["/dashboard",        "bi-grid",          "Dashboard"],
                ["/dashboard/profile","bi-person",        "My Profile"],
                ["/dashboard/apps",   "bi-file-earmark",  "My Applications"],
              ].map(([to, icon, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: ".65rem",
                    padding: ".75rem 1.1rem",
                    fontSize: ".875rem", color: "#374151",
                    borderBottom: "1px solid #f9fafb",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#f9fafb"}
                  onMouseOut={(e)  => e.currentTarget.style.background = "transparent"}
                >
                  <i className={`bi ${icon}`} style={{ color: "var(--nw-blue)" }}></i>
                  {label}
                </Link>
              ))}
              <button
                onClick={() => authService.logout()}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: ".65rem",
                  padding: ".75rem 1.1rem",
                  fontSize: ".875rem", color: "#dc2626",
                  background: "none", border: "none", cursor: "pointer",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
                onMouseOut={(e)  => e.currentTarget.style.background = "transparent"}
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}