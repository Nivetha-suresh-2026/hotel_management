import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <nav className="nav-bar">
      <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)", letterSpacing: "-0.5px" }}>
        Hostay
      </div>
      <div className="nav-links">
        {userRole === "admin" && <Link to="/admin">Dashboard</Link>}
        {userRole === "owner" && <Link to="/owner">Owner Portal</Link>}
        {userRole === "admin" && <Link to="/booking">New Booking</Link>}
      </div>
    </nav>
  );
}

export default Navbar;