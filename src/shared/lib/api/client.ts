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

// Функция для выполнения запроса с retry логикой при 401 ошибке
async function makeRequestWithRetry<T>(
  path: string, 
  init: RequestInit, 
  maxRetries: number = 2
): Promise<T> {
  let retryCount = 0
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`${API_BASE}${path}`, init)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`API Response for ${path}:`, data)
        return data
      }
      
      // Если получили 401 - пытаемся обновить токен и повторить запрос
      if (response.status === 401 && retryCount < maxRetries - 1) {
        console.warn(`Got 401 error, attempting token refresh (attempt ${retryCount + 1}/${maxRetries})`)
        
        try {
          // Принудительно обновляем токен
          await ensureToken(-1) // -1 означает принудительное обновление
          
          // Обновляем заголовки с новым токеном
          const newToken = await ensureToken(30)
          const newHeaders = new Headers(init.headers)
          newHeaders.set('Authorization', `Bearer ${newToken}`)
          init.headers = newHeaders
          
          retryCount++
          continue // Повторяем запрос с новым токеном
        } catch (tokenError) {
          console.error('Token refresh failed:', tokenError)
          throw new Error('Authentication failed - please login again')
        }
      }
      
      // Для других ошибок или если retry исчерпаны
      const errorText = await response.text()
      console.error(`API Error (${response.status}):`, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
      
    } catch (error) {
      if (retryCount >= maxRetries - 1) {
        throw error
      }
      retryCount++
      console.warn(`Request failed, retrying (${retryCount}/${maxRetries})...`)
      
      // Небольшая задержка перед повтором
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  throw new Error('Max retries exceeded')
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const requestInit = await withAuth({ ...init, method: 'GET' })
    return makeRequestWithRetry<T>(path, requestInit)
  } catch (error) {
    console.error('API GET Request failed:', error)
    throw error
  }
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  try {
    const requestInit = await withAuth({ 
      ...init, 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    })
    return makeRequestWithRetry<T>(path, requestInit)
  } catch (error) {
    console.error('API POST Request failed:', error)
    throw error
  }
}

export async function apiPut<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  try {
    const requestInit = await withAuth({ 
      ...init, 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    })
    return makeRequestWithRetry<T>(path, requestInit)
  } catch (error) {
    console.error('API PUT Request failed:', error)
    throw error
  }
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const requestInit = await withAuth({ ...init, method: 'DELETE' })
    return makeRequestWithRetry<T>(path, requestInit)
  } catch (error) {
    console.error('API DELETE Request failed:', error)
    throw error
  }
}


