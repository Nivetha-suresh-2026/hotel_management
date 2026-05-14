import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

const EMPTY_FORM = {
  // Personal
  fullName: "", age: "", gender: "", mobile: "", email: "", address: "",
  identityType: "", identityNumber: "",
  // Employment
  employmentType: "Full Time", branchId: "", departmentId: "", roleId: "",
  shift: "Morning", joinedDate: "", status: "active",
  // Login Credentials
  staffEmail: "", staffPassword: "",
  // Portal Access - matches DB default JSON structure
  accessDashboard: true, accessTasks: true, accessLeave: true, accessProfile: true,
  // Task Assignment
  taskTitle: "", taskDescription: "", taskDueDate: "", taskPriority: "medium", taskRoleId: "",
};

const STEPS = [
  { id: 1, label: "Personal Details", icon: "👤" },
  { id: 2, label: "Employment Details", icon: "🏢" },
  { id: 3, label: "Login Credentials", icon: "🔐" },
  { id: 4, label: "Portal Access Permissions", icon: "🛡️" },
  { id: 5, label: "Task Assignment", icon: "📋" },
];

const inputStyle = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
  border: "1.5px solid #e2e8f0", fontSize: "0.9rem",
  background: "#fff", outline: "none", boxSizing: "border-box",
};
const labelStyle = { fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.4rem", display: "block" };
const FG = ({ children, span }) => (
  <div style={{ display: "flex", flexDirection: "column", gridColumn: span ? `span ${span}` : undefined }}>
    {children}
  </div>
);

export const StaffCreation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [bRes, dRes, rRes] = await Promise.all([
        supabase.from("hotel_branches").select("*"),
        supabase.from("departments").select("*"),
        supabase.from("job_roles").select("*"),
      ]);
      if (bRes.data) setBranches(bRes.data);
      if (dRes.data) setDepartments(dRes.data);
      if (rRes.data) setJobRoles(rRes.data);
      fetchStaff({ showLoader: true }); // fetchStaff manages loading only when called with showLoader
    } catch (err) {
      console.error("StaffCreation: fetchInitialData error:", err);
      notify("error", "Failed to load form data. Please refresh.");
      setLoading(false); // Safety net if Promise.all fails before fetchStaff runs
    }
  };

  const fetchStaff = async ({ showLoader = false } = {}) => {
    if (showLoader) setLoading(true);
    try {
      console.log("StaffCreation: Fetching staff list...");
      const { data, error } = await supabase
        .from("staff")
        .select(`*, hotel_branches!staff_branch_fkey(branch_name), job_roles!staff_role_id_fkey(role_name, departments(name))`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setStaffList(data);
    } catch (err) {
      console.error("StaffCreation: Fetch error:", err);
      notify("error", "Failed to refresh staff list: " + err.message);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const filteredDepts = departments.filter(d => d.branch_id === formData.branchId);
  const filteredRoles = jobRoles.filter(r => r.department_id === formData.departmentId);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ── Validation & Formatting ──
    if (name === "mobile") {
      // Only digits, max 10
      const val = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    if (name === "identityNumber") {
      // Only digits, max 12
      const digits = value.replace(/\D/g, "").slice(0, 12);
      // Format: XXXX XXXX XXXX
      let formatted = "";
      for (let i = 0; i < digits.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " ";
        formatted += digits[i];
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "branchId") { next.departmentId = ""; next.roleId = ""; }
      if (name === "departmentId") next.roleId = "";
      return next;
    });
  };

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If not on the last step, just move to the next one
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    console.log("StaffCreation: Submitting form via Supabase RPC...", formData);

    if (!formData.branchId || !formData.fullName || !formData.mobile) {
      setStep(1);
      return notify("error", "Please fill all required fields in Step 1.");
    }

    if (formData.mobile.length !== 10) {
      setStep(1);
      return notify("error", "Mobile number must be exactly 10 digits.");
    }

    if (formData.identityNumber.replace(/\s/g, "").length !== 12) {
      setStep(1);
      return notify("error", "Identity number must be exactly 12 digits.");
    }

    setSubmitting(true);
    try {
      console.log("StaffCreation: Getting current user...");
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      const { data: prof, error: profErr } = await supabase.from("users").select("id").eq("auth_id", user.id).single();
      if (profErr) throw profErr;

      const permissions = {
        leave: formData.accessLeave,
        tasks: formData.accessTasks,
        profile: formData.accessProfile,
        dashboard: formData.accessDashboard
      };

      let staffId = editingId;

      if (editingId) {
        console.log("StaffCreation: Updating existing staff record...");
        const payload = {
          full_name: formData.fullName,
          branch_id: formData.branchId,
          phone: formData.mobile,
          email: formData.email,
          shift: formData.shift,
          employment_type: formData.employmentType,
          status: formData.status,
          age: parseInt(formData.age) || null,
          gender: formData.gender,
          address: formData.address,
          identity_type: formData.identityType,
          identity_number: formData.identityNumber,
          role_id: formData.roleId || null,
          joined_date: formData.joinedDate || new Date().toISOString().split('T')[0],
          portal_permissions: permissions
        };
        const { error } = await supabase.from("staff").update(payload).eq("id", editingId);
        if (error) throw new Error(`Update failed: ${error.message}`);
      } else {
        // NEW ENROLLMENT: Use RPC logic if login credentials provided
        if (formData.staffEmail && formData.staffPassword) {
          console.log("StaffCreation: Calling create_staff_user RPC...");
          const { data: rpcData, error: rpcErr } = await supabase.rpc('create_staff_user', {
            p_email: formData.staffEmail,
            p_password: formData.staffPassword,
            p_full_name: formData.fullName,
            p_branch_id: formData.branchId,
            p_role_id: formData.roleId || null,
            p_phone: formData.mobile || null,
            p_shift: formData.shift,
            p_employment_type: formData.employmentType,
            p_status: formData.status,
            p_joined_date: formData.joinedDate || null,
            p_age: parseInt(formData.age) || null,
            p_gender: formData.gender || null,
            p_address: formData.address || null,
            p_identity_type: formData.identityType || null,
            p_identity_number: formData.identityNumber || null,
            p_portal_permissions: permissions,
            p_created_by: prof.id
          });

          console.log('RPC Response:', rpcData, rpcErr);

          if (rpcErr) throw rpcErr;
          if (rpcData && rpcData.success === false) throw new Error(rpcData.message || 'RPC Failed');

          staffId = rpcData.staff_id || (rpcData.data && rpcData.data.staff_id);
        } else {
          // Only create staff row (no auth_id link)
          console.log("StaffCreation: Inserting staff row without login...");
          const { data: newStaff, error: staffErr } = await supabase.from("staff").insert([{
            full_name: formData.fullName,
            branch_id: formData.branchId,
            phone: formData.mobile,
            email: formData.email,
            shift: formData.shift,
            employment_type: formData.employmentType,
            status: formData.status,
            age: parseInt(formData.age) || null,
            gender: formData.gender,
            address: formData.address,
            role_id: formData.roleId || null,
            portal_permissions: permissions,
            created_by: prof.id
          }]).select().single();

          if (staffErr) throw staffErr;
          staffId = newStaff.id;
        }
      }

      // Assign initial task if provided
      if (formData.taskTitle.trim() && staffId) {
        console.log("StaffCreation: Assigning initial task...");
        const { error: taskErr } = await supabase.from("assigned_tasks").insert([{
          staff_id: staffId,
          job_id: formData.taskRoleId || formData.roleId,
          assigned_by: prof.id,
          title: formData.taskTitle,
          description: formData.taskDescription,
          deadline: formData.taskDueDate || null,
          priority: formData.taskPriority,
          status: "pending",
        }]);
        if (taskErr) throw new Error(`Task Error: ${taskErr.message}`);
      }

      notify("success", editingId ? "Staff updated!" : "Staff enrolled successfully!");
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setStep(1);
    } catch (err) {
      console.error("StaffCreation: Submit error:", err);
      notify("error", err.message || "An error occurred during submission");
    } finally {
      setSubmitting(false);
      fetchStaff();
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setFormData({
      ...EMPTY_FORM,
      fullName: s.full_name, age: s.age || "", gender: s.gender || "",
      mobile: s.phone || "", email: s.email || "", address: s.address || "",
      identityType: s.identity_type || "", identityNumber: s.identity_number || "",
      employmentType: s.employment_type || "Full Time", branchId: s.branch_id,
      departmentId: s.job_roles?.department_id || "", roleId: s.role_id || "",
      shift: s.shift || "Morning", joinedDate: s.joined_date || "",
      status: s.status || "active",
    });
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this employee? This will also remove their assigned tasks.")) return;
    
    setLoading(true);
    try {
      // 1. Delete assigned tasks first to avoid FK constraint issues
      const { error: taskErr } = await supabase
        .from("assigned_tasks")
        .delete()
        .eq("staff_id", id);
      
      if (taskErr) {
        console.warn("Task cleanup warning:", taskErr.message);
      }

      // 2. Delete the staff record
      const { error: staffErr } = await supabase
        .from("staff")
        .delete()
        .eq("id", id);

      if (staffErr) throw staffErr;

      notify("success", "Staff member and associated tasks removed.");
      fetchStaff();
    } catch (err) {
      console.error("Staff deletion error:", err);
      notify("error", `Failed to delete: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => { setEditingId(null); setFormData(EMPTY_FORM); setStep(1); };

  return (
    <AdminWrapper
      title="Staff Enrollment"
      subtitle="Comprehensive employee onboarding portal"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Staff Enrollment" }]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* ── Step Indicator ── */}
        <div style={{ display: "flex", gap: "0.5rem", background: "#fff", borderRadius: "16px", padding: "1.25rem 2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
          {STEPS.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.5rem 1rem", borderRadius: "10px", border: "none",
                    background: active ? "#4f46e5" : done ? "#f0fdf4" : "#f8fafc",
                    color: active ? "#fff" : done ? "#16a34a" : "#64748b",
                    fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                    transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                >
                  <span>{done ? "✅" : s.icon}</span>
                  <span style={{ display: window.innerWidth < 900 ? "none" : "inline" }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: done ? "#bbf7d0" : "#f1f5f9", alignSelf: "center", borderRadius: 4, minWidth: 12 }} />}
              </React.Fragment>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── STEP 1: Personal Details ── */}
          {step === 1 && (
            <div className="card" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
              <SectionHeader title="1. Personal Details" subtitle="Basic identity and contact information" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                <FG><label style={labelStyle}>Full Name *</label><input style={inputStyle} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Employee full name" required /></FG>
                <FG><label style={labelStyle}>Age *</label><input style={inputStyle} type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" min={18} max={65} required /></FG>
                <FG><label style={labelStyle}>Gender *</label>
                  <select style={inputStyle} name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </FG>
                <FG><label style={labelStyle}>Mobile Number *</label><input style={inputStyle} name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit number" maxLength={10} required /></FG>
                <FG><label style={labelStyle}>Email Address</label><input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="personal@email.com" /></FG>
                <FG><label style={labelStyle}>Identity Type *</label>
                  <select style={inputStyle} name="identityType" value={formData.identityType} onChange={handleChange} required>
                    <option value="">Select ID...</option>
                    <option>Aadhar</option><option>PAN Card</option><option>Driving Licence</option>
                  </select>
                </FG>
                <FG><label style={labelStyle}>Identity Number *</label><input style={inputStyle} name="identityNumber" value={formData.identityNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX" maxLength={14} required /></FG>
                <FG span={2}><label style={labelStyle}>Permanent Address</label>
                  <textarea style={{ ...inputStyle, resize: "none", minHeight: 45 }} name="address" value={formData.address} onChange={handleChange} placeholder="Residential address..." rows={1} />
                </FG>
              </div>
            </div>
          )}

          {/* ── STEP 2: Employment Details ── */}
          {step === 2 && (
            <div className="card" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
              <SectionHeader title="2. Employment Details" subtitle="Branch, department and shift allocation" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                <FG><label style={labelStyle}>Branch *</label>
                  <select style={inputStyle} name="branchId" value={formData.branchId} onChange={handleChange} required>
                    <option value="">Select Branch...</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                  </select>
                </FG>
                <FG><label style={labelStyle}>Department *</label>
                  <select style={inputStyle} name="departmentId" value={formData.departmentId} onChange={handleChange} disabled={!formData.branchId} required>
                    <option value="">Select Dept...</option>
                    {filteredDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </FG>
                <FG><label style={labelStyle}>Job Role *</label>
                  <select style={inputStyle} name="roleId" value={formData.roleId} onChange={handleChange} disabled={!formData.departmentId} required>
                    <option value="">Select Role...</option>
                    {filteredRoles.map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                  </select>
                  {filteredRoles.length === 0 && formData.departmentId && <span style={{ fontSize: "0.7rem", color: "#ef4444", marginTop: 4 }}>No roles defined for this dept.</span>}
                </FG>
                <FG><label style={labelStyle}>Employment Type *</label>
                  <select style={inputStyle} name="employmentType" value={formData.employmentType} onChange={handleChange}>
                    <option>Full Time</option><option>Part Time</option><option>Hybrid</option>
                  </select>
                </FG>
                <FG><label style={labelStyle}>Shift *</label>
                  <select style={inputStyle} name="shift" value={formData.shift} onChange={handleChange}>
                    <option>Morning</option><option>Afternoon</option><option>Night</option>
                  </select>
                </FG>
                <FG><label style={labelStyle}>Joined Date</label>
                  <input style={inputStyle} type="date" name="joinedDate" value={formData.joinedDate} onChange={handleChange} />
                </FG>
                <FG><label style={labelStyle}>Status</label>
                  <select style={inputStyle} name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </FG>
              </div>
            </div>
          )}

          {/* ── STEP 3: Login Credentials ── */}
          {step === 3 && (
            <div className="card" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
              <SectionHeader title="3. Login Credentials" subtitle="Create staff portal login access" />
              <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "0.875rem 1.25rem", fontSize: "0.85rem", color: "#92400e" }}>
                  ⚠️ {editingId ? "Login credentials cannot be changed here. Use Supabase Auth." : "These credentials will allow the staff member to log in to the Staff Portal."}
                </div>
                {!editingId && (
                  <>
                    <FG><label style={labelStyle}>Staff Portal Email</label>
                      <input style={inputStyle} type="email" name="staffEmail" value={formData.staffEmail} onChange={handleChange} placeholder="staff@hostay.com" disabled={!!editingId} />
                    </FG>
                    <FG><label style={labelStyle}>Temporary Password</label>
                      <input style={inputStyle} type="password" name="staffPassword" value={formData.staffPassword} onChange={handleChange} placeholder="Min 8 characters" disabled={!!editingId} />
                    </FG>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: Portal Access Permissions ── */}
          {step === 4 && (
            <div className="card" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
              <SectionHeader title="4. Portal Access Permissions" subtitle="Control what this staff member can see in the Staff Portal" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", maxWidth: 600 }}>
                {[
                  { key: "accessDashboard", label: "Dashboard Overview", desc: "View shift, attendance and summary stats", icon: "🏠" },
                  { key: "accessTasks", label: "Assigned Tasks", desc: "View and update assigned tasks", icon: "📋" },
                  { key: "accessLeave", label: "Leave Requests", desc: "Submit and track leave applications", icon: "📅" },
                  { key: "accessProfile", label: "My Profile", desc: "View and edit personal details", icon: "👤" },
                ].map(perm => (
                  <label key={perm.key} style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.25rem", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${formData[perm.key] ? "#4f46e5" : "#e2e8f0"}`,
                    background: formData[perm.key] ? "#eef2ff" : "#fff",
                    transition: "all 0.2s",
                  }}>
                    <input type="checkbox" name={perm.key} checked={formData[perm.key]} onChange={handleChange} style={{ width: 18, height: 18, accentColor: "#4f46e5" }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>{perm.icon} {perm.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>{perm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 5: Task Assignment ── */}
          {step === 5 && (
            <div className="card" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
              <SectionHeader title="5. Task Assignment" subtitle="Assign a task to this staff member (optional)" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                <FG span={2}><label style={labelStyle}>Task Title</label>
                  <input style={inputStyle} name="taskTitle" value={formData.taskTitle} onChange={handleChange} placeholder="e.g. Room inspection for Floor 3" />
                </FG>
                <FG><label style={labelStyle}>Priority</label>
                  <select style={inputStyle} name="taskPriority" value={formData.taskPriority} onChange={handleChange}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </FG>
                <FG><label style={labelStyle}>Due Date</label>
                  <input style={inputStyle} type="date" name="taskDueDate" value={formData.taskDueDate} onChange={handleChange} />
                </FG>
                <FG><label style={labelStyle}>Job Role</label>
                  <select style={inputStyle} name="taskRoleId" value={formData.taskRoleId} onChange={handleChange} disabled={!formData.departmentId}>
                    <option value="">General Task</option>
                    {filteredRoles.map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                  </select>
                </FG>
                <FG span={2}><label style={labelStyle}>Task Description</label>
                  <textarea style={{ ...inputStyle, resize: "none", minHeight: 80 }} name="taskDescription" value={formData.taskDescription} onChange={handleChange} placeholder="Detailed task description..." rows={3} />
                </FG>
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)} style={{ padding: "0.875rem 1.75rem", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 700, cursor: "pointer" }}>
                  ← Back
                </button>
              )}
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ padding: "0.875rem 1.75rem", borderRadius: 12, border: "none", background: "#f1f5f9", color: "#64748b", fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
            <div>
              {step < 5 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} style={{ padding: "0.875rem 2.5rem", borderRadius: 12, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
                  Next →
                </button>
              ) : (
                <button type="submit" disabled={submitting} style={{ padding: "0.875rem 3rem", borderRadius: 12, border: "none", background: submitting ? "#a5b4fc" : "#4f46e5", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Processing..." : editingId ? "Update Record" : "✅ Complete Enrollment"}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ── Staff Directory Table ── */}
        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f1f5f9" }}>
            <SectionHeader title="Staff Directory" subtitle={`${staffList.length} employees registered`} />
          </div>
          {staffList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#94a3b8" }}>
              {loading ? "Loading staff..." : "No staff registered yet."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Employee", "Branch / Dept", "Shift", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "1rem 1.5rem", color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", textAlign: h === "Actions" ? "right" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(s => (
                    <tr key={s.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ fontWeight: 700, color: "#1e293b" }}>{s.full_name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{s.job_roles?.role_name || "—"} • {s.phone}</div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ fontWeight: 600 }}>{s.hotel_branches?.branch_name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{s.job_roles?.departments?.name || "—"}</div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textTransform: "capitalize", fontSize: "0.875rem" }}>{s.shift}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", background: s.status === "active" ? "#f0fdf4" : "#fef2f2", color: s.status === "active" ? "#16a34a" : "#dc2626" }}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                        <button 
                          onClick={() => handleEdit(s)} 
                          style={{ 
                            background: "#eff6ff", border: "1px solid #dbeafe", color: "#2563eb", 
                            padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, 
                            cursor: "pointer", marginRight: 12, transition: "all 0.2s" 
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#dbeafe"}
                          onMouseLeave={(e) => e.target.style.background = "#eff6ff"}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)} 
                          style={{ 
                            background: "#fef2f2", border: "1px solid #fee2e2", color: "#dc2626", 
                            padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 700, 
                            cursor: "pointer", transition: "all 0.2s" 
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#fee2e2"}
                          onMouseLeave={(e) => e.target.style.background = "#fef2f2"}
                        >
                          Delete
                        </button>
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
