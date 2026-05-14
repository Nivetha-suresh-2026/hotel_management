import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PATHS } from "../../routes/paths";
import { AdminWrapper } from "../admin/AdminWrapper";
import { useAuth } from "../../hooks/useAuth";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { session, role, profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    staffCount: 0,
    adminCount: 0,
    roomCount: 0,
    branchCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && session && role === 'owner') {
      fetchDashboardData();
    }
  }, [authLoading, session, role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Staff from Supabase (filtered by role)
      const { count: staffCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'staff');

      // 2. Admins from Supabase (filtered by role)
      const { count: adminCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // 3. Rooms from Supabase
      const { count: roomCount } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });

      // 4. Branches from Supabase
      const { count: branchCount } = await supabase
        .from('hotel_branches')
        .select('*', { count: 'exact', head: true });

      setStats({
        staffCount: staffCount || 0,
        adminCount: adminCount || 0,
        roomCount: roomCount || 0,
        branchCount: branchCount || 0
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  // Session exists but role hasn't been fetched from DB yet — keep waiting
  if (session && !role) return null;

  if (!session || role !== "owner") {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view the Owner Portal.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "var(--primary)", color: "white", border: "none", fontWeight: 600 }}>Go to Login</button>
      </div>
    );
  }

  const kpis = [
    { title: "Total Staff", value: stats.staffCount, icon: "👥", color: "#6366f1" },
    { title: "Admin Users", value: stats.adminCount, icon: "🔑", color: "#10b981" },
    { title: "Total Rooms", value: stats.roomCount, icon: "🏨", color: "#f59e0b" },
    { title: "Total Branches", value: stats.branchCount, icon: "📍", color: "#ef4444" },
  ];

  const chartData = [
    { name: "Staff", count: stats.staffCount },
    { name: "Admins", count: stats.adminCount },
    { name: "Rooms", count: stats.roomCount },
    { name: "Branches", count: stats.branchCount },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <AdminWrapper title="Business Insights" subtitle="Real-time performance and resource overview">
      <div className="container" style={{ padding: 0 }}>
        {/* Section 1: KPI Cards */}
        <section className="dashboard-grid" style={{ marginTop: 0 }}>
          {kpis.map((kpi, index) => (
            <div key={index} className="stat-card" style={{ borderTop: `4px solid ${kpi.color}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>{kpi.icon}</span>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-muted)" }}>{kpi.title}</h3>
              </div>
              <p style={{ fontSize: "2.5rem", margin: 0, fontWeight: "800" }}>{kpi.value}</p>
            </div>
          ))}
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", marginTop: "2rem" }}>
          {/* Section 2: Visualization */}
          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Resource Distribution</h3>
            <div style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 3: Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="card" style={{ background: "#0f172a", color: "white" }}>
              <h3 style={{ margin: "0 0 1.5rem 0", color: "#38bdf8", fontSize: "1rem" }}>🕵️ Admin Activity Monitor</h3>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: "1.6" }}>
                Track real-time system changes, including room creations, branch registrations, and staff onboarding events.
              </p>
              <button
                onClick={() => navigate(PATHS.OWNER_ACTIVITY)}
                style={{ width: "100%", marginTop: "1.5rem", background: "#1e293b", border: "none", color: "#38bdf8", padding: "12px", borderRadius: "8px", fontSize: "0.875rem", cursor: "pointer", fontWeight: "600" }}
              >
                View Full Audit Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

export default OwnerDashboard;