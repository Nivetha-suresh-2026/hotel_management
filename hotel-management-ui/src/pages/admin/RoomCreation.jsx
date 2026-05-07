// import React from "react";
// import { AdminWrapper } from "./AdminWrapper";
// import { PATHS } from "../../routes/paths";

// export const RoomCreation = () => {
//   const [formData, setFormData] = React.useState({
//     branchId: "",
//     floor: "",
//     roomNumber: "",
//     roomType: "",
//     bedCount: "",
//     features: []
//   });
//   const [branches, setBranches] = React.useState([]);
//   const [rooms, setRooms] = React.useState([]);
//   const [notification, setNotification] = React.useState(null);
//   const [editingId, setEditingId] = React.useState(null);

//   React.useEffect(() => {
//     const savedBranches = JSON.parse(localStorage.getItem("branches") || "[]");
//     const savedRooms = JSON.parse(localStorage.getItem("rooms") || "[]");
//     setBranches(savedBranches);
//     setRooms(savedRooms);
//   }, []);

//   const selectedBranch = branches.find(b => b.id.toString() === formData.branchId);
//   const floors = selectedBranch 
//     ? Array.from({ length: selectedBranch.endFloor - selectedBranch.startFloor + 1 }, (_, i) => selectedBranch.startFloor + i)
//     : [];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.branchId || !formData.floor || !formData.roomNumber || !formData.roomType || !formData.bedCount) {
//       setNotification({ type: "error", message: "Please fill all fields" });
//       return;
//     }

//     const branch = branches.find(b => b.id.toString() === formData.branchId);

//     if (editingId) {
//       const updatedRooms = rooms.map(r => r.id === editingId ? { ...formData, id: editingId, branchName: branch.branchName } : r);
//       localStorage.setItem("rooms", JSON.stringify(updatedRooms));
//       setRooms(updatedRooms);
//       setEditingId(null);
//       setNotification({ type: "success", message: "Room updated successfully!" });
//     } else {
//       const newRoom = { ...formData, id: Date.now(), branchName: branch.branchName };
//       const updatedRooms = [...rooms, newRoom];
//       localStorage.setItem("rooms", JSON.stringify(updatedRooms));
//       setRooms(updatedRooms);
//       setNotification({ type: "success", message: "Room created successfully!" });
//     }

//     setFormData({ branchId: "", floor: "", roomNumber: "", roomType: "", bedCount: "", features: [] });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleEditRoom = (room) => {
//     setFormData({
//       branchId: branches.find(b => b.branchName === room.branchName)?.id.toString() || "",
//       floor: room.floor,
//       roomNumber: room.roomNumber,
//       roomType: room.roomType,
//       bedCount: room.bedCount,
//       features: room.features || []
//     });
//     setEditingId(room.id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDeleteRoom = (id) => {
//     if (window.confirm("Are you sure you want to delete this room?")) {
//       const updatedRooms = rooms.filter(r => r.id !== id);
//       localStorage.setItem("rooms", JSON.stringify(updatedRooms));
//       setRooms(updatedRooms);
//       setNotification({ type: "success", message: "Room deleted successfully!" });
//       setTimeout(() => setNotification(null), 3000);
//     }
//   };

//   return (
//     <AdminWrapper 
//       title="Room Setup" 
//       subtitle="Configure room units, types, and floor assignments"
//       notification={notification}
//       breadcrumbs={[{ label: "Dashboard", path: PATHS.ADMIN_DASHBOARD }, { label: "Rooms" }]}
//     >
//       <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
//         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//           <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
//               <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }}></span>
//               <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Branch</h4>
//             </div>
//             <div className="form-group">
//               <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Select branch</label>
//               <select name="branchId" value={formData.branchId} onChange={handleChange} style={{ borderRadius: "10px" }}>
//                 <option value="">Choose a branch...</option>
//                 {branches.map(b => (
//                   <option key={b.id} value={b.id}>{b.branchName}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
//               <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }}></span>
//               <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Location</h4>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
//               <div className="form-group">
//                 <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Floor</label>
//                 <select name="floor" value={formData.floor} onChange={handleChange} disabled={!formData.branchId} style={{ borderRadius: "10px" }}>
//                   <option value="">Floor...</option>
//                   {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Room number</label>
//                 <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="e.g. 101" style={{ borderRadius: "10px" }} />
//               </div>
//             </div>
//           </div>

//           <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
//               <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6" }}></span>
//               <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Room details</h4>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
//               <div className="form-group">
//                 <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Room type</label>
//                 <select name="roomType" value={formData.roomType} onChange={handleChange} style={{ borderRadius: "10px" }}>
//                   <option value="">Type...</option>
//                   <option value="Single">Single</option>
//                   <option value="Double">Double</option>
//                   <option value="Suite">Suite</option>
//                   <option value="Deluxe">Deluxe</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8125rem", fontWeight: "600", color: "#64748b" }}>Beds</label>
//                 <input type="number" name="bedCount" value={formData.bedCount} onChange={handleChange} placeholder="Count" min="1" style={{ borderRadius: "10px" }} />
//               </div>
//             </div>
//           </div>

//           <div className="card" style={{ padding: "1.5rem", boxShadow: "none", border: "1px solid #e2e8f0" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
//               <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
//               <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "700", color: "#1e293b" }}>Features & Amenities</h4>
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
//               {["AC", "WiFi", "TV", "Mini Fridge", "Bathtub", "Balcony", "Safe", "Room Service"].map(feature => {
//                 const isSelected = formData.features.includes(feature);
//                 return (
//                   <button
//                     key={feature}
//                     type="button"
//                     onClick={() => {
//                       const newFeatures = isSelected 
//                         ? formData.features.filter(f => f !== feature)
//                         : [...formData.features, feature];
//                       setFormData(prev => ({ ...prev, features: newFeatures }));
//                     }}
//                     style={{
//                       padding: "0.5rem 1rem",
//                       borderRadius: "20px",
//                       fontSize: "0.8125rem",
//                       fontWeight: "600",
//                       border: "1px solid",
//                       borderColor: isSelected ? "#10b981" : "#e2e8f0",
//                       background: isSelected ? "#ecfdf5" : "transparent",
//                       color: isSelected ? "#059669" : "#64748b",
//                       boxShadow: "none",
//                       transition: "all 0.2s"
//                     }}
//                   >
//                     {isSelected ? "✓ " : "+ "}{feature}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem", gap: "1rem", alignItems: "center" }}>
//             {editingId && (
//               <button 
//                 type="button" 
//                 onClick={() => {
//                   setEditingId(null);
//                   setFormData({ branchId: "", floor: "", roomNumber: "", roomType: "", bedCount: "", features: [] });
//                 }}
//                 style={{ background: "transparent", color: "#64748b", border: "none", boxShadow: "none", cursor: "pointer" }}
//               >
//                 Cancel Edit
//               </button>
//             )}
//             <button type="submit" style={{ 
//               padding: "0.875rem 2.5rem", 
//               borderRadius: "12px", 
//               background: "var(--primary)", 
//               fontSize: "0.9375rem",
//               fontWeight: "600",
//               boxShadow: "0 4px 6px -1px rgb(79 70 229 / 0.2)"
//             }}>
//               {editingId ? "Update Room" : "Create Room"}
//             </button>
//           </div>
//         </form>

//         <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "none", border: "1px solid #e2e8f0", marginTop: "1rem" }}>
//           <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e2e8f0", background: "#fcfcfc" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div>
//                 <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Inventory</h4>
//                 <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{rooms.length} rooms available</p>
//               </div>
//             </div>
//           </div>
//           {rooms.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
//               <p style={{ color: "var(--text-muted)" }}>No rooms registered yet.</p>
//             </div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//                 <thead>
//                   <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
//                     <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Room</th>
//                     <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Location</th>
//                     <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Type</th>
//                     <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Features</th>
//                     <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase" }}>Beds</th>
//                     <th style={{ padding: "1rem 2rem", color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rooms.map(room => (
//                     <tr key={room.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
//                       <td style={{ padding: "1.25rem 2rem" }}>
//                         <div style={{ fontWeight: "700", color: "var(--primary)" }}>#{room.roomNumber}</div>
//                         <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Floor {room.floor}</div>
//                       </td>
//                       <td style={{ padding: "1.25rem 2rem" }}>{room.branchName}</td>
//                       <td style={{ padding: "1.25rem 2rem" }}>
//                         <span style={{ 
//                           padding: "0.25rem 0.75rem", 
//                           borderRadius: "20px", 
//                           background: "#f1f5f9", 
//                           color: "#475569",
//                           fontSize: "0.75rem", 
//                           fontWeight: "700" 
//                         }}>{room.roomType}</span>
//                       </td>
//                       <td style={{ padding: "1.25rem 2rem" }}>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
//                           {room.features && room.features.map(f => (
//                             <span key={f} style={{ fontSize: "0.65rem", background: "#f0f9ff", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bae6fd" }}>{f}</span>
//                           ))}
//                         </div>
//                       </td>
//                       <td style={{ padding: "1.25rem 2rem", fontWeight: "600" }}>{room.bedCount}</td>
//                       <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
//                         <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
//                           <button 
//                             onClick={() => handleEditRoom(room)}
//                             style={{ padding: "6px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "6px", cursor: "pointer" }}
//                             title="Edit"
//                           >
//                             ✏️
//                           </button>
//                           <button 
//                             onClick={() => handleDeleteRoom(room.id)}
//                             style={{ padding: "6px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer" }}
//                             title="Delete"
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </AdminWrapper>
//   );
// };
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
      const { data: { user } } = await supabase.auth.getUser();

      const payload = {
        branch_id: formData.branchId,
        floor_number: parseInt(formData.floorNumber),
        room_number: formData.roomNumber,
        room_type: formData.roomType,
        bed_count: parseInt(formData.bedCount) || 1,
        features: formData.features.join(", "), // Save as comma-separated text
        created_by: user.id
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "2rem", alignItems: "start" }}>
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

        {/* Table UI continues... */}
      </div>
    </AdminWrapper>
  );
};
