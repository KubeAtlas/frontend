import type { StatisticsResponse } from './types'
import { apiGet } from './client'

export class StatisticsService {
  // Получение статистики системы
  async getStatistics(): Promise<StatisticsResponse> {
    try {
      console.log('StatisticsService: Fetching statistics from API...')
      const response = await apiGet<{success: boolean, data: StatisticsResponse, error: string | null, message: string | null}>('/statistics')
      console.log('StatisticsService: API response:', response)
      
      if (response.success && response.data) {
        console.log('StatisticsService: Returning API data:', response.data)
        return response.data
      } else {
        console.log('StatisticsService: API returned error, using mock data')
        return this.getMockStatistics()
      }
    } catch (error) {
      console.error('StatisticsService error:', error)
      
      // Если API недоступен, возвращаем мок-данные для тестирования
      console.log('StatisticsService: API unavailable, returning mock data')
      return this.getMockStatistics()
    }
  }

  // Мок-данные для тестирования
  private getMockStatistics(): StatisticsResponse {
    return {
      total_users: {
        value: 1,
        change_percent: 0,
        change_period: 'с прошлого месяца'
      },
      active_sessions: {
        value: 1,
        change_percent: 0,
        change_period: 'с прошлого часа'
      },
      system_status: {
        percentage: 100,
        status: 'Все системы работают',
        details: [
          {
            name: 'Keycloak',
            status: 'operational',
            uptime_percentage: 100
          },
          {
            name: 'Database',
            status: 'operational',
            uptime_percentage: 100
          }
        ]
      }
    }
  }

  // Кеширование статистики
  private cache: StatisticsResponse | null = null
  private lastFetchTime = 0
  private readonly CACHE_DURATION = 30000 // 30 секунд

  async getCachedStatistics(): Promise<StatisticsResponse> {
    const now = Date.now()
    
    if (this.cache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      console.log('Using cached statistics')
      return this.cache
    }
    
    console.log('Fetching fresh statistics')
    this.cache = await this.getStatistics()
    this.lastFetchTime = now
    return this.cache
  }

  // Очистка кеша
  clearCache(): void {
    this.cache = null
    this.lastFetchTime = 0
  }
}
