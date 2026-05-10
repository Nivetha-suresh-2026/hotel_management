import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

export const StaffCreation = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    identityType: "",
    identityNumber: "",
    employmentType: "Full Time",
    branchId: "",
    departmentId: "",
    role: "",
    shift: "Morning",
    status: "active"
  });
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const [branchRes, deptRes, roleRes] = await Promise.all([
      supabase.from('hotel_branches').select('*'),
      supabase.from('departments').select('*'),
      supabase.from('job_roles').select('*')
    ]);

    if (branchRes.data) setBranches(branchRes.data);
    if (deptRes.data) setDepartments(deptRes.data);
    if (roleRes.data) setJobRoles(roleRes.data);
    
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
  const filteredRoles = jobRoles.filter(r => r.department_id === formData.departmentId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === "branchId") {
        newState.departmentId = "";
        newState.role = "";
      }
      if (name === "departmentId") {
        newState.role = "";
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.departmentId || !formData.fullName || !formData.mobile) {
      setNotification({ type: "error", message: "Please fill all required fields" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('users').select('id').eq('auth_id', user.id).single();

      const payload = {
        full_name: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.mobile,
        address: formData.address,
        identity_type: formData.identityType,
        identity_number: formData.identityNumber,
        employment_type: formData.employmentType,
        branch_id: formData.branchId,
        department_id: formData.departmentId,
        role: formData.role,
        shift: formData.shift,
        status: formData.status,
        created_by: profile.id
      };

      const { error } = await supabase.from('staff').insert([payload]);
      if (error) throw error;

      setNotification({ type: "success", message: "Staff enrolled successfully!" });
      setFormData({ 
        fullName: "", age: "", gender: "", mobile: "", address: "", 
        identityType: "", identityNumber: "", employmentType: "Full Time",
        branchId: "", departmentId: "", role: "Receptionist", shift: "Morning", status: "active" 
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
      subtitle="Comprehensive employee onboarding and department assignment"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Staff" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="card" style={{ boxShadow: "var(--shadow-premium)" }}>
            <SectionHeader title="1. Personal Details" subtitle="Basic identity and contact information" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Employee full name" required />
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" required />
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Mobile Number</label>
                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit number" required />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Permanent Address</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Residential address..." 
                  rows={1} 
                  required 
                  style={{ 
                    resize: "none",
                    minHeight: "45px",
                    padding: "0.75rem 1rem"
                  }} 
                />
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Identity Type</label>
                <select name="identityType" value={formData.identityType} onChange={handleChange} required>
                  <option value="">Select Identity...</option>
                  <option value="Aadhar">Aadhar</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Driving Licence">Driving Licence</option>
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Identity Number</label>
                <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleChange} placeholder="ID Number" required />
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ boxShadow: "var(--shadow-premium)" }}>
            <SectionHeader title="2. Professional Assignment" subtitle="Department and shift allocation" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Branch</label>
                <select name="branchId" value={formData.branchId} onChange={handleChange} required>
                  <option value="">Select Branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Department</label>
                <select name="departmentId" value={formData.departmentId} onChange={handleChange} disabled={!formData.branchId} required>
                  <option value="">Select Dept...</option>
                  {filteredDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Job Role</label>
                <select name="role" value={formData.role} onChange={handleChange} disabled={!formData.departmentId} required>
                  <option value="">Select Role...</option>
                  {filteredRoles.map(role => (
                    <option key={role.id} value={role.role_name}>{role.role_name}</option>
                  ))}
                </select>
                {filteredRoles.length === 0 && formData.departmentId && (
                  <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>No roles defined for this dept.</span>
                )}
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#1e293b" }}>Shift</label>
                <select name="shift" value={formData.shift} onChange={handleChange} required>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" disabled={loading} style={{ 
                padding: "1rem 3.5rem", 
                fontSize: "1rem",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}>
                {loading ? "Enrolling Staff..." : "Complete Enrollment"}
              </button>
            </div>
          </div>
        </form>

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
