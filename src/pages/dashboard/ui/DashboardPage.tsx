import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../../../shared/lib/api/client'
import { Label, Badge } from '../../../shared/ui'
import { SidebarProvider, SidebarTrigger } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { Activity, UserPlus, Crown, Shield, Sparkles, Star, Globe } from 'lucide-react'

interface Profile { id: string; username: string; email?: string; firstName?: string; lastName?: string }

// Компонент для кругового прогресса
const CircularProgress = ({ value, size = 120, strokeWidth = 8, color = "#3b82f6" }: {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-circle"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{value}%</span>
      </div>
    </div>
  )
}

export const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // User creation form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [userRoles, setUserRoles] = useState('user')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)

  // Focus states for beautiful labels
  const [focusStates, setFocusStates] = useState({
    username: false,
    email: false,
    firstName: false,
    lastName: false,
    password: false,
    roles: false
  })

  const handleFocus = (field: string) => {
    setFocusStates(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field: string, value: string) => {
    if (!value) {
      setFocusStates(prev => ({ ...prev, [field]: false }))
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [p, r] = await Promise.all([
          apiGet<Profile>('/user/profile'),
          apiGet<{ roles: string[] }>('/user/roles')
        ])
        if (!mounted) return
        setProfile(p)
        setRoles(r.roles)
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setMessage(null)
    try {
      await apiPost('/admin/users', {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        roles: userRoles.split(',').map(s => s.trim()).filter(Boolean)
      })
      setMessage('✅ Пользователь успешно создан!')
      setUsername('')
      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setUserRoles('user')
    } catch (e: any) {
      setMessage(`❌ ${e?.message || 'Ошибка создания пользователя'}`)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3 pulse-animation">
          <Sparkles className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-xl font-medium glow-text">Загружаем KubeAtlas...</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 p-8 space-y-8 slide-in">
          {/* Beautiful Hero Header */}
          <div className="glass-header">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold neon-text">
                  KubeAtlas Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  Управление пользователями Kubernetes кластера
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="holographic p-6 rounded-3xl">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <SidebarTrigger />
              </div>
            </div>
          </div>

          {/* Horizontal Information Cards */}
          <div className="flex items-stretch justify-center gap-5 md:gap-7 flex-wrap pb-2">
            {/* Satisfaction Rate Card */}
            <div className="ultra-modern-card p-6 min-w-[320px] max-w-[360px] shrink-0 mx-6 ring-2 ring-white/20 shadow-2xl">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-muted-foreground mb-1">Satisfaction Rate</h3>
                  <p className="text-xs text-muted-foreground">From all projects</p>
                </div>
                <div className="flex items-center justify-center">
                  <CircularProgress value={95} size={90} strokeWidth={6} color="#3b82f6" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Based on likes</p>
                </div>
              </div>
            </div>

            {/* Referral Tracking Card */}
            <div className="ultra-modern-card p-6 min-w-[320px] max-w-[360px] shrink-0 mx-6 ring-2 ring-white/20 shadow-2xl">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-muted-foreground mb-1">Referral Tracking</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Invited</p>
                      <p className="text-xl font-bold">145 people</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <CircularProgress value={93} size={90} strokeWidth={6} color="#10b981" />
                </div>
                <div className="text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Bonus</p>
                    <p className="text-lg font-bold">1,465</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            {profile && (
              <div className="ultra-modern-card p-6 min-w-[320px] max-w-[360px] shrink-0 mx-6 ring-2 ring-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">Ваш профиль</h3>
                      <p className="text-xs text-muted-foreground">Текущий пользователь</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Пользователь</Label>
                      <Badge variant="outline" className="text-xs px-2 py-1 mt-1">
                        {profile.username}
                      </Badge>
                    </div>
                    {profile.email && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="text-xs mt-1">{profile.email}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-muted-foreground">Роли</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {roles.map(role => (
                          <Badge 
                            key={role} 
                            className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px]"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compact User Creation Button */}
          <div className="flex justify-center">
            <div className="ultra-modern-card p-8 max-w-md w-full">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-2xl">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold neon-text">Создать пользователя</h3>
                    <p className="text-sm text-muted-foreground">Добавить в систему</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowUserForm(!showUserForm)}
                  className="modern-button-primary w-full h-14 text-lg font-semibold"
                >
                  <UserPlus className="h-5 w-5 mr-3" />
                  {showUserForm ? 'Скрыть форму' : 'Открыть форму создания'}
                </button>

                {message && (
                  <div className={`p-4 rounded-xl text-sm font-medium text-center ${
                    message.includes('✅') 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Creation Form Modal */}
          {showUserForm && (
            <div className="ultra-modern-card p-10 max-w-4xl mx-auto">
              <div className="flex items-center space-x-6 mb-8">
                <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-2xl">
                  <UserPlus className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold neon-text mb-2">Создание пользователя</h2>
                  <p className="text-lg text-muted-foreground">
                    Заполните форму для добавления нового пользователя
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => handleFocus('username')}
                      onBlur={(e) => handleBlur('username', e.target.value)}
                      placeholder="Введите имя пользователя"
                      required
                      className="beautiful-input"
                    />
                    <label 
                      htmlFor="username" 
                      className={`beautiful-label ${focusStates.username || username ? 'active' : ''}`}
                    >
                      Имя пользователя *
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleFocus('email')}
                      onBlur={(e) => handleBlur('email', e.target.value)}
                      placeholder="user@example.com"
                      className="beautiful-input"
                    />
                    <label 
                      htmlFor="email" 
                      className={`beautiful-label ${focusStates.email || email ? 'active' : ''}`}
                    >
                      Email адрес
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => handleFocus('firstName')}
                      onBlur={(e) => handleBlur('firstName', e.target.value)}
                      placeholder="Введите имя"
                      className="beautiful-input"
                    />
                    <label 
                      htmlFor="firstName" 
                      className={`beautiful-label ${focusStates.firstName || firstName ? 'active' : ''}`}
                    >
                      Имя
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => handleFocus('lastName')}
                      onBlur={(e) => handleBlur('lastName', e.target.value)}
                      placeholder="Введите фамилию"
                      className="beautiful-input"
                    />
                    <label 
                      htmlFor="lastName" 
                      className={`beautiful-label ${focusStates.lastName || lastName ? 'active' : ''}`}
                    >
                      Фамилия
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => handleFocus('password')}
                      onBlur={(e) => handleBlur('password', e.target.value)}
                      placeholder="Создайте надежный пароль"
                      required
                      className="beautiful-input"
                    />
                    <label 
                      htmlFor="password" 
                      className={`beautiful-label ${focusStates.password || password ? 'active' : ''}`}
                    >
                      Пароль *
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <input
                      id="roles"
                      type="text"
                      value={userRoles}
                      onChange={(e) => setUserRoles(e.target.value)}
                      onFocus={() => handleFocus('roles')}
                      onBlur={(e) => handleBlur('roles', e.target.value)}
                      placeholder="user, admin, developer"
                      className="beautiful-input"
                    />
                    <label 
                      htmlFor="roles" 
                      className={`beautiful-label ${focusStates.roles || userRoles ? 'active' : ''}`}
                    >
                      Роли пользователя
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button 
                    type="submit" 
                    disabled={creating}
                    className="modern-button-primary px-8 h-14 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <>
                        <Activity className="h-5 w-5 mr-3 animate-spin" />
                        Создаем пользователя...
                      </>
                    ) : (
                      <>
                        <Star className="h-5 w-5 mr-3" />
                        Создать пользователя
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="px-8 h-14 text-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <div className="modern-dashboard-card p-6 border-red-500/50">
              <div className="flex items-center space-x-3 text-red-400">
                <Activity className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}


