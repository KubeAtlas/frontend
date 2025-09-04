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
    'loading_dashboard': 'Загружаем KubeAtlas...'
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
    'loading_dashboard': 'Loading KubeAtlas...'
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
