const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Import User model
const User = require('./backend/src/models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Count total users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    // Get all users (limit 10)
    const users = await User.find({}).limit(10).select('email phone fullName isActive isBlocked createdAt');
    console.log('\nUsers in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Phone: ${user.phone}, Name: ${user.fullName}, Active: ${user.isActive}, Blocked: ${user.isBlocked}`);
    });
    
    // Check if test user exists
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      console.log('\nTest user found:');
      console.log('Email:', testUser.email);
      console.log('Phone:', testUser.phone);
      console.log('Active:', testUser.isActive);
      console.log('Blocked:', testUser.isBlocked);
      console.log('Email verified:', testUser.isEmailVerified);
      console.log('Phone verified:', testUser.isPhoneVerified);
    } else {
      console.log('\nTest user (test@example.com) not found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkUsers();