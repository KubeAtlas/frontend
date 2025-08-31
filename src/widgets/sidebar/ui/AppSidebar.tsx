import { Users, LogOut, Shield, Activity, Settings, Crown, Sparkles } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../../shared/ui/sidebar'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

export function AppSidebar() {
  const { logout } = useAuthContext()
  const navigate = useNavigate()

  return (
    <div className="modern-sidebar">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-3 p-6 border-b border-white/10">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg glow-text">KubeAtlas</div>
              <div className="text-xs text-muted-foreground">Kubernetes Manager</div>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <div className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="text-xs font-semibold text-blue-400 mb-4 flex items-center">
                  <Sparkles className="h-3 w-3 mr-2" />
                  УПРАВЛЕНИЕ
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <div className="space-y-2">
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <div className="modern-sidebar-button group">
                          <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                            <Users className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="font-medium">Пользователи</span>
                          <div className="ml-auto">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <div className="modern-sidebar-button group opacity-50 cursor-not-allowed">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <Shield className="h-4 w-4 text-purple-400" />
                          </div>
                          <span className="font-medium">Безопасность</span>
                          <div className="ml-auto text-xs text-muted-foreground">Скоро</div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <div className="modern-sidebar-button group opacity-50 cursor-not-allowed">
                          <div className="p-2 rounded-lg bg-emerald-500/20">
                            <Activity className="h-4 w-4 text-emerald-400" />
                          </div>
                          <span className="font-medium">Мониторинг</span>
                          <div className="ml-auto text-xs text-muted-foreground">Скоро</div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <div className="modern-sidebar-button group opacity-50 cursor-not-allowed">
                          <div className="p-2 rounded-lg bg-orange-500/20">
                            <Settings className="h-4 w-4 text-orange-400" />
                          </div>
                          <span className="font-medium">Настройки</span>
                          <div className="ml-auto text-xs text-muted-foreground">Скоро</div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="p-4 border-t border-white/10">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <div 
                    className="modern-sidebar-button group hover:bg-red-500/20 cursor-pointer"
                    onClick={() => {
                      logout()
                      navigate('/login', { replace: true })
                    }}
                  >
                    <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                      <LogOut className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="font-medium">Выйти</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}


