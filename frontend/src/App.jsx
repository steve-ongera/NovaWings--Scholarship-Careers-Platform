// app.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/api.js";

// Layout components
import Navbar  from "./components/Navbar.jsx";
import Footer  from "./components/Footer.jsx";

// Portal components
import PortalNavbar from "./components/PortalNavbar.jsx";
import Sidebar      from "./components/Sidebar.jsx";

// Public pages
import Index      from "./pages/Index.jsx";
import About      from "./pages/About.jsx";
import Contact    from "./pages/Contact.jsx";
import Services   from "./pages/Services.jsx";
import Scholarship from "./pages/Scholarship.jsx";
import Careers    from "./pages/Careers.jsx";
import Login      from "./pages/Login.jsx";
import Register   from "./pages/Register.jsx";

// Protected pages
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AppJob           from "./pages/AppJob.jsx";

// ── Protected Route wrapper ─────────────────────
function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
}

// ── Public layout (Navbar + Footer) ─────────────
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// ── Portal layout (PortalNavbar + Sidebar) ───────
function PortalLayout({ children }) {
  return (
    <div className="portal-layout">
      <PortalNavbar />
      <div className="portal-body">
        <Sidebar />
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ────────────────── */}
        <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/scholarships" element={<PublicLayout><Scholarship /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />

        {/* ── Auth routes ──────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected portal routes ──────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PortalLayout><StudentDashboard /></PortalLayout>
          </ProtectedRoute>
        } />
        <Route path="/jobs/:slug/apply" element={
          <ProtectedRoute>
            <PortalLayout><AppJob /></PortalLayout>
          </ProtectedRoute>
        } />

        {/* ── 404 fallback ─────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}