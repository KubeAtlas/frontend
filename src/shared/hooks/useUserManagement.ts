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
      const data = await userManagementService.getAllUsers()
      console.log('useUsers: Received users:', data)
      setUsers(data)
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
      await fetchUsers() // Обновляем список
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

  return { 
    users, 
    loading, 
    error, 
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser
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
