import { useState } from 'react'

export const LoginPageNew = () => {
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (username === 'admin' && password === 'admin123') {
        alert(`🚀 Добро пожаловать в KubeAtlas, ${username}!`)
      } else {
        setError('Неверные учетные данные')
      }
    } catch (err) {
      setError('Ошибка авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/background-images/image.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Затемнение для лучшей читаемости */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(1px)'
      }} />

      {/* Основной контент */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '448px' }}>
        {/* Логотип */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
            borderRadius: '50%',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
          }}>
            <span style={{ fontSize: '40px', color: 'white' }}>★</span>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              opacity: 0.3,
              filter: 'blur(20px)',
              animation: 'pulse 3s infinite ease-in-out'
            }} />
          </div>
          
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            KubeAtlas
          </h1>
          
          <p style={{
            color: '#d1d5db',
            fontSize: '18px',
            fontWeight: '300',
            marginBottom: '16px'
          }}>
            Центр управления кластером
          </p>
        </div>

        {/* Форма */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '448px',
          margin: '0 auto'
        }}>
          {/* Декоративные элементы */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
          }} />
          
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '80px',
            height: '80px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '80px',
            height: '80px',
            background: 'rgba(147, 51, 234, 0.2)',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />

          {/* Заголовок формы */}
          <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%'
            }}>
              <span style={{ fontSize: '24px', color: 'white' }}>🔒</span>
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }}>
              Добро пожаловать
            </h2>
            
            <p style={{
              color: '#d1d5db',
              fontSize: '14px'
            }}>
              Войдите в систему для доступа к KubeAtlas
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#e5e7eb',
                marginBottom: '6px',
                marginLeft: '2px'
              }}>
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '0 16px',
                  color: 'white',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#e5e7eb',
                marginBottom: '6px',
                marginLeft: '2px'
              }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '0 16px',
                    color: 'white',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
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
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = '#9ca3af'
                  }}
                >
                  {showPassword ? '👁️' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <span style={{ color: '#f87171', fontSize: '16px' }}>⚠</span>
                <p style={{ color: '#fca5a5', fontSize: '14px', margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              style={{
                width: '100%',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isLoading || !username || !password) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || !username || !password) ? 0.5 : 1,
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
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
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span>Вход...</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '20px', color: 'white' }}>→</span>
                  <span>Войти в систему</span>
                </>
              )}
            </button>
          </form>

          {/* Демо-доступ */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 10
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              Демо-доступ:
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setUsername('admin')
                  setPassword('admin123')
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
                onClick={() => {
                  setUsername('admin')
                  setPassword('admin123')
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#4ade80',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
        
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Powered by Advanced Technology
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
