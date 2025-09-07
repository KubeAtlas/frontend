import React, { useState } from 'react'
import type { User } from '../../../shared/lib/api/types'
import { useUsers } from '../../../shared/hooks/useUserManagement'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Shield, 
  User as UserIcon,
  Crown,
  Users as UsersIcon
} from 'lucide-react'

interface UsersTableProps {
  onCreateUser: () => void
  onEditUser: (user: User) => void
  onDeleteUser?: (user: User) => void
}

export const UsersTable: React.FC<UsersTableProps> = ({
  onCreateUser,
  onEditUser
}) => {
  const { users, loading, error, refetch, deleteUser, refreshUserRoles } = useUsers()
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [refreshingRolesUserId, setRefreshingRolesUserId] = useState<string | null>(null)
  const { t } = useLocale()


  const handleDeleteUser = async (user: User) => {
    if (!confirm(`${t('confirm_delete')} "${user.username}"?`)) {
      return
    }

    try {
      setDeletingUserId(user.id)
      await deleteUser(user.id)
      console.log('User deleted successfully')
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert(t('error_loading_users'))
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleRefreshUserRoles = async (user: User) => {
    try {
      setRefreshingRolesUserId(user.id)
      await refreshUserRoles(user.id)
      console.log('User roles refreshed successfully')
    } catch (err: any) {
      console.error('Failed to refresh user roles:', err)
      
      // Не показываем модальное окно для ошибок доступа
      if (err.message === 'ACCESS_DENIED') {
        console.warn('Access denied for refreshing user roles - this is expected for non-admin users')
        return
      }
      
      // Показываем ошибку только для других типов ошибок
      alert(t('refresh_roles_error'))
    } finally {
      setRefreshingRolesUserId(null)
    }
  }

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) {
        return t('unknown')
      }
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Date formatting error:', error)
      return t('unknown')
    }
  }

  const getRoleIcon = (roleName: string) => {
    const role = roleName.toLowerCase()
    if (role.includes('admin') || role.includes('administrator')) {
      return <Crown className="w-4 h-4 text-blue-400" />
    }
    if (role.includes('user') || role.includes('member')) {
      return <UserIcon className="w-4 h-4 text-green-400" />
    }
    if (role.includes('guest') || role.includes('visitor')) {
      return <UsersIcon className="w-4 h-4 text-gray-400" />
    }
    if (role.includes('moderator') || role.includes('mod')) {
      return <Shield className="w-4 h-4 text-yellow-400" />
    }
    return <Shield className="w-4 h-4 text-purple-400" />
  }

  const getRoleColor = (roleName: string) => {
    const role = roleName.toLowerCase()
    if (role.includes('admin') || role.includes('administrator')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
    if (role.includes('user') || role.includes('member')) {
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
    if (role.includes('guest') || role.includes('visitor')) {
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    if (role.includes('moderator') || role.includes('mod')) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    }
    return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  }

  if (loading) {
    return (
        <div className="unified-card p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-600 border-t-blue-500"></div>
          <span className="text-slate-300">{t('loading_users')}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="unified-card p-6 border border-red-500/30 bg-red-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-red-300 font-semibold">{t('error_loading_users')}</h3>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="unified-card p-6">
      {/* Заголовок с кнопками */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t('system_users')}</h2>
            <p className="text-slate-400 text-sm">{t('total_users_count')}: {users.length}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
            title={t('refresh_list')}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          
          <button
            onClick={onCreateUser}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            <UserPlus className="w-4 h-4 mr-2 inline" />
            {t('create_user')}
          </button>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600/50">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('username')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('roles')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('created')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/30 divide-y divide-slate-600/30">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-slate-300 font-semibold">{t('no_users')}</h3>
                    <p className="text-slate-500 text-sm">{t('no_users_message')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.username
                          }
                        </div>
                        <div className="text-sm text-slate-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-200">{user.email}</div>
                    {user.emailVerified && (
                      <div className="text-xs text-green-400 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        {t('verified')}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.attributes?.roles && Array.isArray(user.attributes.roles) && user.attributes.roles.length > 0 ? (
                        user.attributes.roles.map((role, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}
                          >
                            {getRoleIcon(role)}
                            <span className="ml-1">{role}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm">{t('no_roles')}</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.enabled 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {user.enabled ? t('active') : t('blocked')}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {formatDate(user.createdTimestamp)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title={t('edit_user')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleRefreshUserRoles(user)}
                        disabled={refreshingRolesUserId === user.id}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                        title={t('refresh_roles')}
                      >
                        {refreshingRolesUserId === user.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"></div>
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={deletingUserId === user.id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                        title={t('delete_user')}
                      >
                        {deletingUserId === user.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
