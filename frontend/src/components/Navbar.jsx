// components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isAuth = authService.isAuthenticated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/",            label: "Home",         icon: "bi-house"          },
    { to: "/scholarships",label: "Scholarships", icon: "bi-mortarboard"    },
    { to: "/careers",     label: "Careers",      icon: "bi-briefcase"      },
    { to: "/services",    label: "Services",     icon: "bi-stars"          },
    { to: "/about",       label: "About",        icon: "bi-info-circle"    },
    { to: "/contact",     label: "Contact",      icon: "bi-envelope"       },
  ];

  return (
    <>
      <nav className="navbar" style={{ background: scrolled ? "rgba(11,20,55,0.98)" : undefined }}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <i className="bi bi-send-fill" style={{ color: "var(--nw-gold)" }}></i>
            Nova<span>Wings</span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar__links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={({ isActive }) => isActive ? "active" : ""}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="navbar__cta">
            {isAuth ? (
              <>
                <Link to="/dashboard" className="btn btn--outline btn--sm">
                  <i className="bi bi-grid-3x3-gap"></i> Dashboard
                </Link>
                <button className="btn btn--primary btn--sm" onClick={() => authService.logout()}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn--outline btn--sm">Login</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="navbar__hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div className={`navbar__drawer-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${open ? "open" : ""}`}>
        <div className="flex-between">
          <span className="navbar__logo" style={{ fontSize: "1.3rem" }}>
            Nova<span>Wings</span>
          </span>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <ul className="navbar__drawer-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} onClick={() => setOpen(false)}>
                <i className={`bi ${l.icon}`}></i> {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {isAuth ? (
            <>
              <Link to="/dashboard" className="btn btn--outline btn--full" onClick={() => setOpen(false)}>
                <i className="bi bi-grid-3x3-gap"></i> Dashboard
              </Link>
              <button className="btn btn--primary btn--full" onClick={() => { setOpen(false); authService.logout(); }}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn--outline btn--full" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn--primary btn--full" onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}