import { useEffect, useState } from 'react'

import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { UserSessionManager } from '../../../widgets/user-session-manager'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { StatisticsCard } from '../../../widgets/statistics-card'
import { SystemStatusCard } from '../../../widgets/system-status-card'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useStatistics } from '../../../shared/hooks/useStatistics'

import { Settings, Sparkles, Activity } from 'lucide-react'

export const UserDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string>('')
  
  const { t } = useLocale()
  const { user, isLoading: authLoading } = useAuthContext()
  const { statistics, loading: statisticsLoading, error: statisticsError, refetch: refetchStatistics } = useStatistics()

  const handleManageSessions = (userId: string, username: string) => {
    setSelectedUserId(userId)
    setSelectedUsername(username)
    setIsSessionManagerOpen(true)
  }

  useEffect(() => {
    if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-600 border-t-blue-500"></div>
          <span className="text-slate-300">Загрузка...</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-900 flex">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-slate-800 border-b border-slate-700">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">KubeAtlas</h1>
                    <p className="text-slate-400 text-sm">Kubernetes Management Platform</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <LanguageSwitcher />
                  
                  {/* Refresh Statistics Button */}
                  <button 
                    onClick={refetchStatistics}
                    disabled={statisticsLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="Обновить статистику"
                  >
                    <Sparkles className={`w-4 h-4 mr-2 inline ${statisticsLoading ? 'animate-spin' : ''}`} />
                    Обновить
                  </button>

                  {/* Session Management Button */}
                  {user && (
                    <button 
                      onClick={() => handleManageSessions(user.id, user.username)}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200"
                    >
                      <Settings className="w-4 h-4 mr-2 inline" />
                      Сессии
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <main className="flex-1 p-6 space-y-6">
            {/* Stats Cards - Vertical Layout */}
            <div className="space-y-4">
              {/* Total Users Card */}
              <StatisticsCard
                title={t('total_users')}
                value={statistics?.total_users?.value || 0}
                change={statistics?.total_users || { value: 0, change_percent: 0, change_period: '' }}
                icon={<Activity className="h-5 w-5" />}
                loading={statisticsLoading}
                error={statisticsError}
              />

              {/* Active Sessions Card */}
              <StatisticsCard
                title={t('active_sessions')}
                value={statistics?.active_sessions?.value || 0}
                change={statistics?.active_sessions || { value: 0, change_percent: 0, change_period: '' }}
                icon={<Activity className="h-5 w-5" />}
                loading={statisticsLoading}
                error={statisticsError}
              />

              {/* System Status Card */}
              <SystemStatusCard
                systemStatus={statistics?.system_status || { percentage: 0, status: 'Загрузка...', details: [] }}
                loading={statisticsLoading}
                error={statisticsError}
              />
            </div>
          </main>
        </div>
      </div>

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

