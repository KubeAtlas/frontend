import { useState } from 'react'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'

export const LoginPageTest = () => {
  const { t } = useLocale()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError(t('error_fill_fields'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (username === 'admin' && password === 'admin123') {
        alert(t('welcome'))
      } else {
        setError(t('error_wrong_credentials'))
      }
    } catch (err) {
      setError(t('error_login_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Виджет переключения языка */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <LanguageSwitcher />
      </div>

      {/* Затемнение для лучшей читаемости */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(0.5px)',
        zIndex: 1
      }} />

      {/* Основной контент */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '400px' }}>
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            {t('cluster_management')}
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
          overflow: 'hidden'
        }}>
          {/* Заголовок формы */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              marginBottom: '16px',
              background: '#3b82f6',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" fill="white"/>
              </svg>
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }}>
              {t('welcome')}
            </h2>
            <p style={{
              color: '#d1d5db',
              fontSize: '14px'
            }}>
              {t('login_system')}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#e5e7eb',
                marginBottom: '6px',
                marginLeft: '2px'
              }}>
                {t('username')}
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
                placeholder={t('enter_username')}
                disabled={isLoading}
                required
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
                {t('password')}
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
                    padding: '0 50px 0 16px',
                    color: 'white',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder={t('enter_password')}
                  disabled={isLoading}
                  required
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
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9ca3af'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
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
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '20px', color: 'white' }}>→</span>
                  <span>{t('login')}</span>
                </>
              )}
            </button>
          </form>

          {/* Демо-доступ */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {t('demo_access')}
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
              >
                admin123
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
