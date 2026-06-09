// pages/Index.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { scholarshipService, jobService } from "../services/api.js";

const DESTINATIONS = [
  { code: "CA", flag: "🇨🇦", name: "Canada", color: "#ff0000", bg: "linear-gradient(135deg, #ff0000, #ffffff)" },
  { code: "AU", flag: "🇦🇺", name: "Australia", color: "#00008b", bg: "linear-gradient(135deg, #00008b, #ffffff)" },
  { code: "US", flag: "🇺🇸", name: "USA", color: "#002868", bg: "linear-gradient(135deg, #002868, #ffffff)" },
  { code: "GB", flag: "🇬🇧", name: "UK", color: "#012169", bg: "linear-gradient(135deg, #012169, #ffffff)" },
];

const HOW_STEPS = [
  { icon: "bi-person-plus", title: "Create Account", desc: "Sign up free and build your NovaWings student profile in minutes.", color: "#16a34a" },
  { icon: "bi-search", title: "Browse Opportunities", desc: "Filter scholarships by destination, level, and tier that match your goals.", color: "#2563eb" },
  { icon: "bi-lock-fill", title: "Unlock & Apply", desc: "Free scholarships apply directly. Premium/Gold unlock via M-Pesa, PayPal, or Visa.", color: "#ea580c" },
  { icon: "bi-graph-up-arrow", title: "Track Your Journey", desc: "Follow real-time application stages from Submitted to Approved.", color: "#d97706" },
];

const heroImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
    title: "Study in Canada",
    description: "World-class education in a multicultural environment",
    destination: "Canada"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop",
    title: "Study in Australia",
    description: "Experience top universities down under",
    destination: "Australia"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200&h=600&fit=crop",
    title: "Study in USA",
    description: "Home to the world's best universities",
    destination: "USA"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop",
    title: "Study in UK",
    description: "Rich academic heritage and innovation",
    destination: "UK"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop",
    title: "Scholarship Opportunities",
    description: "Fully funded scholarships available",
    destination: "Global"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop",
    title: "Global Network",
    description: "Join thousands of successful students",
    destination: "Worldwide"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Emily Wanjiku",
    role: "Master's Student - University of Toronto",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "NovaWings helped me secure a fully-funded scholarship to Canada. The visa assistance was invaluable!",
    rating: 5,
    country: "Canada",
    flag: "🇨🇦"
  },
  {
    id: 2,
    name: "James Otieno",
    role: "PhD Researcher - University of Oxford",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    text: "The platform made finding the right scholarship so easy. I'm now pursuing my PhD in the UK!",
    rating: 5,
    country: "UK",
    flag: "🇬🇧"
  },
  {
    id: 3,
    name: "Mary Njeri",
    role: "Undergraduate - University of Melbourne",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    text: "From application to visa processing, NovaWings guided me every step of the way. Highly recommended!",
    rating: 5,
    country: "Australia",
    flag: "🇦🇺"
  },
  {
    id: 4,
    name: "David Mwangi",
    role: "Software Engineer - Google",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    text: "The career opportunities section helped me land my dream job in the US tech industry.",
    rating: 5,
    country: "USA",
    flag: "🇺🇸"
  },
];

const partners = [
  { name: "UNESCO", logo: "https://via.placeholder.com/150x80?text=UNESCO" },
  { name: "British Council", logo: "https://via.placeholder.com/150x80?text=British+Council" },
  { name: "DAAD", logo: "https://via.placeholder.com/150x80?text=DAAD" },
  { name: "Mastercard Foundation", logo: "https://via.placeholder.com/150x80?text=Mastercard" },
  { name: "World Bank", logo: "https://via.placeholder.com/150x80?text=World+Bank" },
  { name: "Fulbright", logo: "https://via.placeholder.com/150x80?text=Fulbright" },
];

export default function Index() {
  const [featured, setFeatured] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    Promise.all([
      scholarshipService.list({ is_featured: true, page_size: 6 }),
      jobService.list({ is_featured: true, page_size: 4 }),
    ]).then(([sRes, jRes]) => {
      setFeatured(sRes.data.results || sRes.data);
      setJobs(jRes.data.results || jRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Trigger stat animation when component mounts
    setTimeout(() => setAnimateStats(true), 500);

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    // Auto-rotate hero images
    const heroInterval = setInterval(() => {
      if (isAutoPlaying) {
        setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
      }
    }, 4000);
    
    return () => {
      clearInterval(testimonialInterval);
      clearInterval(heroInterval);
    };
  }, [isAutoPlaying]);

  // Auto-scroll partners
  useEffect(() => {
    const partnerInterval = setInterval(() => {
      setCurrentPartnerIndex((prev) => (prev + 1) % (partners.length - 2));
    }, 3000);
    return () => clearInterval(partnerInterval);
  }, []);

  const nextHeroImage = () => {
    setIsAutoPlaying(false);
    setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevHeroImage = () => {
    setIsAutoPlaying(false);
    setCurrentHeroImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const stats = [
    { icon: "bi-mortarboard-fill", val: "500+", label: "Active Scholarships", cls: "stat-card__icon--blue", suffix: "" },
    { icon: "bi-briefcase-fill", val: "200+", label: "Job Listings", cls: "stat-card__icon--green", suffix: "" },
    { icon: "bi-people-fill", val: "2.4k", label: "Students Helped", cls: "stat-card__icon--purple", suffix: "+" },
    { icon: "bi-globe2", val: "30+", label: "Partner Universities", cls: "stat-card__icon--orange", suffix: "" },
  ];

  return (
    <>
      {/* HERO with Image Carousel */}
      <section className="hero" style={{ position: "relative", overflow: "hidden", minHeight: "700px", padding: "0" }}>
        {/* Hero Image Carousel Background */}
        <div className="hero-carousel" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          {heroImages.map((image, idx) => (
            <div
              key={image.id}
              className="hero-slide"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: idx === currentHeroImage ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(11,20,55,0.9) 0%, rgba(19,32,87,0.85) 100%)"
              }}></div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button 
            onClick={prevHeroImage}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              cursor: "pointer",
              color: "white",
              fontSize: "1.5rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <button 
            onClick={nextHeroImage}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              cursor: "pointer",
              color: "white",
              fontSize: "1.5rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          
          {/* Carousel Dots */}
          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            zIndex: 10
          }}>
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentHeroImage(idx);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: currentHeroImage === idx ? "white" : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "100px", paddingBottom: "100px" }}>
          <div className="hero__content">
            
            <h1 className="fade-in-up delay-1">
              Your Wings to<br /><em style={{ background: "linear-gradient(135deg, #fff, #e0e0e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Global Education</em>
            </h1>
            <p className="hero__sub fade-in-up delay-2">
              NovaWings connects Kenyan students with scholarships to Canada, Australia, USA,
              and the UK — covering Degree, Masters, and PhD programmes. Visa assistance included.
            </p>
            <div className="hero__actions fade-in-up delay-3">
              <Link to="/scholarships" className="btn btn--primary btn--lg pulse-animation">
                <i className="bi bi-mortarboard-fill"></i> Browse Scholarships
              </Link>
              <Link to="/register" className="btn btn--outline btn--lg">
                Create Free Account <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="hero__flags fade-in-up delay-4">
              {DESTINATIONS.map((d, idx) => (
                <div 
                  key={d.code} 
                  className="hero__flag-item floating" 
                  style={{ animationDelay: `${idx * 0.2}s` }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span style={{ fontSize: "1.5rem" }}>{d.flag}</span> {d.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS with counter animation */}
      <section style={{ padding: "3rem 0", background: "linear-gradient(135deg, var(--nw-cream) 0%, #ffffff 100%)", borderBottom: "1px solid #e5e7eb" }}>
        <div className="container">
          <div className="stats-row">
            {stats.map((stat, idx) => (
              <div 
                key={stat.label} 
                className={`stat-card fade-in-up ${animateStats ? 'animated' : ''}`}
                style={{ animationDelay: `${idx * 0.15}s`, transition: "all 0.5s ease", cursor: "pointer" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div className={`stat-card__icon ${stat.cls}`}>
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <div>
                  <div className="stat-card__value">
                    {animateStats ? stat.val : "0"}
                  </div>
                  <div className="stat-card__label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SCHOLARSHIPS with hover effects */}
      <section className="section">
        <div className="container">
          <div className="flex-between mb-4">
            <div>
              <h2 style={{ fontSize: "2rem", position: "relative", display: "inline-block" }}>
                Featured <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Scholarships</span>
                <div className="animated-underline"></div>
              </h2>
              <p className="text-muted mt-1">Hand-picked opportunities across all study levels</p>
            </div>
            <Link to="/scholarships" className="btn btn--ghost hover-glow">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: "4rem" }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="scholarship-grid">
              {featured.map((s, i) => (
                <div 
                  key={s.id} 
                  className={`card fade-in-up delay-${(i % 3) + 1}`}
                  style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  {s.cover_image ? (
                    <img 
                      src={s.cover_image} 
                      alt={s.title} 
                      className="card__img"
                      style={{ transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  ) : (
                    <div className="card__img" style={{ background: "linear-gradient(135deg, var(--nw-navy), var(--nw-blue))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bi bi-mortarboard-fill" style={{ fontSize: "3rem", color: "white", opacity: 0.5 }}></i>
                    </div>
                  )}
                  <div className="card__body">
                    <div className="flex-between mb-2">
                      <span className={`tier-badge tier-badge--${s.tier}`}>
                        <i className={s.tier === "gold" ? "bi-star-fill" : s.tier === "premium" ? "bi-lock-fill" : "bi-unlock-fill"}></i>
                        {s.tier}
                      </span>
                      <span className="text-muted" style={{ fontSize: ".78rem" }}>
                        <span style={{ fontSize: "1rem" }}>{s.destination_flag || "🌍"}</span> {s.destination_name || "Various"}
                      </span>
                    </div>
                    <h3 className="card__title">{s.title}</h3>
                    <div className="card__meta">
                      <span><i className="bi bi-building"></i> {s.university || "Various"}</span>
                      <span><i className="bi bi-award"></i> {s.level}</span>
                    </div>
                    {s.deadline && (
                      <div className="card__meta">
                        <span style={{ color: new Date(s.deadline) < new Date() ? "#dc2626" : "#16a34a" }}>
                          <i className="bi bi-calendar3"></i> Deadline: {new Date(s.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <Link to={`/scholarships/${s.slug}`} className="btn btn--primary btn--sm btn--full">
                      View Details <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS with animated steps */}
      <section className="section section--alt" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)" }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>
              How <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>It Works</span>
            </h2>
            <p className="text-muted mt-2">Four simple steps to your dream scholarship</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {HOW_STEPS.map((step, i) => (
              <div 
                key={i} 
                className="card fade-in-up" 
                style={{ 
                  padding: "2rem", 
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.querySelector('.step-number').style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.querySelector('.step-number').style.transform = "scale(1)";
                }}
              >
                <div 
                  className="step-number"
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}88)`,
                    borderRadius: "50%",
                    opacity: 0.1,
                    transition: "transform 0.3s ease"
                  }}
                ></div>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem", fontSize: "2rem", color: "white",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(360deg)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
                >
                  <i className={`bi ${step.icon}`}></i>
                </div>
                <span style={{
                  display: "inline-block", background: step.color, color: "white",
                  borderRadius: 999, width: 28, height: 28, fontSize: ".8rem", fontWeight: 700,
                  lineHeight: "28px", textAlign: "center", marginBottom: ".75rem",
                }}>{i + 1}</span>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", marginBottom: ".5rem", color: step.color }}>{step.title}</h3>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL CAROUSEL */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ color: "white", fontSize: "2rem" }}>
              What Our <span style={{ color: "rgba(255,255,255,0.9)" }}>Students Say</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,.7)", marginTop: "1rem" }}>Success stories from students who achieved their dreams</p>
          </div>
          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
            <div style={{ overflow: "hidden", position: "relative" }}>
              {testimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  style={{
                    transition: "all 0.5s ease",
                    transform: `translateX(${(idx - currentTestimonial) * 100}%)`,
                    opacity: idx === currentTestimonial ? 1 : 0,
                    position: idx === currentTestimonial ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <div className="card" style={{ padding: "2rem", textAlign: "center", background: "white" }}>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        borderRadius: "50%", 
                        margin: "0 auto 1rem",
                        border: "3px solid var(--nw-gold)",
                        objectFit: "cover"
                      }} 
                    />
                    <div style={{ marginBottom: "1rem" }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill" style={{ color: "#fbbf24", margin: "0 2px" }}></i>
                      ))}
                    </div>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "1.5rem", fontStyle: "italic" }}>
                      "{testimonial.text}"
                    </p>
                    <h4 style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{testimonial.name}</h4>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      {testimonial.flag} {testimonial.country} • {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: currentTestimonial === idx ? "white" : "rgba(255,255,255,0.4)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER CAROUSEL */}
      <section className="section section--alt">
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>Our <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Partners</span></h2>
            <p className="text-muted mt-2">Trusted by leading organizations worldwide</p>
          </div>
          <div style={{ overflow: "hidden", position: "relative" }}>
            <div
              style={{
                display: "flex",
                gap: "2rem",
                transition: "transform 0.5s ease",
                transform: `translateX(-${currentPartnerIndex * (100 / 3)}%)`,
              }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: "0 0 calc(33.333% - 1.33rem)",
                    minWidth: "200px",
                    padding: "1rem",
                    background: "white",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: "bold", color: "var(--nw-midnight)" }}>{partner.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LATEST JOBS with hover effects */}
      <section className="section">
        <div className="container">
          <div className="flex-between mb-4">
            <div>
              <h2 style={{ fontSize: "2rem", position: "relative", display: "inline-block" }}>
                Latest <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Jobs</span>
              </h2>
              <p className="text-muted mt-1">Career opportunities for students and graduates</p>
            </div>
            <Link to="/careers" className="btn btn--ghost hover-glow">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {jobs.map((job, i) => (
              <div 
                key={job.id} 
                className={`card fade-in-up delay-${(i % 3) + 1}`}
                style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div className="card__body">
                  <div className="flex gap-2 mb-2" style={{ alignItems: "center" }}>
                    {job.company_logo ? (
                      <img 
                        src={job.company_logo} 
                        alt={job.company} 
                        style={{ width: 50, height: 50, borderRadius: 8, objectFit: "contain", border: "1px solid #e5e7eb" }} 
                      />
                    ) : (
                      <div style={{ width: 50, height: 50, background: "linear-gradient(135deg, var(--nw-navy), var(--nw-blue))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="bi bi-building" style={{ color: "white", fontSize: "1.5rem" }}></i>
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--nw-midnight)" }}>{job.company}</div>
                      <div style={{ fontSize: ".75rem", color: "#9ca3af" }}>{job.category_name}</div>
                    </div>
                  </div>
                  <h3 className="card__title" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{job.title}</h3>
                  <div className="card__meta">
                    <span><i className="bi bi-geo-alt"></i> {job.location || "Remote"}</span>
                    <span><i className="bi bi-clock"></i> {job.job_type?.replace("_", " ") || "Full Time"}</span>
                  </div>
                  {job.salary_range && (
                    <div className="card__meta">
                      <span><i className="bi bi-cash"></i> {job.salary_range}</span>
                    </div>
                  )}
                  <Link to={`/jobs/${job.slug}/apply`} className="btn btn--primary btn--sm btn--full" style={{ marginTop: "1rem" }}>
                    Apply Now <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG / NEWS SECTION */}
      <section className="section section--alt">
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "2rem" }}>Latest <span style={{ background: "linear-gradient(135deg, var(--nw-blue), var(--nw-midnight))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>News & Updates</span></h2>
            <p className="text-muted mt-2">Stay informed about scholarships, deadlines, and opportunities</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="card"
                style={{ transition: "all 0.3s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div style={{ 
                  height: "200px", 
                  background: `linear-gradient(135deg, var(--nw-navy), var(--nw-blue))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url('https://images.unsplash.com/photo-${item === 1 ? '1523050854058-8df90110c9f1' : item === 2 ? '1500382017468-9049fed747ef' : '1485738422979-f5c462d49f74'}?w=600&h=400&fit=crop')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3
                  }}></div>
                  <i className="bi bi-newspaper" style={{ fontSize: "3rem", color: "white", opacity: 0.8, position: "relative", zIndex: 1 }}></i>
                </div>
                <div className="card__body">
                  <div className="card__meta">
                    <span><i className="bi bi-calendar3"></i> December {item + 10}, 2024</span>
                    <span><i className="bi bi-clock"></i> 3 min read</span>
                  </div>
                  <h3 className="card__title">Scholarship Deadline Approaching for {item === 1 ? "Canada" : item === 2 ? "Australia" : "UK"} Programs</h3>
                  <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                    Don't miss out on these amazing opportunities. Apply now before the deadline closes.
                  </p>
                  <Link to="/blog" className="btn btn--ghost btn--sm" style={{ paddingLeft: 0 }}>
                    Read More <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER with animation */}
      <section style={{ background: "linear-gradient(135deg, var(--nw-midnight), var(--nw-navy))", padding: "5rem 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="animated-wave"></div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ color: "white", fontSize: "2.2rem", marginBottom: "1rem" }}>
            Ready to Take <span style={{ background: "linear-gradient(135deg, #fff, #e0e0e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flight?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: 540, margin: "0 auto 2rem" }}>
            Join thousands of Kenyan students who have launched their global careers through NovaWings.
          </p>
          <div className="flex-center gap-2">
            <Link 
              to="/register" 
              className="btn btn--primary btn--lg pulse-animation"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <i className="bi bi-rocket-takeoff-fill"></i> Start Your Journey
            </Link>
            <Link 
              to="/contact" 
              className="btn btn--outline btn--lg"
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              Talk to Us <i className="bi bi-chat-dots"></i>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-carousel {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .hero-slide {
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animated-underline {
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--nw-blue), var(--nw-midnight));
          animation: expandUnderline 1s ease forwards;
        }
        
        @keyframes expandUnderline {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 15px rgba(26, 58, 158, 0.3);
          transition: all 0.3s ease;
        }
        
        .animated-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 40px);
          animation: waveMove 20s linear infinite;
        }
        
        @keyframes waveMove {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
      `}</style>
    </>
  );
}