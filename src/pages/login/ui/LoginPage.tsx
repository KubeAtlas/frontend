import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { LanguageSwitcher } from '../../../widgets/language-switcher/ui/LanguageSwitcher'
import { AnimatedLockIcon } from '../../../shared/ui/AnimatedLockIcon/AnimatedLockIcon'
import { LoginPreloader } from '../../../shared/ui'

export const LoginPage = () => {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  useEffect(() => {
    // Включаем фоновую анимацию только на логине
    document.body.classList.add('login-bg')
    return () => {
      document.body.classList.remove('login-bg')
    }
  }, [])
  const { t } = useLocale()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginSuccess, setIsLoginSuccess] = useState(false)

  // Показываем preloader при загрузке
  if (isLoading) {
    return <LoginPreloader message="Вход в систему" />
  }

  const handleAnimationComplete = () => {
    // Сбрасываем состояние через некоторое время
    setTimeout(() => {
      setIsLoginSuccess(false)
      setUsername('')
      setPassword('')
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError(t('error_fill_fields'))
      return
    }

    setIsLoading(true)
    setError('')
    const res = await login({ username, password })
    setIsLoading(false)
    if (res.success) {
      setIsLoginSuccess(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 800)
    } else {
      setError(res.error || t('error_login_failed'))
    }
  }

  return (
    <div className="login-page" style={{
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
              background: isLoginSuccess ? '#10b981' : '#3b82f6',
              borderRadius: '12px',
              boxShadow: isLoginSuccess 
                ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                : '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <AnimatedLockIcon 
                isUnlocked={isLoginSuccess} 
                onAnimationComplete={handleAnimationComplete}
              />
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
                  setUsername('admin-service')
                  setPassword('AdminPassw0rd!')
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
                admin-service
              </button>
              <span style={{ color: '#6b7280' }}>/</span>
              <button
                onClick={() => {
                  setUsername('admin-service')
                  setPassword('AdminPassw0rd!')
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
                AdminPassw0rd!
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
