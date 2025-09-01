import { useEffect, useState } from 'react'

import { SidebarProvider } from '../../../shared/ui/sidebar'
import { AppSidebar } from '../../../widgets/sidebar'
import { CreateUserPopup } from '../../../widgets/create-user-popup'

import { UserPlus, Crown, Users, TrendingUp, Database, Sparkles, Activity } from 'lucide-react'





export const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [isCreateUserPopupOpen, setIsCreateUserPopupOpen] = useState(false)




  useEffect(() => {
    setLoading(false)
  }, [])



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
      <div className="min-h-screen flex bg-slate-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header with Logo, User Info and Create User Button */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">KubeAtlas</h1>
                  <p className="text-sm text-slate-400">Kubernetes Management Platform</p>
                </div>
              </div>

              {/* Database Status and Create User Button */}
              <div className="flex items-center space-x-6">
                {/* Database Status */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Database className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Database</p>
                    <p className="text-green-400 font-medium text-sm">Online</p>
                    <p className="text-slate-400 text-xs">Response time: 2ms</p>
                  </div>
                </div>

                {/* Create User Button */}
                <button 
                  onClick={() => setIsCreateUserPopupOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>
            </div>
          </div>
          
          <main className="flex-1 p-6 space-y-6">
            {/* Stats Cards - Vertical Layout */}
            <div className="space-y-4">
              {/* Total Users Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Users</p>
                    <p className="text-xl font-bold text-white">1,234</p>
                    <p className="text-green-400 text-xs">+12% from last month</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Active Sessions Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-green-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Active Sessions</p>
                    <p className="text-xl font-bold text-white">89</p>
                    <p className="text-green-400 text-xs">+5% from last hour</p>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Activity className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </div>

              {/* System Health Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">System Health</p>
                    <p className="text-xl font-bold text-white">98.5%</p>
                    <p className="text-green-400 text-xs">All systems operational</p>
                  </div>
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              </div>


            </div>




          </main>
          

        </div>
      </div>
      
      {/* Create User Popup */}
      <CreateUserPopup 
        isOpen={isCreateUserPopupOpen}
        onClose={() => setIsCreateUserPopupOpen(false)}
      />
    </SidebarProvider>
  )
}


