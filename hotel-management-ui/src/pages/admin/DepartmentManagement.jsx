import React from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";

export const DepartmentManagement = () => {
  const [formData, setFormData] = React.useState({
    branchId: "",
    departmentName: "",
    description: ""
  });
  const [branches, setBranches] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [notification, setNotification] = React.useState(null);

  React.useEffect(() => {
    const savedBranches = JSON.parse(localStorage.getItem("branches") || "[]");
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setBranches(savedBranches);
    setDepartments(savedDepartments);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.departmentName || !formData.description) {
      setNotification({ type: "error", message: "Please fill all fields" });
      return;
    }
    const branch = branches.find(b => b.id.toString() === formData.branchId);
    const newDept = { ...formData, id: Date.now(), branchName: branch.branchName };
    const updatedDepts = [...departments, newDept];
    localStorage.setItem("departments", JSON.stringify(updatedDepts));
    setDepartments(updatedDepts);
    setFormData({ branchId: "", departmentName: "", description: "" });
    setNotification({ type: "success", message: "Department created successfully!" });
    setTimeout(() => setNotification(null), 3000);
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
                {branches.map(b => <option key={b.id} value={b.id}>{b.branchName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Department Name</label>
              <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} placeholder="e.g. Housekeeping" />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Department purpose..." rows={3} />
            </div>
            <button type="submit" style={{ padding: "0.875rem" }}>Create Department</button>
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
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem 2rem", fontWeight: "700" }}>{dept.departmentName}</td>
                      <td style={{ padding: "1rem 2rem" }}>{dept.branchName}</td>
                      <td style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>{dept.description}</td>
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
