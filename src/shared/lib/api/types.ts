// API типы для KubeAtlas Backend

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Статистика системы
export interface StatItem {
  value: number;
  change_percent: number;
  change_period: string;
}

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime_percentage: number;
}

export interface SystemStatus {
  percentage: number;
  status: string;
  details: ServiceStatus[];
}

export interface StatisticsResponse {
  total_users: StatItem;
  active_sessions: StatItem;
  system_status: SystemStatus;
}

// Пользователи
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  roles: string[];
  is_admin: boolean;
  is_user: boolean;
  is_guest: boolean;
}

export interface UserRole {
  username: string;
  roles: string[];
  is_admin: boolean;
  is_user: boolean;
  is_guest: boolean;
}

// Управление пользователями
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  createdTimestamp: number;
  attributes?: Record<string, string[]>;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  roles: string[];
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
}

// Сессии пользователей
export interface UserSession {
  id: string;
  userId: string;
  username: string;
  ipAddress: string;
  start: number;
  lastAccess: number;
  clients: Record<string, string>;
  userAgent?: string;
  browser?: string;
  os?: string;
}

export interface SessionRevocationResponse {
  success: boolean;
  message: string;
  sessionsRevoked?: number;
}

export interface UsersListResponse {
  users: User[];
  totalCount: number;
}

export interface UserDetailsResponse {
  user: User;
  roles: Role[];
  sessions: UserSession[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
}
