import { useState } from 'react'
import { userService, type CreateUserRequest } from '../../../shared/lib/api/userService'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { Activity, UserPlus, Star, X, AlertCircle } from 'lucide-react'

interface CreateUserPopupProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateUserPopup = ({ isOpen, onClose }: CreateUserPopupProps) => {
  const { t } = useLocale()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userRoles, setUserRoles] = useState('user')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setConfirmPassword('')
    setUserRoles('user')
    setValidationErrors([])
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setMessage(null)
    setValidationErrors([])
    
    try {
      // Подготавливаем данные для отправки
      const userData: CreateUserRequest = {
        username: username.trim(),
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password: password,
        roles: userRoles.split(',').map(s => s.trim()).filter(Boolean)
      }

      // Валидация данных
      const errors = userService.validateUserData(userData)
      
      // Проверка совпадения паролей
      if (password !== confirmPassword) {
        errors.push('Passwords do not match')
      }
      
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }

      console.log('Sending user data:', userData)
      
      const response = await userService.createUser(userData)
      console.log('User creation response:', response)
      
      setMessage(t('user_created_success'))
      
      // Reset form
      resetForm()
      
      // Close popup after 3 seconds
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 3000)
    } catch (e: any) {
      console.error('Error creating user:', e)
      const errorMessage = userService.formatApiError(e)
      setMessage(`❌ ${errorMessage}`)
    } finally {
      setCreating(false)
    }
  }

  const handleClose = () => {
    setMessage(null)
    setValidationErrors([])
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{t('create_user_popup')}</h3>
              <p className="text-sm text-slate-400">{t('add_new_user')}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">{t('validation_errors')}</span>
            </div>
            <ul className="text-sm text-red-300 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

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
              {t('username')} *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('enter_username_placeholder')}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              {t('email_address')} *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enter_email_placeholder')}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label 
                htmlFor="firstName" 
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                {t('first_name')} *
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('enter_first_name_placeholder')}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label 
                htmlFor="lastName" 
                className="block text-sm font-medium text-slate-400 mb-2"
              >
                {t('last_name')} *
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('enter_last_name_placeholder')}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              {t('password')} *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('create_strong_password')}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              {t('confirm_password')} *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('repeat_password')}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label 
              htmlFor="roles" 
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              {t('user_roles')}
            </label>
            <select
              id="roles"
              value={userRoles}
              onChange={(e) => setUserRoles(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="user">{t('user_role')}</option>
              <option value="admin">{t('admin_role')}</option>
              <option value="guest">Guest</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              {t('roles_help')}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              disabled={creating}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {creating ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>{t('creating')}</span>
                </>
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  <span>{t('create_user_button')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}