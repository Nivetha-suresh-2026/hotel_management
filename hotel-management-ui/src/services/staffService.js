const API_BASE_URL = "http://localhost:8000/api/v1/staff";

async function fetchWithAuth(endpoint, method = "GET", body = null, token) {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Request failed");
  }

  return response.json();
}

export const staffService = {
  getProfile: (token) => fetchWithAuth("/portal/me", "GET", null, token),
  getTasks: (token) => fetchWithAuth("/portal/tasks", "GET", null, token),
  getDashboard: (token) => fetchWithAuth("/portal/dashboard", "GET", null, token),
  updateTaskStatus: (taskId, status, token) => fetchWithAuth(`/portal/tasks/${taskId}`, "PATCH", { status }, token),
};
