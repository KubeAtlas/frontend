import React from 'react'

interface PreloaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'logout' | 'login'
}

export const Preloader: React.FC<PreloaderProps> = ({ 
  message = 'Загрузка...', 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'logout':
        return {
          container: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
          spinner: 'border-slate-600 border-t-blue-500',
          text: 'text-slate-300',
          icon: 'text-blue-400'
        }
      case 'login':
        return {
          container: 'bg-gradient-to-br from-blue-900 via-slate-800 to-purple-900',
          spinner: 'border-slate-600 border-t-blue-400',
          text: 'text-slate-200',
          icon: 'text-blue-300'
        }
      default:
        return {
          container: 'bg-slate-900',
          spinner: 'border-slate-600 border-t-blue-500',
          text: 'text-slate-300',
          icon: 'text-blue-400'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${styles.container}`}>
      {/* Фоновые элементы для красоты */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Логотип/иконка */}
        <div className="relative">
          <div className={`${sizeClasses[size]} ${styles.spinner} border-4 rounded-full animate-spin`}></div>
          {variant === 'logout' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          )}
          {variant === 'login' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          )}
        </div>

        {/* Текст */}
        <div className="text-center">
          <h2 className={`${textSizeClasses[size]} font-semibold ${styles.text} mb-2`}>
            {message}
          </h2>
          {variant === 'logout' && (
            <p className="text-sm text-slate-400">
              Завершение сессии...
            </p>
          )}
          {variant === 'login' && (
            <p className="text-sm text-slate-400">
              Вход в систему...
            </p>
          )}
        </div>

        {/* Дополнительные анимационные элементы */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Дополнительные декоративные элементы */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-slate-500 text-sm">
          <div className="w-1 h-1 bg-slate-500 rounded-full animate-pulse"></div>
          <span>KubeAtlas</span>
          <div className="w-1 h-1 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
        </div>
      </div>
    </div>
  )
}

// Специализированные компоненты для разных случаев
export const LogoutPreloader: React.FC<{ message?: string }> = ({ message = 'Выход из системы' }) => (
  <Preloader message={message} variant="logout" size="lg" />
)

export const LoginPreloader: React.FC<{ message?: string }> = ({ message = 'Вход в систему' }) => (
  <Preloader message={message} variant="login" size="lg" />
)

export const LoadingPreloader: React.FC<{ message?: string }> = ({ message = 'Загрузка...' }) => (
  <Preloader message={message} variant="default" size="md" />
)
