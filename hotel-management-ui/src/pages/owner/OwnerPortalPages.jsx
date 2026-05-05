import Sidebar from "../../components/Sidebar";

function OwnerPlaceholder({ title }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header style={{ background: "white", padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)" }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
        </header>
        <div className="container">
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>{title} Module</h3>
            <p style={{ color: "var(--text-muted)" }}>This specialized analytic module for <strong>{title}</strong> is currently under development.</p>
            <div style={{ marginTop: "2rem", border: "2px dashed var(--border-color)", borderRadius: "12px", height: "400px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              Data Visualization Coming Soon...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const RevenueAnalytics = () => <OwnerPlaceholder title="Revenue Analytics" />;
export const HotelPerformance = () => <OwnerPlaceholder title="Hotel Performance" />;
export const ActivityLogs = () => <OwnerPlaceholder title="Admin Activity Logs" />;
export const Alerts = () => <OwnerPlaceholder title="System Alerts" />;
export const Reviews = () => <OwnerPlaceholder title="Guest Reviews" />;
