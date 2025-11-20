/**
 * Script to fix buses without proper seatLayout
 *
 * Usage: node scripts/fix-bus-seat-layout.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Bus = require('../src/models/Bus');

async function fixBusSeatLayouts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quikride', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find all buses
    const buses = await Bus.find({});
    console.log(`\n📊 Found ${buses.length} buses in database\n`);

    let fixedCount = 0;
    let alreadyValidCount = 0;

    for (const bus of buses) {
      console.log(`\n🚌 Checking bus: ${bus.busNumber} (${bus.busType})`);

      // Check if seatLayout exists and is valid
      if (!bus.seatLayout || !bus.seatLayout.totalSeats) {
        console.log(`   ⚠️  Missing or invalid seatLayout`);

        // Create default seatLayout based on busType
        const defaultLayouts = {
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
            columns: 4,
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
            columns: 4,
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

        const defaultLayout = defaultLayouts[bus.busType];
        if (defaultLayout) {
          bus.seatLayout = defaultLayout;
          await bus.save();
          console.log(`   ✅ Applied default ${bus.busType} layout (${defaultLayout.totalSeats} seats)`);
          fixedCount++;
        } else {
          console.log(`   ❌ No default layout for type: ${bus.busType}`);
        }
      } else {
        console.log(`   ✅ seatLayout is valid (${bus.seatLayout.totalSeats} seats)`);
        alreadyValidCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   Total buses: ${buses.length}`);
    console.log(`   Already valid: ${alreadyValidCount}`);
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Failed: ${buses.length - alreadyValidCount - fixedCount}`);
    console.log('='.repeat(60) + '\n');

    await mongoose.connection.close();
    console.log('✅ Done! Connection closed.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
fixBusSeatLayouts();
