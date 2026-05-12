import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

export const AdminWrapper = ({ title, subtitle, children, notification, showSearch, breadcrumbs }) => {
  const [showProfile, setShowProfile] = React.useState(false);
  const { session, role, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && !session) {
      console.warn("AdminWrapper: No session found, redirecting to login.");
      navigate(PATHS.LOGIN);
    }
  }, [session, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: "0 auto 1rem", border: "4px solid #e2e8f0", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
          <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header style={{
          background: "white",
          padding: "1rem 2.5rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {breadcrumbs && (
              <button
                onClick={() => navigate(-1)}
                style={{ background: "#f1f5f9", border: "none", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                ←
              </button>
            )}
            <div>
              {breadcrumbs && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2px" }}>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <span
                        style={{ fontSize: "0.75rem", color: index === breadcrumbs.length - 1 ? "var(--primary)" : "#94a3b8", cursor: crumb.path ? "pointer" : "default", fontWeight: 600 }}
                        onClick={() => crumb.path && navigate(crumb.path)}
                      >
                        {crumb.label}
                      </span>
                      {index < breadcrumbs.length - 1 && <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>/</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "var(--text-main)" }}>{title}</h2>
              {subtitle && <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{subtitle}</p>}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {showSearch && (
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "1rem", color: "#94a3b8" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search booking, room, etc"
                  style={{ width: "260px", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "12px", background: "#f1f5f9", border: "1px solid transparent", fontSize: "0.875rem" }}
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {role === "admin" && (
                <Link to={PATHS.BOOKING}>
                  <button style={{ background: "var(--primary)", color: "white", border: "none", borderRadius: "10px", padding: "0.625rem 1.25rem", fontWeight: 600, fontSize: "0.875rem" }}>
                    + New Booking
                  </button>
                </Link>
              )}

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  style={{ background: "#f1f5f9", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontSize: "1.25rem" }}>👤</span>
                </button>

                {showProfile && (
                  <div style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    width: "220px",
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    border: "1px solid #f1f5f9",
                    padding: "1rem",
                    animation: "slideDown 0.2s ease-out"
                  }}>
                    <div style={{ marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-main)" }}>
                        {profile?.name || "Loading..."}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", textTransform: "capitalize" }}>
                        {profile?.role?.replace(/_/g, " ") || "User"}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "0.625rem",
                        borderRadius: "10px",
                        background: "#fff1f2",
                        color: "#e11d48",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center"
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {notification && (
          <div style={{
            margin: "1.5rem 2.5rem 0",
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            background: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: notification.type === "success" ? "#166534" : "#991b1b",
            fontSize: "0.875rem",
            fontWeight: "600",
            border: `1px solid ${notification.type === "success" ? "#bbf7d0" : "#fecaca"}`
          }}>
            {notification.type === "success" ? "✓ " : "✕ "}{notification.message}
          </div>
        )}

        <div className="container" style={{ padding: "2.5rem" }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "var(--text-main)" }}>{title}</h3>
    {subtitle && <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--text-muted)" }}>{subtitle}</p>}
  </div>
);

export const HubCard = ({ title, description, icon, path, color }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="card"
      style={{
        cursor: "pointer",
        padding: "1.75rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #f1f5f9",
        borderTop: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
      }}
    >
      <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontSize: "1.5rem" }}>{icon}</div>
        <div style={{ fontWeight: "800", fontSize: "1.25rem", color: "#1e293b" }}>{title}</div>
      </div>
      <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b", lineHeight: "1.5" }}>{description}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <span style={{ color: color, fontWeight: "700", fontSize: "0.8125rem", background: `${color}15`, padding: "4px 12px", borderRadius: "20px" }}>Open Hub →</span>
      </div>
    </div>
  );
};

export const HubBanner = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="card" style={{
      padding: "2.5rem",
      display: "flex",
      alignItems: "center",
      gap: "2.5rem",
      marginBottom: "2.5rem",
      borderRadius: "32px",
      background: "white",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.04)",
      border: "1px solid #f1f5f9"
    }}>
      <div style={{ position: "relative" }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <img src={imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>{title}</h1>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.125rem", color: "#64748b", fontWeight: "500" }}>{subtitle}</p>
      </div>
    </div>
  );
};
