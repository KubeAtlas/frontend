import { LoginPage } from '../pages/login/ui/LoginPage'
import { LocaleProvider } from '../shared/lib/locale/LocaleContext'
import { AuthProvider, useAuthContext } from './providers/AuthProvider'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { DashboardPage } from '../pages/dashboard'
import type { ReactElement } from 'react'

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LocaleProvider>
  )
}

function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, isLoading } = useAuthContext()
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-400">Загрузка...</div>
    </div>
  )
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default App
