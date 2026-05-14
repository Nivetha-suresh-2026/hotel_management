import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../routes/paths";

/* ─── Tiny Staff Sidebar ─────────────────────────────────────── */
export function StaffSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const menu = [
    { name: "Dashboard",       path: PATHS.STAFF_DASHBOARD,  icon: "🏠" },
    { name: "My Profile",      path: PATHS.STAFF_PROFILE,    icon: "👤" },
    { name: "Assigned Tasks",  path: PATHS.STAFF_TASKS,      icon: "📋" },
    { name: "Leave Requests",  path: PATHS.STAFF_LEAVE,      icon: "📅" },
  ];

  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "#0f172a",
      display: "flex", flexDirection: "column", padding: "1.5rem 0",
      position: "fixed", top: 0, left: 0, zIndex: 100,
    }}>
      <div style={{ padding: "0 1.5rem 2rem", fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
        Hostay
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0 0.75rem" }}>
        {menu.map(item => (
          <Link key={item.path} to={item.path} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.75rem 1rem", borderRadius: "10px",
            color: location.pathname === item.path ? "#fff" : "#94a3b8",
            background: location.pathname === item.path ? "#4f46e5" : "transparent",
            textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div style={{ padding: "0 0.75rem 1rem" }}>
        <button onClick={signOut} style={{
          width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
          background: "transparent", border: "1px solid #1e293b",
          color: "#f87171", fontWeight: 600, fontSize: "0.875rem",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

/* ─── Staff Layout Wrapper ───────────────────────────────────── */
export function StaffWrapper({ title, subtitle, children }) {
  const { profile } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <StaffSidebar />
      <main style={{ flex: 1, marginLeft: 220, display: "flex", flexDirection: "column" }}>
        <header style={{
          background: "#fff", padding: "1rem 2.5rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>{title}</h2>
            {subtitle && <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "#64748b" }}>{subtitle}</p>}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.5rem 1rem", background: "#f1f5f9", borderRadius: "12px",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: "0.875rem",
            }}>
              {(profile?.name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1e293b" }}>{profile?.name || "Staff"}</div>
              <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Staff Member</div>
            </div>
          </div>
        </header>
        <div style={{ padding: "2.5rem", flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}

/* ─── Stat Mini Card ─────────────────────────────────────────── */
export function MiniStat({ label, value, icon, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem",
      border: "1px solid #f1f5f9", borderLeft: `4px solid ${color}`,
      display: "flex", alignItems: "center", gap: "1rem",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "12px",
        background: `${color}18`, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "1.4rem",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b" }}>{value}</div>
        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}
