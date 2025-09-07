import { useEffect, useState } from 'react'
import { useAuthContext } from '../app/providers/AuthProvider'
import { apiGet } from '../shared/lib/api/client'
import { DashboardPage } from '../pages/dashboard'
import { UserDashboard } from '../pages/user-dashboard'

export const RoleBasedDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    const checkAdminRole = async () => {
      try {
        console.log('Checking admin role for user:', user)
        const rolesResponse = await apiGet<{ roles: string[] }>('/user/roles')
        console.log('User roles:', rolesResponse.roles)
        const hasAdminRole = rolesResponse.roles.includes('admin')
        console.log('Is admin:', hasAdminRole)
        setIsAdmin(hasAdminRole)
      } catch (error) {
        console.error('Failed to check admin role:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminRole()
  }, [user, isAuthenticated])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-blue-500"></div>
          <span className="text-slate-300">Загрузка дашборда...</span>
        </div>
      </div>
    )
  }

  // Показываем админский дашборд если пользователь админ
  if (isAdmin) {
    return <DashboardPage />
  }

  // Показываем пользовательский дашборд для обычных пользователей
  return <UserDashboard />
}

