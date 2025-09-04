import React, { useState } from 'react'
import { useLocale, type Locale } from '../../../shared/lib/locale/LocaleContext'

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'ru' as Locale, name: t('russian'), flag: '🇷🇺' },
    { code: 'en' as Locale, name: t('english'), flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          minWidth: '120px',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>{currentLanguage?.flag}</span>
          <span>{currentLanguage?.name}</span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay для закрытия при клике вне */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown меню */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '140px',
              zIndex: 100,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLocale(language.code)
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: locale === language.code ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (locale !== language.code) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (locale !== language.code) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: 'auto' }}
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
