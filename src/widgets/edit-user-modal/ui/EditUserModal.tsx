import React, { useState, useEffect } from 'react'
import type { User, UpdateUserRequest } from '../../../shared/lib/api/types'
import { useUserDetails } from '../../../shared/hooks/useUserManagement'
import { X, Save, User as UserIcon, Mail, Shield } from 'lucide-react'

interface EditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, userData: UpdateUserRequest) => Promise<void>
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const { loading: rolesLoading } = useUserDetails(user?.id || '')
  const [formData, setFormData] = useState<UpdateUserRequest>({
    email: '',
    first_name: '',
    last_name: '',
    roles: []
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        roles: user.attributes?.roles || []
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      await onSave(user.id, formData)
      onClose()
    } catch (error) {
      console.error('Failed to save user:', error)
      alert('Ошибка при сохранении пользователя')
    } finally {
      setSaving(false)
    }
  }

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles?.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...(prev.roles || []), role]
    }))
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Редактировать пользователя</h2>
              <p className="text-slate-400 text-sm">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-blue-400" />
              Основная информация
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите имя"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Фамилия
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите фамилию"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите email"
                  required
                />
              </div>
            </div>
          </div>

          {/* Роли */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              Роли пользователя
            </h3>
            
            {rolesLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-600 border-t-blue-500"></div>
                <span className="ml-3 text-slate-300">Загрузка ролей...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['admin', 'user', 'guest'].map((role) => (
                  <label
                    key={role}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.roles?.includes(role)
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                        : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles?.includes(role) || false}
                      onChange={() => handleRoleToggle(role)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        formData.roles?.includes(role)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-400'
                      }`}>
                        {formData.roles?.includes(role) && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <span className="font-medium capitalize">{role}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-600/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
