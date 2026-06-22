const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.errors?.join(' ') || data.error || 'Request failed');
  return data;
}

export function getProfile() {
  return request('/profile');
}

export function getProjects() {
  return request('/projects');
}

export function postContact(body) {
  return request('/contact', { method: 'POST', body: JSON.stringify(body) });
}
