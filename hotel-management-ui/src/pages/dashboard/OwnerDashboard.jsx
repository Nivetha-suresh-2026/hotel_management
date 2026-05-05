import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function OwnerDashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "owner") {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view the Owner Portal.</p>
        <button onClick={() => navigate("/")}>Go to Login</button>
      </div>
    );
  }

  const kpis = [
    { title: "Total Revenue", value: "$1.42M", trend: "+12%", color: "#6366f1" },
    { title: "Total Bookings", value: "2,840", trend: "+5.4%", color: "#10b981" },
    { title: "Occupancy Rate", value: "84.5%", trend: "+2.1%", color: "#f59e0b" },
    { title: "Net Profit", value: "$420K", trend: "+8.2%", color: "#ef4444" },
  ];

  const activities = [
    { admin: "Zain George", action: "Created Booking", target: "#00124 (Guest: Alice)", time: "10 mins ago" },
    { admin: "Zain George", action: "Modified Room", target: "Suite 302 (Price updated)", time: "1 hour ago" },
    { admin: "Sarah Khan", action: "Cancelled Booking", target: "#00119 (Refund processed)", time: "3 hours ago" },
    { admin: "Zain George", action: "Updated Staff", target: "John Doe (Role change)", time: "Yesterday" },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header style={{ 
          background: "white", 
          padding: "1rem 2rem", 
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ margin: 0 }}>Business Insights</h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Last synced: Just now</span>
            <button style={{ background: "#f1f5f9", color: "var(--text-main)", border: "1px solid var(--border-color)", padding: "6px 12px" }}>
              Download PDF Report
            </button>
          </div>
        </header>

        <div className="container">
          {/* Section 1: KPI Cards */}
          <section className="dashboard-grid" style={{ marginTop: 0 }}>
            {kpis.map((kpi, index) => (
              <div key={index} className="stat-card" style={{ borderTop: `4px solid ${kpi.color}` }}>
                <h3>{kpi.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontSize: "2rem" }}>{kpi.value}</p>
                  <span style={{ color: "#10b981", fontSize: "0.875rem", fontWeight: 700 }}>{kpi.trend}</span>
                </div>
              </div>
            ))}
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", marginTop: "2rem" }}>
            {/* Section 2: Revenue Analytics & Performance */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0 }}>Revenue Growth</h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ fontSize: "0.75rem", padding: "4px 8px", background: "#dcfce7", color: "#166534", borderRadius: "4px" }}>Peak Season: Summer</span>
                  </div>
                </div>
                <div style={{ height: "250px", background: "#f8fafc", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", border: "1px dashed var(--border-color)" }}>
                  [ Monthly Revenue Analytics Graph Placeholder ]
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "1.5rem" }}>Top Performing Room Types</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { type: "Presidential Suite", rev: "$45,000", occ: "92%" },
                    { type: "Deluxe Family", rev: "$38,200", occ: "88%" },
                    { type: "Standard Double", rev: "$22,500", occ: "76%" },
                  ].map((room, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: "#f8fafc", borderRadius: "8px" }}>
                      <span style={{ fontWeight: 600 }}>{room.type}</span>
                      <div style={{ display: "flex", gap: "1.5rem" }}>
                        <span style={{ color: "#10b981" }}>{room.rev}</span>
                        <span style={{ color: "var(--text-muted)" }}>{room.occ} Occ.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Admin Activity Monitoring */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="card" style={{ background: "#0f172a", color: "white" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", color: "#38bdf8", fontSize: "1rem" }}>🕵️ Admin Activity Audit</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {activities.map((act, i) => (
                    <div key={i} style={{ borderLeft: "2px solid #334155", paddingLeft: "1rem" }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>{act.admin}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>{act.action}: <span style={{ color: "white" }}>{act.target}</span></div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>{act.time}</div>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", marginTop: "1.5rem", background: "#1e293b", border: "none", color: "#38bdf8", padding: "8px", fontSize: "0.75rem", cursor: "pointer" }}>
                  View Full Audit Log
                </button>
              </div>

              {/* Section 5: Alerts */}
              <div className="card" style={{ border: "1px solid #fee2e2", background: "#fffafb" }}>
                <h3 style={{ color: "#991b1b", fontSize: "0.875rem", margin: "0 0 1rem 0" }}>🚨 System Alerts</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ fontSize: "0.8125rem", color: "#991b1b", padding: "8px", background: "#fef2f2", borderRadius: "6px" }}>
                    ⚠️ <strong>High Cancellation:</strong> 5 bookings cancelled in last 2h.
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#854d0e", padding: "8px", background: "#fefce8", borderRadius: "6px" }}>
                    📉 <strong>Low Occupancy:</strong> Branch B is at 45% for next week.
                  </div>
                </div>
              </div>

              {/* Section 6: Reviews */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "0.875rem" }}>Guest Ratings</h3>
                  <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f59e0b" }}>4.8/5.0</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  "Amazing service and the rooftop pool is incredible!"
                  <div style={{ marginTop: "4px", fontWeight: 600 }}>- David M.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OwnerDashboard;