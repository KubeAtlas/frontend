import { LoginPage } from '../pages/login/ui/LoginPage'
import { LocaleProvider } from '../shared/lib/locale/LocaleContext'
import { AuthProvider, useAuthContext } from './providers/AuthProvider'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { RoleBasedDashboard } from '../components/RoleBasedDashboard'
import { UsersPage } from '../pages/users'
import { LogoutPreloader, LoadingPreloader } from '../shared/ui'
import type { ReactElement } from 'react'

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><RoleBasedDashboard /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LocaleProvider>
  )
}

function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuthContext()
  
  if (isLoggingOut) {
    return <LogoutPreloader message="Выход из системы" />
  }
  
  if (isLoading) {
    return <LoadingPreloader message="Загрузка..." />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default App
