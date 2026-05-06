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

    </aside>
  );
}

export default Sidebar;
