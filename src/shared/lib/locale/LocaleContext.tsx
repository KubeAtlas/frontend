import React, { createContext, useContext, useState, type ReactNode } from 'react'

export type Locale = 'ru' | 'en'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

// Переводы
const translations = {
  ru: {
    // Общие
    'welcome': 'Добро пожаловать',
    'login': 'Войти в систему',
    'username': 'Имя пользователя',
    'password': 'Пароль',
    'enter_username': 'Введите имя пользователя',
    'enter_password': 'Введите пароль',
    'login_system': 'Войдите в систему для доступа к KubeAtlas',
    'cluster_management': 'Центр управления кластером',
    'loading': 'Вход...',
    'error_fill_fields': 'Пожалуйста, заполните все поля',
    'error_wrong_credentials': 'Неверные учетные данные',
    'error_login_failed': 'Произошла ошибка при входе',
    'demo_access': 'Демо-доступ:',
    'language': 'Язык',
    'russian': 'Русский',
    'english': 'English',
    
    // Дашборд
    'dashboard_title': 'KubeAtlas',
    'dashboard_subtitle': 'Kubernetes Management Platform',
    'database': 'База данных',
    'online': 'Онлайн',
    'response_time': 'Время отклика',
    'create_user': 'Создать пользователя',
    'total_users': 'Всего пользователей',
    'active_sessions': 'Активные сессии',
    'system_health': 'Состояние системы',
    'from_last_month': 'с прошлого месяца',
    'from_last_hour': 'с прошлого часа',
    'all_systems_operational': 'Все системы работают',
    'management': 'УПРАВЛЕНИЕ',
    'users': 'Пользователи',
    'security': 'Безопасность',
    'monitoring': 'Мониторинг',
    'settings': 'Настройки',
    'soon': 'Скоро',
    'logout': 'Выйти',
    'loading_dashboard': 'Загружаем KubeAtlas...',
    
    // Новые элементы
    'system_overview': 'Обзор системы',
    'key_indicators': 'Ключевые показатели и состояние системы',
    'system_status': 'Состояние системы',
    'update': 'Обновить',
    'sessions': 'Сессии',
    'system_users': 'Пользователи системы',
    'total_users_count': 'Всего пользователей',
    'refresh_list': 'Обновить список',
    'no_roles': 'Нет ролей',
    'active': 'Активен',
    'blocked': 'Заблокирован',
    'created': 'Создан',
    'actions': 'Действия',
    'edit_user': 'Редактировать пользователя',
    'delete_user': 'Удалить пользователя',
    'confirm_delete': 'Вы уверены, что хотите удалить пользователя',
    'loading_users': 'Загрузка пользователей...',
    'error_loading_users': 'Ошибка загрузки пользователей',
    'no_users': 'Нет пользователей',
    'no_users_message': 'В системе пока нет пользователей',
    'unknown': 'Неизвестно',
    'roles': 'Роли',
    'status': 'Статус',
    'verified': 'Подтвержден',
    'loading_error': 'Ошибка загрузки',
    
    // Popup окна
    'create_user_popup': 'Создать пользователя',
    'add_new_user': 'Добавить нового пользователя в систему',
    'validation_errors': 'Ошибки валидации:',
    'user_created_success': '✅ Пользователь успешно создан! Теперь можно войти с этими учетными данными.',
    'first_name': 'Имя',
    'last_name': 'Фамилия',
    'email_address': 'Email адрес',
    'confirm_password': 'Подтвердите пароль',
    'user_roles': 'Роли пользователя',
    'enter_username_placeholder': 'Введите имя пользователя',
    'enter_email_placeholder': 'user@example.com',
    'enter_first_name_placeholder': 'Введите имя',
    'enter_last_name_placeholder': 'Введите фамилию',
    'create_strong_password': 'Создайте надежный пароль',
    'repeat_password': 'Повторите пароль',
    'user_role': 'Пользователь',
    'admin_role': 'Администратор',
    'user_and_admin': 'Пользователь и Администратор',
    'roles_help': 'Или введите роли через запятую: user, admin, developer',
    'cancel': 'Отмена',
    'creating': 'Создание...',
    'create_user_button': 'Создать пользователя',
    'edit_user_popup': 'Редактировать пользователя',
    'basic_info': 'Основная информация',
    'enter_email_placeholder_edit': 'Введите email',
    'loading_roles': 'Загрузка ролей...',
    'save_changes': 'Сохранение...',
    'save_changes_button': 'Сохранить изменения',
    'session_management': 'Управление сессиями',
    'user_colon': 'Пользователь:',
    'close': 'Закрыть',
    'loading_sessions': 'Загрузка сессий...',
    'getting_server_data': 'Получаем данные с сервера',
    'sessions_load_error': 'Ошибка загрузки сессий',
    'try_again': 'Попробовать снова',
    'no_active_sessions': 'Нет активных сессий',
    'no_active_sessions_message': 'У пользователя нет активных сессий в данный момент',
    'active_sessions_count': 'Активные сессии',
    'close_all_sessions': 'Закрыть все сессии',
    'session_id': 'ID сессии',
    'ip_address': 'IP адрес',
    'browser_os': 'Браузер / ОС',
    'session_start': 'Начало сессии',
    'last_activity': 'Последняя активность',
    'current': 'Текущая',
    'deleting': 'Удаление...',
    'delete': 'Удалить',
    'current_session': 'Текущая сессия',
    'confirm_close_all_sessions': 'Вы уверены, что хотите закрыть все сессии?',
    'sessions_delete_error': 'Ошибка удаления сессий',
    'session_delete_error': 'Ошибка удаления сессии',
    'sessions_format_error': 'Неверный формат данных сессий',
    'refresh_roles': 'Обновить роли',
    'refresh_roles_error': 'Ошибка при обновлении ролей пользователя'
  },
  en: {
    // General
    'welcome': 'Welcome',
    'login': 'Sign In',
    'username': 'Username',
    'password': 'Password',
    'enter_username': 'Enter username',
    'enter_password': 'Enter password',
    'login_system': 'Sign in to access KubeAtlas',
    'cluster_management': 'Cluster Management Center',
    'loading': 'Signing in...',
    'error_fill_fields': 'Please fill in all fields',
    'error_wrong_credentials': 'Invalid credentials',
    'error_login_failed': 'An error occurred during login',
    'demo_access': 'Demo access:',
    'language': 'Language',
    'russian': 'Русский',
    'english': 'English',
    
    // Dashboard
    'dashboard_title': 'KubeAtlas',
    'dashboard_subtitle': 'Kubernetes Management Platform',
    'database': 'Database',
    'online': 'Online',
    'response_time': 'Response time',
    'create_user': 'Create User',
    'total_users': 'Total Users',
    'active_sessions': 'Active Sessions',
    'system_health': 'System Health',
    'from_last_month': 'from last month',
    'from_last_hour': 'from last hour',
    'all_systems_operational': 'All systems operational',
    'management': 'MANAGEMENT',
    'users': 'Users',
    'security': 'Security',
    'monitoring': 'Monitoring',
    'settings': 'Settings',
    'soon': 'Soon',
    'logout': 'Logout',
    'loading_dashboard': 'Loading KubeAtlas...',
    
    // New elements
    'system_overview': 'System Overview',
    'key_indicators': 'Key indicators and system status',
    'system_status': 'System Status',
    'update': 'Update',
    'sessions': 'Sessions',
    'system_users': 'System Users',
    'total_users_count': 'Total users',
    'refresh_list': 'Refresh list',
    'no_roles': 'No roles',
    'active': 'Active',
    'blocked': 'Blocked',
    'created': 'Created',
    'actions': 'Actions',
    'edit_user': 'Edit user',
    'delete_user': 'Delete user',
    'confirm_delete': 'Are you sure you want to delete user',
    'loading_users': 'Loading users...',
    'error_loading_users': 'Error loading users',
    'no_users': 'No users',
    'no_users_message': 'No users in the system yet',
    'unknown': 'Unknown',
    'roles': 'Roles',
    'status': 'Status',
    'verified': 'Verified',
    'loading_error': 'Loading error',
    
    // Popup windows
    'create_user_popup': 'Create User',
    'add_new_user': 'Add new user to the system',
    'validation_errors': 'Validation errors:',
    'user_created_success': '✅ User created successfully! You can now log in with these credentials.',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'email_address': 'Email Address',
    'confirm_password': 'Confirm Password',
    'user_roles': 'User Roles',
    'enter_username_placeholder': 'Enter username',
    'enter_email_placeholder': 'user@example.com',
    'enter_first_name_placeholder': 'Enter first name',
    'enter_last_name_placeholder': 'Enter last name',
    'create_strong_password': 'Create a strong password',
    'repeat_password': 'Repeat password',
    'user_role': 'User',
    'admin_role': 'Administrator',
    'user_and_admin': 'User and Administrator',
    'roles_help': 'Or enter roles separated by commas: user, admin, developer',
    'cancel': 'Cancel',
    'creating': 'Creating...',
    'create_user_button': 'Create User',
    'edit_user_popup': 'Edit User',
    'basic_info': 'Basic Information',
    'enter_email_placeholder_edit': 'Enter email',
    'loading_roles': 'Loading roles...',
    'save_changes': 'Saving...',
    'save_changes_button': 'Save Changes',
    'session_management': 'Session Management',
    'user_colon': 'User:',
    'close': 'Close',
    'loading_sessions': 'Loading sessions...',
    'getting_server_data': 'Getting data from server',
    'sessions_load_error': 'Error loading sessions',
    'try_again': 'Try Again',
    'no_active_sessions': 'No Active Sessions',
    'no_active_sessions_message': 'User has no active sessions at the moment',
    'active_sessions_count': 'Active Sessions',
    'close_all_sessions': 'Close All Sessions',
    'session_id': 'Session ID',
    'ip_address': 'IP Address',
    'browser_os': 'Browser / OS',
    'session_start': 'Session Start',
    'last_activity': 'Last Activity',
    'current': 'Current',
    'deleting': 'Deleting...',
    'delete': 'Delete',
    'current_session': 'Current Session',
    'confirm_close_all_sessions': 'Are you sure you want to close all sessions?',
    'sessions_delete_error': 'Error deleting sessions',
    'session_delete_error': 'Error deleting session',
    'sessions_format_error': 'Invalid sessions data format',
    'refresh_roles': 'Refresh Roles',
    'refresh_roles_error': 'Error refreshing user roles'
  }
}

interface LocaleProviderProps {
  children: ReactNode
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Получаем сохраненный язык из localStorage или используем русский по умолчанию
    const savedLocale = localStorage.getItem('kubeatlas-locale') as Locale
    return savedLocale && ['ru', 'en'].includes(savedLocale) ? savedLocale : 'ru'
  })

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('kubeatlas-locale', newLocale)
  }

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations[typeof locale]] || key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
