import { ensureToken } from '../auth/keycloak'

const API_BASE = 'http://localhost:3001/api/v1'

async function withAuth(init?: RequestInit): Promise<RequestInit> {
  try {
    const token = await ensureToken(30)
    const headers = new Headers(init?.headers || {})
    headers.set('Authorization', `Bearer ${token}`)
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    return { ...init, headers }
  } catch (error) {
    console.error('Failed to get token for request:', error)
    throw new Error('Authentication required')
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, await withAuth({ ...init, method: 'GET' }))
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API GET Error (${res.status}):`, errorText)
      if (res.status === 401) {
        throw new Error('Unauthorized - please login again')
      }
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
      if (res.status === 401) {
        throw new Error('Unauthorized - please login again')
      }
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }
    return res.json()
  } catch (error) {
    console.error('API POST Request failed:', error)
    throw error
  }
}

export async function apiPut<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, await withAuth({ ...init, method: 'PUT', body: body ? JSON.stringify(body) : undefined }))
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API PUT Error (${res.status}):`, errorText)
      if (res.status === 401) {
        throw new Error('Unauthorized - please login again')
      }
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }
    return res.json()
  } catch (error) {
    console.error('API PUT Request failed:', error)
    throw error
  }
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, await withAuth({ ...init, method: 'DELETE' }))
    if (!res.ok) {
      const errorText = await res.text()
      console.error(`API DELETE Error (${res.status}):`, errorText)
      if (res.status === 401) {
        throw new Error('Unauthorized - please login again')
      }
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }
    return res.json()
  } catch (error) {
    console.error('API DELETE Request failed:', error)
    throw error
  }
}


