import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";
import { supabase } from "../../lib/supabaseClient";

export const RoomCreation = () => {
  const [formData, setFormData] = useState({
    branchId: "",
    floorNumber: "",
    roomNumber: "",
    roomType: "",
    bedCount: "",
    features: [] // Array for UI state
  });
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const availableFeatures = ["WiFi", "TV", "Mini Fridge", "Bathtub", "Balcony", "Safe", "Room Service", "Geyser"];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: branchData } = await supabase.from('hotel_branches').select('*');
    if (branchData) setBranches(branchData);
    fetchRooms();
  };

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select(`*, hotel_branches!fk_branch(branch_name)`)
      .order('created_at', { ascending: false });
    if (!error) setRooms(data);
  };

  const selectedBranch = branches.find(b => b.id === formData.branchId);
  const floors = selectedBranch
    ? Array.from({ length: selectedBranch.end_floor - selectedBranch.start_floor + 1 }, (_, i) => selectedBranch.start_floor + i)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchId || !formData.floorNumber || !formData.roomNumber || !formData.roomType) {
      setNotification({ type: "error", message: "Please fill all fields" });
      return;
    }

    setLoading(true);
    try {
      // 1. Get the current user's profile ID from public.users
      // Note: we need the 'id' column, not the 'auth_id' column
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Could not retrieve your user profile. Please re-login.");
      }

      // 2. Check for duplicate room number in this branch
      const duplicateQuery = supabase
        .from('rooms')
        .select('id')
        .eq('branch_id', formData.branchId)
        .eq('room_number', formData.roomNumber);
      
      if (editingId) {
        duplicateQuery.neq('id', editingId);
      }

      const { data: duplicateRoom } = await duplicateQuery.single();

      if (duplicateRoom) {
        throw new Error(`Room #${formData.roomNumber} already exists in this branch.`);
      }

      const payload = {
        branch_id: formData.branchId,
        floor_number: parseInt(formData.floorNumber),
        room_number: formData.roomNumber,
        room_type: formData.roomType,
        bed_count: parseInt(formData.bedCount) || 1,
        features: formData.features.join(", "),
        created_by: profile.id
      };

      if (editingId) {
        const { error } = await supabase.from('rooms').update(payload).eq('id', editingId);
        if (error) throw error;
        setNotification({ type: "success", message: "Room updated!" });
      } else {
        const { error } = await supabase.from('rooms').insert([payload]);
        if (error) throw error;
        setNotification({ type: "success", message: "Room created!" });
      }

      setFormData({ branchId: "", floorNumber: "", roomNumber: "", roomType: "", bedCount: "", features: [] });
      setEditingId(null);
      fetchRooms();
    } catch (error) {
      setNotification({ type: "error", message: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditRoom = (room) => {
    setFormData({
      branchId: room.branch_id,
      floorNumber: room.floor_number.toString(),
      roomNumber: room.room_number,
      roomType: room.room_type,
      bedCount: room.bed_count.toString(),
      features: room.features ? room.features.split(", ") : [] // Parse text back to array
    });
    setEditingId(room.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ... (handleDeleteRoom remains the same) ...

  return (
    <AdminWrapper title="Room Setup" subtitle="Configure inventory and amenities" notification={notification}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }}>
        {/* Creation Form */}
        <div className="card" style={{ boxShadow: "var(--shadow-premium)" }}>
          <SectionHeader title="Room Details" subtitle="Enter room specifications" />
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label>Branch</label>
              <select name="branchId" value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value, floorNumber: "" })}>
                <option value="">Select Branch...</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Floor & Room</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <select name="floorNumber" value={formData.floorNumber} onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })} disabled={!formData.branchId}>
                  <option value="">Floor...</option>
                  {floors.map(f => <option key={f} value={f}>F {f}</option>)}
                </select>
                <input type="text" placeholder="No." value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Type & Beds</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <select value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}>
                  <option value="">Type...</option>
                  <option value="AC">AC</option>
                  <option value="NON AC">NON AC</option>
                </select>
                <input type="number" placeholder="Beds" value={formData.bedCount} onChange={(e) => setFormData({ ...formData, bedCount: e.target.value })} min="1" />
              </div>
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "0.5rem" }}>
                {availableFeatures.map(f => {
                  const isSelected = formData.features.includes(f);
                  return (
                    <button
                      key={f} type="button"
                      onClick={() => {
                        const newF = isSelected ? formData.features.filter(x => x !== f) : [...formData.features, f];
                        setFormData({ ...formData, features: newF });
                      }}
                      style={{ padding: "4px 10px", fontSize: "0.7rem", borderRadius: "15px", border: "1px solid", borderColor: isSelected ? "var(--primary)" : "#e2e8f0", background: isSelected ? "#eff6ff" : "white", color: isSelected ? "var(--primary)" : "#64748b" }}
                    >{f}</button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading}>{loading ? "Saving..." : (editingId ? "Update" : "Create Room")}</button>
          </form>
        </div>

        {/* Room Inventory Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-premium)" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e2e8f0", background: "#fcfcfc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Room Inventory</h4>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                {rooms.length === 0 ? "No rooms registered" : `Showing last 4 of ${rooms.length} rooms registered`}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6366f1", background: "#eef2ff", padding: "4px 10px", borderRadius: "12px" }}>
                Live Database
              </span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            {rooms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                <p style={{ color: "#94a3b8" }}>No rooms found in the selected inventory.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "1rem 2rem", color: "#64748b", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Room Details</th>
                    <th style={{ padding: "1rem 2rem", color: "#64748b", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Branch</th>
                    <th style={{ padding: "1rem 2rem", color: "#64748b", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Type</th>
                    <th style={{ padding: "1rem 2rem", color: "#64748b", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Features</th>
                    <th style={{ padding: "1rem 2rem", color: "#64748b", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.slice(0, 4).map(room => (
                    <tr key={room.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} className="table-row-hover">
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "1rem" }}>#{room.room_number}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>Floor {room.floor_number}</div>
                      </td>
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>{room.hotel_branches?.branch_name}</div>
                      </td>
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <span style={{ 
                          padding: "4px 10px", 
                          borderRadius: "8px", 
                          background: room.room_type === "AC" ? "#dcfce7" : "#f1f5f9", 
                          color: room.room_type === "AC" ? "#15803d" : "#475569",
                          fontSize: "0.7rem", 
                          fontWeight: "800" 
                        }}>{room.room_type}</span>
                        <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "4px" }}>{room.bed_count} Beds</div>
                      </td>
                      <td style={{ padding: "1.25rem 2rem" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "200px" }}>
                          {room.features && room.features.split(", ").map(f => (
                            <span key={f} style={{ fontSize: "0.6rem", background: "#f0f9ff", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bae6fd", fontWeight: "600" }}>{f}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => handleEditRoom(room)}
                            style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm("Delete this room?")) {
                                const { error } = await supabase.from('rooms').delete().eq('id', room.id);
                                if (!error) fetchRooms();
                              }
                            }}
                            style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
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
            )}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
};
