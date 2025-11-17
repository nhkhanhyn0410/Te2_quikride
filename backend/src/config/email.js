const nodemailer = require('nodemailer');

// Email transporter configuration
let transporter;

const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    // SendGrid configuration
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.EMAIL_SERVICE === 'gmail') {
    // Gmail configuration (for development)
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Default SMTP configuration
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
};

/**
 * Send email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @returns {Promise<object>} - Email send result
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      transporter = createTransporter();
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Email templates
 */
const emailTemplates = {
  // Welcome email template
  welcome: (name) => ({
    subject: 'Chào mừng đến với QuikRide!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Chào mừng đến với QuikRide!</h1>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại QuikRide. Chúng tôi rất vui được phục vụ bạn!</p>
        <p>Bạn có thể bắt đầu tìm kiếm và đặt vé xe ngay bây giờ.</p>
        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Khám phá ngay
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Trân trọng,<br>
          Đội ngũ QuikRide
        </p>
      </div>
    `,
  }),

  // Email verification template
  emailVerification: (name, token) => ({
    subject: 'Xác thực email - QuikRide',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Xác thực email của bạn</h1>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Xác thực email
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Link xác thực có hiệu lực trong 24 giờ.
        </p>
        <p style="margin-top: 10px; color: #666; font-size: 14px;">
          Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
        </p>
      </div>
    `,
  }),

  // Password reset template
  passwordReset: (name, resetUrl) => ({
    subject: 'Đặt lại mật khẩu - QuikRide',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Đặt lại mật khẩu</h1>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Đặt lại mật khẩu
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Link đặt lại mật khẩu có hiệu lực trong 1 giờ.
        </p>
        <p style="margin-top: 10px; color: #666; font-size: 14px;">
          Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        </p>
      </div>
    `,
  }),
};

module.exports = {
  sendEmail,
  emailTemplates,
};
