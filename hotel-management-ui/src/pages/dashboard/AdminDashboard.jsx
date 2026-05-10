import React from "react";
import { AdminWrapper } from "../admin/AdminWrapper";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

function AdminDashboard() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [profile, setProfile] = React.useState(null);
  const [stats, setStats] = React.useState({
    staffCount: 0,
    guestsToday: 0,
    checkIn: 0,
    checkOut: 0,
    cashCollection: 0
  });
  const [recentBookings, setRecentBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (userRole !== "admin") return;
    fetchDashboardData();
  }, [userRole]);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile using security definer function (no RLS recursion)
      const { data: profileData, error: profileError } =
        await supabase.rpc("get_my_profile");

      if (profileError) throw profileError;
      setProfile(profileData);

      // Save to localStorage for other components
      localStorage.setItem("userProfile", JSON.stringify(profileData));

      const today = new Date().toISOString().split("T")[0];

      // Fetch staff count
      const { count: staffCount } = await supabase
        .from("staff")
        .select("*", { count: "exact", head: true });

      // Fetch today's bookings with guest details
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, guests(full_name)")
        .order("created_at", { ascending: false });

      const todayCheckIns = bookings?.filter(b => b.check_in_date === today) || [];
      const todayCheckOuts = bookings?.filter(b => b.check_out_date === today) || [];
      const confirmedGuests = bookings?.filter(b => b.status === "reserved" || b.status === "checked_in") || [];
      const cashCollection = todayCheckIns.reduce(
        (sum, b) => sum + (parseFloat(b.total_amount) || 0), 0
      );

      setStats({
        staffCount: staffCount || 0,
        guestsToday: confirmedGuests.length,
        checkIn: todayCheckIns.length,
        checkOut: todayCheckOuts.length,
        cashCollection
      });

      // Recent bookings for table
      setRecentBookings(bookings?.slice(0, 5) || []);

    } catch (error) {
      console.error("Dashboard fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
    { title: "Total Staff", value: stats.staffCount, icon: "👥", color: "#6366f1", trend: "Active members" },
    { title: "Confirmed Guests", value: stats.guestsToday, icon: "🏨", color: "#10b981", trend: "Currently staying" },
    { title: "Today Check-In", value: stats.checkIn, icon: "🔑", color: "#3b82f6", trend: "Arriving today" },
    { title: "Today Check-Out", value: stats.checkOut, icon: "🚪", color: "#f43f5e", trend: "Departing today" },
    { title: "Today Cash Collection", value: `₹${stats.cashCollection.toLocaleString()}`, icon: "💰", color: "#f59e0b", trend: "From today's check-ins" }
  ];

  return (
    <AdminWrapper
      title={`Welcome, ${profile?.name || "Admin"}`}
      subtitle="Real-time operational metrics and performance"
      showSearch={true}
    >
      <div className="container" style={{ padding: 0 }}>

        {/* Profile Banner */}
        <div className="card" style={{
          padding: "1.5rem 2rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          color: "white",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem"
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.5rem"
          }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: "800" }}>
              {profile?.name || "Loading..."}
            </div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
              {profile?.email} • Administrator
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem"
        }}>
          {statCards.map((stat, index) => (
            <div key={index} className="card" style={{
              padding: "1.5rem",
              borderTop: `4px solid ${stat.color}`,
              borderRadius: "12px",
              background: "white",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: "1.25rem" }}>{stat.icon}</div>
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b" }}>
                  {loading ? "..." : stat.value}
                </div>
                <div style={{ fontSize: "0.65rem", color: stat.color, fontWeight: "600", marginTop: "2px" }}>
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Bookings Table */}
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Recent Bookings</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem" }}>Booking ID</th>
                  <th style={{ padding: "1rem" }}>Guest</th>
                  <th style={{ padding: "1rem" }}>Check In</th>
                  <th style={{ padding: "1rem" }}>Check Out</th>
                  <th style={{ padding: "1rem" }}>Status</th>
                  <th style={{ padding: "1rem" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                      Loading...
                    </td>
                  </tr>
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem", fontWeight: "600" }}>
                        #{booking.id?.toString().slice(0, 8)}
                      </td>
                      <td style={{ padding: "1rem" }}>{booking.guests?.full_name || "—"}</td>
                      <td style={{ padding: "1rem" }}>{booking.check_in_date || "—"}</td>
                      <td style={{ padding: "1rem" }}>{booking.check_out_date || "—"}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700",
                          background: booking.status === "reserved" ? "#dcfce7" : "#fef9c3",
                          color: booking.status === "reserved" ? "#166534" : "#854d0e"
                        }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        ₹{parseFloat(booking.total_amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </AdminWrapper>
  );
}

export default AdminDashboard;