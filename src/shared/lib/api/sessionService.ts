import type { UserSession, SessionRevocationResponse } from './types'
import { apiGet, apiPost, apiDelete } from './client'

export class SessionService {
  private async makeRequest<T>(endpoint: string, method: 'GET' | 'POST' | 'DELETE' = 'GET', body?: unknown): Promise<T> {
    try {
      let response: T
      
      switch (method) {
        case 'GET':
          response = await apiGet<T>(endpoint)
          break
        case 'POST':
          response = await apiPost<T>(endpoint, body)
          break
        case 'DELETE':
          response = await apiDelete<T>(endpoint)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      
      return response
    } catch (error) {
      console.error(`SessionService ${method} error:`, error)
      throw error
    }
  }

  // Получение всех активных сессий текущего пользователя
  async getCurrentUserSessions(): Promise<UserSession[]> {
    const response = await this.makeRequest<{ sessions: UserSession[] }>('/user/sessions', 'GET')
    return response.sessions || []
  }

  // Получение сессий конкретного пользователя (для админов)
  async getUserSessions(userId: string): Promise<UserSession[]> {
    const response = await this.makeRequest<{ sessions: UserSession[] }>(`/admin/users/${userId}/sessions`, 'GET')
    return response.sessions || []
  }

  // Закрытие конкретной сессии
  async revokeSession(sessionId: string): Promise<SessionRevocationResponse> {
    return this.makeRequest<SessionRevocationResponse>(`/user/sessions/${sessionId}`, 'DELETE')
  }

  // Закрытие конкретной сессии пользователя (для админов)
  async revokeUserSession(userId: string, sessionId: string): Promise<SessionRevocationResponse> {
    return this.makeRequest<SessionRevocationResponse>(`/admin/users/${userId}/sessions/${sessionId}`, 'DELETE')
  }

  // Закрытие всех сессий текущего пользователя
  async revokeAllCurrentUserSessions(): Promise<SessionRevocationResponse> {
    return this.makeRequest<SessionRevocationResponse>('/user/sessions/revoke', 'POST')
  }

  // Закрытие всех сессий пользователя (для админов)
  async revokeAllUserSessions(userId: string): Promise<SessionRevocationResponse> {
    return this.makeRequest<SessionRevocationResponse>(`/admin/users/${userId}/sessions/revoke`, 'POST')
  }

  // Форматирование времени для отображения
  formatSessionTime(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Получение информации о браузере из User-Agent
  parseUserAgent(userAgent?: string): { browser: string; os: string } {
    if (!userAgent) {
      return { browser: 'Неизвестно', os: 'Неизвестно' }
    }

    let browser = 'Неизвестно'
    let os = 'Неизвестно'

    // Определение браузера
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome'
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox'
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari'
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge'
    }

    // Определение ОС
    if (userAgent.includes('Windows')) {
      os = 'Windows'
    } else if (userAgent.includes('Mac')) {
      os = 'macOS'
    } else if (userAgent.includes('Linux')) {
      os = 'Linux'
    } else if (userAgent.includes('Android')) {
      os = 'Android'
    } else if (userAgent.includes('iOS')) {
      os = 'iOS'
    }

    return { browser, os }
  }
}
