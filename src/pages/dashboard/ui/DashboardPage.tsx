import { useEffect, useState } from 'react'

import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { CreateUserPopup } from '../../../widgets/create-user-popup'
import { UserSessionManager } from '../../../widgets/user-session-manager'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { useAuthContext, AdminOnly } from '../../../app/providers/AuthProvider'
import { UserInfo } from '../../../widgets/user-info'

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
      <div className="min-h-screen flex bg-slate-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header with Logo, User Info and Create User Button */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{t('dashboard_title')}</h1>
                  <p className="text-sm text-slate-400">{t('dashboard_subtitle')}</p>
                </div>
              </div>

              {/* Database Status, Language Switcher and Create User Button */}
              <div className="flex items-center space-x-6">
                {/* Database Status */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{t('create_user')}</span>
                  </button>
                </AdminOnly>
                
                {/* Session Management Button - Only for current user or admins */}
                {user && (
                  <button 
                    onClick={() => handleManageSessions(user.id, user.username)}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
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
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{t('total_users')}</p>
                    <p className="text-xl font-bold text-white">1,234</p>
                    <p className="text-green-400 text-xs">+12% {t('from_last_month')}</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Active Sessions Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-green-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{t('active_sessions')}</p>
                    <p className="text-lg font-bold text-white">89</p>
                    <p className="text-green-400 text-xs">+5% {t('from_last_hour')}</p>
                  </div>
                  <div className="p-1.5 bg-green-500/20 rounded-lg">
                    <Activity className="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </div>

              {/* System Health Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{t('system_health')}</p>
                    <p className="text-xl font-bold text-white">98.5%</p>
                    <p className="text-green-400 text-xs">{t('all_systems_operational')}</p>
                  </div>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Admin Panel Card - Only for Admins */}
              <AdminOnly>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-red-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Админ панель</p>
                      <p className="text-xl font-bold text-white">Активна</p>
                      <p className="text-red-400 text-xs">Расширенные права доступа</p>
                    </div>
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Shield className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                </div>
              </AdminOnly>

              {/* User Info Card - Test Integration */}
              <UserInfo />

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSessionManagerOpen(false)
              setSelectedUserId(null)
              setSelectedUsername('')
            }
          }}
        >
          <div className="relative">
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


