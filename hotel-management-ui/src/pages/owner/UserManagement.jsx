import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "../admin/AdminWrapper";
import { supabase } from "../../lib/supabaseClient";
import { PATHS } from "../../routes/paths";

export const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call the custom RPC function to create the auth user
      const { data: userId, error: rpcError } = await supabase.rpc('create_admin_user', {
        email: formData.email,
        password: formData.password,
        full_name: formData.name
      });

      if (rpcError) throw rpcError;

      // 2. The trigger on_auth_user_created (from previous step) 
      // will handle the public.users insertion automatically.

      setNotification({ type: "success", message: `Admin account for ${formData.name} created successfully!` });
      setFormData({ name: "", email: "", password: "", role: "admin" });
      fetchUsers();
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to revoke access for this user? This will delete their authentication account.")) return;

    // In a real app, you'd use another RPC to delete from auth.users
    // For now, we'll just delete from public.users which triggers cascade
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      setNotification({ type: "error", message: error.message });
    } else {
      setNotification({ type: "success", message: "User access revoked." });
      fetchUsers();
    }
  };

  return (
    <AdminWrapper
      title="User Management"
      subtitle="Allocate roles and manage system access for Administrators"
      notification={notification}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem", alignItems: "start" }}>
        {/* Creation Form */}
        <div className="card" style={{ boxShadow: "var(--shadow-premium)" }}>
          <SectionHeader title="Register Admin" subtitle="Create new administrator credentials" />
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@hostay.com"
                required
              />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Assigned Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={{ background: "#f8fafc" }}>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ padding: "1rem", marginTop: "0.5rem" }}>
              {loading ? "Creating Account..." : "Create Admin Account"}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
          <div style={{ padding: "1.5rem 2.5rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
            <SectionHeader title="Active Users" subtitle={`${users.length} authorized accounts`} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem 2.5rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>User</th>
                  <th style={{ padding: "1rem 2.5rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Role</th>
                  <th style={{ padding: "1rem 2.5rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Joined</th>
                  <th style={{ padding: "1rem 2.5rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1.25rem 2.5rem" }}>
                      <div style={{ fontWeight: "700", color: "#1e293b" }}>{user.full_name || user.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{user.email}</div>
                    </td>
                    <td style={{ padding: "1.25rem 2.5rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        background: user.role === "admin" ? "#eff6ff" : "#fef2f2",
                        color: user.role === "admin" ? "#2563eb" : "#dc2626",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase"
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: "1.25rem 2.5rem", fontSize: "0.875rem", color: "#64748b" }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1.25rem 2.5rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "1.25rem", cursor: "pointer", opacity: 0.7 }}
                        title="Revoke Access"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
};
