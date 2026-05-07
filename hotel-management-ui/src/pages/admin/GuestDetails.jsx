import React from "react";
import { AdminWrapper, SectionHeader } from "./AdminWrapper";
import { PATHS } from "../../routes/paths";

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
