import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../features/auth'
import type { AuthState } from '../../entities/user/model/types'

interface AuthContextType extends AuthState {
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; user?: any; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
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
