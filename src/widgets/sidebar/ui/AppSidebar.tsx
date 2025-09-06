import { Users, LogOut, Shield, Activity, Settings, Crown, Sparkles, User, X } from 'lucide-react'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet } from '../../../shared/lib/api/client'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { UserInfo } from '../../user-info'

interface Profile { id: string; username: string; email?: string; firstName?: string; lastName?: string }

export function AppSidebar() {
  const { logout } = useAuthContext()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false)
  const { t } = useLocale()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        console.log('Loading user profile and roles...')
        const [p, r] = await Promise.all([
          apiGet<Profile>('/user/profile'),
          apiGet<{ roles: string[] }>('/user/roles')
        ])
        if (!mounted) return
        console.log('Profile loaded:', p)
        console.log('Roles loaded:', r.roles)
        setProfile(p)
        setRoles(r.roles)
      } catch (e: any) {
        console.error('Error loading profile:', e)
        // Не показываем ошибку пользователю, просто оставляем логотип
      }
    })()
    return () => { mounted = false }
  }, [])

  // Handle Escape key to close popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isUserPopupOpen) {
        setIsUserPopupOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isUserPopupOpen])

  return (
    <>
      <div className="h-screen flex flex-col mx-2 my-2 space-y-4">
        {/* Component 1: User Profile - Clickable */}
        <div 
          className="unified-card p-6 flex-shrink-0 cursor-pointer hover:bg-slate-800/50 transition-colors"
          onClick={() => profile && setIsUserPopupOpen(true)}
        >
          {profile ? (
            <div className="flex items-center gap-3">
              <div className="icon-container-small">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm text-white">
                {profile.username} • {roles.includes('admin') ? 'admin' : roles[0] || 'user'}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="icon-container">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="header-title text-lg">KubeAtlas</div>
                <div className="header-subtitle text-xs">Kubernetes Manager</div>
              </div>
            </div>
          )}
        </div>
      
      {/* Component 2: Navigation Buttons */}
      <div className="unified-card p-4 flex-1 overflow-y-auto">
        <div className="space-y-3">
          <div className="card-subtitle mb-6 flex items-center">
            <Sparkles className="h-3 w-3 mr-2" />
            {t('management')}
          </div>
          
          <div className="space-y-3">
            <div className="unified-nav-item">
              <div className="icon-container-small">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium text-white">{t('users')}</span>
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
            
            <div className="unified-nav-item opacity-50 cursor-not-allowed">
              <div className="icon-container-small">
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <span className="font-medium text-white">{t('security')}</span>
              <div className="ml-auto text-xs text-slate-400">{t('soon')}</div>
            </div>
            
            <div className="unified-nav-item opacity-50 cursor-not-allowed">
              <div className="icon-container-small">
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium text-white">{t('monitoring')}</span>
              <div className="ml-auto text-xs text-slate-400">{t('soon')}</div>
            </div>
            
            <div className="unified-nav-item opacity-50 cursor-not-allowed">
              <div className="icon-container-small">
                <Settings className="h-4 w-4 text-orange-400" />
              </div>
              <span className="font-medium text-white">{t('settings')}</span>
              <div className="ml-auto text-xs text-slate-400">{t('soon')}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Component 3: Logout Button */}
      <div className="unified-card p-4 flex-shrink-0">
        <div 
          className="unified-nav-item hover:bg-red-500/20"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        >
          <div className="icon-container-small bg-red-500/20">
            <LogOut className="h-4 w-4 text-red-400" />
          </div>
          <span className="font-medium text-white">{t('logout')}</span>
        </div>
      </div>
      </div>

      {/* User Info Popup */}
      {isUserPopupOpen && (
        <div 
          className="popup-overlay flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsUserPopupOpen(false)
            }
          }}
        >
          <div className="popup-content max-w-md w-full">
            <div className="unified-card p-6 relative">
              <button
                onClick={() => setIsUserPopupOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <UserInfo />
            </div>
          </div>
        </div>
      )}
    </>
  )
}


