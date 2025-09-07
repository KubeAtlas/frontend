import React from 'react'
import { Users } from 'lucide-react'
import { useLocale } from '../../../shared/lib/locale/LocaleContext'
import { SessionsTable } from '../../sessions-table'

interface UserSessionManagerProps {
  userId: string
  username: string
  onClose?: () => void
}

export const UserSessionManager: React.FC<UserSessionManagerProps> = ({
  userId,
  username,
  onClose
}) => {
  const { t } = useLocale()
  return (
    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t('session_management')}</h3>
            <p className="text-sm text-slate-400">{t('user_colon')} {username}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-white text-xl font-bold"
            title={t('close')}
          >
            ×
          </button>
        )}
      </div>

      {/* Sessions Table */}
      <SessionsTable 
        userId={userId}
        onSessionRevoked={() => {
          console.log('Сессия удалена для пользователя:', username)
        }}
      />
    </div>
  )
}