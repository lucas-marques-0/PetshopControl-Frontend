// api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiGet(table) {
  const res = await fetch(`${API_URL}/${table}`);
  return res.json();
}

export async function apiPost(table, data) {
  const res = await fetch(`${API_URL}/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiPut(table, id, data) {
  const res = await fetch(`${API_URL}/${table}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDelete(table, id) {
  const res = await fetch(`${API_URL}/${table}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
