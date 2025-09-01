import { useState } from 'react'
import { apiPost } from '../../../shared/lib/api/client'
import { Activity, UserPlus, Star, X } from 'lucide-react'

interface CreateUserPopupProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateUserPopup = ({ isOpen, onClose }: CreateUserPopupProps) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [userRoles, setUserRoles] = useState('user')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setMessage(null)
    try {
      // Подготавливаем данные для отправки
      const userData = {
        username: username.trim(),
        email: email.trim() || undefined,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        password: password,
        roles: userRoles.split(',').map(s => s.trim()).filter(Boolean)
      }

      // Удаляем пустые поля
      Object.keys(userData).forEach(key => {
        if (userData[key as keyof typeof userData] === undefined || userData[key as keyof typeof userData] === '') {
          delete userData[key as keyof typeof userData]
        }
      })

      console.log('Sending user data:', userData)
      
      const response = await apiPost('/admin/users', userData)
      console.log('User creation response:', response)
      
      setMessage('✅ User created successfully! You can now login with these credentials.')
      
      // Reset form
      setUsername('')
      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')
      setUserRoles('user')
      
      // Close popup after 3 seconds
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 3000)
    } catch (e: any) {
      console.error('Error creating user:', e)
      let errorMessage = 'Error creating user'
      
      if (e?.message) {
        // Парсим сообщение об ошибке для более понятного отображения
        if (e.message.includes('HTTP 400')) {
          errorMessage = 'Invalid user data. Please check all fields.'
        } else if (e.message.includes('HTTP 401')) {
          errorMessage = 'Unauthorized. Please login again.'
        } else if (e.message.includes('HTTP 403')) {
          errorMessage = 'Access denied. Admin role required.'
        } else if (e.message.includes('HTTP 409')) {
          errorMessage = 'User already exists with this username or email.'
        } else if (e.message.includes('HTTP 500')) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = e.message
        }
      }
      
      setMessage(`❌ ${errorMessage}`)
    } finally {
      setCreating(false)
    }
  }

  const handleClose = () => {
    setMessage(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Create New User</h3>
              <p className="text-sm text-slate-400">Add a new user to the system</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium mb-4 ${
            message.includes('✅') 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Username *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="lastName" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="roles" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              User Roles
            </label>
            <input
              id="roles"
              type="text"
              value={userRoles}
              onChange={(e) => setUserRoles(e.target.value)}
              placeholder="user, admin, developer"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={creating}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {creating ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
