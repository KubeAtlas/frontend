import React, { useState, useEffect } from 'react'
import type { UserSession } from '../../../shared/lib/api/types'
import { SessionService } from '../../../shared/lib/api/sessionService'

interface SessionsTableProps {
  userId?: string // Если передан, показываем сессии конкретного пользователя (для админов)
  onSessionRevoked?: () => void // Callback при удалении сессии
}

export const SessionsTable: React.FC<SessionsTableProps> = ({ 
  userId, 
  onSessionRevoked 
}) => {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null)

  const sessionService = new SessionService()

  useEffect(() => {
    loadSessions()
  }, [userId])

  const loadSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading sessions for userId:', userId)
      const userSessions = userId 
        ? await sessionService.getUserSessions(userId)
        : await sessionService.getCurrentUserSessions()
      
      console.log('Received sessions data:', userSessions)
      console.log('Type of sessions data:', typeof userSessions)
      console.log('Is array:', Array.isArray(userSessions))
      
      // Проверяем, что получили массив
      if (Array.isArray(userSessions)) {
        setSessions(userSessions)
      } else if (userSessions && typeof userSessions === 'object' && 'sessions' in userSessions) {
        // Если API вернул объект с полем sessions
        const sessionsData = (userSessions as any).sessions
        console.log('Found sessions in object.sessions:', sessionsData)
        if (Array.isArray(sessionsData)) {
          setSessions(sessionsData)
        } else {
          console.error('sessions field is not an array:', sessionsData)
          setError('Неверный формат данных сессий')
          setSessions([])
        }
      } else {
        console.error('Expected array but got:', userSessions)
        setError('Неверный формат данных сессий')
        setSessions([])
      }
    } catch (err) {
      console.error('Error loading sessions:', err)
      setError(err instanceof Error ? err.message : 'Ошибка загрузки сессий')
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setRevokingSessionId(sessionId)
      
      if (userId) {
        await sessionService.revokeUserSession(userId, sessionId)
      } else {
        await sessionService.revokeSession(sessionId)
      }
      
      // Обновляем список сессий
      await loadSessions()
      
      // Вызываем callback
      onSessionRevoked?.()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления сессии')
    } finally {
      setRevokingSessionId(null)
    }
  }

  const handleRevokeAllSessions = async () => {
    if (!confirm('Вы уверены, что хотите закрыть все сессии?')) {
      return
    }

    try {
      setLoading(true)
      
      if (userId) {
        await sessionService.revokeAllUserSessions(userId)
      } else {
        await sessionService.revokeAllCurrentUserSessions()
      }
      
      // Обновляем список сессий
      await loadSessions()
      
      // Вызываем callback
      onSessionRevoked?.()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления сессий')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-blue-400 animate-pulse"></div>
        </div>
        <span className="mt-4 text-slate-300 text-lg font-medium">Загрузка сессий...</span>
        <span className="mt-1 text-slate-500 text-sm">Получаем данные с сервера</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-red-300">Ошибка загрузки сессий</h3>
            <p className="mt-1 text-sm text-red-200">{error}</p>
            <button 
              onClick={loadSessions}
              className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Нет активных сессий</h3>
        <p className="text-slate-400">У пользователя нет активных сессий в данный момент</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок с кнопкой удаления всех сессий */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">
          Активные сессии ({sessions.length})
        </h3>
        <button
          onClick={handleRevokeAllSessions}
          disabled={loading}
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 border border-red-500 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-red-500/25"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Закрыть все сессии
        </button>
      </div>

      {/* Таблица сессий */}
      <div className="overflow-x-auto rounded-xl border border-slate-600/50 bg-slate-800/50">
        <table className="min-w-full divide-y divide-slate-600/50">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ID сессии
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                IP адрес
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Браузер / ОС
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Начало сессии
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Последняя активность
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/30 divide-y divide-slate-600/30">
            {sessions.map((session) => {
              const { browser, os } = sessionService.parseUserAgent(session.userAgent)
              const isCurrentSession = session.id === localStorage.getItem('current-session-id')
              
              return (
                <tr key={session.id} className={`hover:bg-slate-700/50 transition-colors ${isCurrentSession ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <code className="text-sm font-mono text-slate-200 bg-slate-700/50 px-2 py-1 rounded">
                        {session.id.substring(0, 12)}...
                      </code>
                      {isCurrentSession && (
                        <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Текущая
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-200 font-medium">{session.ipAddress}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        {browser === 'Chrome' ? (
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">C</span>
                          </div>
                        ) : browser === 'Firefox' ? (
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">F</span>
                          </div>
                        ) : browser === 'Safari' ? (
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">S</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-300">?</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{browser}</div>
                        <div className="text-xs text-slate-400">{os}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {sessionService.formatSessionTime(session.start)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {sessionService.formatSessionTime(session.lastAccess)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!isCurrentSession ? (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokingSessionId === session.id}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 border border-red-500 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                      >
                        {revokingSessionId === session.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Удаление...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Удалить
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-700/50 border border-slate-600/50">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Текущая сессия
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
