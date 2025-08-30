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
    'english': 'English'
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
    'english': 'English'
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
