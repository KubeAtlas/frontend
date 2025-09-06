import React from 'react'
import type { SystemStatus } from '../../../shared/lib/api/types'

interface SystemStatusCardProps {
  systemStatus: SystemStatus
  loading?: boolean
  error?: string | null
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  systemStatus,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="unified-card p-6 relative overflow-hidden">
        {/* Skeleton loader */}
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-slate-600 rounded w-32"></div>
            <div className="w-8 h-8 bg-slate-600 rounded"></div>
          </div>
          <div className="h-8 bg-slate-600 rounded w-20 mb-2"></div>
          <div className="h-4 bg-slate-600 rounded w-32"></div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="unified-card p-6 border border-red-500/30 bg-red-900/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-medium">Состояние системы</h3>
          <div className="w-8 h-8 text-red-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="text-red-300 text-sm">Ошибка загрузки</div>
        <div className="text-red-400 text-xs mt-1">{error}</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('работают') || status.toLowerCase().includes('operational')) {
      return 'text-green-400'
    }
    if (status.toLowerCase().includes('проблем') || status.toLowerCase().includes('degraded')) {
      return 'text-yellow-400'
    }
    return 'text-red-400'
  }

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes('работают') || status.toLowerCase().includes('operational')) {
      return (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    if (status.toLowerCase().includes('проблем') || status.toLowerCase().includes('degraded')) {
      return (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
    return (
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <div className="unified-card p-6 hover:bg-slate-800/50 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">Состояние системы</h3>
        <div className={`w-8 h-8 ${getStatusColor(systemStatus.status)} group-hover:scale-110 transition-transform`}>
          {getStatusIcon(systemStatus.status)}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-white">
            {Math.round(systemStatus.percentage)}%
          </span>
        </div>
        
        <div className={`text-sm font-medium ${getStatusColor(systemStatus.status)}`}>
          {systemStatus.status}
        </div>
        
        {/* Детали сервисов */}
        {systemStatus.details && systemStatus.details.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-600/30">
            {systemStatus.details.map((service, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{service.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    service.status === 'operational' ? 'text-green-400' : 
                    service.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {service.status === 'operational' ? '✓' : 
                     service.status === 'degraded' ? '⚠' : '✗'}
                  </span>
                  <span className="text-slate-500">
                    {Math.round(service.uptime_percentage)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
