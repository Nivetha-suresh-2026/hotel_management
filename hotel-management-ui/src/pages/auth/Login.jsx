import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { PATHS } from "../../routes/paths";
import loginBg from "../../assets/login-bg.png";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, session, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Single unified effect:
  // - If already logged in → redirect to correct dashboard
  // - If not logged in → clear any stale localStorage data
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    if (session && role) {
      if (role === 'owner') navigate('/owner');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'staff') navigate('/staff/dashboard');
    } else if (!session) {
      // Safely clear stale data — no signOut needed (avoids race condition)
      localStorage.clear();
    }
  }, [authLoading, session, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { alert('Please enter email and password.'); return; }
    setLoading(true);
    try {
      // Just sign in — AuthContext's onAuthStateChange will fire SIGNED_IN,
      // fetch the profile, set the role, and the redirect useEffect below handles navigation.
      await signIn(email, password);
    } catch (err) {
      console.error('Login error:', err);
      alert(`Login failed: ${err.message || 'An unexpected error occurred'}`);
      setLoading(false);
    }
    // Note: setLoading(false) is intentionally NOT in finally here.
    // The redirect useEffect will unmount this component when role is set,
    // so we leave loading=true (shows "Signing in...") until navigation happens.
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
        width: "90%", maxWidth: "400px", position: "relative", zIndex: 1,
        background: "rgba(255, 255, 255, 0.98)",
        padding: "3.5rem 2.5rem", borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", textAlign: "center"
      }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            margin: "0 0 0.5rem 0", fontSize: "2.5rem",
            fontWeight: 800, color: "#1e293b", letterSpacing: "-1px"
          }}>Hostay</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", fontStyle: "italic", margin: 0 }}>
            "Where comfort meets elegance."
          </p>
        </div>

        <form onSubmit={handleLogin} style={{
          display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
              Email Address
            </label>
            <InputField
              type="email"
              placeholder="name@hostay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
              Password
            </label>
            <InputField
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Button
              text={loading ? "Signing in..." : "Sign In"}
              disabled={loading}
            />
          </div>
        </form>

        <p style={{ marginTop: "1.5rem", color: "#64748b", fontSize: "0.875rem" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate(PATHS.SIGNUP)}
            style={{ color: "#3b82f6", fontWeight: 600, cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;