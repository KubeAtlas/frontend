import { useState } from 'react'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Временная заглушка - симулируем авторизацию
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (username === 'admin' && password === 'admin123') {
        alert(`🚀 Добро пожаловать в KubeAtlas, ${username}! Авторизация успешна!`)
      } else {
        setError('Неверные учетные данные')
      }
    } catch (err) {
      setError('Ошибка авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setUsername('admin')
    setPassword('admin123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Упрощенный космический фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Простые звезды */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Основной контент */}
      <div className="relative z-10 w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative shadow-2xl">
            <span className="text-4xl">🚀</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-xl animate-pulse" />
          </div>
          
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            KubeAtlas
          </h1>
          
          <p className="text-gray-300 text-lg font-light mb-4">
            Центр управления кластером
          </p>
          
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <span 
                key={i}
                className="text-yellow-400 animate-pulse" 
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>

        {/* Красивая форма */}
        <div className="w-full max-w-md mx-auto">
          <div 
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Декоративные элементы */}
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                height: '4px'
              }}
            />
            <div 
              className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl"
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                width: '80px',
                height: '80px'
              }}
            />
            <div 
              className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full blur-xl"
              style={{
                background: 'rgba(147, 51, 234, 0.2)',
                width: '80px',
                height: '80px'
              }}
            />
            <div className="text-center mb-8 relative z-10">
              <div 
                className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  width: '48px',
                  height: '48px'
                }}
              >
                <span style={{ fontSize: '24px' }}>🔐</span>
              </div>
              <h2 
                className="mb-2"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                Добро пожаловать
              </h2>
              <p 
                style={{
                  color: '#d1d5db',
                  fontSize: '14px'
                }}
              >
                Войдите в систему для доступа к KubeAtlas
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label 
                  htmlFor="username" 
                  className="block"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#e5e7eb'
                  }}
                >
                  Имя пользователя
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 rounded-xl px-4 transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      height: '48px'
                    }}
                    placeholder="Введите имя пользователя"
                    disabled={isLoading}
                    required
                    onFocus={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                      opacity: 0
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#e5e7eb'
                  }}
                >
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 rounded-xl px-4 pr-12 transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      height: '48px'
                    }}
                    placeholder="Введите пароль"
                    disabled={isLoading}
                    required
                    onFocus={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                    style={{
                      color: '#9ca3af',
                      fontSize: '16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    disabled={isLoading}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#9ca3af'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                      opacity: 0
                    }}
                  />
                </div>
              </div>

              {error && (
                <div 
                  className="flex items-center space-x-2 p-3 rounded-xl backdrop-blur-sm"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '12px'
                  }}
                >
                  <span style={{ color: '#f87171', fontSize: '16px' }}>⚠️</span>
                  <p style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  height: '48px',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                  opacity: (isLoading || !username || !password) ? 0.5 : 1,
                  cursor: (isLoading || !username || !password) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && username && password) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed, #db2777)'
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && username && password) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)'
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Вход...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Войти в систему</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
              <p 
                className="text-center mb-3"
                style={{
                  color: '#9ca3af',
                  fontSize: '14px'
                }}
              >
                Демо-доступ:
              </p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={fillDemoCredentials}
                  className="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-mono"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    padding: '8px 16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                  }}
                >
                  admin
                </button>
                <span style={{ color: '#6b7280' }}>/</span>
                <button
                  onClick={fillDemoCredentials}
                  className="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-mono"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                    padding: '8px 16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)'
                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)'
                  }}
                >
                  admin123
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p 
            style={{
              color: '#6b7280',
              fontSize: '14px'
            }}
          >
            Powered by Advanced Technology
          </p>
        </div>
      </div>
    </div>
  )
}
