const axios = require('axios');

async function testRegister() {
  try {
    console.log('Testing register API...');
    
    const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
      email: 'test@example.com',
      phone: '0123456789',
      password: 'Test123456',
      fullName: 'Test User'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Error message:', error.message);
  }
}

testRegister();