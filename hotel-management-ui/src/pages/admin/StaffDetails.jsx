import React from "react";
import { AdminWrapper } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

export const StaffDetails = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBranch, setSelectedBranch] = React.useState("All");
  const [selectedDept, setSelectedDept] = React.useState("All");
  const [loading, setLoading] = React.useState(true);
  const [branches, setBranches] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [staffList, setStaffList] = React.useState([]);
  const { session, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && session) {
      fetchInitialData();
    }
  }, [session, authLoading]);

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
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          hotel_branches!staff_branch_fkey(branch_name),
          job_roles!staff_role_id_fkey(
            role_name,
            department_id,
            departments(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching staff:", error);
        alert("Failed to load staff details. Please check console for errors.");
      } else {
        setStaffList(data || []);
      }
    } catch (err) {
      console.error("Staff fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = (staff.full_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === "All" || staff.hotel_branches?.branch_name === selectedBranch;
    const matchesDept = selectedDept === "All" || staff.job_roles?.departments?.name === selectedDept;
    return matchesSearch && matchesBranch && matchesDept;
  });

  return (
    <AdminWrapper
      title="Staff Directory"
      subtitle="Comprehensive view of all active employees"
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Staff Directory" }]}
    >
      <div className="card" style={{ marginBottom: "2rem", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", boxShadow: "var(--shadow-premium)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1.5rem", alignItems: "end" }}>
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--text-muted)" }}>Search Staff</label>
            <div style={{ position: "relative" }}>
              <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: "3rem" }} />
              <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>🔍</span>
            </div>
          </div>
          <div className="form-group" style={{ minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--text-muted)" }}>Branch</label>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="All">All Branches</option>
              {branches.map(b => <option key={b.id} value={b.branch_name}>{b.branch_name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--text-muted)" }}>Dept</label>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="All">All Departments</option>
              {[...new Set(departments.map(d => d.name))].map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Staff", val: filteredStaff.length, color: "var(--primary)" },
          { label: "Active", val: filteredStaff.filter(s => s.status === "active").length, color: "#166534" },
          { label: "Hybrid", val: filteredStaff.filter(s => s.employment_type === "Hybrid").length, color: "#6366f1" }
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", padding: "1.5rem", borderRadius: "16px", flex: 1, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.025em" }}>{stat.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: stat.color, marginTop: "0.5rem" }}>{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem", border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
            <p style={{ color: "var(--text-muted)" }}>Loading staff directory...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p style={{ color: "var(--text-muted)" }}>No staff found matching filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "1.25rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Employee</th>
                  <th style={{ padding: "1.25rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Branch & Dept</th>
                  <th style={{ padding: "1.25rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Identity</th>
                  <th style={{ padding: "1.25rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(staff => (
                  <tr key={staff.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>{(staff.full_name || "S").charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "1rem" }}>{staff.full_name}</div>
                          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{staff.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <div style={{ fontWeight: "600" }}>{staff.hotel_branches?.branch_name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{staff.job_roles?.departments?.name} • {staff.job_roles?.role_name}</div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem" }}><div style={{ fontFamily: "monospace", letterSpacing: "0.05em", color: "#475569" }}>{(staff.identity_number || "").replace(/(\d{4})/g, "$1 ").trim()}</div></td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <span style={{ padding: "0.375rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", background: staff.status === "active" ? "#dcfce7" : "#fee2e2", color: staff.status === "active" ? "#166534" : "#991b1b" }}>{staff.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminWrapper>
  );
};
