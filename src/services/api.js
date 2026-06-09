import liff from "@line/liff";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const DEFAULT_EVENT_ID = Number(import.meta.env.VITE_DEFAULT_EVENT_ID) || 1;

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: "POST", body });

// LINE user id. Prefer LIFF profile, fall back to a value cached in
// localStorage so dev outside LINE still works.
export async function getLineId() {
  const cached = localStorage.getItem("lineId");
  if (cached) return cached;

  try {
    if (!liff.isLoggedIn?.()) return null;
    const profile = await liff.getProfile();
    if (profile?.userId) {
      localStorage.setItem("lineId", profile.userId);
      return profile.userId;
    }
  } catch {
    // LIFF not initialized — caller handles missing line id.
  }

  return null;
}

export function setLineId(lineId) {
  if (lineId) localStorage.setItem("lineId", lineId);
}
