// Скрипт для отладки токенов в браузере
// Выполните в консоли браузера

console.log('=== DEBUG TOKENS ===');

// 1. Проверяем токены в localStorage
console.log('1. LocalStorage tokens:');
console.log('kubeatlas_token:', localStorage.getItem('kubeatlas_token'));
console.log('kubeatlas_refresh_token:', localStorage.getItem('kubeatlas_refresh_token'));
console.log('kubeatlas_id_token:', localStorage.getItem('kubeatlas_id_token'));

// 2. Проверяем состояние Keycloak
console.log('\n2. Keycloak state:');
console.log('Keycloak authenticated:', window.keycloak?.authenticated);
console.log('Keycloak token:', window.keycloak?.token);
console.log('Keycloak refreshToken:', window.keycloak?.refreshToken);

// 3. Анализируем токен
const token = localStorage.getItem('kubeatlas_token');
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = new Date(payload.exp * 1000);
    
    console.log('\n3. Token analysis:');
    console.log('Issuer:', payload.iss);
    console.log('Subject:', payload.sub);
    console.log('Expires at:', expiresAt.toLocaleString());
    console.log('Current time:', new Date().toLocaleString());
    console.log('Time until expiry:', Math.floor((payload.exp - now) / 60), 'minutes');
    console.log('Token valid:', payload.exp > now);
    
    // Проверяем роли
    if (payload.realm_access?.roles) {
      console.log('Roles:', payload.realm_access.roles);
    }
    
    // Проверяем ресурсы
    if (payload.resource_access) {
      console.log('Resource access:', Object.keys(payload.resource_access));
    }
    
  } catch (e) {
    console.error('Invalid token format:', e);
  }
} else {
  console.log('\n3. No token found in localStorage');
}

// 4. Проверяем API доступность
console.log('\n4. Testing API access...');
fetch('http://localhost:3001/api/v1/health')
  .then(response => {
    console.log('Health check status:', response.status);
    return response.text();
  })
  .then(text => console.log('Health check response:', text))
  .catch(error => console.error('Health check failed:', error));

// 5. Тестируем аутентифицированный запрос
if (token) {
  console.log('\n5. Testing authenticated request...');
  fetch('http://localhost:3001/api/v1/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Profile request status:', response.status);
    return response.text();
  })
  .then(text => console.log('Profile request response:', text))
  .catch(error => console.error('Profile request failed:', error));
}

console.log('\n=== END DEBUG ===');
