import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { PATHS } from "../../routes/paths";
import loginBg from "../../assets/login-bg.png";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      alert("Please fill in all fields.");
      return;
    }
    
    setLoading(true);

    try {
      // 1. Sign up with Supabase
      // Note: The database trigger 'on_auth_user_created' will automatically
      // create the profile in 'public.users' using the metadata below.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        alert("Registration successful! Please check your email for verification.");
        navigate(PATHS.LOGIN);
      }
    } catch (err) {
      alert(`Signup failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", width: "100vw", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: "-10px", left: "-10px",
        right: "-10px", bottom: "-10px",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "blur(8px) brightness(0.6)", zIndex: 0
      }} />

      <div className="card" style={{
        width: "90%", maxWidth: "450px", position: "relative", zIndex: 1,
        background: "rgba(255, 255, 255, 0.98)",
        padding: "3.5rem 2.5rem", borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", textAlign: "center"
      }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            margin: "0 0 0.5rem 0", fontSize: "2.5rem",
            fontWeight: 800, color: "#1e293b", letterSpacing: "-1px"
          }}>Join Hostay</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", fontStyle: "italic", margin: 0 }}>
            "Start managing your hotel with elegance."
          </p>
        </div>

        <form onSubmit={handleSignup} style={{
          display: "flex", flexDirection: "column", gap: "1.2rem", textAlign: "left"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>Full Name</label>
            <InputField
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>Email Address</label>
            <InputField
              type="email"
              placeholder="name@hostay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>Password</label>
            <InputField
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Button
              text={loading ? "Creating Account..." : "Create Account"}
              disabled={loading}
            />
          </div>
        </form>

        <p style={{ marginTop: "1.5rem", color: "#64748b", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate(PATHS.LOGIN)}
            style={{ color: "#3b82f6", fontWeight: 600, cursor: "pointer" }}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
