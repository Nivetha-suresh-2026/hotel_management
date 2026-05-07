import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  const adminMenu = [
    { name: "Dashboard", path: PATHS.ADMIN_DASHBOARD, icon: "📊" },
    { name: "Room Creation", path: PATHS.ADMIN_ROOMS, icon: "🏨" },
    { name: "Branch Creation", path: PATHS.ADMIN_BRANCHES, icon: "📍" },
    { name: "Staff Creation", path: PATHS.ADMIN_STAFF, icon: "👥" },
    { name: "Department", path: PATHS.ADMIN_DEPARTMENTS, icon: "🏢" },
    { name: "Guest Details", path: PATHS.ADMIN_GUESTS, icon: "📋" },
    { name: "Staff Details", path: PATHS.ADMIN_STAFF_DETAILS, icon: "📝" },
  ];

  const ownerMenu = [
    { name: "Overview", path: PATHS.OWNER_DASHBOARD, icon: "📈" },
    { name: "Hotel Performance", path: PATHS.OWNER_PERFORMANCE, icon: "🏨" },
    { name: "Activity Logs", path: PATHS.OWNER_ACTIVITY, icon: "🕵️" },
    { name: "Role Allocation", path: PATHS.OWNER_USERS, icon: "🔑" },
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
