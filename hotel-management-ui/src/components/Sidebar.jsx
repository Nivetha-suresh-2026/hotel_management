import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  const adminMenu = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Room Creation", path: "/admin/rooms", icon: "🏨" },
    { name: "Branch Creation", path: "/admin/branches", icon: "📍" },
    { name: "Staff Creation", path: "/admin/staff", icon: "👥" },
    { name: "Department", path: "/admin/departments", icon: "🏢" },
    { name: "Guest Details", path: "/admin/guests", icon: "📋" },
    { name: "Staff Details", path: "/admin/staff-details", icon: "📝" },
  ];

  const ownerMenu = [
    { name: "Overview", path: "/owner", icon: "📈" },
    { name: "Revenue Analytics", path: "/owner/revenue", icon: "💰" },
    { name: "Hotel Performance", path: "/owner/performance", icon: "🏨" },
    { name: "Activity Logs", path: "/owner/activity", icon: "🕵️" },
    { name: "Alerts", path: "/owner/alerts", icon: "🚨" },
    { name: "Reviews", path: "/owner/reviews", icon: "⭐" },
  ];

  const menuItems = userRole === "admin" ? adminMenu : ownerMenu;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ fontSize: "1.75rem", letterSpacing: "-0.5px" }}>
        Hostay
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: "auto", padding: "1rem 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.5rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            {userRole === "admin" ? "A" : "O"}
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{userRole === "admin" ? "Zain George" : "Property Owner"}</div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{userRole === "admin" ? "Admin" : "Owner"}</div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            width: "100%", 
            marginTop: "1.5rem", 
            background: "rgba(239, 68, 68, 0.08)", 
            color: "#f87171", 
            border: "1px solid rgba(239, 68, 68, 0.2)",
            padding: "10px",
            borderRadius: "12px",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"}
        >
          <span style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "2px" }}></span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
