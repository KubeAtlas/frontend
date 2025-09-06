import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'kubeatlas',
  clientId: 'kubeatlas-backend'
})

// Функции для сохранения и восстановления токенов
function saveTokens() {
  if (keycloak.token) {
    localStorage.setItem('kubeatlas_token', keycloak.token)
  }
  if (keycloak.refreshToken) {
    localStorage.setItem('kubeatlas_refresh_token', keycloak.refreshToken)
  }
  if (keycloak.idToken) {
    localStorage.setItem('kubeatlas_id_token', keycloak.idToken)
  }
}

function restoreTokens() {
  const token = localStorage.getItem('kubeatlas_token')
  const refreshToken = localStorage.getItem('kubeatlas_refresh_token')
  const idToken = localStorage.getItem('kubeatlas_id_token')
  
  if (token && refreshToken && idToken) {
    // Проверяем, не истек ли токен
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp > now) {
        console.log('Token is still valid, restoring...')
        // Восстанавливаем токены в Keycloak
        ;(keycloak as any).token = token
        ;(keycloak as any).refreshToken = refreshToken
        ;(keycloak as any).idToken = idToken
        ;(keycloak as any).authenticated = true
        ;(keycloak as any).tokenParsed = payload
        ;(keycloak as any).refreshTokenParsed = JSON.parse(atob(refreshToken.split('.')[1]))
        ;(keycloak as any).idTokenParsed = JSON.parse(atob(idToken.split('.')[1]))
        return true
      } else {
        console.log('Token expired, clearing...')
        clearTokens()
        return false
      }
    } catch (error) {
      console.log('Invalid token format, clearing...')
      clearTokens()
      return false
    }
  }
  return false
}

function clearTokens() {
  localStorage.removeItem('kubeatlas_token')
  localStorage.removeItem('kubeatlas_refresh_token')
  localStorage.removeItem('kubeatlas_id_token')
}

// Экспортируем функцию для использования в других модулях
export { clearTokens }

// Настройка обработчиков событий Keycloak
keycloak.onTokenExpired = () => {
  console.log('Token expired, attempting refresh...')
  // Для password grant мы не можем автоматически обновлять токены
  // Пользователь должен будет войти заново
  console.log('Token expired, user needs to login again')
  clearTokens()
}

keycloak.onAuthRefreshError = () => {
  console.log('Auth refresh error, clearing tokens...')
  clearTokens()
}

keycloak.onAuthLogout = () => {
  console.log('User logged out, clearing tokens...')
  clearTokens()
}

let isInitialized = false

export async function initAuth() {
  if (isInitialized) return keycloak.authenticated
  
  console.log('Initializing auth...')
  
  try {
    // Сначала пытаемся восстановить токены из localStorage
    console.log('Trying to restore tokens from localStorage...')
    const tokensRestored = restoreTokens()
    
    if (tokensRestored) {
      console.log('Tokens restored from localStorage')
      // Проверяем валидность токена
      try {
        const token = localStorage.getItem('kubeatlas_token')
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Math.floor(Date.now() / 1000)
          
          if (payload.exp && payload.exp > now + 60) { // 60 секунд буфер
            console.log('Restored token is valid, user is authenticated')
            isInitialized = true
            return true
          } else {
            console.log('Restored token is expired, clearing...')
            clearTokens()
          }
        }
      } catch (error) {
        console.log('Failed to validate restored token, clearing...')
        clearTokens()
      }
    }
    
    // Если не удалось восстановить токены, инициализируем Keycloak без токенов
    console.log('Initializing Keycloak without tokens...')
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    })
    
    console.log('Keycloak initialized, authenticated:', authenticated)
    
    if (authenticated) {
      console.log('User is authenticated, saving tokens...')
      saveTokens()
    }
    
    isInitialized = true
    return authenticated
  } catch (error) {
    console.error('Keycloak initialization failed:', error)
    isInitialized = true
    return false
  }
}

export async function ensureToken(minValiditySeconds = 30) {
  // Сначала проверяем токен в Keycloak
  if (keycloak.authenticated && keycloak.token) {
    try {
      const payload = JSON.parse(atob(keycloak.token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp > now + minValiditySeconds) {
        return keycloak.token
      } else {
        console.log('Keycloak token is expired, trying to update...')
        try {
          // Пытаемся обновить токен
          const refreshed = await keycloak.updateToken(minValiditySeconds)
          if (refreshed) {
            console.log('Token refreshed successfully')
            saveTokens()
            return keycloak.token
          } else {
            console.log('Failed to refresh token, clearing...')
            clearTokens()
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          clearTokens()
        }
      }
    } catch (error) {
      console.error('Failed to check Keycloak token validity:', error)
      clearTokens()
    }
  }
  
  // Если токен в Keycloak недоступен, проверяем localStorage
  const token = localStorage.getItem('kubeatlas_token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp > now + minValiditySeconds) {
        console.log('Using token from localStorage')
        return token
      } else {
        console.log('LocalStorage token is expired, trying to refresh...')
        try {
          // Пытаемся обновить токен через Keycloak
          if (keycloak.authenticated) {
            const refreshed = await keycloak.updateToken(minValiditySeconds)
            if (refreshed) {
              console.log('Token refreshed from localStorage')
              saveTokens()
              return keycloak.token
            }
          }
          console.log('Failed to refresh token, clearing...')
          clearTokens()
        } catch (error) {
          console.error('Failed to refresh token from localStorage:', error)
          clearTokens()
        }
      }
    } catch (error) {
      console.error('Failed to check localStorage token validity:', error)
      clearTokens()
    }
  }
  
  console.error('No valid token available - user not authenticated')
  throw new Error('No token available')
}

// Функция для проверки, авторизован ли пользователь
export function isAuthenticated() {
  // Проверяем Keycloak
  if (keycloak.authenticated && keycloak.token) {
    return true
  }
  
  // Проверяем localStorage
  const token = localStorage.getItem('kubeatlas_token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      return payload.exp && payload.exp > now
    } catch (error) {
      console.error('Failed to check localStorage token:', error)
      return false
    }
  }
  
  return false
}

// Функция для получения информации о токене
export function getTokenInfo() {
  if (!keycloak.token) return null
  
  try {
    const payload = JSON.parse(atob(keycloak.token.split('.')[1]))
    return {
      exp: payload.exp,
      iat: payload.iat,
      sub: payload.sub,
      username: payload.preferred_username || payload.username
    }
  } catch (error) {
    console.error('Failed to parse token:', error)
    return null
  }
}

export async function loginWithPasswordGrant(params: { username: string; password: string }) {
  console.log('loginWithPasswordGrant called with:', params.username)
  
  const body = new URLSearchParams()
  body.set('grant_type', 'password')
  body.set('client_id', 'kubeatlas-backend')
  body.set('client_secret', 'backend-secret-key')
  body.set('username', params.username)
  body.set('password', params.password)
  body.set('scope', 'openid profile email roles')

  console.log('Making token request to Keycloak...')
  const resp = await fetch('http://localhost:8081/realms/kubeatlas/protocol/openid-connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  
  if (!resp.ok) {
    const errorText = await resp.text()
    console.error('Keycloak token request failed:', resp.status, errorText)
    throw new Error(`HTTP ${resp.status}: ${errorText}`)
  }
  
  const data: any = await resp.json()
  console.log('Token received successfully')

  // Обновляем токены напрямую
  ;(keycloak as any).token = data.access_token
  ;(keycloak as any).refreshToken = data.refresh_token
  ;(keycloak as any).idToken = data.id_token
  ;(keycloak as any).authenticated = true
  
  // Парсим токены для правильной работы Keycloak
  try {
    ;(keycloak as any).tokenParsed = JSON.parse(atob(data.access_token.split('.')[1]))
    ;(keycloak as any).refreshTokenParsed = JSON.parse(atob(data.refresh_token.split('.')[1]))
    ;(keycloak as any).idTokenParsed = JSON.parse(atob(data.id_token.split('.')[1]))
  } catch (error) {
    console.error('Failed to parse tokens:', error)
  }
  
  // Сохраняем токены в localStorage
  saveTokens()
  
  if (!isInitialized) {
    isInitialized = true
  }
  
  console.log('Keycloak state updated, authenticated:', keycloak.authenticated)
  return { accessToken: data.access_token as string }
}


