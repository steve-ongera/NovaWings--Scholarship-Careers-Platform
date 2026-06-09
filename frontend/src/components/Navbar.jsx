// components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api.js";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isAuth = authService.isAuthenticated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mainNavLinks = [
    { to: "/", label: "Home", icon: "bi-house" },
    { to: "/scholarships", label: "Scholarships", icon: "bi-mortarboard" },
    { to: "/careers", label: "Careers", icon: "bi-briefcase" },
  ];

  const dropdownLinks = [
    { to: "/services", label: "Our Services", icon: "bi-stars" },
    { to: "/about", label: "About Us", icon: "bi-info-circle" },
    { to: "/contact", label: "Contact", icon: "bi-envelope" },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate("/");
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Sub Navigation (Top Bar) */}
      <div className="subnav">
        <div className="subnav__inner">
          <ul className="subnav__info">
            <li>
              <i className="bi bi-envelope"></i>
              <a href="mailto:info@novawings.co.ke">info@novawings.co.ke</a>
            </li>
            <li>
              <i className="bi bi-geo-alt"></i>
              <span>Westlands, Nairobi, Kenya</span>
            </li>
            <li>
              <i className="bi bi-clock"></i>
              <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
            </li>
          </ul>
          <div className="subnav__emergency">
            <span>Emergency Support:</span>
            <a href="tel:+254700000000" className="emergency-number">
              <i className="bi bi-telephone-fill"></i> +254 700 000 000
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`mainnav ${scrolled ? "mainnav--scrolled" : ""}`}>
        <div className="mainnav__inner">
          {/* Logo */}
          <Link to="/" className="mainnav__logo">
            <i className="bi bi-send-fill"></i>
            Nova<span>Wings</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="mainnav__menu">
            {mainNavLinks.map((link) => (
              <li key={link.to} className="mainnav__menu-item">
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `mainnav__menu-link ${isActive ? "active" : ""}`
                  }
                >
                  <i className={link.icon}></i>
                  {link.label}
                </NavLink>
              </li>
            ))}
            
            {/* Dropdown Menu */}
            <li className="mainnav__dropdown">
              <span className="mainnav__menu-link">
                <i className="bi bi-grid-3x3-gap"></i> More
                <i className="bi bi-chevron-down" style={{ fontSize: "0.75rem" }}></i>
              </span>
              <div className="mainnav__dropdown-menu">
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="mainnav__dropdown-item"
                  >
                    <i className={link.icon}></i> {link.label}
                  </Link>
                ))}
              </div>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="mainnav__cta">
            {isAuth ? (
              <>
                <Link to="/dashboard" className="btn btn--outline btn--sm">
                  <i className="bi bi-grid-3x3-gap"></i> Dashboard
                </Link>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--outline btn--sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn--primary btn--sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="mainnav__hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mainnav__drawer-overlay ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`mainnav__drawer ${drawerOpen ? "open" : ""}`}>
        <div className="flex-between">
          <span className="mainnav__logo" style={{ fontSize: "1.3rem" }}>
            Nova<span>Wings</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <ul className="mainnav__drawer-links">
          {[...mainNavLinks, ...dropdownLinks].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className={link.icon}></i> {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mainnav__drawer-emergency">
          <p>
            <i className="bi bi-telephone-fill"></i> Emergency Support
          </p>
          <a href="tel:+254700000000">+254 700 000 000</a>
          <small>24/7 Available for urgent inquiries</small>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            paddingTop: "1.5rem",
          }}
        >
          {isAuth ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn--outline btn--full"
                onClick={() => setDrawerOpen(false)}
              >
                <i className="bi bi-grid-3x3-gap"></i> Dashboard
              </Link>
              <button
                className="btn btn--primary btn--full"
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn--outline btn--full"
                onClick={() => setDrawerOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn--primary btn--full"
                onClick={() => setDrawerOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}