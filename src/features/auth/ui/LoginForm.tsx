import { useState } from 'react'
import { Button, Input, Label, Badge } from '../../../shared/ui'
import { 
  EyeOpenIcon,
  EyeClosedIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons'

export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Временная заглушка - симулируем авторизацию
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (username === 'admin' && password === 'admin123') {
        alert(`🚀 Добро пожаловать в KubeAtlas, ${username}! Авторизация успешна!`)
      } else {
        setError('Неверные учетные данные')
      }
    } catch (err) {
      setError('Ошибка авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setUsername('admin')
    setPassword('admin123')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Добро пожаловать
          </h2>
          <p className="text-gray-300 text-sm">
            Войдите в систему для доступа к KubeAtlas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-200">
              Имя пользователя
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:bg-white/10 focus:border-blue-400/50"
              placeholder="Введите имя пользователя"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-200">
              Пароль
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:bg-white/10 focus:border-blue-400/50 pr-12"
                placeholder="Введите пароль"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-white/10"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeClosedIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOpenIcon className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            <div className="flex items-center justify-center space-x-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircledIcon className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Вход...' : 'Войти'}</span>
            </div>
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-400 text-sm text-center mb-3">
            Демо-доступ:
          </p>
          <div className="flex justify-center space-x-2">
            <Badge 
              variant="outline" 
              className="text-blue-400 border-blue-500/50 bg-blue-500/10 cursor-pointer hover:bg-blue-500/20"
              onClick={fillDemoCredentials}
            >
              admin
            </Badge>
            <Badge 
              variant="outline" 
              className="text-green-400 border-green-500/50 bg-green-500/10 cursor-pointer hover:bg-green-500/20"
              onClick={fillDemoCredentials}
            >
              admin123
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
