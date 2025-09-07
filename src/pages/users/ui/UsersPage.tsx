import { useState } from 'react'
import type { User, UpdateUserRequest } from '../../../shared/lib/api/types'
import { UsersTable } from '../../../widgets/users-table'
import { EditUserModal } from '../../../widgets/edit-user-modal'
import { CreateUserPopup } from '../../../widgets/create-user-popup'
import { useUsers } from '../../../shared/hooks/useUserManagement'
import { AdminOnly } from '../../../app/providers/AuthProvider'
import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { useAuthContext } from '../../../app/providers/AuthProvider'

import { Users as UsersIcon, Shield } from 'lucide-react'

export const UsersPage = () => {
  const [isCreateUserPopupOpen, setIsCreateUserPopupOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const { isLoading: authLoading } = useAuthContext()
  const { updateUser } = useUsers()

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

  if (authLoading) {
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
                    <UsersIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Управление пользователями</h1>
                    <p className="text-slate-400 text-sm">Создание, редактирование и удаление пользователей системы</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <AdminOnly>
              <UsersTable
                onCreateUser={() => setIsCreateUserPopupOpen(true)}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            </AdminOnly>
            
            {/* Access Denied for Non-Admins */}
            <div className="hidden admin-only:hidden">
              <div className="unified-card p-12 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Доступ запрещен</h2>
                <p className="text-slate-400 mb-6">
                  У вас нет прав для просмотра и управления пользователями системы.
                </p>
                <p className="text-slate-500 text-sm">
                  Обратитесь к администратору для получения соответствующих прав.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <CreateUserPopup 
        isOpen={isCreateUserPopupOpen}
        onClose={() => setIsCreateUserPopupOpen(false)}
      />
      
      <EditUserModal
        user={editingUser}
        isOpen={isEditUserModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
      />
    </SidebarProvider>
  )
}
