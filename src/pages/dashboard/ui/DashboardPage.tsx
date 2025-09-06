import { useEffect, useState } from 'react'

import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { CreateUserPopup } from '../../../widgets/create-user-popup'
import { UserSessionManager } from '../../../widgets/user-session-manager'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { StatisticsCard } from '../../../widgets/statistics-card'
import { SystemStatusCard } from '../../../widgets/system-status-card'
import { UsersTable } from '../../../widgets/users-table'
import { EditUserModal } from '../../../widgets/edit-user-modal'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { useAuthContext, AdminOnly } from '../../../app/providers/AuthProvider'
import { useStatistics } from '../../../shared/hooks/useStatistics'
import { useUsers } from '../../../shared/hooks/useUserManagement'
import type { User, UpdateUserRequest } from '../../../shared/lib/api/types'

import { UserPlus, Crown, Users, Database, Sparkles, Activity, Settings, Shield } from 'lucide-react'





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
                
                {/* Refresh Statistics Button */}
                <button 
                  onClick={refetchStatistics}
                  disabled={statisticsLoading}
                  className="unified-button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  title="Обновить статистику"
                >
                  <Sparkles className={`h-4 w-4 ${statisticsLoading ? 'animate-spin' : ''}`} />
                  <span>Обновить</span>
                </button>

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
            {/* Users Table */}
            <UsersTable
              onCreateUser={() => setIsCreateUserPopupOpen(true)}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />

            {/* Stats Cards - Vertical Layout */}
            <div className="space-y-4">
              {/* Total Users Card */}
              <StatisticsCard
                title={t('total_users')}
                value={statistics?.total_users?.value || 0}
                change={statistics?.total_users || { value: 0, change_percent: 0, change_period: '' }}
                icon={<Users className="h-5 w-5" />}
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


