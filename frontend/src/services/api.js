export const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

function parseBodySafely(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const text = await response.text();
  const body = parseBodySafely(text);

  if (!response.ok) {
    const message =
      typeof body === "string"
        ? body
        : body?.error || body?.message || "Request failed";
    throw new Error(message);
  }

  return body;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getAuthHeaders() {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
