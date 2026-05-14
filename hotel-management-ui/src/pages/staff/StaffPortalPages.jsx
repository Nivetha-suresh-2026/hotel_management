import React, { useState, useEffect } from "react";
import { StaffWrapper, MiniStat } from "./StaffWrapper";
import { useAuth } from "../../hooks/useAuth";
import { staffService } from "../../services/staffService";

/* ─── Staff Dashboard ────────────────────────────────────────── */
export function StaffDashboard() {
  const { profile, session } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.access_token) {
      staffService.getDashboard(session.access_token)
        .then(setData)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (loading) return <StaffWrapper title="Loading..." subtitle="Fetching dashboard data..."><p>Loading...</p></StaffWrapper>;
  if (error) return <StaffWrapper title="Error" subtitle="Failed to load dashboard"><p style={{ color: "red" }}>{error}</p></StaffWrapper>;

  const { task_counts, branch, shift, staff_name } = data || {};

  return (
    <StaffWrapper 
      title={`Welcome back, ${staff_name || profile?.name || "Staff"}!`} 
      subtitle="Here's an overview of your activity today."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <MiniStat label="Total Tasks" value={task_counts?.total || 0} icon="📋" color="#6366f1" />
        <MiniStat label="Pending" value={task_counts?.pending || 0} icon="⏳" color="#f59e0b" />
        <MiniStat label="Completed" value={task_counts?.completed || 0} icon="✅" color="#10b981" />
        <MiniStat label="Shift" value={shift || "N/A"} icon="⏰" color="#ec4899" />
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: "0 0 1.5rem", fontSize: "1.1rem", fontWeight: 700 }}>Branch Information</h3>
          <p style={{ color: "#1e293b", fontWeight: 600 }}>{branch || "Assigning..."}</p>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>You are currently assigned to this branch.</p>
        </div>
      </div>
    </StaffWrapper>
  );
}

/* ─── Staff Profile ──────────────────────────────────────────── */
export function StaffProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.access_token) {
      staffService.getProfile(session.access_token)
        .then(setProfile)
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (loading) return <StaffWrapper title="Loading..." subtitle="Fetching profile..."><p>Loading...</p></StaffWrapper>;

  return (
    <StaffWrapper title="My Profile" subtitle="Manage your personal and employment information">
      <div style={{ maxWidth: "800px", background: "#fff", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Full Name</label>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>{profile?.full_name}</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Email Address</label>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>{profile?.email}</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Phone</label>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>{profile?.phone || "N/A"}</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Shift</label>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>{profile?.shift}</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Role</label>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>{profile?.job_roles?.role_name}</div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Department</label>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>{profile?.job_roles?.departments?.name}</div>
          </div>
        </div>
      </div>
    </StaffWrapper>
  );
}

/* ─── Assigned Tasks ─────────────────────────────────────────── */
export function StaffTasks() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (session?.access_token) {
      try {
        const data = await staffService.getTasks(session.access_token);
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [session]);

  const updateStatus = async (taskId, status) => {
    try {
      await staffService.updateTaskStatus(taskId, status, session.access_token);
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <StaffWrapper title="Assigned Tasks" subtitle="Track and update your daily responsibilities">
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Task Name</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Priority</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: "2rem", textAlign: "center" }}>Loading tasks...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No tasks found.</td></tr>
            ) : tasks.map(task => (
              <tr key={task.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{task.title}</td>
                <td style={{ padding: "1rem 1.5rem" }}>
                   <span style={{ 
                     padding: "4px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                     background: task.priority === "High" ? "#fee2e2" : "#f1f5f9",
                     color: task.priority === "High" ? "#ef4444" : "#64748b"
                   }}>{task.priority}</span>
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                   <span style={{ 
                     padding: "4px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                     background: task.status === "completed" ? "#dcfce7" : "#fef3c7",
                     color: task.status === "completed" ? "#16a34a" : "#d97706"
                   }}>{task.status.replace("_", " ")}</span>
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <select 
                    value={task.status} 
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    style={{ padding: "4px 8px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.8rem" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffWrapper>
  );
}

/* ─── Leave Requests ─────────────────────────────────────────── */
export function StaffLeave() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 2000);
    }, 1500);
  };

  return (
    <StaffWrapper title="Leave Requests" subtitle="Apply for time off and check status">
      <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
        {!showForm ? (
          <>
            <button 
              onClick={() => setShowForm(true)}
              style={{
                padding: "0.75rem 1.5rem", background: "#4f46e5", color: "#fff",
                border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>+</span> Request Leave
            </button>
            <div style={{ marginTop: "2rem", color: "#64748b", textAlign: "center", padding: "4rem 2rem", border: "2px dashed #f1f5f9", borderRadius: "16px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📅</div>
              <h4 style={{ margin: 0, color: "#1e293b" }}>No Recent Requests</h4>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Your leave history and pending requests will appear here.</p>
            </div>
          </>
        ) : (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>New Leave Request</h3>
              <button 
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: 600 }}
              >
                Cancel
              </button>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "#f0fdf4", borderRadius: "16px", color: "#166534" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
                <h4 style={{ margin: 0 }}>Request Submitted!</h4>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Your manager will review your application shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
                <div className="form-group">
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Leave Type</label>
                  <select required style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <option value="">Select Type</option>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="maternity">Maternity/Paternity</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Start Date</label>
                    <input type="date" required style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                  </div>
                  <div className="form-group">
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>End Date</label>
                    <input type="date" required style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Reason for Leave</label>
                  <textarea 
                    placeholder="Briefly explain the reason..."
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", minHeight: "100px", resize: "vertical" }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    padding: "0.875rem", background: "#4f46e5", color: "#fff",
                    border: "none", borderRadius: "12px", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1, transition: "all 0.2s"
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </StaffWrapper>
  );
}
