/**
 * Quick script to check and fix all buses without seatLayout
 * Run: node scripts/check-and-fix-buses.js
 */

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quikride';

// Define minimal Bus schema
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
  busType: String,
  seatLayout: SeatLayoutSchema,
  status: String,
}, { timestamps: true });

const Bus = mongoose.model('Bus', BusSchema);

// Default seat layouts
const DEFAULT_LAYOUTS = {
  limousine: {
    floors: 1,
    rows: 4,
    columns: 2,
    layout: [
      ['1', '2'],
      ['3', '4'],
      ['5', '6'],
      ['7', '8'],
    ],
    totalSeats: 8,
  },
  sleeper: {
    floors: 1,
    rows: 6,
    columns: 3,
    layout: [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['10', '11', '12'],
      ['13', '14', '15'],
      ['16', '17', '18'],
    ],
    totalSeats: 18,
  },
  seater: {
    floors: 1,
    rows: 10,
    columns: 5,
    layout: [
      ['1', '2', '', '3', '4'],
      ['5', '6', '', '7', '8'],
      ['9', '10', '', '11', '12'],
      ['13', '14', '', '15', '16'],
      ['17', '18', '', '19', '20'],
      ['21', '22', '', '23', '24'],
      ['25', '26', '', '27', '28'],
      ['29', '30', '', '31', '32'],
      ['33', '34', '', '35', '36'],
      ['37', '38', '', '39', '40'],
    ],
    totalSeats: 40,
  },
  double_decker: {
    floors: 2,
    rows: 8,
    columns: 5,
    layout: [
      ['1', '2', '', '3', '4'],
      ['5', '6', '', '7', '8'],
      ['9', '10', '', '11', '12'],
      ['13', '14', '', '15', '16'],
      ['17', '18', '', '19', '20'],
      ['21', '22', '', '23', '24'],
      ['25', '26', '', '27', '28'],
      ['29', '30', '', '31', '32'],
    ],
    totalSeats: 32,
  },
};

async function checkAndFixBuses() {
  try {
    console.log('🔌 Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all buses
    const allBuses = await Bus.find({});
    console.log(`📊 Total buses in database: ${allBuses.length}\n`);

    if (allBuses.length === 0) {
      console.log('⚠️  No buses found in database!');
      console.log('💡 You need to create buses first before creating trips.\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    let fixedCount = 0;
    let validCount = 0;

    for (const bus of allBuses) {
      const hasSeatLayout = bus.seatLayout && bus.seatLayout.totalSeats;

      console.log(`\n🚌 Bus: ${bus.busNumber} (${bus.busType})`);
      console.log(`   Status: ${bus.status || 'unknown'}`);

      if (hasSeatLayout) {
        console.log(`   ✅ Has valid seatLayout: ${bus.seatLayout.totalSeats} seats`);
        validCount++;
      } else {
        console.log(`   ❌ Missing seatLayout!`);

        const defaultLayout = DEFAULT_LAYOUTS[bus.busType];
        if (defaultLayout) {
          bus.seatLayout = defaultLayout;
          await bus.save();
          console.log(`   ✅ FIXED: Applied ${bus.busType} layout (${defaultLayout.totalSeats} seats)`);
          fixedCount++;
        } else {
          console.log(`   ⚠️  Unknown bus type: ${bus.busType}`);
        }
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY:');
    console.log(`   Total buses: ${allBuses.length}`);
    console.log(`   Already valid: ${validCount}`);
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Failed: ${allBuses.length - validCount - fixedCount}`);
    console.log('='.repeat(70) + '\n');

    if (fixedCount > 0) {
      console.log('✅ All buses fixed! You can now create trips.\n');
    } else if (validCount === allBuses.length) {
      console.log('✅ All buses already have valid seatLayout.\n');
    } else {
      console.log('⚠️  Some buses could not be fixed. Please check the bus types.\n');
    }

    await mongoose.connection.close();
    console.log('🔌 Connection closed.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run
checkAndFixBuses();
