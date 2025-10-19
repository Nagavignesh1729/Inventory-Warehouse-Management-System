// Base URL for the backend API. Configure via VITE_API_URL or fall back to localhost:3000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// --- Token helpers ---
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveTokens(tokens: { access_token: string; refresh_token?: string }) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
  } catch {
    // Ignore storage errors
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function authHeader(token?: string): HeadersInit {
  const t = token || getAccessToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// --- Low-level request & response handling ---
async function requestRaw(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // Non-JSON response
  }
  return { res, json };
}

function handleResponse(res: Response, json: any) {
  if (!res.ok || (json && json.success === false)) {
    const message = (json && json.message) || `Request failed with status ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.details = json && json.details;
    throw err;
  }
  return json ? json.data : undefined;
}

// --- Refresh flow ---
async function refresh(): Promise<{ access_token: string; refresh_token?: string; user: any }> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error('No refresh token available');
  const { res, json } = await requestRaw('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) {
    const msg = (json && json.message) || `Token refresh failed (${res.status})`;
    throw new Error(msg);
  }
  const data = json?.data;
  if (data?.access_token) saveTokens({ access_token: data.access_token, refresh_token: data.refresh_token });
  return data;
}

// --- Authenticated request with auto-refresh ---
export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  try {
    const { res, json } = await requestRaw(path, {
      ...init,
      headers: {
        ...authHeader(),
        ...(init.headers || {}),
      },
    });
    if (res.status === 401) throw Object.assign(new Error('Unauthorized'), { status: 401 });
    return handleResponse(res, json);
  } catch (err: any) {
    if (err && err.status === 401) {
      // Attempt refresh once
      try {
        const data = await refresh();
        const newToken = data?.access_token;
        const { res, json } = await requestRaw(path, {
          ...init,
          headers: {
            ...authHeader(newToken),
            ...(init.headers || {}),
          },
        });
        return handleResponse(res, json);
      } catch (refreshErr) {
        clearTokens();
        throw err;
      }
    }
    throw err;
  }
}

// --- High-level API methods ---
export async function login(email: string, password: string): Promise<{ access_token: string; refresh_token?: string; user: any }> {
  const { res, json } = await requestRaw('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res, json);
}

export async function me(token?: string): Promise<any> {
  const { res, json } = await requestRaw('/auth/me', {
    method: 'GET',
    headers: {
      ...authHeader(token),
    },
  });
  if (res.status === 401 && !token) {
    // If called without explicit token, try refresh then retry once
    await refresh();
    const retry = await requestRaw('/auth/me', {
      method: 'GET',
      headers: {
        ...authHeader(),
      },
    });
    return handleResponse(retry.res, retry.json);
  }
  return handleResponse(res, json);
}

export async function logout(token?: string): Promise<void> {
  const { res, json } = await requestRaw('/auth/logout', {
    method: 'POST',
    headers: {
      ...authHeader(token),
    },
  });
  handleResponse(res, json);
}

// Example domain API (for next steps)
export async function listWarehouses(): Promise<any[]> {
  return fetchWithAuth('/warehouses', { method: 'GET' });
}

// --- Session restore helper ---
export async function restoreSession(): Promise<any | null> {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const profile = await me(token);
    return profile;
  } catch {
    return null;
  }
}


// create new warehouses API
export async function createWarehouse(data: Record<string, any>): Promise<any[]> {
  return fetchWithAuth('/warehouses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
}
