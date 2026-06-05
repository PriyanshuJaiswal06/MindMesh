// lib/api.js
// All backend API calls are here. Import what you need in any page.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Token Helpers ───────────────────────────────────────────────────────────

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mindmesh_token');
}

export function saveToken(token) {
  localStorage.setItem('mindmesh_token', token);
  document.cookie = `mindmesh_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

export function clearToken() {
  localStorage.removeItem('mindmesh_token');
  document.cookie = 'mindmesh_token=; path=/; max-age=0';
}

export function isLoggedIn() {
  return !!getToken();
}

function authHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Registration failed');
  saveToken(data.access_token);
  return data;
}

// IMPORTANT: Login uses FormData (not JSON) — backend requirement
export async function login(email, password) {
  const formData = new FormData();
  formData.append('username', email); // backend expects 'username', not 'email'
  formData.append('password', password);

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  saveToken(data.access_token);
  return data;
}

export function logout() {
  clearToken();
  window.location.href = '/login';
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export async function saveArticle(url, title) {
  const res = await fetch(`${BASE_URL}/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ url, title, extracted_text: null }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to save article');
  return data;
}

// IMPORTANT: PDF upload uses FormData (not JSON) — do NOT add Content-Type header
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/upload-pdf`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'PDF upload failed');
  return data;
}

export async function getArticle(id) {
  const res = await fetch(`${BASE_URL}/article/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Article not found');
  return data;
}

// ─── Search & AI ──────────────────────────────────────────────────────────────

export async function searchArticles(query) {
  const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Search failed');
  return data; // returns array of articles
}

export async function askMindMesh(query) {
  const res = await fetch(`${BASE_URL}/ask?query=${encodeURIComponent(query)}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Ask failed');
  return data; // returns { query, response, sources: [{title, url}] }
}
