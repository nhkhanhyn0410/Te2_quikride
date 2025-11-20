/**
 * Enhanced Seed Script for QuikRide Database
 * Creates comprehensive sample data with journey tracking and stops
 *
 * Usage: node scripts/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const BusOperator = require('../src/models/BusOperator');
const Employee = require('../src/models/Employee');
const Route = require('../src/models/Route');
const Bus = require('../src/models/Bus');
const Trip = require('../src/models/Trip');
const Booking = require('../src/models/Booking');
const Ticket = require('../src/models/Ticket');

// Import seat layout utilities
const {
  generateLimousineLayout,
  generateAisleLayout,
  generateDoubleDecker,
} = require('../src/utils/seatLayout');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quikride', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Enhanced seed data with full journey tracking
const seedData = async () => {
  try {
    console.log('\n🌱 Starting to seed database with enhanced data...\n');

    // ==================== CLEAR ALL EXISTING DATA ====================
    console.log('🗑️  Clearing ALL existing data...');
    await User.deleteMany({});
    await BusOperator.deleteMany({});
    await Employee.deleteMany({});
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Trip.deleteMany({});
    await Booking.deleteMany({});
    await Ticket.deleteMany({});
    console.log('✅ Cleared all existing data\n');
    } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('👋 Database connection closed. Goodbye!\n');
  process.exit(0);
};

main();