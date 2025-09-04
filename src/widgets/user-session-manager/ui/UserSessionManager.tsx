import React, { useState, useEffect } from 'react'
import { userService, type UserSession } from '../../../shared/lib/api/userService'
import { Activity, Users, Clock, Globe, Smartphone, LogOut, AlertTriangle } from 'lucide-react'

interface UserSessionManagerProps {
  userId: string
  username: string
  onClose?: () => void
}

export const UserSessionManager: React.FC<UserSessionManagerProps> = ({
  userId,
  username,
  onClose
}) => {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmRevoke, setShowConfirmRevoke] = useState(false)

  const loadSessions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.getUserSessions(userId)
      setSessions(result.sessions)
    } catch (error) {
      console.error('Ошибка загрузки сессий:', error)
      const errorMessage = userService.formatApiError(error)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const revokeSessions = async () => {
    setRevoking(true)
    setError(null)
    
    try {
      await userService.revokeUserSessions(userId)
      setShowConfirmRevoke(false)
      await loadSessions() // Перезагружаем список
    } catch (error) {
      console.error('Ошибка отзыва сессий:', error)
      const errorMessage = userService.formatApiError(error)
      setError(errorMessage)
    } finally {
      setRevoking(false)
    }
  }

  const formatLastAccess = (lastAccess: string) => {
    try {
      const date = new Date(lastAccess)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMinutes < 1) {
        return 'Только что'
      } else if (diffMinutes < 60) {
        return `${diffMinutes} мин назад`
      } else if (diffHours < 24) {
        return `${diffHours} ч назад`
      } else if (diffDays < 7) {
        return `${diffDays} дн назад`
      } else {
        return date.toLocaleDateString('ru-RU')
      }
    } catch {
      return 'Неизвестно'
    }
  }

  const getDeviceIcon = (userAgent: string) => {
    if (!userAgent) {
      return <Globe className="h-4 w-4 text-slate-400" />
    }
    const ua = userAgent.toLowerCase()
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4 text-blue-400" />
    }
    return <Globe className="h-4 w-4 text-green-400" />
  }

  useEffect(() => {
    loadSessions()
  }, [userId])

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Управление сессиями</h3>
            <p className="text-sm text-slate-400">Пользователь: {username}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white text-xl font-bold"
            title="Закрыть"
          >
            ×
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Activity className="h-6 w-6 animate-spin text-blue-500 mr-3" />
          <span className="text-slate-400">Загрузка сессий...</span>
        </div>
      )}

      {/* Sessions List */}
      {!loading && (
        <>
          {/* Sessions Count and Actions */}
          <div className="flex items-center justify-between mb-3 gap-4">
            <div className="text-sm text-slate-400">
              Активных сессий: <span className="text-white font-medium">{sessions.length}</span>
            </div>
            
            {sessions.length > 0 && (
              <button
                onClick={() => setShowConfirmRevoke(true)}
                disabled={revoking}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
              >
                {revoking ? (
                  <>
                    <Activity className="h-3.5 w-3.5 animate-spin" />
                    <span>Отзыв...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Отозвать все сессии</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Confirm Revoke Dialog */}
          {showConfirmRevoke && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-red-400 font-medium">Подтверждение действия</span>
              </div>
              <p className="text-red-300 text-sm mb-4">
                Вы уверены, что хотите отозвать все активные сессии пользователя <strong>{username}</strong>?
                <br />
                Пользователь будет принудительно выйден из системы на всех устройствах.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={revokeSessions}
                  disabled={revoking}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Да, отозвать все сессии
                </button>
                <button
                  onClick={() => setShowConfirmRevoke(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Sessions */}
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">Нет активных сессий</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={session.id || index}
                  className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:border-slate-500/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getDeviceIcon(session.userAgent)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-medium text-sm">
                          {session.ipAddress || 'Неизвестный IP'}
                        </span>
                        {session.active && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                            Активна
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mb-2 break-all">
                        {session.userAgent || 'Неизвестное устройство'}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-slate-500 text-xs">
                          Последняя активность: {formatLastAccess(session.lastAccess || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadSessions}
              disabled={loading || revoking}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Activity className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}