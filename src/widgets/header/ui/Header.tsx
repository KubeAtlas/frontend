import { UserPlus, Crown } from 'lucide-react'
import { Button } from '../../../shared/ui/button'

interface HeaderProps {
  onCreateUser: () => void
}

export const Header = ({ onCreateUser }: HeaderProps) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
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

        {/* Create User Button */}
        <Button 
          onClick={onCreateUser}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Create User</span>
        </Button>
      </div>
    </header>
  )
}
