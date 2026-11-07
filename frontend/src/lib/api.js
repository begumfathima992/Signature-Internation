// Talks to the Node API in /server. Locally Vite forwards /api to it (see vite.config.js); in production
// VITE_SERVER_URL points at the API. The login cookie is httpOnly, so it travels with credentials: 'include'.
const SERVER_URL = (import.meta.env.VITE_SERVER_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${SERVER_URL}${path}`, {
      method,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(0, 'Could not reach the server. Please check your connection and try again.');
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'Something went wrong. Please try again.', data.errors);
  }
  return data;
}
