// Скрипт для отладки API статистики
// Запустите этот код в консоли браузера на странице http://localhost:8080

console.log('=== DEBUG STATISTICS API ===');

// 1. Проверяем токен
const token = localStorage.getItem('kubeatlas_token');
console.log('Token exists:', !!token);
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expired:', new Date(payload.exp * 1000) < new Date());
  } catch (e) {
    console.log('Token parse error:', e);
  }
}

// 2. Тестируем API статистики
async function testStatisticsAPI() {
  try {
    console.log('\n--- Testing Statistics API ---');
    
    const response = await fetch('http://localhost:3001/api/v1/statistics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success && data.data) {
      console.log('✅ Statistics API working!');
      console.log('Total users:', data.data.total_users);
      console.log('Active sessions:', data.data.active_sessions);
      console.log('System status:', data.data.system_status);
    } else {
      console.log('❌ Statistics API error:', data.error || data.message);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error);
  }
}

// 3. Тестируем другие API
async function testOtherAPIs() {
  try {
    console.log('\n--- Testing Other APIs ---');
    
    // Тест профиля пользователя
    const profileResponse = await fetch('http://localhost:3001/api/v1/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Profile API status:', profileResponse.status);
    const profileData = await profileResponse.json();
    console.log('Profile data:', profileData);
    
    // Тест ролей пользователя
    const rolesResponse = await fetch('http://localhost:3001/api/v1/user/roles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Roles API status:', rolesResponse.status);
    const rolesData = await rolesResponse.json();
    console.log('Roles data:', rolesData);
    
  } catch (error) {
    console.log('❌ Other APIs error:', error);
  }
}

// 4. Проверяем Keycloak
function checkKeycloak() {
  console.log('\n--- Checking Keycloak ---');
  
  if (window.keycloak) {
    console.log('Keycloak instance:', window.keycloak);
    console.log('Authenticated:', window.keycloak.authenticated);
    console.log('Token:', window.keycloak.token);
    console.log('Token parsed:', window.keycloak.tokenParsed);
  } else {
    console.log('❌ Keycloak not found in window');
  }
}

// Запускаем все тесты
async function runAllTests() {
  checkKeycloak();
  await testStatisticsAPI();
  await testOtherAPIs();
}

// Автоматически запускаем тесты
runAllTests();

console.log('\n=== END DEBUG ===');
