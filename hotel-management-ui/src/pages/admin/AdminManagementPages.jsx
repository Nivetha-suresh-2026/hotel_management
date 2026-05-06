import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ADMIN_HUB_MODULES, CREATION_HUB_MODULES } from "../../routes/navigation";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabaseClient";

export const AdminWrapper = ({ title, subtitle, children, notification, showSearch, breadcrumbs }) => {
  const [showProfile, setShowProfile] = React.useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header style={{ 
          background: "white", 
          padding: "1rem 2.5rem", 
          borderBottom: "1px solid var(--border-color)", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {breadcrumbs && (
              <button 
                onClick={() => navigate(-1)} 
                style={{ background: "#f1f5f9", border: "none", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                ←
              </button>
            )}
            <div>
              {breadcrumbs && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2px" }}>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <span 
                        style={{ fontSize: "0.75rem", color: index === breadcrumbs.length - 1 ? "var(--primary)" : "#94a3b8", cursor: crumb.path ? "pointer" : "default", fontWeight: 600 }}
                        onClick={() => crumb.path && navigate(crumb.path)}
                      >
                        {crumb.label}
                      </span>
                      {index < breadcrumbs.length - 1 && <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>/</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "var(--text-main)" }}>{title}</h2>
              {subtitle && <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{subtitle}</p>}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {showSearch && (
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "1rem", color: "#94a3b8" }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search booking, room, etc" 
                  style={{ width: "260px", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "12px", background: "#f1f5f9", border: "1px solid transparent", fontSize: "0.875rem" }} 
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>

              <Link to={PATHS.BOOKING}>
                <button style={{ background: "var(--primary)", color: "white", border: "none", borderRadius: "10px", padding: "0.625rem 1.25rem", fontWeight: 600, fontSize: "0.875rem" }}>
                  + New Booking
                </button>
              </Link>
              
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  style={{ background: "#f1f5f9", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontSize: "1.25rem" }}>👤</span>
                </button>

                {showProfile && (
                  <div style={{ 
                    position: "absolute", 
                    top: "120%", 
                    right: 0, 
                    width: "220px", 
                    background: "white", 
                    borderRadius: "16px", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", 
                    border: "1px solid #f1f5f9",
                    padding: "1rem",
                    animation: "slideDown 0.2s ease-out"
                  }}>
                    <div style={{ marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{userRole === "admin" ? "Zain George" : "Property Owner"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{userRole === "admin" ? "System Administrator" : "Hotel Owner"}</div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        width: "100%", 
                        padding: "0.625rem", 
                        borderRadius: "10px", 
                        background: "#fff1f2", 
                        color: "#e11d48", 
                        border: "none", 
                        fontWeight: 600, 
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center"
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {notification && (
          <div style={{ 
            margin: "1.5rem 2.5rem 0",
            padding: "0.75rem 1.25rem", 
            borderRadius: "12px", 
            background: notification.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: notification.type === "success" ? "#166534" : "#991b1b",
            fontSize: "0.875rem",
            fontWeight: "600",
            border: `1px solid ${notification.type === "success" ? "#bbf7d0" : "#fecaca"}`
          }}>
            {notification.type === "success" ? "✓ " : "✕ "}{notification.message}
          </div>
        )}

        <div className="container" style={{ padding: "2.5rem" }}>
          {children}
        </div>
      </main>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "var(--text-main)" }}>{title}</h3>
    {subtitle && <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--text-muted)" }}>{subtitle}</p>}
  </div>
);

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
    const payload = {
      branch_name: formData.branchName,
      location: formData.location,
      start_floor: parseInt(formData.startFloor),
      end_floor: parseInt(formData.endFloor),
      contact_number: formData.contactNumber,
      status: 'Active'
    };

    try {
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

  const handleSyncLocalData = async () => {
    const localBranches = JSON.parse(localStorage.getItem("branches") || "[]");
    if (localBranches.length === 0) {
      setNotification({ type: "error", message: "No local data found to sync" });
      return;
    }

    setLoading(true);
    const payloads = localBranches.map(b => ({
      branch_name: b.branchName,
      location: b.location,
      start_floor: parseInt(b.startFloor),
      end_floor: parseInt(b.endFloor),
      contact_number: b.contactNumber,
      status: 'Active'
    }));

    const { error } = await supabase
      .from('hotel_branches')
      .insert(payloads);

    if (error) {
      setNotification({ type: "error", message: `Sync failed: ${error.message}` });
    } else {
      setNotification({ type: "success", message: `Successfully synced ${localBranches.length} branches!` });
      localStorage.removeItem("branches");
      fetchBranches();
    }
    setLoading(false);
    setTimeout(() => setNotification(null), 3000);
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
            <button type="submit" style={{ padding: "0.875rem", fontSize: "1rem" }}>
              {editingId ? "Update Branch" : "Register Branch"}
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
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc" }}>
            <SectionHeader title="All Branches" subtitle={`${branches.length} locations registered`} />
          </div>
          {branches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>No branches created yet.</p>
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
                  {branches.map(branch => (
                    <tr key={branch.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "1.25rem 2rem", fontWeight: "600" }}>{branch.branchName}</td>
                      <td style={{ padding: "1.25rem 2rem" }}>{branch.location}</td>
                      <td style={{ padding: "1.25rem 2rem" }}><span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.875rem", fontWeight: "600" }}>{branch.startFloor}-{branch.endFloor}</span></td>
                      <td style={{ padding: "1.25rem 2rem", color: "var(--text-muted)" }}>{branch.contactNumber}</td>
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

export const RoomCreation = () => {
  const [formData, setFormData] = React.useState({
    branchId: "",
    floor: "",
    roomNumber: "",
    roomType: "",
    bedCount: "",
    features: []
  });
  const [branches, setBranches] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [notification, setNotification] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);

  React.useEffect(() => {
    const savedBranches = JSON.parse(localStorage.getItem("branches") || "[]");
    const savedRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    setBranches(savedBranches);
    setRooms(savedRooms);
  }, []);

  const selectedBranch = branches.find(b => b.id.toString() === formData.branchId);
  const floors = selectedBranch 
    ? Array.from({ length: selectedBranch.endFloor - selectedBranch.startFloor + 1 }, (_, i) => selectedBranch.startFloor + i)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.floor || !formData.roomNumber || !formData.roomType || !formData.bedCount) {
      setNotification({ type: "error", message: "Please fill all fields" });
      return;
    }

    const branch = branches.find(b => b.id.toString() === formData.branchId);
    
    if (editingId) {
      const updatedRooms = rooms.map(r => r.id === editingId ? { ...formData, id: editingId, branchName: branch.branchName } : r);
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      setRooms(updatedRooms);
      setEditingId(null);
      setNotification({ type: "success", message: "Room updated successfully!" });
    } else {
      const newRoom = { ...formData, id: Date.now(), branchName: branch.branchName };
      const updatedRooms = [...rooms, newRoom];
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      setRooms(updatedRooms);
      setNotification({ type: "success", message: "Room created successfully!" });
    }

    setFormData({ branchId: "", floor: "", roomNumber: "", roomType: "", bedCount: "", features: [] });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditRoom = (room) => {
    setFormData({
      branchId: branches.find(b => b.branchName === room.branchName)?.id.toString() || "",
      floor: room.floor,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      bedCount: room.bedCount,
      features: room.features || []
    });
    setEditingId(room.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      const updatedRooms = rooms.filter(r => r.id !== id);
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      setRooms(updatedRooms);
      setNotification({ type: "success", message: "Room deleted successfully!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AdminWrapper 
      title="Room Setup" 
      subtitle="Configure room units, types, and floor assignments"
      notification={notification}
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Rooms" }]}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }}></span>
              <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Branch</h4>
            </div>
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Select branch</label>
              <select name="branchId" value={formData.branchId} onChange={handleChange} style={{ borderRadius: "10px" }}>
                <option value="">Choose a branch...</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.branchName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }}></span>
              <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Location</h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Floor</label>
                <select name="floor" value={formData.floor} onChange={handleChange} disabled={!formData.branchId} style={{ borderRadius: "10px" }}>
                  <option value="">Floor...</option>
                  {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Room number</label>
                <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="e.g. 101" style={{ borderRadius: "10px" }} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }}></span>
              <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Room details</h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Room type</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange} style={{ borderRadius: "10px" }}>
                  <option value="">Type...</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Beds</label>
                <input type="number" name="bedCount" value={formData.bedCount} onChange={handleChange} placeholder="Count" min="1" style={{ borderRadius: "10px" }} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
              <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Features & Amenities</h4>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {["AC", "WiFi", "TV", "Mini Fridge", "Bathtub", "Balcony", "Safe", "Room Service"].map(feature => {
                const isSelected = formData.features.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => {
                      const newFeatures = isSelected 
                        ? formData.features.filter(f => f !== feature)
                        : [...formData.features, feature];
                      setFormData(prev => ({ ...prev, features: newFeatures }));
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.8125rem",
                      fontWeight: "600",
                      border: "1px solid",
                      borderColor: isSelected ? "#10b981" : "#e2e8f0",
                      background: isSelected ? "#ecfdf5" : "transparent",
                      color: isSelected ? "#059669" : "#64748b",
                      boxShadow: "none",
                      transition: "all 0.2s"
                    }}
                  >
                    {isSelected ? "✓ " : "+ "}{feature}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem", gap: "1rem", alignItems: "center" }}>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ branchId: "", floor: "", roomNumber: "", roomType: "", bedCount: "", features: [] });
                }}
                style={{ background: "transparent", color: "#64748b", border: "none", boxShadow: "none", cursor: "pointer" }}
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" style={{ 
              padding: "0.875rem 2.5rem", 
              borderRadius: "12px", 
              background: "var(--primary)", 
              fontSize: "0.9375rem",
              fontWeight: "600",
              boxShadow: "0 4px 6px -1px rgb(79 70 229 / 0.2)"
            }}>
              {editingId ? "Update Room" : "Create Room"}
            </button>
          </div>
        </form>

        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "none", border: "1px solid #e2e8f0", marginTop: "1rem" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e2e8f0", background: "#fcfcfc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Inventory</h4>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{rooms.length} rooms available</p>
              </div>
            </div>
          </div>
          {rooms.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>No rooms registered yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Room</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Location</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Type</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Features</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Beds</th>
                    <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <div style={{ fontWeight: "700", color: "var(--primary)" }}>#{room.roomNumber}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Floor {room.floor}</div>
                      </td>
                      <td style={{ padding: "1.25rem 2rem" }}>{room.branchName}</td>
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "20px", 
                          background: "#f1f5f9", 
                          color: "#475569",
                          fontSize: "0.75rem", 
                          fontWeight: "700" 
                        }}>{room.roomType}</span>
                      </td>
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {room.features && room.features.map(f => (
                            <span key={f} style={{ fontSize: "0.65rem", background: "#f0f9ff", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bae6fd" }}>{f}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "1.25rem 2rem", fontWeight: "600" }}>{room.bedCount}</td>
                      <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => handleEditRoom(room)}
                            style={{ padding: "6px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", cursor: "pointer" }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteRoom(room.id)}
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

export const GuestDetails = () => {
  const [guests, setGuests] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGuest, setSelectedGuest] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setGuests(savedBookings);
  }, []);

  const filteredGuests = guests.filter(guest => 
    guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.contact.includes(searchTerm)
  );

  const handleEditClick = (guest) => {
    setSelectedGuest({ ...guest });
    setIsModalOpen(true);
  };

  const handleUpdateGuest = (e) => {
    e.preventDefault();
    const updatedGuests = guests.map(g => g.id === selectedGuest.id ? selectedGuest : g);
    localStorage.setItem("bookings", JSON.stringify(updatedGuests));
    setGuests(updatedGuests);
    setIsModalOpen(false);
    alert("Guest details updated successfully!");
  };

  const handleModalChange = (name, value) => {
    if (name === "contact") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 10) setSelectedGuest({ ...selectedGuest, [name]: val });
      return;
    }
    if (name === "aadhar") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 12) setSelectedGuest({ ...selectedGuest, [name]: val });
      return;
    }
    if (name === "guestName") {
      const val = value.replace(/[0-9]/g, "");
      setSelectedGuest({ ...selectedGuest, [name]: val });
      return;
    }
    setSelectedGuest({ ...selectedGuest, [name]: value });
  };

  return (
    <AdminWrapper 
      title="Guest Directory" 
      subtitle="Search and view historical guest records"
      breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Guests" }]}
    >
      <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
        <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", background: "#fcfcfc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionHeader title="Guest List" subtitle={`${filteredGuests.length} records found`} />
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "300px", paddingLeft: "2.5rem" }}
            />
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          </div>
        </div>
        
        {filteredGuests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p style={{ color: "var(--text-muted)" }}>No guests found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem 2rem", textAlign: "left" }}>Guest Info</th>
                  <th style={{ padding: "1rem 2rem", textAlign: "left" }}>ID Details</th>
                  <th style={{ padding: "1rem 2rem", textAlign: "left" }}>Contact</th>
                  <th style={{ padding: "1rem 2rem", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map(guest => (
                  <tr key={guest.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{guest.guestName}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Member since {new Date(guest.id).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>Aadhar: {guest.aadhar}</div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <div style={{ fontSize: "0.875rem" }}>{guest.contact}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{guest.email}</div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem", textAlign: "center" }}>
                      <button 
                        onClick={() => handleEditClick(guest)}
                        style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: "700" }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && selectedGuest && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="card" style={{ width: "500px", padding: "2rem", position: "relative" }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
            <SectionHeader title="Edit Guest Details" subtitle="Update guest profile information" />
            <form onSubmit={handleUpdateGuest} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="form-group">
                <label>Guest Name</label>
                <input type="text" value={selectedGuest.guestName} onChange={(e) => handleModalChange("guestName", e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="text" value={selectedGuest.contact} onChange={(e) => handleModalChange("contact", e.target.value)} required maxLength={10} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={selectedGuest.email} onChange={(e) => handleModalChange("email", e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Aadhar Number</label>
                <input type="text" value={selectedGuest.aadhar} onChange={(e) => handleModalChange("aadhar", e.target.value)} required maxLength={12} />
              </div>
              <button type="submit" style={{ padding: "1rem", marginTop: "1rem" }}>Update Profile</button>
            </form>
          </div>
        </div>
      )}
    </AdminWrapper>
  );
};

export const StaffDetails = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBranch, setSelectedBranch] = React.useState("All");
  const [selectedDept, setSelectedDept] = React.useState("All");
  const [staffList, setStaffList] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const savedStaff = JSON.parse(localStorage.getItem("staff") || "[]");
    const savedBranches = JSON.parse(localStorage.getItem("branches") || "[]");
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setStaffList(savedStaff);
    setBranches(savedBranches);
    setDepartments(savedDepartments);
  }, []);

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === "All" || staff.branchName === selectedBranch;
    const matchesDept = selectedDept === "All" || staff.departmentName === selectedDept;
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
              {branches.map(b => <option key={b.id} value={b.branchName}>{b.branchName}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--text-muted)" }}>Dept</label>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="All">All Departments</option>
              {[...new Set(departments.map(d => d.departmentName))].map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Staff", val: filteredStaff.length, color: "var(--primary)" },
          { label: "Active", val: filteredStaff.filter(s => s.status === "Active").length, color: "#166534" },
          { label: "Hybrid", val: filteredStaff.filter(s => s.employmentType === "Hybrid").length, color: "#6366f1" }
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", padding: "1.5rem", borderRadius: "16px", flex: 1, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.025em" }}>{stat.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: stat.color, marginTop: "0.5rem" }}>{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
        {filteredStaff.length === 0 ? (
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
                        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>{staff.staffName.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "1rem" }}>{staff.staffName}</div>
                          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{staff.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <div style={{ fontWeight: "600" }}>{staff.branchName}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{staff.departmentName} • {staff.role}</div>
                    </td>
                    <td style={{ padding: "1.25rem 2rem" }}><div style={{ fontFamily: "monospace", letterSpacing: "0.05em", color: "#475569" }}>{staff.aadharNumber.replace(/(\d{4})/g, "$1 ").trim()}</div></td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                      <span style={{ padding: "0.375rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", background: staff.status === "Active" ? "#dcfce7" : "#fee2e2", color: staff.status === "Active" ? "#166534" : "#991b1b" }}>{staff.status}</span>
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

export const HubCard = ({ title, description, icon, path, color }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className="card" 
      style={{ 
        cursor: "pointer", 
        padding: "1.75rem", 
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #f1f5f9",
        borderTop: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
      }}
    >
      <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontSize: "1.5rem" }}>{icon}</div>
        <div style={{ fontWeight: "800", fontSize: "1.25rem", color: "#1e293b" }}>{title}</div>
      </div>
      <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b", lineHeight: "1.5" }}>{description}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <span style={{ color: color, fontWeight: "700", fontSize: "0.8125rem", background: `${color}15`, padding: "4px 12px", borderRadius: "20px" }}>Open Hub →</span>
      </div>
    </div>
  );
};

export const HubBanner = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="card" style={{ 
      padding: "2.5rem", 
      display: "flex", 
      alignItems: "center", 
      gap: "2.5rem", 
      marginBottom: "2.5rem",
      borderRadius: "32px",
      background: "white",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.04)",
      border: "1px solid #f1f5f9"
    }}>
      <div style={{ position: "relative" }}>
        <div style={{ 
          width: "100px", 
          height: "100px", 
          borderRadius: "50%", 
          overflow: "hidden", 
          border: "4px solid white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <img src={imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>{title}</h1>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.125rem", color: "#64748b", fontWeight: "500" }}>{subtitle}</p>
      </div>
    </div>
  );
};

