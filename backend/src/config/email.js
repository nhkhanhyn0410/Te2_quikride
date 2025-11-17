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
 * @param {Array} options.attachments - Email attachments
 * @returns {Promise<object>} - Email send result
 */
const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
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
      attachments,
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

  // Ticket confirmation email template
  ticketConfirmation: (ticketData) => ({
    subject: `Vé xe của bạn - ${ticketData.bookingCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #0ea5e9; margin: 0; font-size: 28px;">QuikRide</h1>
            <p style="color: #64748b; margin: 5px 0; font-size: 14px;">Đặt vé xe khách trực tuyến</p>
          </div>

          <!-- Success Message -->
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 20px; font-size: 14px;">
              ✅ Đặt vé thành công
            </div>
          </div>

          <h2 style="color: #1e293b; margin-top: 30px;">Xin chào ${ticketData.passengerName}!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Cảm ơn bạn đã đặt vé tại QuikRide. Vé điện tử của bạn đã sẵn sàng!
          </p>

          <!-- Booking Info -->
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0ea5e9; margin-top: 0;">Thông tin đặt vé</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 40%;">Mã đặt chỗ:</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${ticketData.bookingCode}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Mã vé:</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${ticketData.ticketCode}</td>
              </tr>
            </table>
          </div>

          <!-- Trip Info -->
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3 style="color: #f59e0b; margin-top: 0;">Thông tin chuyến đi</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #78350f; width: 40%;">🚌 Tuyến:</td>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">${ticketData.routeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f;">🕐 Giờ đi:</td>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">${ticketData.departureTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f;">📍 Điểm đón:</td>
                <td style="padding: 8px 0; color: #78350f;">${ticketData.pickupPoint}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f;">💺 Ghế:</td>
                <td style="padding: 8px 0; color: #78350f; font-weight: bold;">${ticketData.seatNumbers}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78350f;">💰 Tổng tiền:</td>
                <td style="padding: 8px 0; color: #f59e0b; font-weight: bold; font-size: 18px;">${ticketData.totalPrice}</td>
              </tr>
            </table>
          </div>

          <!-- QR Code -->
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #1e293b;">Mã QR vé của bạn</h3>
            <p style="color: #64748b; font-size: 14px;">Vui lòng xuất trình mã QR này khi lên xe</p>
            <div style="background: white; display: inline-block; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 10px 0;">
              <img src="${ticketData.qrCodeImage}" alt="QR Code" style="width: 200px; height: 200px;" />
            </div>
          </div>

          <!-- Download Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ticketData.ticketUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              📥 Tải vé PDF
            </a>
          </div>

          <!-- Important Notes -->
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0; font-size: 14px;">⚠️ LƯU Ý QUAN TRỌNG:</h4>
            <ul style="color: #78350f; font-size: 13px; margin: 10px 0; padding-left: 20px;">
              <li style="margin: 5px 0;">Vui lòng có mặt trước 15 phút so với giờ khởi hành</li>
              <li style="margin: 5px 0;">Xuất trình mã QR hoặc vé PDF khi lên xe</li>
              <li style="margin: 5px 0;">Mang theo CMND/CCCD để đối chiếu</li>
              <li style="margin: 5px 0;">Liên hệ nhà xe nếu cần hỗ trợ</li>
            </ul>
          </div>

          <!-- Operator Contact -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
            <h4 style="color: #1e293b; margin-bottom: 10px;">Thông tin nhà xe:</h4>
            <p style="color: #475569; margin: 5px 0; font-size: 14px;">
              <strong>${ticketData.operatorName}</strong><br>
              📞 Hotline: ${ticketData.operatorPhone}<br>
              📧 Email: ${ticketData.operatorEmail}
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0;">
              QuikRide - Nền tảng đặt vé xe khách trực tuyến<br>
              Hotline: 1900-xxxx | Email: support@quikride.com
            </p>
            <p style="color: #cbd5e1; font-size: 11px; margin: 10px 0;">
              Email này được gửi tự động, vui lòng không reply.
            </p>
          </div>
        </div>
      </div>
    `,
  }),

  // Booking reminder email
  tripReminder: (reminderData) => ({
    subject: `Nhắc nhở: Chuyến xe ${reminderData.routeName} - ${reminderData.departureTime}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0ea5e9;">Nhắc nhở chuyến đi</h1>
        <p>Xin chào <strong>${reminderData.passengerName}</strong>,</p>
        <p>Chuyến xe của bạn sắp khởi hành!</p>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e;">Thông tin chuyến đi:</h3>
          <p style="color: #78350f; margin: 5px 0;">
            🚌 <strong>Tuyến:</strong> ${reminderData.routeName}<br>
            🕐 <strong>Giờ đi:</strong> ${reminderData.departureTime}<br>
            📍 <strong>Điểm đón:</strong> ${reminderData.pickupPoint}<br>
            💺 <strong>Ghế:</strong> ${reminderData.seatNumbers}
          </p>
        </div>

        <p style="color: #dc2626; font-weight: bold;">⚠️ Vui lòng có mặt trước 15 phút!</p>

        <a href="${reminderData.ticketUrl}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Xem vé của tôi
        </a>

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Trân trọng,<br>
          Đội ngũ QuikRide
        </p>
      </div>
    `,
  }),
};

module.exports = {
  sendEmail,
  emailTemplates,
};
