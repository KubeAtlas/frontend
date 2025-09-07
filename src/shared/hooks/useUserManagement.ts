import { useState, useEffect, useCallback } from 'react'
import type { User, Role, CreateUserRequest, UpdateUserRequest } from '../lib/api/types'
import { UserManagementService } from '../lib/api/userManagementService'

const userManagementService = new UserManagementService()

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      console.log('useUsers: Starting to fetch users...')
      setLoading(true)
      setError(null)
      
      // Получаем всех пользователей напрямую из API
      const usersData = await userManagementService.getAllUsers()
      console.log('useUsers: Received users from API:', usersData)
      console.log('useUsers: Users data type:', typeof usersData, 'Is array:', Array.isArray(usersData))
      
      // Проверяем, что получили массив пользователей
      if (!Array.isArray(usersData)) {
        console.error('useUsers: Expected array of users, got:', usersData)
        setError('Invalid response format from server')
        return
      }
      
      // Загружаем роли для каждого пользователя
      const usersWithRoles = await Promise.all(
        usersData.map(async (user) => {
          try {
            console.log(`useUsers: Loading roles for user ${user.username} (${user.id})...`)
            
            // Получаем роли пользователя из API
            const roles = await userManagementService.getUserRoles(user.id)
            console.log(`useUsers: Loaded roles for ${user.username}:`, roles)
            
            // Преобразуем роли в массив строк
            const roleNames = Array.isArray(roles) 
              ? roles.map(role => typeof role === 'string' ? role : role.name || '')
              : []
            
            console.log(`useUsers: Processed roles for ${user.username}:`, roleNames)
            
            // Возвращаем пользователя с ролями
            return {
              ...user,
              attributes: {
                ...user.attributes,
                roles: roleNames
              }
            }
          } catch (roleError) {
            console.warn(`useUsers: Failed to load roles for user ${user.username}:`, roleError)
            // Возвращаем пользователя с пустыми ролями
            return {
              ...user,
              attributes: {
                ...user.attributes,
                roles: []
              }
            }
          }
        })
      )
      
      console.log('useUsers: Users with roles:', usersWithRoles)
      
      // Дополнительная отладка ролей
      usersWithRoles.forEach(user => {
        console.log(`useUsers: Final roles for ${user.username}:`, user.attributes?.roles)
      })
      
      setUsers(usersWithRoles)
    } catch (err) {
      console.error('useUsers: Failed to fetch users:', err)
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = async (userData: CreateUserRequest) => {
    try {
      console.log('useUsers: Creating user:', userData)
      const newUser = await userManagementService.createUser(userData)
      console.log('useUsers: User created:', newUser)
      await fetchUsers() // Обновляем список
      return newUser
    } catch (err) {
      console.error('useUsers: Failed to create user:', err)
      throw err
    }
  }

  const updateUser = async (userId: string, userData: UpdateUserRequest) => {
    try {
      console.log('useUsers: Updating user:', userId, userData)
      const updatedUser = await userManagementService.updateUser(userId, userData)
      console.log('useUsers: User updated:', updatedUser)
      
      // Обновляем весь список пользователей для получения актуальных данных
      console.log('useUsers: Refreshing users list after update...')
      await fetchUsers()
      
      return updatedUser
    } catch (err) {
      console.error('useUsers: Failed to update user:', err)
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      console.log('useUsers: Deleting user:', userId)
      await userManagementService.deleteUser(userId)
      console.log('useUsers: User deleted successfully')
      await fetchUsers() // Обновляем список
    } catch (err) {
      console.error('useUsers: Failed to delete user:', err)
      throw err
    }
  }

  const refreshUserRoles = async (userId: string) => {
    try {
      console.log('useUsers: Refreshing roles for user:', userId)
      const roles = await userManagementService.getUserRoles(userId)
      console.log('useUsers: Refreshed roles:', roles)
      
      // Преобразуем роли в массив строк
      const roleNames = Array.isArray(roles) 
        ? roles.map(role => typeof role === 'string' ? role : role.name || '')
        : []
      
      // Обновляем роли пользователя в локальном состоянии
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? {
                ...user,
                attributes: {
                  ...user.attributes,
                  roles: roleNames
                }
              }
            : user
        )
      )
      
      console.log('useUsers: Updated roles for user:', userId, roleNames)
      return roles
    } catch (err: any) {
      console.error('useUsers: Failed to refresh user roles:', err)
      
      // Если это ошибка доступа (403), не показываем модальное окно
      if (err.message && err.message.includes('403')) {
        console.warn('useUsers: Access denied for refreshing user roles - this is expected for non-admin users')
        throw new Error('ACCESS_DENIED')
      }
      
      throw err
    }
  }

  return { 
    users, 
    loading, 
    error, 
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    refreshUserRoles
  }
}

export const useUserDetails = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return
    
    try {
      console.log('useUserDetails: Fetching user details:', userId)
      setLoading(true)
      setError(null)
      const data = await userManagementService.getUserFullDetails(userId)
      console.log('useUserDetails: Received details:', data)
      setUser(data.user)
      setRoles(data.roles)
    } catch (err) {
      console.error('useUserDetails: Failed to fetch user details:', err)
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUserDetails()
  }, [fetchUserDetails])

  return { 
    user, 
    roles, 
    loading, 
    error, 
    refetch: fetchUserDetails
  }
}
