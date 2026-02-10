const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('jobmatch_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPublicJobs(searchQuery) {
  const q = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
  const res = await fetch(`${API_BASE}/public/jobs${q}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load jobs');
  return data;
}

export async function register(email, password, role) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getProfileMe() {
  const res = await fetch(`${API_BASE}/profiles/me`, { headers: getAuthHeader() });
  if (res.status === 404) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load profile');
  return data;
}

export async function createProfile(formData) {
  const res = await fetch(`${API_BASE}/profiles`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create profile');
  return data;
}

export async function getProfileMatches(profileId) {
  const res = await fetch(`${API_BASE}/profiles/${profileId}/matches`, { headers: getAuthHeader() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load matches');
  return data;
}

export async function getJobs() {
  const res = await fetch(`${API_BASE}/jobs`, { headers: getAuthHeader() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load jobs');
  return data;
}

export async function getJob(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, { headers: getAuthHeader() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load job');
  return data;
}

export async function createJob(body) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create job');
  return data;
}

export async function getJobMatches(jobId) {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/matches`, { headers: getAuthHeader() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load matches');
  return data;
}
