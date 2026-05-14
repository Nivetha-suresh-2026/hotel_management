import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "../routes/paths";

function Navbar() {
  const navigate = useNavigate();
  const { role, signOut, session } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate(PATHS.LOGIN);
  };

  return (
    <nav className="nav-bar">
      <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)", letterSpacing: "-0.5px" }}>
        Hostay
      </div>
      <div className="nav-links">
        {role === "admin" && <Link to={PATHS.ADMIN_DASHBOARD}>Dashboard</Link>}
        {role === "owner" && <Link to={PATHS.OWNER_DASHBOARD}>Owner Portal</Link>}
        {role === "admin" && <Link to={PATHS.BOOKING}>New Booking</Link>}
        
        {session ? (
          <button 
            onClick={handleLogout}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#ef4444", 
              fontWeight: 600, 
              cursor: "pointer",
              padding: "0.5rem 1rem"
            }}
          >
            Logout
          </button>
        ) : (
          <Link to={PATHS.LOGIN}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;