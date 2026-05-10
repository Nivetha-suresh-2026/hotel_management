import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { PATHS } from "../../routes/paths";
import loginBg from "../../assets/login-bg.png";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      // STEP 0: Force clear any existing stale session
      await supabase.auth.signOut();

      // STEP 1: Sign in
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        alert(`Login failed: ${authError.message}`);
        return;
      }

      console.log("✅ Auth success, user id:", authData.user.id);

      // STEP 2: Fetch role from DB via direct query (targeting auth_id)
      const { data: profile, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("auth_id", authData.user.id) // Corrected to use auth_id
        .maybeSingle();

      if (roleError) {
        alert(`Profile error: ${roleError.message}`);
        await supabase.auth.signOut();
        return;
      }

      if (!profile) {
        alert("Your account was created, but your profile was not found. Please contact support.");
        await supabase.auth.signOut();
        return;
      }

      const userRole = profile?.role;

      if (!userRole) {
        alert("No profile found for this account.");
        await supabase.auth.signOut();
        return;
      }

      // STEP 3: Map DB role to app role and save to localStorage
      let appRole = "";
      if (userRole === "hotel_owner") appRole = "owner";
      else if (userRole === "admin")  appRole = "admin";
      else {
        alert("Invalid role detected.");
        await supabase.auth.signOut();
        return;
      }

      localStorage.setItem("userRole",  appRole);
      localStorage.setItem("userId",    authData.user.id);
      localStorage.setItem("userName",
        authData.user.user_metadata?.full_name ||
        authData.user.email.split('@')[0]
      );
      localStorage.setItem("userEmail", authData.user.email);

      // STEP 4: Redirect based on role (Your exact logic)
      if (profile.role === "hotel_owner") {
        navigate("/owner");
      } else if (profile.role === "admin") {
        navigate("/admin");
      }

    } catch (err) {
      console.error("Login Error Object:", err);
      const errorMsg = err.message || JSON.stringify(err);
      alert(`System Error: ${errorMsg}`);
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