require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUsers() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quikride';
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('email phone fullName createdAt');

    console.log('\n=== USERS IN DATABASE ===');
    console.log('Total users:', users.length);
    console.log('\nUser list:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Phone: ${user.phone}, Name: ${user.fullName}, Created: ${user.createdAt}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
