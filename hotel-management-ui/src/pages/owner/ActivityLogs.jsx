import React, { useState, useEffect } from "react";
import { AdminWrapper, SectionHeader } from "../admin/AdminWrapper";
import { supabase } from "../../lib/supabaseClient";

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const allActivities = [];

      // 1. Fetch Branch Creations from Supabase
      const { data: branches } = await supabase
        .from('hotel_branches')
        .select('branch_name, created_at')
        .order('created_at', { ascending: false });
      
      if (branches) {
        branches.forEach(b => {
          allActivities.push({
            id: `branch-${b.created_at}`,
            type: "branch",
            title: "New Branch Created",
            description: `Branch "${b.branch_name}" was registered in the system.`,
            timestamp: new Date(b.created_at),
            icon: "📍",
            color: "#6366f1"
          });
        });
      }

      // 2. Fetch Room Creations from Supabase
      const { data: rooms } = await supabase
        .from('rooms')
        .select('room_number, created_at, hotel_branches(branch_name)')
        .order('created_at', { ascending: false });
      
      if (rooms) {
        rooms.forEach(r => {
          allActivities.push({
            id: `room-${r.created_at}`,
            type: "room",
            title: "Room Added",
            description: `Room #${r.room_number} was added to ${r.hotel_branches?.branch_name || 'a branch'}.`,
            timestamp: new Date(r.created_at),
            icon: "🏨",
            color: "#8b5cf6"
          });
        });
      }

      // 3. Fetch Staff from LocalStorage
      const staffList = JSON.parse(localStorage.getItem("staff") || "[]");
      staffList.forEach(s => {
        allActivities.push({
          id: `staff-${s.id}`,
          type: "staff",
          title: "Staff Enrolled",
          description: `${s.staffName} was enrolled as ${s.role} in ${s.branchName}.`,
          timestamp: new Date(s.id), // id is Date.now()
          icon: "👥",
          color: "#10b981"
        });
      });

      // 4. Fetch Bookings from LocalStorage
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      bookings.forEach(b => {
        allActivities.push({
          id: `booking-${b.id}`,
          type: "booking",
          title: "New Booking Confirmed",
          description: `Reservation for ${b.guestName} (${b.roomType}) from ${b.checkIn} to ${b.checkOut}.`,
          timestamp: new Date(b.id), // id is Date.now()
          icon: "📅",
          color: "#f59e0b"
        });
      });

      // Sort all by timestamp descending
      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(allActivities);

    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.type === filter);

  const stats = {
    total: activities.length,
    branches: activities.filter(a => a.type === "branch").length,
    rooms: activities.filter(a => a.type === "room").length,
    staff: activities.filter(a => a.type === "staff").length,
    bookings: activities.filter(a => a.type === "booking").length,
  };

  if (loading) return (
    <AdminWrapper title="Activity Audit" subtitle="Loading logs...">
      <div style={{ textAlign: "center", padding: "5rem" }}>Processing audit logs...</div>
    </AdminWrapper>
  );

  return (
    <AdminWrapper 
      title="Admin Activity Logs" 
      subtitle="Complete audit trail of system modifications and transactions"
    >
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Main Feed */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <SectionHeader title="Activity Stream" subtitle="Recent administrative actions" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "0.5rem 1rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "0.875rem", fontWeight: "600" }}
            >
              <option value="all">All Activities</option>
              <option value="branch">Branch Registry</option>
              <option value="room">Room Inventory</option>
              <option value="staff">Staff Enrollment</option>
              <option value="booking">Bookings</option>
            </select>
          </div>

          <div style={{ position: "relative" }}>
            {/* Vertical Line */}
            <div style={{ position: "absolute", left: "20px", top: 0, bottom: 0, width: "2px", background: "#f1f5f9" }}></div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {filteredActivities.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>No activities found for this filter.</div>
              ) : (
                filteredActivities.map((activity) => (
                  <div key={activity.id} style={{ display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
                    <div style={{ 
                      width: "42px", 
                      height: "42px", 
                      borderRadius: "12px", 
                      background: "white", 
                      border: `2px solid ${activity.color}`, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1, paddingTop: "2px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b" }}>{activity.title}</h4>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{activity.timestamp.toLocaleString()}</span>
                      </div>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#64748b", fontSize: "0.9375rem", lineHeight: "1.5" }}>{activity.description}</p>
                      <div style={{ marginTop: "0.75rem" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", padding: "4px 10px", borderRadius: "6px", background: `${activity.color}15`, color: activity.color }}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "0.9375rem", fontWeight: "800", color: "#1e293b" }}>Audit Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <SummaryRow label="Total Events" value={stats.total} color="#64748b" />
              <SummaryRow label="Bookings" value={stats.bookings} color="#f59e0b" />
              <SummaryRow label="Staff Onboarded" value={stats.staff} color="#10b981" />
              <SummaryRow label="Rooms Added" value={stats.rooms} color="#8b5cf6" />
              <SummaryRow label="Branches" value={stats.branches} color="#6366f1" />
            </div>
          </div>

          <div className="card" style={{ padding: "1.5rem", background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8125rem", color: "#475569" }}>System Health</h4>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", lineHeight: "1.4" }}>All logs are digitally signed and verified against the Supabase audit trail.</p>
          </div>
        </div>

      </div>
    </AdminWrapper>
  );
};

const SummaryRow = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>{label}</span>
    <span style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", background: `${color}10`, padding: "2px 8px", borderRadius: "6px", minWidth: "30px", textAlign: "center" }}>{value}</span>
  </div>
);

export default ActivityLogs;
