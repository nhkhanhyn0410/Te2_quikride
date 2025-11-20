/**
 * Test Resend Email with Real Ticket
 * Run: node test-resend-email.js <ticketCode>
 */
require('dotenv').config();
const mongoose = require('mongoose');
const TicketService = require('./src/services/ticket.service');

async function testResendEmail() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('');

    // Get ticket code from command line or use latest
    const ticketCodeArg = process.argv[2];

    console.log('🔍 Finding ticket...');
    const Ticket = mongoose.model('Ticket');
    
    let ticket;
    if (ticketCodeArg) {
      ticket = await Ticket.findOne({ ticketCode: ticketCodeArg });
      console.log(`   Looking for: ${ticketCodeArg}`);
    } else {
      ticket = await Ticket.findOne().sort({ createdAt: -1 });
      console.log('   Using latest ticket');
    }

    if (!ticket) {
      console.error('❌ No ticket found');
      console.log('');
      console.log('Usage: node test-resend-email.js [ticketCode]');
      console.log('Example: node test-resend-email.js TKT-20251120-ABC123');
      process.exit(1);
    }

    console.log('✅ Found ticket:', ticket.ticketCode);
    console.log('   Ticket ID:', ticket._id);
    console.log('   Booking ID:', ticket.bookingId);
    console.log('   QR Code exists:', !!ticket.qrCode);
    console.log('   QR Code length:', ticket.qrCode?.length || 0);
    console.log('   Email sent:', ticket.emailSent);
    console.log('');

    // Check QR code format
    if (ticket.qrCode) {
      const isBase64 = ticket.qrCode.startsWith('data:image');
      console.log('   QR Code format:', isBase64 ? 'Base64 Data URL ✅' : 'Invalid format ❌');
      if (isBase64) {
        const preview = ticket.qrCode.substring(0, 50) + '...';
        console.log('   Preview:', preview);
      }
    } else {
      console.error('   ⚠️  QR Code is empty!');
    }
    console.log('');

    console.log('📧 Resending email...');
    console.log('   DEMO_MODE:', process.env.DEMO_MODE);
    console.log('   EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('');

    const result = await TicketService.resendTicket(ticket._id.toString());

    console.log('✅ Result:', JSON.stringify(result, null, 2));
    console.log('');

    if (result.email.sent) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Check inbox for booking:', ticket.bookingId);
    } else if (result.email.demo) {
      console.log('📝 Demo mode - email not actually sent');
      console.log('   Set DEMO_MODE=false in .env to send real emails');
    } else {
      console.log('❌ Email failed:', result.email.error);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testResendEmail();
