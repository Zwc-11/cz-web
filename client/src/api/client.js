const BASE = '/api';
const TIMEOUT_MS = 12000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options,
    });
  } catch (err) {
    throw new Error(
      err.name === 'AbortError'
        ? 'The server took too long to respond. Check your connection and try again.'
        : 'Could not reach the server. Check your connection and try again.'
    );
  } finally {
    clearTimeout(timer);
  }
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
