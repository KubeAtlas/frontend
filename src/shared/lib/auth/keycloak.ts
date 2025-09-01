import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'kubeatlas',
  clientId: 'kubeatlas-backend'
})

let isInitialized = false

export async function initAuth() {
  if (isInitialized) return true
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
    pkceMethod: 'S256'
  })
  isInitialized = true
  return authenticated
}

export async function ensureToken(minValiditySeconds = 30) {
  if (!keycloak.token) {
    console.error('No token available')
    throw new Error('No token available')
  }
  
  try {
    const refreshed = await keycloak.updateToken(minValiditySeconds)
    if (refreshed) {
      console.log('Token refreshed successfully')
    }
  } catch (error) {
    console.error('Failed to refresh token:', error)
    // Если не удалось обновить, пробуем продолжить с текущим (может быть ещё валиден)
  }
  
  if (!keycloak.token) {
    console.error('No token after update attempt')
    throw new Error('No token after update')
  }
  
  return keycloak.token
}

export async function loginWithPasswordGrant(params: { username: string; password: string }) {
  const body = new URLSearchParams()
  body.set('grant_type', 'password')
  body.set('client_id', 'kubeatlas-backend')
  body.set('client_secret', 'backend-secret-key')
  body.set('username', params.username)
  body.set('password', params.password)
  body.set('scope', 'openid profile email roles')

  const resp = await fetch('http://localhost:8081/realms/kubeatlas/protocol/openid-connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  if (!resp.ok) throw new Error(await resp.text())
  const data: any = await resp.json()

  if (!isInitialized) {
    const authenticated = await keycloak.init({
      token: data.access_token,
      refreshToken: data.refresh_token,
      checkLoginIframe: false,
      pkceMethod: 'S256',
      onLoad: 'check-sso'
    })
    if (!authenticated) throw new Error('Keycloak init failed')
    isInitialized = true
  } else {
    // Обновляем токены без повторного init, чтобы избежать ошибки
    ;(keycloak as any).token = data.access_token
    ;(keycloak as any).refreshToken = data.refresh_token
    ;(keycloak as any).idToken = data.id_token
  }
  return { accessToken: data.access_token as string }
}


