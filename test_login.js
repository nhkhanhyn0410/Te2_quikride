const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      identifier: 'nhkyn0410@gmail.com', // hoặc số điện thoại
      password: 'Test123456'
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
    
    if (error.response?.status === 401) {
      console.log('\n=== Lỗi 401 - Unauthorized ===');
      console.log('Có thể do:');
      console.log('1. Email/số điện thoại không tồn tại');
      console.log('2. Mật khẩu không đúng');
      console.log('3. Tài khoản bị khóa hoặc không hoạt động');
      console.log('4. Lỗi trong quá trình so sánh mật khẩu');
    }
  }
}

testLogin();