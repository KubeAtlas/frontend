import { apiGet, apiPost, apiPut, apiDelete } from './client'

export interface User {
  id?: string
  username: string
  email: string
  first_name: string
  last_name: string
  password?: string
  roles: string[]
  enabled?: boolean
  created_at?: string
  updated_at?: string
}

export interface UserSession {
  id: string
  ipAddress: string
  userAgent: string
  lastAccess: string
  active: boolean
}

export interface CreateUserRequest {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  roles: string[]
}

export interface UpdateUserRequest {
  email?: string
  first_name?: string
  last_name?: string
  roles?: string[]
  enabled?: boolean
}

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
  error?: string
}

export interface UserRoles {
  roles: string[]
  isAdmin: boolean
  isUser: boolean
  isGuest: boolean
}

export interface UserProfile {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  roles: string[]
  enabled: boolean
  created_at: string
  updated_at: string
}

class UserManagementService {
  // User profile endpoints
  async getUserProfile(): Promise<UserProfile> {
    return apiGet<UserProfile>('/user/profile')
  }

  async getUserRoles(): Promise<UserRoles> {
    return apiGet<UserRoles>('/user/roles')
  }

  // Admin endpoints - User Management
  async createUser(userData: CreateUserRequest): Promise<{ id: string; message: string }> {
    return apiPost<{ id: string; message: string }>('/admin/users', userData)
  }

  async updateUser(userId: string, updates: UpdateUserRequest): Promise<{ id: string; message: string }> {
    return apiPut<{ id: string; message: string }>(`/admin/users/${userId}`, updates)
  }

  async deleteUser(userId: string): Promise<{ message: string; id: string }> {
    return apiDelete<{ message: string; id: string }>(`/admin/users/${userId}`)
  }

  // Admin endpoints - Session Management
  async getUserSessions(userId: string): Promise<{ sessions: UserSession[] }> {
    return apiGet<{ sessions: UserSession[] }>(`/admin/users/${userId}/sessions`)
  }

  async revokeUserSessions(userId: string): Promise<{ message: string }> {
    return apiPost<{ message: string }>(`/admin/users/${userId}/sessions/revoke`)
  }

  // Auth validation
  async validateToken(): Promise<{ valid: boolean; user?: any }> {
    return apiPost<{ valid: boolean; user?: any }>('/auth/validate')
  }

  async getCurrentUser(): Promise<UserProfile> {
    return apiGet<UserProfile>('/auth/user')
  }

  // Helper methods
  async checkAdminRights(): Promise<boolean> {
    try {
      const rolesData = await this.getUserRoles()
      return rolesData.isAdmin || rolesData.roles.includes('admin')
    } catch (error) {
      console.error('Error checking admin rights:', error)
      return false
    }
  }

  // Validate user data before sending
  validateUserData(user: Partial<CreateUserRequest>): string[] {
    const errors: string[] = []

    if (!user.username || user.username.length < 3) {
      errors.push('Username must be at least 3 characters long')
    }

    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      errors.push('Please enter a valid email address')
    }

    if (!user.password || user.password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!user.first_name || user.first_name.trim().length === 0) {
      errors.push('First name is required')
    }

    if (!user.last_name || user.last_name.trim().length === 0) {
      errors.push('Last name is required')
    }

    if (!user.roles || user.roles.length === 0) {
      errors.push('At least one role must be assigned')
    }

    return errors
  }

  // Format API errors for user-friendly display
  formatApiError(error: any): string {
    if (error?.message) {
      if (error.message.includes('HTTP 400')) {
        return 'Invalid user data. Please check all fields.'
      } else if (error.message.includes('HTTP 401')) {
        return 'Unauthorized. Please login again.'
      } else if (error.message.includes('HTTP 403')) {
        return 'Access denied. Admin privileges required.'
      } else if (error.message.includes('HTTP 409')) {
        return 'User already exists with this username or email.'
      } else if (error.message.includes('HTTP 500')) {
        return 'Server error. Please try again later.'
      } else {
        return error.message
      }
    }
    return 'An unexpected error occurred'
  }
}

// Create and export singleton instance
export const userService = new UserManagementService()
export default userService