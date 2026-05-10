import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

export const DepartmentManagement = () => {
  const [formData, setFormData] = useState({ branchId: "", name: "", description: "" });
  const [roleFormData, setRoleFormData] = useState({ departmentId: "", roleName: "" });
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const allowedDepartments = ['Front Desk', 'Housekeeping', 'Food & Beverage', 'Maintenance', 'Security', 'Management'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: branchData } = await supabase.from('hotel_branches').select('*');
    if (branchData) setBranches(branchData);
    fetchDepartments();
    fetchRoles();
  };

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select(`*, hotel_branches(branch_name)`)
      .order('created_at', { ascending: false });
    if (!error) setDepartments(data);
  };

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('job_roles')
      .select(`*, departments(name)`)
      .order('created_at', { ascending: false });
    if (!error) setRoles(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({ ...prev, [name]: value }));
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
      const { data: profile } = await supabase.from('users').select('id').eq('auth_id', user.id).single();
      if (!profile) throw new Error("User profile not found");

      const { error } = await supabase.from('departments').insert([{
        branch_id: formData.branchId,
        name: formData.name,
        description: formData.description,
        created_by: profile.id
      }]);
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

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!roleFormData.departmentId || !roleFormData.roleName) {
      setNotification({ type: "error", message: "Please fill all role fields" });
      return;
    }

    setRoleLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('users').select('id').eq('auth_id', user.id).single();

      const { error } = await supabase.from('job_roles').insert([{
        department_id: roleFormData.departmentId,
        role_name: roleFormData.roleName,
        created_by: profile?.id
      }]);
      if (error) throw error;

      setNotification({ type: "success", message: "Job Role defined successfully!" });
      setRoleFormData({ departmentId: "", roleName: "" });
      fetchRoles();
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    } finally {
      setRoleLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (!error) fetchDepartments();
  };

  const handleRoleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    const { error } = await supabase.from('job_roles').delete().eq('id', id);
    if (!error) fetchRoles();
  };

  // Filter Logic
  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
    d.hotel_branches?.branch_name.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const filteredRoles = roles.filter(r => 
    r.role_name.toLowerCase().includes(roleSearch.toLowerCase()) ||
    r.departments?.name.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const displayedRoles = roleSearch ? filteredRoles : filteredRoles.slice(0, 4);

  return (
    <AdminWrapper 
      title="Organizational Setup" 
      subtitle="Manage departments and job roles across branches"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Organization" }]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
        {/* Left Column: Department Creation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div className="card" style={{ boxShadow: "var(--shadow-premium)", padding: "2rem" }}>
            <SectionHeader title="Register Department" subtitle="Create new operational units" />
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Target Branch</label>
                <select name="branchId" value={formData.branchId} onChange={handleChange} required>
                  <option value="">Select branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Unit Category</label>
                <select name="name" value={formData.name} onChange={handleChange} required>
                  <option value="">Choose category...</option>
                  {allowedDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Unit purpose..." 
                  rows={2}
                  style={{ resize: "none", padding: "0.75rem 1rem", minHeight: "80px" }}
                />
              </div>
              <button type="submit" disabled={loading} style={{ 
                padding: "1rem", 
                marginTop: "0.5rem",
                borderRadius: "12px",
                fontWeight: "600"
              }}>
                {loading ? "Registering..." : "Add Department"}
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SectionHeader title="Active Departments" subtitle={`${departments.length} units registered`} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={deptSearch} 
                  onChange={(e) => setDeptSearch(e.target.value)} 
                  style={{ width: "200px", padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                />
              </div>
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody style={{ fontSize: "0.875rem" }}>
                  {filteredDepartments.length === 0 ? (
                    <tr><td style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No matches found.</td></tr>
                  ) : (
                    filteredDepartments.map(dept => (
                      <tr key={dept.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "1.25rem 2rem" }}>
                          <div style={{ fontWeight: "700", color: "#1e293b" }}>{dept.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{dept.hotel_branches?.branch_name}</div>
                        </td>
                        <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
                          <button onClick={() => handleDelete(dept.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.1rem" }}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Role Creation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div className="card" style={{ boxShadow: "var(--shadow-premium)", padding: "2rem" }}>
            <SectionHeader title="Define Job Roles" subtitle="Create specific roles per department" />
            <form onSubmit={handleRoleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Target Department</label>
                <select name="departmentId" value={roleFormData.departmentId} onChange={handleRoleChange} required>
                  <option value="">Select department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.hotel_branches?.branch_name})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Job Role Name</label>
                <input 
                  type="text" 
                  name="roleName" 
                  value={roleFormData.roleName} 
                  onChange={handleRoleChange} 
                  placeholder="e.g. Senior Receptionist" 
                  required 
                  style={{ padding: "0.75rem 1rem" }}
                />
              </div>
              <div className="form-group" style={{ visibility: "hidden" }}>
                <label>Spacer</label>
                <div style={{ height: "80px" }}></div>
              </div>
              <button type="submit" disabled={roleLoading} style={{ 
                padding: "1rem", 
                marginTop: "0.5rem",
                borderRadius: "12px",
                fontWeight: "600"
              }}>
                {roleLoading ? "Saving..." : "Create Job Role"}
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SectionHeader title="Registered Roles" subtitle={roleSearch ? "Search results" : "Last 4 roles defined"} />
                <input 
                  type="text" 
                  placeholder="Search roles..." 
                  value={roleSearch} 
                  onChange={(e) => setRoleSearch(e.target.value)} 
                  style={{ width: "200px", padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                />
              </div>
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody style={{ fontSize: "0.875rem" }}>
                  {displayedRoles.length === 0 ? (
                    <tr><td style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No matches found.</td></tr>
                  ) : (
                    displayedRoles.map(role => (
                      <tr key={role.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "1.25rem 2rem" }}>
                          <div style={{ fontWeight: "700", color: "#1e293b" }}>{role.role_name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{role.departments?.name}</div>
                        </td>
                        <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
                          <button onClick={() => handleRoleDelete(role.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.1rem" }}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
};
