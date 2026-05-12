import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { createBooking } from "../../services/bookingservice";
import { supabase } from "../../lib/supabaseClient";

function BookingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    age: "",
    contact: "",
    email: "",
    aadhar: "",
    branchId: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    totalMembers: "1",
    advancePaid: "0",
    paymentStatus: "pending",
    specialRequests: ""
  });

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Final Validation before submission
    if (formData.contact.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }
    if (formData.aadhar.length !== 12) {
      alert("Aadhar number must be exactly 12 digits");
      setLoading(false);
      return;
    }
    if (/\d/.test(formData.guestName)) {
      alert("Full Name should not contain numbers");
      setLoading(false);
      return;
    }

    try {
      await createBooking(formData);
      alert(`Reservation confirmed for ${formData.guestName}!`);
      navigate("/admin/guests"); // Redirect to guests page to see the new entry
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    // Prevent non-numeric input for specific fields and enforce max length
    if (name === "contact") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 10) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === "aadhar") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 12) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === "age") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 3) setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === "guestName") {
      // Prevent numbers in name
      const val = value.replace(/[0-9]/g, "");
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    if (name === "branchId") {
      setFormData(prev => ({ ...prev, [name]: value, roomId: "" }));
      fetchRooms(value);
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchBranches = async () => {
    const { data, error } = await supabase.from('hotel_branches').select('id, branch_name');
    if (error) console.error("Error fetching branches:", error);
    else setBranches(data || []);
  };

  const fetchRooms = async (branchId) => {
    if (!branchId) {
      setRooms([]);
      return;
    }
    const { data, error } = await supabase
      .from('rooms')
      .select('id, room_number, room_type')
      .eq('branch_id', branchId);
    if (error) console.error("Error fetching rooms:", error);
    else setRooms(data || []);
  };

  useEffect(() => {
    fetchBranches();
  }, []);


  return (
    <div>
      <Navbar />
      <main className="container" style={{ maxWidth: "800px" }}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1>New Reservation</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: step === 1 ? 1 : 0.5 }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>1</span>
              <span style={{ fontWeight: 600 }}>Guest Details</span>
            </div>
            <div style={{ width: "50px", height: "2px", background: "#e2e8f0", alignSelf: "center" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: step === 2 ? 1 : 0.5 }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: step === 2 ? "var(--primary)" : "#e2e8f0", color: step === 2 ? "white" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>2</span>
              <span style={{ fontWeight: 600 }}>Booking Details</span>
            </div>
          </div>
        </header>

        {step === 1 ? (
          <form onSubmit={handleNext} className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Full Name</label>
              <InputField
                type="text"
                placeholder="Guest Name"
                value={formData.guestName}
                onChange={(e) => handleChange("guestName", e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Age</label>
              <InputField
                type="text"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Contact Number</label>
              <InputField
                type="text"
                placeholder="10-digit Mobile Number"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email Address</label>
              <InputField
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Aadhar Number</label>
              <InputField
                type="text"
                placeholder="12-digit Aadhar ID"
                value={formData.aadhar}
                onChange={(e) => handleChange("aadhar", e.target.value)}
                maxLength={12}
                required
              />
            </div>
            <div style={{ gridColumn: "span 2", marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
              <Button text="Continue to Booking" loading={loading} />
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Branch</label>
              <select 
                value={formData.branchId} 
                onChange={(e) => handleChange("branchId", e.target.value)}
                style={{ background: "white" }}
                required
              >
                <option value="">Select Branch...</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Room</label>
              <select 
                value={formData.roomId} 
                onChange={(e) => handleChange("roomId", e.target.value)}
                style={{ background: "white" }}
                disabled={!formData.branchId}
                required
              >
                <option value="">{formData.branchId ? "Select Room..." : "Select Branch First"}</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>Room {r.room_number} ({r.room_type})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Check-in Date</label>
              <InputField
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleChange("checkIn", e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Check-out Date</label>
              <InputField
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleChange("checkOut", e.target.value)}
                required
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Total Members</label>
              <InputField
                type="number"
                placeholder="Number of Guests"
                value={formData.totalMembers}
                onChange={(e) => handleChange("totalMembers", e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Advance Paid (₹)</label>
              <InputField
                type="number"
                placeholder="0"
                value={formData.advancePaid}
                onChange={(e) => handleChange("advancePaid", e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Payment Status</label>
              <select 
                value={formData.paymentStatus} 
                onChange={(e) => handleChange("paymentStatus", e.target.value)}
                style={{ background: "white" }}
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Special Requests</label>
              <textarea 
                placeholder="Any special requests or notes..."
                value={formData.specialRequests}
                onChange={(e) => handleChange("specialRequests", e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem 1rem", 
                  borderRadius: "var(--radius)", 
                  border: "1px solid var(--border-color)",
                  minHeight: "100px",
                  fontFamily: "inherit"
                }}
              />
            </div>
            <div style={{ gridColumn: "span 2", marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <button 
                type="button" 
                onClick={handleBack}
                style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-color)", flex: 1 }}
              >
                Back to Details
              </button>
              <div style={{ flex: 2 }}>
                <Button text="Confirm Reservation" loading={loading} loadingText="Creating Reservation..." />
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default BookingForm;
