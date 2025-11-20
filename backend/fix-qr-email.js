/**
 * Script to check and fix QR code in emails
 * This will help debug why QR codes don't show in emails
 */
require('dotenv').config();
const mongoose = require('mongoose');

async function checkQRCodes() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');

    const Ticket = mongoose.model('Ticket');
    
    console.log('📊 Analyzing tickets with QR codes...\n');
    
    const tickets = await Ticket.find({ qrCode: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .limit(5);

    if (tickets.length === 0) {
      console.log('❌ No tickets with QR codes found');
      process.exit(0);
    }

    console.log(`Found ${tickets.length} tickets with QR codes:\n`);

    for (const ticket of tickets) {
      console.log(`📋 Ticket: ${ticket.ticketCode}`);
      console.log(`   Created: ${ticket.createdAt}`);
      
      if (ticket.qrCode) {
        const qrLength = ticket.qrCode.length;
        const isDataUrl = ticket.qrCode.startsWith('data:image');
        const qrSizeKB = (qrLength / 1024).toFixed(2);
        
        console.log(`   ✅ QR Code exists`);
        console.log(`   📏 Size: ${qrSizeKB} KB (${qrLength} chars)`);
        console.log(`   📐 Format: ${isDataUrl ? 'Data URL ✅' : 'Invalid ❌'}`);
        
        if (isDataUrl) {
          const matches = ticket.qrCode.match(/^data:image\/(png|jpeg|jpg);base64,/);
          if (matches) {
            console.log(`   🖼️  Type: ${matches[1]}`);
          }
        }
        
        // Check size - Gmail has ~50KB limit for inline images
        if (qrLength > 50000) {
          console.log(`   ⚠️  WARNING: QR code is large (>${(50000/1024).toFixed(0)}KB), may not display in some email clients`);
        }
        
        // Show preview
        const preview = ticket.qrCode.substring(0, 60) + '...';
        console.log(`   Preview: ${preview}`);
      } else {
        console.log(`   ❌ No QR code`);
      }
      
      console.log('');
    }

    console.log('💡 Tips:');
    console.log('   1. QR codes should be data URLs: data:image/png;base64,...');
    console.log('   2. Keep QR size under 50KB for Gmail compatibility');
    console.log('   3. Use PNG format for better email client support');
    console.log('   4. If QR still not showing, check email client settings');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkQRCodes();
