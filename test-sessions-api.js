// Тестовый скрипт для проверки API сессий
// Выполните в консоли браузера

console.log('=== TESTING SESSIONS API ===');

// Получаем токен
const token = localStorage.getItem('kubeatlas_token');
if (!token) {
  console.error('No token found! Please login first.');
} else {
  console.log('Token found, testing API...');
  
  // Тестируем эндпоинт сессий
  fetch('http://localhost:3001/api/v1/user/sessions', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Sessions API response status:', response.status);
    return response.text();
  })
  .then(text => {
    console.log('Sessions API raw response:', text);
    try {
      const data = JSON.parse(text);
      console.log('Sessions API parsed response:', data);
      console.log('Response type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      if (data.sessions) {
        console.log('Sessions field found:', data.sessions);
        console.log('Sessions is array:', Array.isArray(data.sessions));
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  })
  .catch(error => {
    console.error('Sessions API request failed:', error);
  });
}

console.log('=== END TEST ===');
