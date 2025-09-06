import React from 'react'
import type { StatItem } from '../../../shared/lib/api/types'

interface StatisticsCardProps {
  title: string
  value: number
  change: StatItem
  icon: React.ReactNode
  loading?: boolean
  error?: string | null
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  change,
  icon,
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
          <div className="h-8 bg-slate-600 rounded w-24 mb-2"></div>
          <div className="h-4 bg-slate-600 rounded w-20"></div>
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
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
          <div className="w-8 h-8 text-red-400">
            {icon}
          </div>
        </div>
        <div className="text-red-300 text-sm">Ошибка загрузки</div>
        <div className="text-red-400 text-xs mt-1">{error}</div>
      </div>
    )
  }

  const isPositiveChange = change.change_percent >= 0
  const changeColor = isPositiveChange ? 'text-green-400' : 'text-red-400'
  const changeIcon = isPositiveChange ? '↗' : '↘'

  return (
    <div className="unified-card p-6 hover:bg-slate-800/50 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className="w-8 h-8 text-slate-300 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">
          {value.toLocaleString('ru-RU')}
        </div>
        
        <div className={`text-sm font-medium ${changeColor} flex items-center`}>
          <span className="mr-1">{changeIcon}</span>
          <span>
            {isPositiveChange ? '+' : ''}{Math.round(change.change_percent * 10) / 10}% {change.change_period}
          </span>
        </div>
      </div>
    </div>
  )
}
