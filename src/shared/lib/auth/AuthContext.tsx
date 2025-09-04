import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { userService, type UserRoles, type UserProfile } from '../api/userService'

interface AuthContextType {
  user: UserProfile | null
  roles: UserRoles | null
  isAdmin: boolean
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  checkAdminRights: () => Promise<boolean>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<UserRoles | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = roles?.isAdmin || roles?.roles.includes('admin') || false
  const isAuthenticated = !!user

  const checkAdminRights = async (): Promise<boolean> => {
    try {
      const rolesData = await userService.getUserRoles()
      setRoles(rolesData)
      return rolesData.isAdmin || rolesData.roles.includes('admin')
    } catch (error) {
      console.error('Error checking admin rights:', error)
      return false
    }
  }

  const refreshUserData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Параллельно загружаем профиль и роли пользователя
      const [userProfile, userRoles] = await Promise.all([
        userService.getUserProfile(),
        userService.getUserRoles()
      ])
      
      setUser(userProfile)
      setRoles(userRoles)
    } catch (err: any) {
      console.error('Failed to load user data:', err)
      setError(userService.formatApiError(err))
      setUser(null)
      setRoles(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUserData()
  }, [])

  const contextValue: AuthContextType = {
    user,
    roles,
    isAdmin,
    isAuthenticated,
    loading,
    error,
    checkAdminRights,
    refreshUserData
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// HOC для защищенных компонентов, требующих админских прав
interface WithAdminRightsProps {
  fallback?: ReactNode
  loadingFallback?: ReactNode
}

export const withAdminRights = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithAdminRightsProps = {}
) => {
  return (props: P) => {
    const { isAdmin, loading, isAuthenticated } = useAuthContext()
    
    if (loading) {
      return options.loadingFallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-slate-400">Проверка прав доступа...</div>
        </div>
      )
    }

    if (!isAuthenticated || !isAdmin) {
      return options.fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-red-400 font-medium mb-2">Доступ запрещен</div>
            <div className="text-slate-400 text-sm">
              Для выполнения этого действия требуются права администратора
            </div>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Компонент для условного отображения контента админам
interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback }) => {
  const { isAdmin, loading, isAuthenticated } = useAuthContext()
  
  if (loading) {
    return null
  }

  if (!isAuthenticated || !isAdmin) {
    return <>{fallback || null}</>
  }

  return <>{children}</>
}