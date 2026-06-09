// components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer section gray-bg" style={{ background: "var(--nw-midnight)" }}>
      <div className="container">
        <div className="footer__grid">
          {/* Brand Section */}
          <div className="footer__brand">
            <div className="logo mb-4">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}>
                Nova<span style={{ color: "var(--nw-gold)" }}>Wings</span>
              </h3>
            </div>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, marginBottom: "1.25rem", color: "rgba(255,255,255,.7)" }}>
              Connecting Kenyan students with world-class scholarship and career
              opportunities in Canada, Australia, USA, and the UK. Your trusted
              partner in global education.
            </p>
            <div className="flex gap-2">
              {[
                ["bi-facebook", "https://facebook.com"],
                ["bi-twitter-x", "https://twitter.com"],
                ["bi-instagram", "https://instagram.com"],
                ["bi-linkedin", "https://linkedin.com"],
              ].map(([icon, href]) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,.7)",
                    fontSize: "1rem",
                    transition: "all 0.25s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--nw-gold)";
                    e.currentTarget.style.color = "var(--nw-midnight)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,.7)";
                  }}
                >
                  <i className={`bi ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Scholarships Section */}
          <div className="footer__col">
            <h4 style={{ color: "var(--nw-white)", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: 600 }}>
              Scholarships
            </h4>
            <div className="divider" style={{ width: "40px", height: "3px", background: "var(--nw-gold)", marginBottom: "1.25rem" }}></div>
            <ul>
              {[
                ["/scholarships?destination=CA", "Canada Scholarships", "bi-map"],
                ["/scholarships?destination=AU", "Australia Awards", "bi-globe"],
                ["/scholarships?destination=US", "USA Programs", "bi-flag"],
                ["/scholarships?destination=GB", "UK Opportunities", "bi-building"],
                ["/scholarships?level=phd", "PhD Programs", "bi-mortarboard"],
                ["/scholarships?level=masters", "Masters Programs", "bi-book"],
              ].map(([to, label, icon]) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: "rgba(255,255,255,.7)", transition: "color 0.25s", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "var(--nw-gold)")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                  >
                    <i className={icon} style={{ fontSize: "0.875rem" }}></i> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 style={{ color: "var(--nw-white)", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: 600 }}>
              Quick Links
            </h4>
            <div className="divider" style={{ width: "40px", height: "3px", background: "var(--nw-gold)", marginBottom: "1.25rem" }}></div>
            <ul>
              {[
                ["/careers", "Job Listings", "bi-briefcase"],
                ["/services", "Our Services", "bi-stars"],
                ["/about", "About NovaWings", "bi-info-circle"],
                ["/contact", "Contact Us", "bi-envelope"],
                ["/login", "Student Login", "bi-box-arrow-in-right"],
                ["/register", "Create Account", "bi-person-plus"],
              ].map(([to, label, icon]) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: "rgba(255,255,255,.7)", transition: "color 0.25s", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "var(--nw-gold)")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                  >
                    <i className={icon} style={{ fontSize: "0.875rem" }}></i> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer__col">
            <h4 style={{ color: "var(--nw-white)", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: 600 }}>
              Get in Touch
            </h4>
            <div className="divider" style={{ width: "40px", height: "3px", background: "var(--nw-gold)", marginBottom: "1.25rem" }}></div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <i className="bi bi-envelope" style={{ color: "var(--nw-gold)", fontSize: "1.1rem" }}></i>
                <span style={{ color: "rgba(255,255,255,.6)", fontSize: "0.875rem" }}>Email Support</span>
              </div>
              <a
                href="mailto:info@novawings.co.ke"
                style={{ color: "var(--nw-white)", fontWeight: 500, transition: "color 0.25s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--nw-gold)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--nw-white)")}
              >
                <i className="bi bi-envelope-fill" style={{ fontSize: "0.875rem", marginRight: "0.5rem" }}></i>
                info@novawings.co.ke
              </a>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <i className="bi bi-telephone" style={{ color: "var(--nw-gold)", fontSize: "1.1rem" }}></i>
                <span style={{ color: "rgba(255,255,255,.6)", fontSize: "0.875rem" }}>24/7 Helpline</span>
              </div>
              <a
                href="tel:+254700000000"
                style={{ color: "var(--nw-white)", fontWeight: 500, fontSize: "1.1rem", transition: "color 0.25s" }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--nw-gold)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--nw-white)")}
              >
                <i className="bi bi-telephone-fill" style={{ fontSize: "0.875rem", marginRight: "0.5rem" }}></i>
                +254 700 000 000
              </a>
            </div>

            <div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <i className="bi bi-geo-alt" style={{ color: "var(--nw-gold)", fontSize: "1.1rem" }}></i>
                <span style={{ color: "rgba(255,255,255,.6)", fontSize: "0.875rem" }}>Visit Us</span>
              </div>
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="bi bi-building"></i>
                Westlands Business Park, 3rd Floor, Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom" style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: "1.5rem", marginTop: "2rem" }}>
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6">
              <div className="copyright" style={{ color: "rgba(255,255,255,.6)", fontSize: "0.875rem" }}>
                <i className="bi bi-c-circle" style={{ marginRight: "0.25rem" }}></i>
                {year} NovaWings. All rights reserved. 
                <span style={{ color: "var(--nw-gold)" }}> Empowering Kenyan students</span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="flex gap-3" style={{ justifyContent: "flex-end" }}>
                <Link
                  to="/privacy"
                  style={{ color: "rgba(255,255,255,.5)", fontSize: "0.8125rem", transition: "color 0.25s", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "var(--nw-gold)")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
                >
                  <i className="bi bi-shield-lock"></i> Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  style={{ color: "rgba(255,255,255,.5)", fontSize: "0.8125rem", transition: "color 0.25s", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "var(--nw-gold)")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
                >
                  <i className="bi bi-file-text"></i> Terms of Service
                </Link>
                <span style={{ color: "rgba(255,255,255,.4)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  Made with <i className="bi bi-heart-fill" style={{ color: "var(--nw-gold)" }}></i> in Nairobi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}