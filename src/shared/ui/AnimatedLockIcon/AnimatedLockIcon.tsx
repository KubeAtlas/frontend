import React, { useState, useEffect } from 'react'

interface AnimatedLockIconProps {
  isUnlocked: boolean
  onAnimationComplete?: () => void
}

export const AnimatedLockIcon: React.FC<AnimatedLockIconProps> = ({ 
  isUnlocked, 
  onAnimationComplete 
}) => {
  const [animationPhase, setAnimationPhase] = useState<'locked' | 'unlocking' | 'unlocked' | 'checkmark'>('locked')

  useEffect(() => {
    if (isUnlocked) {
      // Фаза 1: Анимация открытия замочка
      setAnimationPhase('unlocking')
      
      // Фаза 2: Показать открытый замочек
      setTimeout(() => {
        setAnimationPhase('unlocked')
      }, 600)
      
      // Фаза 3: Показать галочку
      setTimeout(() => {
        setAnimationPhase('checkmark')
        onAnimationComplete?.()
      }, 1200)
    } else {
      setAnimationPhase('locked')
    }
  }, [isUnlocked, onAnimationComplete])

  const renderIcon = () => {
    switch (animationPhase) {
      case 'locked':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" 
              fill="white"
            />
          </svg>
        )
      
      case 'unlocking':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" 
              fill="white"
              style={{
                transform: 'rotateY(45deg)',
                transition: 'transform 0.6s ease-in-out'
              }}
            />
          </svg>
        )
      
      case 'unlocked':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" 
              fill="white"
              style={{
                opacity: 0.3,
                transition: 'opacity 0.3s ease'
              }}
            />
          </svg>
        )
      
      case 'checkmark':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
              fill="white"
              style={{
                animation: 'checkmarkAppear 0.5s ease-out'
              }}
            />
          </svg>
        )
      
      default:
        return null
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {renderIcon()}
      <style>{`
        @keyframes checkmarkAppear {
          0% {
            transform: scale(0) rotate(45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

