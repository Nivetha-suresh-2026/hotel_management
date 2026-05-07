import React from "react";
import { AdminWrapper } from "../admin/AdminWrapper";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [stats, setStats] = React.useState({
    staffCount: 0,
    guestsToday: 0,
    checkIn: 0,
    checkOut: 0,
    cashCollection: 0
  });

  React.useEffect(() => {
    if (userRole !== "admin") return;

    const staff = JSON.parse(localStorage.getItem("staff") || "[]");
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const today = new Date().toISOString().split('T')[0];

    const checkIns = bookings.filter(b => b.checkIn === today).length;
    const checkOuts = bookings.filter(b => b.checkOut === today).length;
    const totalCash = bookings
      .filter(b => b.checkIn === today)
      .reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);

    setStats({
      staffCount: staff.length,
      guestsToday: bookings.filter(b => b.status === "Confirmed").length,
      checkIn: checkIns,
      checkOut: checkOuts,
      cashCollection: totalCash
    });
  }, [userRole]);

  if (userRole !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view the Admin Dashboard.</p>
        <button onClick={() => navigate("/")}>Go to Login</button>
      </div>
    );
  }

  const statCards = [
    { title: "Total Staff", value: stats.staffCount, icon: "👥", color: "#6366f1", trend: "+2 this month" },
    { title: "Guests Today", value: stats.guestsToday, icon: "🏨", color: "#10b981", trend: "+5% from yesterday" },
    { title: "Today Check-In", value: stats.checkIn, icon: "🔑", color: "#3b82f6", trend: "On schedule" },
    { title: "Today Check-Out", value: stats.checkOut, icon: "🚪", color: "#f43f5e", trend: "3 pending" },
    { title: "Today Cash Collection", value: `₹${stats.cashCollection.toLocaleString()}`, icon: "💰", color: "#f59e0b", trend: "High volume" }
  ];

  return (
    <AdminWrapper title="Business Insights" subtitle="Real-time operational metrics and performance" showSearch={true}>
      <div className="container" style={{ padding: 0 }}>
          {/* Main Stat Cards */}
          <section className="dashboard-grid" style={{ marginTop: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {statCards.map((stat, index) => (
              <div key={index} className="card" style={{ 
                padding: "1.5rem", 
                borderTop: `4px solid ${stat.color}`,
                borderRadius: "12px",
                background: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.title}</div>
                  <div style={{ fontSize: "1.25rem" }}>{stat.icon}</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b" }}>{stat.value}</div>
                  <div style={{ fontSize: "0.65rem", color: stat.color, fontWeight: "600", marginTop: "2px" }}>{stat.trend}</div>
                </div>
              </div>
            ))}
          </section>

          {/* Activity and System Status Row */}
          <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginTop: "2rem" }}>
            <div className="card" style={{ padding: "2rem", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: "700" }}>Recent Activity</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "700", cursor: "pointer" }}>View All</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { text: "New staff member 'Anita' enrolled", time: "10 mins ago", icon: "👤", color: "#6366f1" },
                  { text: "Booking #4421 confirmed for Room 302", time: "25 mins ago", icon: "✅", color: "#10b981" },
                  { text: "Maintenance alert: Room 105 AC check", time: "1 hour ago", icon: "⚠️", color: "#f59e0b" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${item.color}15`, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>{item.text}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: "2rem", borderRadius: "16px", background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)", color: "white", border: "none" }}>
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: "700" }}>System Status</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", marginTop: "0.5rem" }}>All services are running smoothly.</p>
              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <span>Server Load</span>
                  <span style={{ fontWeight: "700" }}>24%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                  <div style={{ width: "24%", height: "100%", background: "#10b981", borderRadius: "3px" }}></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
                  <span>Storage</span>
                  <span style={{ fontWeight: "700" }}>62%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                  <div style={{ width: "62%", height: "100%", background: "#f59e0b", borderRadius: "3px" }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Revenue and Occupancy Row */}
          <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginTop: "2rem" }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0 }}>Revenue</h3>
                <select style={{ width: "auto", padding: "4px 8px" }}><option>Last 8 Months</option></select>
              </div>
              <div style={{ height: "200px", background: "#f8fafc", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                [ Revenue Chart Placeholder ]
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: "1.5rem" }}>Room Occupancy</h3>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800 }}>256</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Total Rooms</div>
                <div style={{ marginTop: "1rem", height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: "65%", background: "#38bdf8" }}></div>
                  <div style={{ width: "25%", background: "#6366f1" }}></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.75rem" }}>
                  <span>🔵 Occupied (65%)</span>
                  <span>🟣 Reserved (25%)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Booking List Section */}
          <section style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0 }}>Booking List</h2>
            </div>
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem" }}>Booking ID</th>
                    <th style={{ padding: "1rem" }}>Guest Name</th>
                    <th style={{ padding: "1rem" }}>Room Type</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                    <th style={{ padding: "1rem" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem" }}>#00123</td>
                    <td style={{ padding: "1rem" }}>James Libbon</td>
                    <td style={{ padding: "1rem" }}>Deluxe</td>
                    <td style={{ padding: "1rem" }}><span style={{ padding: "4px 8px", borderRadius: "12px", background: "#dcfce7", color: "#166534", fontSize: "0.75rem" }}>Confirmed</span></td>
                    <td style={{ padding: "1rem" }}>$450.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
    </AdminWrapper>
  );
}

export default AdminDashboard;