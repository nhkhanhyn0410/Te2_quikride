#!/usr/bin/env node
/**
 * Auto-fix all buses without seatLayout
 */

const mongoose = require('mongoose');
const path = require('path');

// Load environment from backend
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quikride';

// Simple schemas
const SeatLayoutSchema = new mongoose.Schema({
  floors: Number,
  rows: Number,
  columns: Number,
  layout: [[String]],
  totalSeats: Number,
}, { _id: false });

const BusSchema = new mongoose.Schema({
  operatorId: mongoose.Schema.Types.ObjectId,
  busNumber: String,
  busType: { type: String, enum: ['limousine', 'sleeper', 'seater', 'double_decker'] },
  seatLayout: SeatLayoutSchema,
  status: String,
}, { collection: 'buses', timestamps: true });

const Bus = mongoose.model('Bus', BusSchema);

const LAYOUTS = {
  limousine: {
    floors: 1, rows: 4, columns: 2,
    layout: [['1','2'],['3','4'],['5','6'],['7','8']],
    totalSeats: 8
  },
  sleeper: {
    floors: 1, rows: 6, columns: 3,
    layout: [['1','2','3'],['4','5','6'],['7','8','9'],['10','11','12'],['13','14','15'],['16','17','18']],
    totalSeats: 18
  },
  seater: {
    floors: 1, rows: 10, columns: 5,
    layout: [['1','2','','3','4'],['5','6','','7','8'],['9','10','','11','12'],['13','14','','15','16'],['17','18','','19','20'],['21','22','','23','24'],['25','26','','27','28'],['29','30','','31','32'],['33','34','','35','36'],['37','38','','39','40']],
    totalSeats: 40
  },
  double_decker: {
    floors: 2, rows: 8, columns: 5,
    layout: [['1','2','','3','4'],['5','6','','7','8'],['9','10','','11','12'],['13','14','','15','16'],['17','18','','19','20'],['21','22','','23','24'],['25','26','','27','28'],['29','30','','31','32']],
    totalSeats: 32
  }
};

async function fixAllBuses() {
  console.log('🔌 Connecting to:', MONGODB_URI);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const buses = await Bus.find({});
    console.log(`📊 Found ${buses.length} buses\n`);

    if (buses.length === 0) {
      console.log('⚠️  No buses in database. Create buses first!\n');
      await mongoose.connection.close();
      return;
    }

    let fixed = 0, valid = 0, failed = 0;

    for (const bus of buses) {
      const needsFix = !bus.seatLayout || !bus.seatLayout.totalSeats;

      console.log(`🚌 ${bus.busNumber} (${bus.busType})`);

      if (!needsFix) {
        console.log(`   ✅ Valid: ${bus.seatLayout.totalSeats} seats`);
        valid++;
        continue;
      }

      console.log(`   ❌ Missing seatLayout`);

      const layout = LAYOUTS[bus.busType];
      if (!layout) {
        console.log(`   ⚠️  Unknown type: ${bus.busType}`);
        failed++;
        continue;
      }

      bus.seatLayout = layout;
      await bus.save();
      console.log(`   ✅ FIXED: ${layout.totalSeats} seats`);
      fixed++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Valid: ${valid} | ⚡ Fixed: ${fixed} | ❌ Failed: ${failed}`);
    console.log('='.repeat(60) + '\n');

    if (fixed > 0) {
      console.log('🎉 All buses fixed! You can now create trips without errors.\n');
    }

    await mongoose.connection.close();
    console.log('🔌 Disconnected\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllBuses();
