import type { User, Role, CreateUserRequest, UpdateUserRequest } from './types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

export class UserManagementService {
  // Получение всех пользователей
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('UserManagementService: Fetching all users...')
      const response = await apiGet<{users: User[], totalCount: number}>('/admin/users')
      console.log('UserManagementService: Users response:', response)
      return response.users || []
    } catch (error) {
      console.error('UserManagementService: Failed to fetch users:', error)
      throw error
    }
  }

  // Получение пользователя по ID
  async getUserById(userId: string): Promise<User> {
    try {
      console.log('UserManagementService: Fetching user by ID:', userId)
      const response = await apiGet<User>(`/admin/users/${userId}`)
      console.log('UserManagementService: User response:', response)
      return response
    } catch (error) {
      console.error('UserManagementService: Failed to fetch user:', error)
      throw error
    }
  }

  // Получение ролей пользователя
  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      console.log('UserManagementService: Fetching user roles:', userId)
      const response = await apiGet<Role[]>(`/admin/users/${userId}/roles`)
      console.log('UserManagementService: Roles response:', response)
      return response
    } catch (error) {
      console.error('UserManagementService: Failed to fetch user roles:', error)
      throw error
    }
  }

  // Создание пользователя
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      console.log('UserManagementService: Creating user:', userData)
      const response = await apiPost<User>('/admin/users', userData)
      console.log('UserManagementService: User created:', response)
      return response
    } catch (error) {
      console.error('UserManagementService: Failed to create user:', error)
      throw error
    }
  }

  // Обновление пользователя
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    try {
      console.log('UserManagementService: Updating user:', userId, userData)
      const response = await apiPut<User>(`/admin/users/${userId}`, userData)
      console.log('UserManagementService: User updated:', response)
      return response
    } catch (error) {
      console.error('UserManagementService: Failed to update user:', error)
      throw error
    }
  }

  // Удаление пользователя
  async deleteUser(userId: string): Promise<void> {
    try {
      console.log('UserManagementService: Deleting user:', userId)
      await apiDelete(`/admin/users/${userId}`)
      console.log('UserManagementService: User deleted successfully')
    } catch (error) {
      console.error('UserManagementService: Failed to delete user:', error)
      throw error
    }
  }

  // Получение полной информации о пользователе (пользователь + роли)
  async getUserFullDetails(userId: string): Promise<{user: User, roles: Role[]}> {
    try {
      console.log('UserManagementService: Fetching full user details:', userId)
      const [user, roles] = await Promise.all([
        this.getUserById(userId),
        this.getUserRoles(userId)
      ])
      console.log('UserManagementService: Full details:', { user, roles })
      return { user, roles }
    } catch (error) {
      console.error('UserManagementService: Failed to fetch full user details:', error)
      throw error
    }
  }
}
