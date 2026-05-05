import { useState } from "react";
import Navbar from "../../components/Navbar";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { createBooking } from "../../services/bookingservice";

function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guestName: "",
    age: "",
    contact: "",
    email: "",
    aadhar: "",
    checkIn: "",
    checkOut: "",
    roomType: "Standard",
    totalMembers: "1"
  });

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking(formData);
    alert(`Reservation confirmed for ${formData.guestName}!`);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Age</label>
              <InputField
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Contact Number</label>
              <InputField
                type="tel"
                placeholder="Mobile Number"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email Address</label>
              <InputField
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Aadhar Number</label>
              <InputField
                type="text"
                placeholder="12-digit Aadhar ID"
                value={formData.aadhar}
                onChange={(e) => handleChange("aadhar", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "span 2", marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
              <Button text="Continue to Booking" />
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Room Category</label>
              <select 
                value={formData.roomType} 
                onChange={(e) => handleChange("roomType", e.target.value)}
                style={{ background: "white" }}
              >
                <option value="Standard">Standard Room - $150/night</option>
                <option value="Deluxe">Deluxe Room - $250/night</option>
                <option value="Suite">Presidential Suite - $500/night</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Check-in Date</label>
              <InputField
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleChange("checkIn", e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Check-out Date</label>
              <InputField
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleChange("checkOut", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Total Members</label>
              <InputField
                type="number"
                placeholder="Number of Guests"
                value={formData.totalMembers}
                onChange={(e) => handleChange("totalMembers", e.target.value)}
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
                <Button text="Confirm Reservation" />
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default BookingForm;
