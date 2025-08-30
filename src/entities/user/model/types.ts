export interface User {
  id: string
  username: string
  email?: string
  avatar?: string
}

export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
