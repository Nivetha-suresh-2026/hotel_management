import React from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";

export const StaffCreation = () => {
  const [formData, setFormData] = React.useState({
    branchId: "",
    departmentId: "",
    staffName: "",
    role: "",
    contact: "",
    aadharNumber: "",
    employmentType: "Full Time",
    status: "Active"
  });
  const [branches, setBranches] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [staffList, setStaffList] = React.useState([]);
  const [notification, setNotification] = React.useState(null);

  React.useEffect(() => {
    const savedBranches = JSON.parse(localStorage.getItem("branches") || "[]");
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    const savedStaff = JSON.parse(localStorage.getItem("staff") || "[]");
    setBranches(savedBranches);
    setDepartments(savedDepartments);
    setStaffList(savedStaff);
  }, []);

  const filteredDepartments = departments.filter(d => d.branchId.toString() === formData.branchId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.departmentId || !formData.staffName || !formData.role || !formData.contact || !formData.aadharNumber) {
      setNotification({ type: "error", message: "Please fill all required fields" });
      return;
    }

    const branch = branches.find(b => b.id.toString() === formData.branchId);
    const dept = departments.find(d => d.id.toString() === formData.departmentId);
    
    const newStaff = { ...formData, id: Date.now(), branchName: branch.branchName, departmentName: dept.departmentName };
    const updatedStaff = [...staffList, newStaff];
    localStorage.setItem("staff", JSON.stringify(updatedStaff));
    setStaffList(updatedStaff);
    setFormData({ branchId: "", departmentId: "", staffName: "", role: "", contact: "", aadharNumber: "", employmentType: "Full Time", status: "Active" });
    setNotification({ type: "success", message: "Staff registered successfully!" });
    setTimeout(() => setNotification(null), 3000);
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
                  <option value="">Select...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branchName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Dept</label>
                <select name="departmentId" value={formData.departmentId} onChange={handleChange} disabled={!formData.branchId}>
                  <option value="">Select...</option>
                  {filteredDepartments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Staff Name</label>
              <input type="text" name="staffName" value={formData.staffName} onChange={handleChange} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Job title" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Contact</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone" />
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Aadhar</label>
                <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} placeholder="ID number" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" style={{ padding: "0.875rem" }}>Register Staff</button>
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
            <SectionHeader title="Staff Directory" subtitle={`${staffList.length} employees registered`} />
          </div>
          {staffList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>No staff registered yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Employee</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Department</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(staff => (
                    <tr key={staff.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem 2rem" }}>
                        <div style={{ fontWeight: "700" }}>{staff.staffName}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{staff.role} • {staff.contact}</div>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <div style={{ fontWeight: "600" }}>{staff.branchName}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{staff.departmentName}</div>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "20px", 
                          background: staff.status === "Active" ? "#f0fdf4" : "#fef2f2", 
                          color: staff.status === "Active" ? "#16a34a" : "#dc2626",
                          fontSize: "0.75rem", 
                          fontWeight: "700" 
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
