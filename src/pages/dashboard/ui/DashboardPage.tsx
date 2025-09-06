import { useEffect, useState } from 'react'

import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { CreateUserPopup } from '../../../widgets/create-user-popup'
import { UserSessionManager } from '../../../widgets/user-session-manager'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { useAuthContext, AdminOnly } from '../../../app/providers/AuthProvider'

import { UserPlus, Crown, Users, TrendingUp, Database, Sparkles, Activity, Settings, Shield } from 'lucide-react'





export const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [isCreateUserPopupOpen, setIsCreateUserPopupOpen] = useState(false)
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string>('')
  
  const { t } = useLocale()
  const { user, isLoading: authLoading } = useAuthContext()

  const handleManageSessions = (userId: string, username: string) => {
    setSelectedUserId(userId)
    setSelectedUsername(username)
    setIsSessionManagerOpen(true)
  }




  useEffect(() => {
    // Ждем завершения загрузки авторизации
    if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading])

  // Обработка клавиши Escape для закрытия модальных окон
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSessionManagerOpen) {
          setIsSessionManagerOpen(false)
          setSelectedUserId(null)
          setSelectedUsername('')
        }
        if (isCreateUserPopupOpen) {
          setIsCreateUserPopupOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSessionManagerOpen, isCreateUserPopupOpen])



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3 pulse-animation">
          <Sparkles className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-xl font-medium glow-text">{t('loading_dashboard')}</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-slate-900 app-background">
        <div className="sidebar">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col main-content">
          {/* Top Header with Logo, User Info and Create User Button */}
          <div className="unified-header header">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center gap-4">
                <div className="icon-container">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="header-title">{t('dashboard_title')}</h1>
                  <p className="header-subtitle">{t('dashboard_subtitle')}</p>
                </div>
              </div>

              {/* Database Status, Language Switcher and Create User Button */}
              <div className="flex items-center gap-6">
                {/* Database Status */}
                <div className="flex items-center gap-3">
                  <div className="icon-container-small bg-orange-500/20">
                    <Database className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">{t('database')}</p>
                    <p className="text-green-400 font-medium text-sm">{t('online')}</p>
                    <p className="text-slate-400 text-xs">{t('response_time')}: 2ms</p>
                  </div>
                </div>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Create User Button - Only for Admins */}
                <AdminOnly>
                  <button 
                    onClick={() => setIsCreateUserPopupOpen(true)}
                    className="unified-button"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{t('create_user')}</span>
                  </button>
                </AdminOnly>
                
                {/* Session Management Button - Only for current user or admins */}
                {user && (
                  <button 
                    onClick={() => handleManageSessions(user.id, user.username)}
                    className="unified-button bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Сессии</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <main className="flex-1 p-6 space-y-6">
            {/* Stats Cards - Vertical Layout */}
            <div className="space-y-4">
              {/* Total Users Card */}
              <div className="unified-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="card-subtitle">{t('total_users')}</p>
                    <p className="text-xl font-bold text-white">1,234</p>
                    <p className="text-green-400 text-xs">+12% {t('from_last_month')}</p>
                  </div>
                  <div className="icon-container-small bg-blue-500/20">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Active Sessions Card */}
              <div className="unified-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="card-subtitle">{t('active_sessions')}</p>
                    <p className="text-lg font-bold text-white">89</p>
                    <p className="text-green-400 text-xs">+5% {t('from_last_hour')}</p>
                  </div>
                  <div className="icon-container-small bg-green-500/20">
                    <Activity className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </div>

              {/* System Health Card */}
              <div className="unified-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="card-subtitle">{t('system_health')}</p>
                    <p className="text-xl font-bold text-white">98.5%</p>
                    <p className="text-green-400 text-xs">{t('all_systems_operational')}</p>
                  </div>
                  <div className="icon-container-small bg-purple-500/20">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Admin Panel Card - Only for Admins */}
              <AdminOnly>
                <div className="unified-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="card-subtitle">Админ панель</p>
                      <p className="text-xl font-bold text-white">Активна</p>
                      <p className="text-red-400 text-xs">Расширенные права доступа</p>
                    </div>
                    <div className="icon-container-small bg-red-500/20">
                      <Shield className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                </div>
              </AdminOnly>

            </div>




          </main>
          

        </div>
      </div>
      
      {/* Create User Popup */}
      <CreateUserPopup 
        isOpen={isCreateUserPopupOpen}
        onClose={() => setIsCreateUserPopupOpen(false)}
      />
      
      {/* Session Manager Modal */}
      {isSessionManagerOpen && selectedUserId && (
        <div 
          className="popup-overlay flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSessionManagerOpen(false)
              setSelectedUserId(null)
              setSelectedUsername('')
            }
          }}
        >
          <div className="popup-content">
            <UserSessionManager
              userId={selectedUserId}
              username={selectedUsername}
              onClose={() => {
                setIsSessionManagerOpen(false)
                setSelectedUserId(null)
                setSelectedUsername('')
              }}
            />
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}


