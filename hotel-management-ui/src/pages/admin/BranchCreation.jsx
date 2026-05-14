import React from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

export const BranchCreation = () => {
  const [formData, setFormData] = React.useState({
    branchName: "",
    location: "",
    startFloor: 0,
    endFloor: "",
    contactNumber: ""
  });
  const [branches, setBranches] = React.useState([]);
  const [notification, setNotification] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchBranches();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchBranches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hotel_branches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching branches:", error);
    } else {
      setBranches(data);
    }
    setLoading(false);
  };

  const filteredBranches = branches.filter(b => 
    b.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedBranches = searchTerm === "" ? filteredBranches.slice(0, 4) : filteredBranches;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 10) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchName || !formData.location || !formData.endFloor || !formData.contactNumber) {
      setNotification({ type: "error", message: "Please fill all fields" });
      return;
    }

    if (formData.contactNumber.length !== 10) {
      setNotification({ type: "error", message: "Contact number must be exactly 10 digits" });
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
        branch_name: formData.branchName,
        location: formData.location,
        start_floor: parseInt(formData.startFloor),
        end_floor: parseInt(formData.endFloor),
        contact_number: formData.contactNumber,
        status: 'Active',
        created_by: profile.id
      };

      if (editingId) {
        const { error } = await supabase
          .from('hotel_branches')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setNotification({ type: "success", message: "Branch updated successfully!" });
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('hotel_branches')
          .insert([payload]);

        if (error) throw error;
        setNotification({ type: "success", message: "Branch created successfully!" });
      }

      setFormData({ branchName: "", location: "", startFloor: 0, endFloor: "", contactNumber: "" });
      fetchBranches();
    } catch (error) {
      setNotification({ type: "error", message: `Error: ${error.message}` });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditBranch = (branch) => {
    setFormData({
      branchName: branch.branch_name,
      location: branch.location,
      startFloor: branch.start_floor,
      endFloor: branch.end_floor,
      contactNumber: branch.contact_number
    });
    setEditingId(branch.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBranch = async (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setLoading(true);
      const { error } = await supabase
        .from('hotel_branches')
        .delete()
        .eq('id', id);

      if (error) {
        setNotification({ type: "error", message: `Delete failed: ${error.message}` });
      } else {
        setNotification({ type: "success", message: "Branch deleted successfully!" });
        fetchBranches();
      }
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AdminWrapper
      title="Branch Creation"
      subtitle="Register and manage your hotel property locations"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Branches" }]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }}>
        <div className="card" style={{ boxShadow: "var(--shadow-premium)", border: "1px solid #f1f5f9" }}>
          <SectionHeader title="New Branch" subtitle="Enter details for the new location" />
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Branch Name</label>
              <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="e.g. Grand Plaza North" />
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City or District" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Start Floor</label>
                <input type="number" name="startFloor" value={formData.startFloor} readOnly style={{ background: "#f8fafc", color: "#64748b" }} />
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>End Floor</label>
                <input type="number" name="endFloor" value={formData.endFloor} onChange={handleChange} placeholder="Max floor" />
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="10-digit Mobile Number"
                maxLength={10}
              />
            </div>
            <button type="submit" style={{ padding: "0.875rem", fontSize: "1rem" }} disabled={loading}>
              {loading ? "Processing..." : (editingId ? "Update Branch" : "Register Branch")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ branchName: "", location: "", startFloor: 0, endFloor: "", contactNumber: "" });
                }}
                style={{ background: "transparent", color: "#64748b", border: "none", boxShadow: "none", marginTop: "-0.5rem" }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)", border: "1px solid #f1f5f9" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <SectionHeader 
              title="All Branches" 
              subtitle={searchTerm === "" ? `Showing last 4 of ${branches.length} locations` : `Found ${filteredBranches.length} matches`} 
            />
            <div style={{ position: "relative", minWidth: "250px" }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search branch name or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "2.5rem", borderRadius: "10px", fontSize: "0.875rem" }}
              />
            </div>
          </div>
          {displayedBranches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>{loading ? "Loading branches..." : "No branches found."}</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Name</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Location</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Floors</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Contact</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBranches.map(branch => (
                    <tr key={branch.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "1.25rem 2rem", fontWeight: "600" }}>{branch.branch_name}</td>
                      <td style={{ padding: "1.25rem 2rem" }}>{branch.location}</td>
                      <td style={{ padding: "1.25rem 2rem" }}><span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.875rem", fontWeight: "600" }}>{branch.start_floor}-{branch.end_floor}</span></td>
                      <td style={{ padding: "1.25rem 2rem", color: "var(--text-muted)" }}>{branch.contact_number}</td>
                      <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleEditBranch(branch)}
                            style={{ padding: "6px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", cursor: "pointer" }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(branch.id)}
                            style={{ padding: "6px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer" }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
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
