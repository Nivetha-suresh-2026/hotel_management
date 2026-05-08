import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

export const StaffCreation = () => {
  const [formData, setFormData] = useState({
    branchId: "",
    departmentId: "",
    fullName: "",
    role: "receptionist",
    phone: "",
    shift: "morning",
    employmentType: "full_time",
    status: "active"
  });
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const [branchRes, deptRes] = await Promise.all([
      supabase.from('hotel_branches').select('*'),
      supabase.from('departments').select('*')
    ]);

    if (branchRes.data) setBranches(branchRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
    
    fetchStaff();
  };

  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        hotel_branches!staff_branch_fkey(branch_name),
        departments!staff_dept_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (!error) setStaffList(data);
    setLoading(false);
  };

  const filteredDepartments = departments.filter(d => d.branch_id === formData.branchId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.departmentId || !formData.fullName || !formData.phone) {
      setNotification({ type: "error", message: "Please fill all required fields" });
      return;
    }

    setLoading(true);
    try {
      // Get the current user's profile ID
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('users').select('id').eq('auth_id', user.id).single();

      const payload = {
        branch_id: formData.branchId,
        department_id: formData.departmentId,
        full_name: formData.fullName,
        role: formData.role,
        phone: formData.phone,
        shift: formData.shift,
        employment_type: formData.employmentType,
        status: formData.status,
        created_by: profile.id
      };

      const { error } = await supabase.from('staff').insert([payload]);
      if (error) throw error;

      setNotification({ type: "success", message: "Staff registered successfully!" });
      setFormData({ 
        branchId: "", 
        departmentId: "", 
        fullName: "", 
        role: "receptionist", 
        phone: "", 
        shift: "morning", 
        employmentType: "full_time", 
        status: "active" 
      });
      fetchStaff();
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AdminWrapper 
      title="Staff Enrollment" 
      subtitle="Onboard new employees and assign roles"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Staff Enrollment" }]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }}>
        <div className="card" style={{ boxShadow: "var(--shadow-premium)" }}>
          <SectionHeader title="Staff Registration" subtitle="Onboard new employees" />
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Branch</label>
                <select name="branchId" value={formData.branchId} onChange={handleChange}>
                  <option value="">Select Branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Dept</label>
                <select name="departmentId" value={formData.departmentId} onChange={handleChange} disabled={!formData.branchId}>
                  <option value="">Select Dept...</option>
                  {filteredDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full employee name" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Job Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="receptionist">Receptionist</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="manager">Manager</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Shift</label>
                <select name="shift" value={formData.shift} onChange={handleChange}>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Contact Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Initial Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            <button type="submit" style={{ padding: "0.875rem" }} disabled={loading}>
              {loading ? "Registering..." : "Register Staff"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
            <SectionHeader title="Staff Directory" subtitle={`${staffList.length} employees registered`} />
          </div>
          {staffList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>{loading ? "Loading staff..." : "No staff registered yet."}</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Employee</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Branch / Dept</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Shift</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(staff => (
                    <tr key={staff.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem 2rem" }}>
                        <div style={{ fontWeight: "700", color: "#1e293b" }}>{staff.full_name}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{staff.role} • {staff.phone}</div>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <div style={{ fontWeight: "600", color: "#475569" }}>{staff.hotel_branches?.branch_name}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{staff.departments?.name}</div>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <span style={{ fontSize: "0.875rem", textTransform: "capitalize" }}>{staff.shift}</span>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "20px", 
                          background: staff.status === "active" ? "#f0fdf4" : "#fef2f2", 
                          color: staff.status === "active" ? "#16a34a" : "#dc2626",
                          fontSize: "0.75rem", 
                          fontWeight: "700",
                          textTransform: "uppercase"
                        }}>{staff.status}</span>
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
