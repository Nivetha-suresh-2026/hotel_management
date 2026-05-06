import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/validators";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import loginBg from "../../assets/login-bg.png";
import { PATHS } from "../../routes/paths";

function Login() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!role) {
      alert("Please select your access role.");
      return;
    }

    // Mock navigation and store role
    localStorage.setItem("userRole", role);
    if (role === "admin") navigate(PATHS.ADMIN_HOME);
    else navigate(PATHS.OWNER_DASHBOARD);
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      width: "100vw",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Image with Blur */}
      <div style={{
        position: "absolute",
        top: "-10px",
        left: "-10px",
        right: "-10px",
        bottom: "-10px",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(8px) brightness(0.6)",
        zIndex: 0
      }} />

      <div className="card" style={{ 
        width: "90%", 
        maxWidth: "400px", 
        position: "relative", 
        zIndex: 1,
        background: "rgba(255, 255, 255, 0.98)",
        padding: "3.5rem 2.5rem",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ 
            margin: "0 0 0.5rem 0", 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            color: "#1e293b",
            letterSpacing: "-1px"
          }}>
            Hostay
          </h1>
          <p style={{ 
            color: "#64748b", 
            fontSize: "0.95rem", 
            fontStyle: "italic",
            margin: 0
          }}>
            "Where comfort meets elegance."
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>Email Address</label>
            <InputField
              type="email"
              placeholder="name@hostay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>Access Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}
            >
              <option value="">Select your role</option>
              <option value="admin">Administrator</option>
              <option value="owner">Hotel Owner</option>
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Button text="Sign In" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;