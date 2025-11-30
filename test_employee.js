const axios = require('axios');

async function testEmployeeFlow() {
  try {
    console.log('=== Testing Employee Login ===');
    
    // 1. Login employee first
    const loginResponse = await axios.post('http://localhost:5000/api/v1/employees/login', {
      employeeCode: 'EMP001', // Thay bằng employee code thực tế
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login Success:', loginResponse.data);
    const token = loginResponse.data.data.token;
    
    console.log('\n=== Testing My Trips ===');
    
    // 2. Get my trips with token
    const tripsResponse = await axios.get('http://localhost:5000/api/v1/employees/my-trips', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('My Trips Success:', tripsResponse.data);
    
  } catch (error) {
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Error message:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n=== Debugging 401 Error ===');
      console.log('Request headers:', error.config?.headers);
    }
  }
}

testEmployeeFlow();