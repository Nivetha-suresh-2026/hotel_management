import Sidebar from "../../components/Sidebar";

function AdminPlaceholder({ title }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header style={{ background: "white", padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)" }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
        </header>
        <div className="container">
          <div className="card">
            <p style={{ color: "var(--text-muted)" }}>This is a placeholder for the <strong>{title}</strong> management page.</p>
            <div style={{ marginTop: "2rem", border: "2px dashed var(--border-color)", borderRadius: "12px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              Content coming soon...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const RoomCreation = () => <AdminPlaceholder title="Room Creation" />;
export const BranchCreation = () => <AdminPlaceholder title="Branch Creation" />;
export const StaffCreation = () => <AdminPlaceholder title="Staff Creation" />;
export const DepartmentManagement = () => <AdminPlaceholder title="Department Management" />;
export const GuestDetails = () => <AdminPlaceholder title="Guest Details" />;
export const StaffDetails = () => <AdminPlaceholder title="Staff Details" />;
