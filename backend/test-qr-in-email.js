/**
 * Test QR Code Display in Email HTML
 * This creates a sample email HTML and tests if QR renders
 */
require('dotenv').config();
const { sendEmail, emailTemplates } = require('./src/config/email');

async function testQRInEmail() {
  console.log('🧪 Testing QR Code in Email...\n');

  // Sample QR code (small 50x50 PNG as data URL for testing)
  const sampleQR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC';

  console.log('📋 QR Code Info:');
  console.log('   Format:', sampleQR.substring(0, 30) + '...');
  console.log('   Length:', sampleQR.length, 'chars');
  console.log('   Size:', (sampleQR.length / 1024).toFixed(2), 'KB');
  console.log('');

  // Create sample ticket data
  const ticketData = {
    bookingCode: 'TEST-BOOKING-123',
    ticketCode: 'TEST-TICKET-456',
    passengerName: 'Test User',
    routeName: 'Hà Nội - TP.HCM',
    departureTime: '08:00, 21/11/2025',
    pickupPoint: 'Bến xe Mỹ Đình',
    seatNumbers: 'A1, A2',
    totalPrice: '500,000 VNĐ',
    qrCodeImage: sampleQR, // ← This is the QR
    ticketUrl: 'http://localhost:3000/tickets/TEST',
    operatorName: 'Test Bus Company',
    operatorPhone: '0123456789',
    operatorEmail: 'test@example.com',
  };

  console.log('🔍 Testing with sample data:');
  console.log('   Booking Code:', ticketData.bookingCode);
  console.log('   QR Code provided:', !!ticketData.qrCodeImage);
  console.log('');

  // Generate email template
  const emailTemplate = emailTemplates.ticketConfirmation(ticketData);

  console.log('📧 Email Template Generated:');
  console.log('   Subject:', emailTemplate.subject);
  console.log('   HTML Length:', emailTemplate.html.length, 'chars');
  console.log('');

  // Check if QR is in HTML
  const hasQRInHTML = emailTemplate.html.includes(sampleQR);
  console.log('✅ QR Code in HTML:', hasQRInHTML ? 'YES ✅' : 'NO ❌');

  if (!hasQRInHTML) {
    console.error('❌ ERROR: QR code not found in email HTML!');
    console.log('');
    console.log('Looking for qrCodeImage references...');
    const qrRefs = emailTemplate.html.match(/qrCodeImage/g);
    if (qrRefs) {
      console.log('Found', qrRefs.length, 'references to qrCodeImage');
    } else {
      console.log('No qrCodeImage references found!');
    }
    process.exit(1);
  }

  console.log('');
  console.log('📤 Sending test email...');
  console.log('   To:', process.env.EMAIL_USER || 'your-email@gmail.com');
  console.log('   DEMO_MODE:', process.env.DEMO_MODE);
  console.log('');

  try {
    const result = await sendEmail({
      to: process.env.EMAIL_USER || 'test@example.com',
      subject: '🧪 TEST: QR Code Display in Email',
      html: emailTemplate.html,
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.messageId);
    console.log('');
    console.log('📬 Check your inbox:', process.env.EMAIL_USER);
    console.log('');
    console.log('⚠️  If QR does not display in email:');
    console.log('   1. Click "Display images" in Gmail');
    console.log('   2. Check if email is in HTML mode (not Plain Text)');
    console.log('   3. Try different email client (Gmail web, mobile app)');
    console.log('   4. Check spam/junk folder');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    process.exit(1);
  }
}

testQRInEmail();
