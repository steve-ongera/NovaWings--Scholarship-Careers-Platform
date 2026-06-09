// pages/About.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const TEAM = [
  { 
    name: "Amina Ochieng",  
    role: "Co-Founder & CEO",         
    initials: "AO",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    bio: "Former international student with 10+ years in education consulting",
    social: { linkedin: "#", twitter: "#" }
  },
  { 
    name: "Brian Mwangi",   
    role: "Head of Scholarships",     
    initials: "BM",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    bio: "Expert in global scholarship programs and funding opportunities",
    social: { linkedin: "#", twitter: "#" }
  },
  { 
    name: "Cynthia Wanjiru",
    role: "Careers & Visa Advisor",   
    initials: "CW",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    bio: "Specialized in study visas and career placement",
    social: { linkedin: "#", twitter: "#" }
  },
  { 
    name: "David Kamau",    
    role: "Lead Developer",           
    initials: "DK",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    bio: "Tech innovator building accessible education platforms",
    social: { linkedin: "#", twitter: "#" }
  },
];

const VALUES = [
  { icon: "bi-people-fill",   title: "Student First",   desc: "Every decision we make is rooted in the best interests of Kenyan and African students.", color: "#16a34a" },
  { icon: "bi-shield-check",  title: "Transparency",    desc: "No hidden fees. Clear pricing, honest guidance, and full application visibility.", color: "#2563eb" },
  { icon: "bi-globe2",        title: "Global Reach",    desc: "Partnerships with universities and employers across four continents.", color: "#ea580c" },
  { icon: "bi-lightbulb-fill",title: "Innovation",      desc: "Continuously improving the platform to serve students better every day.", color: "#d97706" },
];

const milestones = [
  { year: "2020", title: "Founded", description: "NovaWings launched in Nairobi with a vision to connect Kenyan students to global education" },
  { year: "2021", title: "First Scholarships", description: "Partnered with 50+ universities and listed first 100 scholarships" },
  { year: "2022", title: "Visa Success", description: "Achieved 95% visa success rate for our first cohort of students" },
  { year: "2023", title: "Career Platform", description: "Launched jobs portal connecting students to global employers" },
  { year: "2024", title: "10,000+ Students", description: "Reached milestone of helping over 10,000 Kenyan students" },
];

export default function About() {
  const [animateOnScroll, setAnimateOnScroll] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible && !el.classList.contains('animated')) {
          el.classList.add('animated');
          setAnimateOnScroll(prev => ({ ...prev, [el.id]: true }));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ paddingTop: "1px" }}>
      {/* Hero with Background Image */}
      <div style={{ 
        background: "linear-gradient(135deg, rgba(11,20,55,0.95), rgba(19,32,87,0.9)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "6rem 0",
        position: "relative"
      }}>
        <div className="container text-center">
          <h1 className="fade-in-up" style={{ color: "white", fontSize: "3rem", marginBottom: "1rem" }}>
            About <span style={{ color: "var(--nw-white)" }}>NovaWings</span>
          </h1>
          <p className="fade-in-up delay-1" style={{ color: "rgba(255,255,255,.8)", fontSize: "1.1rem", maxWidth: 680, margin: "1rem auto 0", lineHeight: "1.8" }}>
            We exist to break down barriers between Kenyan students and the world's best academic and career opportunities.
          </p>
        </div>
      </div>

      {/* Mission Section with Image */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div className="animate-on-scroll" id="mission-text" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
              <span className="hero__eyebrow" style={{ marginBottom: "1rem", display: "inline-block" }}>
                <i className="bi bi-bullseye"></i> Our Mission
              </span>
              <h2 style={{ fontSize: "2.2rem", marginBottom: "1.5rem" }}>
                Making Global Education <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Accessible</span>
              </h2>
              <p style={{ lineHeight: 1.9, color: "#4b5563", marginBottom: "1rem", fontSize: "1.05rem" }}>
                NovaWings was founded in Nairobi with one goal: to make world-class education accessible to every talented Kenyan student, regardless of financial background.
              </p>
              <p style={{ lineHeight: 1.9, color: "#4b5563", marginBottom: "1.5rem", fontSize: "1.05rem" }}>
                We partner with universities in Canada, Australia, the USA, and the UK to source scholarships spanning Degree, Masters, and PhD levels — and we guide each student from first application to visa approval.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link to="/scholarships" className="btn btn--primary">
                  Explore Scholarships <i className="bi bi-arrow-right"></i>
                </Link>
                <Link to="/contact" className="btn btn--outline" style={{ borderColor: "var(--nw-blue)", color: "var(--nw-blue)" }}>
                  <i className="bi bi-chat-dots"></i> Contact Us
                </Link>
              </div>
            </div>
            <div className="animate-on-scroll" id="mission-stats" style={{ animation: "fadeInUp 0.6s ease-out both 0.2s" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "1.5rem",
                background: "linear-gradient(135deg, var(--nw-cream), #ffffff)",
                padding: "2rem",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)"
              }}>
                {[
                  { val: "500+", label: "Scholarships Listed", icon: "bi-mortarboard-fill", color: "#2563eb" },
                  { val: "10k+", label: "Students Helped", icon: "bi-people-fill", color: "#16a34a" },
                  { val: "30+", label: "Partner Universities", icon: "bi-building", color: "#ea580c" },
                  { val: "95%", label: "Visa Success Rate", icon: "bi-patch-check-fill", color: "#d97706" }
                ].map((stat, idx) => (
                  <div 
                    key={stat.label} 
                    style={{ 
                      background: "white", 
                      borderRadius: "var(--radius-md)", 
                      padding: "1.75rem", 
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className={`bi ${stat.icon}`} style={{ fontSize: "2rem", color: stat.color, marginBottom: "0.5rem", display: "block" }}></i>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--nw-navy)", fontWeight: 700 }}>{stat.val}</div>
                    <div style={{ fontSize: ".85rem", color: "#6b7280", marginTop: ".35rem" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section section--alt" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)" }}>
        <div className="container">
          <div className="text-center mb-4">
            <span className="hero__eyebrow">
              <i className="bi bi-clock-history"></i> Our Journey
            </span>
            <h2 style={{ fontSize: "2rem", marginTop: "0.5rem" }}>The <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NovaWings Story</span></h2>
            <p className="text-muted mt-2">How we grew from an idea to a movement</p>
          </div>
          
          <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
            {/* Timeline line */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "3px", height: "100%", background: "linear-gradient(180deg, var(--nw-blue), var(--nw-gold))", opacity: 0.3 }}></div>
            
            {milestones.map((milestone, idx) => (
              <div 
                key={milestone.year}
                className="animate-on-scroll"
                id={`milestone-${idx}`}
                style={{ 
                  display: "flex", 
                  justifyContent: idx % 2 === 0 ? "flex-start" : "flex-end",
                  marginBottom: "3rem",
                  position: "relative",
                  animation: "fadeInUp 0.6s ease-out both",
                  animationDelay: `${idx * 0.15}s`
                }}
              >
                <div style={{ width: "45%", padding: idx % 2 === 0 ? "0 2rem 0 0" : "0 0 0 2rem" }}>
                  <div className="card" style={{ padding: "1.5rem", transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <div style={{ 
                      width: "50px", 
                      height: "50px", 
                      borderRadius: "50%", 
                      background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      color: "white",
                      fontWeight: "bold"
                    }}>
                      {milestone.year.slice(-2)}
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "var(--nw-navy)" }}>{milestone.title}</h3>
                    <p className="text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>{milestone.description}</p>
                  </div>
                </div>
                <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "20px" }}>
                  <div style={{ 
                    width: "12px", 
                    height: "12px", 
                    borderRadius: "50%", 
                    background: "var(--nw-gold)",
                    border: "3px solid white",
                    boxShadow: "0 0 0 3px rgba(229,168,32,0.3)"
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section with Images */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="hero__eyebrow">
              <i className="bi bi-gem"></i> What We Believe
            </span>
            <h2 style={{ fontSize: "2rem", marginTop: "0.5rem" }}>Our Core <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Values</span></h2>
            <p className="text-muted mt-2">The principles that guide everything we do</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {VALUES.map((v, idx) => (
              <div 
                key={v.title} 
                className="card animate-on-scroll" 
                id={`value-${idx}`}
                style={{ 
                  padding: "2rem", 
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  animation: "fadeInUp 0.6s ease-out both",
                  animationDelay: `${idx * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.querySelector('.value-icon').style.transform = "scale(1.1) rotate(360deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.querySelector('.value-icon').style.transform = "scale(1) rotate(0deg)";
                }}
              >
                <div 
                  className="value-icon"
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${v.color}, ${v.color}dd)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    transition: "all 0.5s ease"
                  }}
                >
                  <i className={`bi ${v.icon}`} style={{ fontSize: "2rem", color: "white" }}></i>
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".75rem", color: v.color }}>{v.title}</h3>
                <p className="text-muted" style={{ lineHeight: "1.7" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Professional Images */}
      <section className="section section--alt">
        <div className="container">
          <div className="text-center mb-4">
            <span className="hero__eyebrow">
              <i className="bi bi-people-fill"></i> The People
            </span>
            <h2 style={{ fontSize: "2rem", marginTop: "0.5rem" }}>Meet the <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Team</span></h2>
            <p className="text-muted mt-2">Passionate experts dedicated to your success</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {TEAM.map((member, idx) => (
              <div 
                key={member.name} 
                className="card animate-on-scroll"
                id={`team-${idx}`}
                style={{ 
                  padding: "0", 
                  textAlign: "center",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  animation: "fadeInUp 0.6s ease-out both",
                  animationDelay: `${idx * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  const img = e.currentTarget.querySelector('.team-img');
                  if (img) img.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  const img = e.currentTarget.querySelector('.team-img');
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <div style={{ overflow: "hidden", height: "250px" }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="team-img"
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transition: "transform 0.5s ease"
                    }}
                  />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>{member.name}</div>
                  <div style={{ color: "var(--nw-blue)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>{member.role}</div>
                  <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1rem" }}>{member.bio}</p>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    <a href={member.social.linkedin} target="_blank" rel="noreferrer" style={{ 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: "50%", 
                      background: "#0077b5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <i className="bi bi-linkedin" style={{ fontSize: "0.9rem" }}></i>
                    </a>
                    <a href={member.social.twitter} target="_blank" rel="noreferrer" style={{ 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: "50%", 
                      background: "#1DA1F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <i className="bi bi-twitter-x" style={{ fontSize: "0.9rem" }}></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", position: "relative", overflow: "hidden" }}>
        <div className="animated-wave" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 20px, transparent 20px, transparent 40px)" }}></div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center mb-4">
            <h2 style={{ color: "white", fontSize: "2rem" }}>Our <span style={{ color: "rgba(255,255,255,0.9)" }}>Impact</span></h2>
            <p style={{ color: "rgba(255,255,255,.7)", marginTop: "1rem" }}>Making a difference in students' lives across Kenya</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
            {[
              { icon: "bi-mortarboard-fill", value: "10,000+", label: "Students Advised", suffix: "" },
              { icon: "bi-cash-stack", value: "KSh 500M+", label: "Scholarships Secured", suffix: "" },
              { icon: "bi-building", value: "200+", label: "Partner Institutions", suffix: "" },
              { icon: "bi-globe2", value: "15+", label: "Countries Reached", suffix: "" }
            ].map((item, idx) => (
              <div 
                key={item.label}
                className="animate-on-scroll"
                id={`impact-${idx}`}
                style={{ 
                  textAlign: "center", 
                  padding: "2rem",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-md)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  animation: "fadeInUp 0.6s ease-out both",
                  animationDelay: `${idx * 0.1}s`
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: "2.5rem", color: "white", marginBottom: "1rem", display: "block" }}></i>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "white", fontWeight: 700 }}>{item.value}</div>
                <div style={{ color: "rgba(255,255,255,.7)", marginTop: "0.5rem", fontSize: "0.9rem" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section section--alt">
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>Our <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Partners</span></h2>
            <p className="text-muted mt-2">Trusted by leading institutions worldwide</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", alignItems: "center" }}>
            {[
              "University of Toronto", "University of Oxford", "University of Melbourne",
              "DAAD", "British Council", "Mastercard Foundation"
            ].map((partner, idx) => (
              <div 
                key={partner}
                className="animate-on-scroll"
                id={`partner-${idx}`}
                style={{ 
                  textAlign: "center", 
                  padding: "1.5rem",
                  background: "white",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.3s ease",
                  animation: "fadeInUp 0.6s ease-out both",
                  animationDelay: `${idx * 0.05}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <i className="bi bi-building" style={{ fontSize: "2rem", color: "var(--nw-blue)", marginBottom: "0.5rem", display: "block" }}></i>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--nw-midnight)" }}>{partner}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: "linear-gradient(135deg, var(--nw-cream), #ffffff)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <div className="animate-on-scroll" id="cta" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              Ready to <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start Your Journey?</span>
            </h2>
            <p className="text-muted mb-4" style={{ fontSize: "1.05rem", maxWidth: 500, margin: "0 auto 2rem" }}>
              Join thousands of students already using NovaWings to achieve their global education dreams.
            </p>
            <div className="flex-center gap-2">
              <Link to="/register" className="btn btn--primary btn--lg">
                <i className="bi bi-rocket-takeoff-fill"></i> Create Free Account
              </Link>
              <Link to="/contact" className="btn btn--outline btn--lg">
                <i className="bi bi-chat-dots"></i> Talk to Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}