import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { userService, type UserProfile, type UserRoles } from '../../../shared/lib/api/userService'

export const UserInfo: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userRoles, setUserRoles] = useState<UserRoles | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserData = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError(null)
    
    try {
      const [profile, roles] = await Promise.all([
        userService.getUserProfile(),
        userService.getUserRoles()
      ])
      
      setUserProfile(profile)
      setUserRoles(roles)
    } catch (err: any) {
      console.error('Failed to load user data:', err)
      setError(userService.formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadUserData()
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
        <div className="text-slate-400">Загрузка информации о пользователе...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
        <div className="text-red-400">Пользователь не авторизован</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-lg p-4">
        <div className="text-red-400 mb-2">Ошибка загрузки данных:</div>
        <div className="text-slate-300 text-sm">{error}</div>
        <button 
          onClick={loadUserData}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white">Информация о пользователе</h3>
      
      {loading && (
        <div className="text-slate-400">Загрузка...</div>
      )}
      
      {userProfile && (
        <div className="space-y-2">
          <div>
            <span className="text-slate-400">ID:</span>
            <span className="text-white ml-2">{userProfile.id}</span>
          </div>
          <div>
            <span className="text-slate-400">Имя пользователя:</span>
            <span className="text-white ml-2">{userProfile.username}</span>
          </div>
          <div>
            <span className="text-slate-400">Email:</span>
            <span className="text-white ml-2">{userProfile.email}</span>
          </div>
          <div>
            <span className="text-slate-400">Имя:</span>
            <span className="text-white ml-2">
              {(userProfile as any).firstName || userProfile.first_name} {(userProfile as any).lastName || userProfile.last_name}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Статус:</span>
            <span className="ml-2 text-green-400">
              Активен
            </span>
          </div>
        </div>
      )}
      
      {userRoles && (
        <div className="space-y-2">
          <div>
            <span className="text-slate-400">Роли:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {userRoles.roles.map((role, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className={`text-center p-2 rounded ${userRoles.isAdmin ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'}`}>
              Admin: {userRoles.isAdmin ? 'Да' : 'Нет'}
            </div>
            <div className={`text-center p-2 rounded ${userRoles.isUser ? 'bg-green-600/20 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}>
              User: {userRoles.isUser ? 'Да' : 'Нет'}
            </div>
            <div className={`text-center p-2 rounded ${userRoles.isGuest ? 'bg-yellow-600/20 text-yellow-400' : 'bg-slate-700/50 text-slate-400'}`}>
              Guest: {userRoles.isGuest ? 'Да' : 'Нет'}
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={loadUserData}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg text-sm"
      >
        {loading ? 'Загрузка...' : 'Обновить данные'}
      </button>
    </div>
  )
}
