import { useState } from 'react'
import { AuthCredentials, AuthState } from '../../../entities/user/model/types'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })

  const login = async (credentials: AuthCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Временная заглушка - симулируем авторизацию
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const user = {
          id: '1',
          username: credentials.username,
          email: 'admin@kubeatlas.com'
        }
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
        
        return { success: true, user }
      } else {
        throw new Error('Неверные учетные данные')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка авторизации'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  }

  return {
    ...authState,
    login,
    logout
  }
}
