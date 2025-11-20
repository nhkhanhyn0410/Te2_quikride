/**
 * Test Email Script
 * Run: node test-email.js
 */
require('dotenv').config();
const { sendEmail } = require('./src/config/email');

async function testEmail() {
  console.log('🔍 Email Configuration:');
  console.log('  SERVICE:', process.env.EMAIL_SERVICE);
  console.log('  USER:', process.env.EMAIL_USER);
  console.log('  FROM:', process.env.EMAIL_FROM);
  console.log('  DEMO_MODE:', process.env.DEMO_MODE);
  console.log('');

  // Replace with your actual email
  const testEmail = process.env.EMAIL_USER || 'your-email@gmail.com';

  try {
    console.log(`📧 Sending test email to: ${testEmail}...`);

    await sendEmail({
      to: testEmail,
      subject: 'Test Email - QuikRide',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0ea5e9;">🎉 Email hoạt động!</h1>
          <p>Nếu bạn nhận được email này, nghĩa là cấu hình email đã <strong>thành công</strong>!</p>
          <hr style="margin: 30px 0;">
          <h2>Thông tin cấu hình:</h2>
          <ul>
            <li><strong>Email Service:</strong> ${process.env.EMAIL_SERVICE}</li>
            <li><strong>Email From:</strong> ${process.env.EMAIL_FROM}</li>
            <li><strong>Demo Mode:</strong> ${process.env.DEMO_MODE}</li>
          </ul>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Sent at: ${new Date().toLocaleString('vi-VN')}
          </p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('📬 Check your inbox:', testEmail);
    console.log('');
    console.log('⚠️  If you don\'t see it:');
    console.log('   1. Check SPAM folder');
    console.log('   2. Wait 1-2 minutes');
    console.log('   3. Check EMAIL_PASSWORD is correct');
    process.exit(0);
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    console.error('');
    console.error('Common issues:');
    console.error('  1. Wrong EMAIL_PASSWORD - Make sure you use App Password (16 chars)');
    console.error('  2. Wrong EMAIL_USER - Must be your full Gmail address');
    console.error('  3. 2-Step Verification not enabled on Gmail');
    console.error('  4. Network/firewall blocking port 587');
    process.exit(1);
  }
}

testEmail();
