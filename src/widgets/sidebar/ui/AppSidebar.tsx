import { Users, LogOut, Shield, Activity, Settings, Crown, Sparkles } from 'lucide-react'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet } from '../../../shared/lib/api/client'

interface Profile { id: string; username: string; email?: string; firstName?: string; lastName?: string }

export function AppSidebar() {
  const { logout } = useAuthContext()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])

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

  return (
    <div className="h-screen flex flex-col mx-2 my-2 space-y-4">
      {/* Component 1: User Profile */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 flex-shrink-0">
        {profile ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-white">
              {profile.username} • {roles.includes('admin') ? 'admin' : roles[0] || 'user'}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-white">KubeAtlas</div>
              <div className="text-xs text-slate-400">Kubernetes Manager</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Component 2: Navigation Buttons */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4 flex-1 overflow-y-auto">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 mb-6 flex items-center">
            <Sparkles className="h-3 w-3 mr-2" />
            MANAGEMENT
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium text-white">Users</span>
              <div className="ml-auto">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-xl opacity-50 cursor-not-allowed">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <span className="font-medium text-white">Security</span>
              <div className="ml-auto text-xs text-slate-400">Soon</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-xl opacity-50 cursor-not-allowed">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium text-white">Monitoring</span>
              <div className="ml-auto text-xs text-slate-400">Soon</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-xl opacity-50 cursor-not-allowed">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Settings className="h-4 w-4 text-orange-400" />
              </div>
              <span className="font-medium text-white">Settings</span>
              <div className="ml-auto text-xs text-slate-400">Soon</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Component 3: Logout Button */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4 flex-shrink-0">
        <div 
          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 cursor-pointer transition-colors"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        >
          <div className="p-2 rounded-lg bg-red-500/20">
            <LogOut className="h-4 w-4 text-red-400" />
          </div>
          <span className="font-medium text-white">Logout</span>
        </div>
      </div>
    </div>
  )
}


