// src/helpers/api-test.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8081';

export async function testEndpoints() {
  const endpoints = [
    '/',
    '/api',
    '/api/products',
    '/api/auth/login',
    '/api/auth/register',
    '/api/user/profile',
    '/api/order'
  ];

  console.log('Testing API endpoints:');
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error: any) {
      if (error.response) {
        console.log(`❌ ${endpoint}: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`❌ ${endpoint}: No response`);
      }
    }
  }
}

// Запустите эту функцию в браузере чтобы увидеть какие endpoints работают