import { useState, useEffect, useCallback } from 'react'
import type { StatisticsResponse } from '../lib/api/types'
import { StatisticsService } from '../lib/api/statisticsService'

const statisticsService = new StatisticsService()

export const useStatistics = (refreshInterval = 30000) => {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchStatistics = useCallback(async () => {
    try {
      console.log('useStatistics: Starting to fetch statistics...')
      setLoading(true)
      setError(null)
      const data = await statisticsService.getCachedStatistics()
      console.log('useStatistics: Received data:', data)
      setStatistics(data)
    } catch (err) {
      console.error('useStatistics: Failed to fetch statistics:', err)
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchStatistics()
    
    const interval = setInterval(fetchStatistics, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchStatistics, refreshInterval])
  
  return { 
    statistics, 
    loading, 
    error, 
    refetch: fetchStatistics 
  }
}
