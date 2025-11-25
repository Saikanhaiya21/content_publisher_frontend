// Minimal fetch wrapper that injects JWT and parses JSON responses.
import type { Publication } from './types'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const err = new Error(data?.error || data?.errors || data?.message || res.statusText)
      ; (err as any).status = res.status
      ; (err as any).data = data
    throw err
  }

  return data
}


export const authApi = {
  login: (email: string, password: string) => request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (email: string, password: string) => request('/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
}

export const publicationsApi = {
  list: (params?: Record<string, any>) =>
    request(`/publications?${new URLSearchParams(params || {})}`),

  get: (id: string | number) => request(`/publications/${id}`),

  create: (payload: Partial<Publication>) =>
    request('/publications', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: string | number, payload: Partial<Publication>) =>
    request(`/publications/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  remove: (id: string | number) =>
    request(`/publications/${id}`, { method: 'DELETE' }),

  bulkDelete: (ids: (number | string)[]) =>
    request('/publications/bulk_destroy', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  undoDelete: (ids: (number | string)[]) =>
    request('/publications/undo_delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  /** ⭐ NEW: List deleted publications */
  listDeleted: () => request('/publications/deleted'),

  // public list of published items
  publicList: () => request('/public/published'),
}