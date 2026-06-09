// components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <h3>Nova<span>Wings</span></h3>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              Connecting Kenyan students with world-class scholarship and career
              opportunities in Canada, Australia, USA, and the UK.
            </p>
            <div className="flex gap-2">
              {[
                ["bi-facebook",  "https://facebook.com"],
                ["bi-twitter-x", "https://twitter.com"],
                ["bi-instagram", "https://instagram.com"],
                ["bi-linkedin",  "https://linkedin.com"],
              ].map(([icon, href]) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,.7)",
                    fontSize: ".95rem",
                    transition: "all .25s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--nw-gold)"; e.currentTarget.style.color = "var(--nw-gold)"; }}
                  onMouseOut={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; e.currentTarget.style.color = "rgba(255,255,255,.7)"; }}
                >
                  <i className={`bi ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          <div className="footer__col">
            <h4>Scholarships</h4>
            <ul>
              {[
                ["/scholarships?destination=CA", "🍁 Canada"],
                ["/scholarships?destination=AU", "🦘 Australia"],
                ["/scholarships?destination=US", "🗽 USA"],
                ["/scholarships?destination=GB", "🇬🇧 United Kingdom"],
                ["/scholarships?level=phd",      "PhD Programs"],
                ["/scholarships?level=masters",  "Masters Programs"],
              ].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              {[
                ["/careers",  "Job Listings"],
                ["/services", "Our Services"],
                ["/about",    "About NovaWings"],
                ["/contact",  "Contact Us"],
                ["/login",    "Student Login"],
                ["/register", "Create Account"],
              ].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li style={{ display: "flex", gap: ".5rem", alignItems: "flex-start" }}>
                <i className="bi bi-geo-alt" style={{ color: "var(--nw-gold)", marginTop: ".15rem" }}></i>
                <span>Westlands, Nairobi, Kenya</span>
              </li>
              <li style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                <i className="bi bi-envelope" style={{ color: "var(--nw-gold)" }}></i>
                <a href="mailto:info@novawings.co.ke">info@novawings.co.ke</a>
              </li>
              <li style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                <i className="bi bi-telephone" style={{ color: "var(--nw-gold)" }}></i>
                <a href="tel:+254700000000">+254 700 000 000</a>
              </li>
              <li style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                <i className="bi bi-globe" style={{ color: "var(--nw-gold)" }}></i>
                <a href="https://www.novawings.co.ke" target="_blank" rel="noreferrer">www.novawings.co.ke</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <span>© {year} NovaWings. All rights reserved.</span>
          <div className="flex gap-2">
            <Link to="/privacy" style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem" }}>Privacy Policy</Link>
            <Link to="/terms"   style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem" }}>Terms of Use</Link>
          </div>
          <span style={{ fontSize: ".82rem" }}>Made with <i className="bi bi-heart-fill" style={{ color: "var(--nw-gold)" }}></i> in Nairobi</span>
        </div>
      </div>
    </footer>
  );
}