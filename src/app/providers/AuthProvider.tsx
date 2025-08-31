import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthState, User } from '../../entities/user/model/types'
import { keycloak, initAuth, loginWithPasswordGrant } from '../../shared/lib/auth/keycloak'
import { apiGet } from '../../shared/lib/api/client'

interface AuthContextType extends AuthState {
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; user?: any; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true, error: null })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await initAuth()
        const token = keycloak.token
        if (token) {
          const profile = await apiGet<User>('/user/profile')
          if (!mounted) return
          setState({ user: profile, isAuthenticated: true, isLoading: false, error: null })
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (e: any) {
        setState({ user: null, isAuthenticated: false, isLoading: false, error: e?.message || null })
      }
    })()
    return () => { mounted = false }
  }, [])

  const login: AuthContextType['login'] = async ({ username, password }) => {
    try {
      await loginWithPasswordGrant({ username, password })
      const profile = await apiGet<User>('/user/profile')
      setState({ user: profile, isAuthenticated: true, isLoading: false, error: null })
      return { success: true, user: profile }
    } catch (e: any) {
      const msg = e?.message || 'Ошибка авторизации'
      setState(prev => ({ ...prev, isLoading: false, error: msg }))
      return { success: false, error: msg }
    }
  }

  const logout = () => {
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
    try { keycloak.logout({ redirectUri: window.location.origin }) } catch {}
  }

  const value = useMemo<AuthContextType>(() => ({ ...state, login, logout }), [state])

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
