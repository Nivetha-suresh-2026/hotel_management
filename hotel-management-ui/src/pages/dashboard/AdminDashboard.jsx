import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view the Admin Dashboard.</p>
        <button onClick={() => navigate("/")}>Go to Login</button>
      </div>
    );
  }

  const stats = [
    { title: "Total Revenue", value: "$32,800", trend: "+3.41%" },
    { title: "New Bookings", value: "135", trend: "+2.28%" },
    { title: "Check In", value: "101", trend: "-1.56%" },
    { title: "Check-Out", value: "29", trend: "+0.97%" },
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
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h2 style={{ margin: 0 }}>Dashboard</h2>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                placeholder="Search booking, room, etc" 
                style={{ width: "300px", padding: "0.5rem 1rem", borderRadius: "20px", background: "#f1f5f9", border: "none" }} 
              />
            </div>
            <Link to="/booking">
              <button style={{ background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 600 }}>
                + New Booking
              </button>
            </Link>
            <div style={{ display: "flex", gap: "1rem" }}>
              <span>🔔</span>
              <span>👤</span>
            </div>
          </div>
        </header>

        <div className="container">
          <section className="dashboard-grid" style={{ marginTop: 0 }}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.title}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", justifyContent: "space-between" }}>
                  <p>{stat.value}</p>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: 600, 
                    background: stat.trend.startsWith("+") ? "#dcfce7" : "#fee2e2",
                    color: stat.trend.startsWith("+") ? "#166534" : "#991b1b"
                  }}>
                    {stat.trend} from last week
                  </span>
                </div>
              </div>
            ))}
          </section>

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
      </main>
    </div>
  );
}

export default AdminDashboard;