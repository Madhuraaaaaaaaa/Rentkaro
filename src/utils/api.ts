const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; signal?: AbortSignal; headers?: Record<string, string> } = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const payload = isJson ? await res.json() : undefined;
    if (res.status === 401) {
      try { localStorage.removeItem('auth_token'); } catch {}
      try { window.dispatchEvent(new CustomEvent('auth-logout')); } catch {}
    }
    if (!res.ok) {
      return { ok: false, status: res.status, error: (payload && (payload.error || payload.message)) || 'Request failed' };
    }
    return { ok: true, status: res.status, data: payload as T };
  } catch (err) {
    return { ok: false, status: 0, error: 'Network error' };
  }
}

export const AuthApi = {
  login(email: string, password: string) {
    return apiFetch<{ token: string; user: unknown }>('/api/login', { method: 'POST', body: { email, password } });
  },
  signup(payload: { email?: string; phone?: string; password: string }) {
    return apiFetch<{ token: string; user: unknown }>('/api/signup', { method: 'POST', body: payload });
  },
};

export const UserApi = {
  history() {
    return apiFetch<{ history: Array<{ id: number; query: string | null; itemId: string | null; createdAt: string }> }>('/api/history');
  },
  rentals() {
    return apiFetch<{ rentals: Array<{ id: number; itemId: string; status: 'Completed' | 'Ongoing'; createdAt: string; type?: 'Rented' | 'Lent' }> }>('/api/rentals');
  },
  updateRental(payload: { id: number; status: 'Completed' | 'Ongoing' }) {
    return apiFetch('/api/rentals', { method: 'PATCH', body: payload });
  },
  createRental(payload: { itemId: string; type?: 'Rented' | 'Lent' }) {
    return apiFetch<{ id: number }>('/api/rentals', { method: 'POST', body: payload });
  },
  pay(amount: number) {
    return apiFetch<{ ok: boolean; paymentId: string }>('/api/pay', { method: 'POST', body: { amount } });
  },
};


