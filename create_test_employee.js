const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Import models
const BusOperator = require('./backend/src/models/BusOperator');
const Employee = require('./backend/src/models/Employee');

async function createTestEmployee() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Tạo hoặc tìm operator
    let operator = await BusOperator.findOne({ email: 'test@operator.com' });
    
    if (!operator) {
      console.log('Creating test operator...');
      operator = await BusOperator.create({
        companyName: 'Test Bus Company',
        email: 'test@operator.com',
        phone: '0123456789',
        password: 'password123',
        businessLicense: 'BL123456',
        address: 'Test Address',
        contactPerson: 'Test Manager'
      });
      console.log('Test operator created:', operator._id);
    } else {
      console.log('Test operator found:', operator._id);
    }

    // 2. Tạo test employee
    let employee = await Employee.findOne({ employeeCode: 'EMP001' });
    
    if (!employee) {
      console.log('Creating test employee...');
      employee = await Employee.create({
        operatorId: operator._id,
        employeeCode: 'EMP001',
        fullName: 'Test Driver',
        phone: '0987654321',
        email: 'driver@test.com',
        password: 'password123',
        role: 'driver',
        licenseNumber: 'DL123456',
        licenseClass: 'D',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        status: 'active'
      });
      console.log('Test employee created:', employee._id);
    } else {
      console.log('Test employee found:', employee._id);
    }

    // 3. Tạo trip manager
    let tripManager = await Employee.findOne({ employeeCode: 'TM001' });
    
    if (!tripManager) {
      console.log('Creating test trip manager...');
      tripManager = await Employee.create({
        operatorId: operator._id,
        employeeCode: 'TM001',
        fullName: 'Test Trip Manager',
        phone: '0987654322',
        email: 'manager@test.com',
        password: 'password123',
        role: 'trip_manager',
        status: 'active'
      });
      console.log('Test trip manager created:', tripManager._id);
    } else {
      console.log('Test trip manager found:', tripManager._id);
    }

    console.log('\n=== Test Data Created ===');
    console.log('Operator ID:', operator._id);
    console.log('Driver - Code: EMP001, Password: password123');
    console.log('Trip Manager - Code: TM001, Password: password123');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestEmployee();