import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

export const DepartmentManagement = () => {
  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    description: ""
  });
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const allowedDepartments = [
    'Front Desk',
    'Housekeeping',
    'Food & Beverage',
    'Maintenance',
    'Security',
    'Management'
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: branchData } = await supabase.from('hotel_branches').select('*');
    if (branchData) setBranches(branchData);
    fetchDepartments();
  };

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select(`*, hotel_branches(branch_name)`)
      .order('created_at', { ascending: false });
    if (!error) setDepartments(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.name) {
      setNotification({ type: "error", message: "Please fill all required fields" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!profile) throw new Error("User profile not found");

      const payload = {
        branch_id: formData.branchId,
        name: formData.name,
        description: formData.description,
        created_by: profile.id
      };

      const { error } = await supabase.from('departments').insert([payload]);
      if (error) throw error;

      setNotification({ type: "success", message: "Department created successfully!" });
      setFormData({ branchId: "", name: "", description: "" });
      fetchDepartments();
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (!error) fetchDepartments();
  };

  return (
    <AdminWrapper 
      title="Department Management" 
      subtitle="Define organizational structure and units"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Departments" }]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }}>
        <div className="card" style={{ boxShadow: "var(--shadow-premium)" }}>
          <SectionHeader title="New Department" subtitle="Define organization units" />
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Branch</label>
              <select name="branchId" value={formData.branchId} onChange={handleChange}>
                <option value="">Select branch...</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Department Name</label>
              <select name="name" value={formData.name} onChange={handleChange}>
                <option value="">Choose department...</option>
                {allowedDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Department purpose..." rows={3} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: "0.875rem" }}>
              {loading ? "Creating..." : "Create Department"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
            <SectionHeader title="All Departments" subtitle={`${departments.length} units defined`} />
          </div>
          {departments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>No departments defined yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Department</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Branch</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Purpose</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem 2rem" }}>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "15px", 
                          background: "#eff6ff", 
                          color: "#1e40af",
                          fontSize: "0.75rem",
                          fontWeight: "700"
                        }}>{dept.name}</span>
                      </td>
                      <td style={{ padding: "1rem 2rem", fontWeight: "600" }}>{dept.hotel_branches?.branch_name}</td>
                      <td style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>{dept.description}</td>
                      <td style={{ padding: "1rem 2rem", textAlign: "right" }}>
                        <button 
                          onClick={() => handleDelete(dept.id)}
                          style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        >🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
};
