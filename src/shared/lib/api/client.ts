import { ensureToken } from '../auth/keycloak'

const API_BASE = 'http://localhost:3001/api/v1'

async function withAuth(init?: RequestInit): Promise<RequestInit> {
  const token = await ensureToken(30)
  const headers = new Headers(init?.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  return { ...init, headers }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, await withAuth({ ...init, method: 'GET' }))
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API GET Error (${res.status}):`, errorText)
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }
    return res.json()
  } catch (error) {
    console.error('API GET Request failed:', error)
    throw error
  }
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, await withAuth({ ...init, method: 'POST', body: body ? JSON.stringify(body) : undefined }))
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API POST Error (${res.status}):`, errorText)
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }
    return res.json()
  } catch (error) {
    console.error('API POST Request failed:', error)
    throw error
  }
}


