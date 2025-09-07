import { useEffect, useState } from 'react'

import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { CreateUserPopup } from '../../../widgets/create-user-popup'
import { UserSessionManager } from '../../../widgets/user-session-manager'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { UsersTable } from '../../../widgets/users-table'
import { EditUserModal } from '../../../widgets/edit-user-modal'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useStatistics } from '../../../shared/hooks/useStatistics'
import { useUsers } from '../../../shared/hooks/useUserManagement'
import type { User, UpdateUserRequest } from '../../../shared/lib/api/types'

import { Crown, Users, Database, Sparkles, Activity, Settings } from 'lucide-react'





export const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [isCreateUserPopupOpen, setIsCreateUserPopupOpen] = useState(false)
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string>('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const { t } = useLocale()
  const { user, isLoading: authLoading } = useAuthContext()
  const { statistics, loading: statisticsLoading, error: statisticsError, refetch: refetchStatistics } = useStatistics()
  const { updateUser } = useUsers()

  const handleManageSessions = (userId: string, username: string) => {
    setSelectedUserId(userId)
    setSelectedUsername(username)
    setIsSessionManagerOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditUserModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    // Обработка удаления пользователя будет в UsersTable
    console.log('Delete user:', user)
  }

  const handleSaveUser = async (userId: string, userData: UpdateUserRequest) => {
    try {
      await updateUser(userId, userData)
      console.log('User updated successfully')
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const handleCloseEditModal = () => {
    setIsEditUserModalOpen(false)
    setEditingUser(null)
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

                
                {/* Refresh Statistics Button */}
                <button 
                  onClick={refetchStatistics}
                  disabled={statisticsLoading}
                  className="unified-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  title={t('update')}
                >
                  <Sparkles className={`h-4 w-4 ${statisticsLoading ? 'animate-spin' : ''}`} />
                  <span>{t('update')}</span>
                </button>

                {/* Session Management Button - Only for current user or admins */}
                {user && (
                  <button 
                    onClick={() => handleManageSessions(user.id, user.username)}
                    className="unified-button bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>{t('sessions')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <main className="flex-1 p-6 space-y-6">
            {/* Users Table - Admin Dashboard */}
            <UsersTable
              onCreateUser={() => setIsCreateUserPopupOpen(true)}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />

            {/* Statistics Overview - Horizontal Grid Layout */}
            <div className="unified-card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">{t('system_overview')}</h2>
                <p className="text-slate-400 text-sm">{t('key_indicators')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 hover:from-blue-500/15 hover:to-blue-600/10 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-400 text-sm font-medium">{t('total_users')}</h3>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">
                      {statisticsLoading ? (
                        <div className="h-8 bg-slate-600 rounded animate-pulse"></div>
                      ) : (
                        (statistics?.total_users?.value || 0).toLocaleString('ru-RU')
                      )}
                    </div>
                    
                    {!statisticsLoading && !statisticsError && statistics?.total_users && (
                      <div className={`text-sm font-medium flex items-center ${
                        statistics.total_users.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span className="mr-1">{statistics.total_users.change_percent >= 0 ? '↗' : '↘'}</span>
                        <span>
                          {statistics.total_users.change_percent >= 0 ? '+' : ''}{Math.round(statistics.total_users.change_percent * 10) / 10}% {statistics.total_users.change_period}
                        </span>
                      </div>
                    )}
                    
                    {statisticsError && (
                      <div className="text-red-400 text-xs">{t('loading_error')}</div>
                    )}
                  </div>
                </div>

                {/* Active Sessions Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 hover:from-green-500/15 hover:to-green-600/10 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-400 text-sm font-medium">{t('active_sessions')}</h3>
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Activity className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">
                      {statisticsLoading ? (
                        <div className="h-8 bg-slate-600 rounded animate-pulse"></div>
                      ) : (
                        (statistics?.active_sessions?.value || 0).toLocaleString('ru-RU')
                      )}
                    </div>
                    
                    {!statisticsLoading && !statisticsError && statistics?.active_sessions && (
                      <div className={`text-sm font-medium flex items-center ${
                        statistics.active_sessions.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span className="mr-1">{statistics.active_sessions.change_percent >= 0 ? '↗' : '↘'}</span>
                        <span>
                          {statistics.active_sessions.change_percent >= 0 ? '+' : ''}{Math.round(statistics.active_sessions.change_percent * 10) / 10}% {statistics.active_sessions.change_period}
                        </span>
                      </div>
                    )}
                    
                    {statisticsError && (
                      <div className="text-red-400 text-xs">{t('loading_error')}</div>
                    )}
                  </div>
                </div>

                {/* System Status Card */}
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6 hover:from-purple-500/15 hover:to-purple-600/10 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-400 text-sm font-medium">{t('system_status')}</h3>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">
                      {statisticsLoading ? (
                        <div className="h-8 bg-slate-600 rounded animate-pulse"></div>
                      ) : (
                        `${Math.round((statistics?.system_status?.percentage || 0))}%`
                      )}
                    </div>
                    
                    {!statisticsLoading && !statisticsError && statistics?.system_status && (
                      <div className={`text-sm font-medium ${
                        statistics.system_status.status.toLowerCase().includes('работают') || 
                        statistics.system_status.status.toLowerCase().includes('operational') 
                          ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {statistics.system_status.status}
                      </div>
                    )}
                    
                    {statisticsError && (
                      <div className="text-red-400 text-xs">{t('loading_error')}</div>
                    )}
                  </div>
                </div>
              </div>
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

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditUserModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
      />
    </SidebarProvider>
  )
}


