import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthState, User } from '../../entities/user/model/types'
import { keycloak, initAuth, loginWithPasswordGrant, clearTokens } from '../../shared/lib/auth/keycloak'
import { apiGet } from '../../shared/lib/api/client'

interface AuthContextType extends AuthState {
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; user?: any; error?: string }>
  logout: () => void
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true, error: null })
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        console.log('Initializing auth...')
        const authenticated = await initAuth()
        console.log('Auth initialized, authenticated:', authenticated)
        
        if (authenticated && keycloak.token) {
          console.log('User is authenticated, loading profile...')
          try {
            const profile = await apiGet<User>('/user/profile')
            if (!mounted) return
            console.log('Profile loaded:', profile)
            setState({ user: profile, isAuthenticated: true, isLoading: false, error: null })
          } catch (profileError) {
            console.error('Failed to load profile:', profileError)
            if (!mounted) return
            // Если профиль не загрузился из-за ошибки аутентификации, считаем пользователя неавторизованным
            if (profileError instanceof Error && profileError.message.includes('Unauthorized')) {
              console.log('Profile load failed due to auth error, user not authenticated')
              setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
            } else {
              // Если другая ошибка, всё равно считаем авторизованным
              setState({ user: null, isAuthenticated: true, isLoading: false, error: null })
            }
          }
        } else {
          console.log('User not authenticated')
          setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
        }
      } catch (e: any) {
        console.error('Auth initialization error:', e)
        setState({ user: null, isAuthenticated: false, isLoading: false, error: e?.message || null })
      }
    })()
    return () => { mounted = false }
  }, [])

  const login: AuthContextType['login'] = async ({ username, password }) => {
    try {
      console.log('Starting login process...')
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      await loginWithPasswordGrant({ username, password })
      console.log('Login successful, loading profile...')
      
      try {
        const profile = await apiGet<User>('/user/profile')
        console.log('Profile loaded:', profile)
        setState({ user: profile, isAuthenticated: true, isLoading: false, error: null })
        return { success: true, user: profile }
      } catch (profileError) {
        console.error('Failed to load profile after login:', profileError)
        // Если профиль не загрузился, но токен есть, всё равно считаем авторизованным
        setState({ user: null, isAuthenticated: true, isLoading: false, error: null })
        return { success: true, user: null }
      }
    } catch (e: any) {
      console.error('Login error:', e)
      const msg = e?.message || 'Ошибка авторизации'
      setState(prev => ({ ...prev, isLoading: false, error: msg }))
      return { success: false, error: msg }
    }
  }

  const logout = async () => {
    setIsLoggingOut(true)
    
    // Небольшая задержка для показа preloader
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
    try { 
      // Очищаем токены без перенаправления
      keycloak.clearToken()
      // Очищаем токены из localStorage
      clearTokens()
    } catch {}
    
    // Дополнительная задержка для завершения анимации
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoggingOut(false)
  }

  const value = useMemo<AuthContextType>(() => ({ ...state, login, logout, isLoggingOut }), [state, isLoggingOut])

  return (
    <AuthContext.Provider value={value}>
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

// Компонент для условного отображения контента админам
interface AdminOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const AdminOnly = ({ children, fallback }: AdminOnlyProps) => {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsAdmin(false)
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
      }
    }

    checkAdminRole()
  }, [user, isAuthenticated])

  // Показываем fallback пока загружаются роли или если пользователь не админ
  if (isLoading || isAdmin === null) {
    return <>{fallback || null}</>
  }

  if (!isAdmin) {
    return <>{fallback || null}</>
  }

  return <>{children}</>
}
