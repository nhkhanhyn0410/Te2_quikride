const cron = require('node-cron');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const User = require('../models/User');
const notificationService = require('./notification.service');
const smsService = require('./sms.service');
const reviewService = require('./review.service');
const loyaltyService = require('./loyalty.service');

/**
 * Scheduler Service
 * Handles cron jobs for periodic tasks
 */
class SchedulerService {
  constructor() {
    this.jobs = {};
  }

  /**
   * Initialize all scheduled jobs
   */
  initialize() {
    console.log('🕐 Initializing scheduler service...');

    // Send trip reminders every hour
    this.jobs.tripReminders = cron.schedule('0 * * * *', async () => {
      await this.sendTripReminders();
    });

    // Send review invitations every 6 hours
    this.jobs.reviewInvitations = cron.schedule('0 */6 * * *', async () => {
      await this.sendReviewInvitations();
    });

    // Cleanup expired points daily at midnight
    this.jobs.expiredPoints = cron.schedule('0 0 * * *', async () => {
      await this.cleanupExpiredPoints();
    });

    // Cleanup expired seat locks every 5 minutes
    this.jobs.seatLocks = cron.schedule('*/5 * * * *', async () => {
      await this.cleanupExpiredSeatLocks();
    });

    console.log('✅ Scheduler service initialized');
  }

  /**
   * Send trip reminders (24h and 2h before departure)
   */
  async sendTripReminders() {
    try {
      console.log('📅 Checking for trip reminders...');

      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Find trips departing in 24 hours (±30 min window)
      const trips24h = await Trip.find({
        departureTime: {
          $gte: new Date(in24Hours.getTime() - 30 * 60 * 1000),
          $lte: new Date(in24Hours.getTime() + 30 * 60 * 1000),
        },
        status: 'scheduled',
      })
        .populate('routeId')
        .lean();

      // Find trips departing in 2 hours (±15 min window)
      const trips2h = await Trip.find({
        departureTime: {
          $gte: new Date(in2Hours.getTime() - 15 * 60 * 1000),
          $lte: new Date(in2Hours.getTime() + 15 * 60 * 1000),
        },
        status: 'scheduled',
      })
        .populate('routeId')
        .lean();

      // Send 24-hour reminders
      for (const trip of trips24h) {
        await this.sendTripRemindersForTrip(trip, '24h');
      }

      // Send 2-hour reminders
      for (const trip of trips2h) {
        await this.sendTripRemindersForTrip(trip, '2h');
      }

      console.log(
        `✅ Sent reminders for ${trips24h.length} trips (24h) and ${trips2h.length} trips (2h)`
      );
    } catch (error) {
      console.error('❌ Error sending trip reminders:', error);
    }
  }

  /**
   * Send trip reminders for a specific trip
   * @param {Object} trip - Trip object
   * @param {string} timeframe - '24h' or '2h'
   */
  async sendTripRemindersForTrip(trip, timeframe) {
    try {
      // Get all confirmed bookings for this trip
      const bookings = await Booking.find({
        tripId: trip._id,
        status: 'confirmed',
      })
        .select('contactInfo seats pickupPoint')
        .lean();

      if (bookings.length === 0) {
        return;
      }

      const routeName =
        trip.routeId?.routeName ||
        `${trip.routeId?.origin?.city} - ${trip.routeId?.destination?.city}`;
      const departureTime = new Date(trip.departureTime).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
      });

      for (const booking of bookings) {
        const email = booking.contactInfo?.email;
        const phone = booking.contactInfo?.phone;

        if (!email && !phone) continue;

        // Send email
        if (email) {
          const emailSubject =
            timeframe === '24h'
              ? `⏰ Nhắc nhở: Chuyến đi của bạn vào ngày mai`
              : `🚌 Nhắc nhở: Chuyến đi của bạn còn 2 giờ nữa`;

          const emailHtml = this.generateReminderEmail(
            booking,
            trip,
            routeName,
            departureTime,
            timeframe
          );

          await notificationService.sendEmail(email, emailSubject, emailHtml);
        }

        // Send SMS
        if (phone) {
          const pickupPoint = booking.pickupPoint?.name || 'Điểm đón';
          const seatNumbers = booking.seats.join(', ');

          await smsService.sendTripReminder({
            phone,
            routeName,
            departureTime,
            pickupPoint,
            seatNumbers,
          });
        }

        // Small delay to avoid rate limiting
        await this.delay(100);
      }

      console.log(`✅ Sent ${timeframe} reminders for trip ${trip._id}`);
    } catch (error) {
      console.error(`❌ Error sending ${timeframe} reminders for trip:`, error);
    }
  }

  /**
   * Generate trip reminder email HTML
   * @param {Object} booking - Booking object
   * @param {Object} trip - Trip object
   * @param {string} routeName - Route name
   * @param {string} departureTime - Departure time string
   * @param {string} timeframe - '24h' or '2h'
   * @returns {string} Email HTML
   */
  generateReminderEmail(booking, trip, routeName, departureTime, timeframe) {
    const title = timeframe === '24h' ? 'Chuyến đi của bạn vào ngày mai' : 'Chuyến đi sắp khởi hành';
    const message =
      timeframe === '24h'
        ? 'Chuyến đi của bạn sẽ khởi hành vào ngày mai. Hãy chuẩn bị hành lý và có mặt đúng giờ nhé!'
        : 'Chuyến đi của bạn sẽ khởi hành sau 2 giờ nữa. Vui lòng có mặt tại điểm đón trước 15 phút!';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .content {
            padding: 30px 20px;
          }
          .trip-info {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .highlight {
            color: #0ea5e9;
            font-weight: bold;
            font-size: 18px;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ QuikRide</h1>
            <p>${title}</p>
          </div>

          <div class="content">
            <h2>${message}</h2>

            <div class="trip-info">
              <h3 style="margin-top: 0; color: #0ea5e9;">Thông tin chuyến đi:</h3>
              <p><strong>Tuyến đường:</strong> ${routeName}</p>
              <p><strong>Thời gian khởi hành:</strong> <span class="highlight">${departureTime}</span></p>
              <p><strong>Điểm đón:</strong> ${booking.pickupPoint?.name || 'N/A'}</p>
              <p><strong>Số ghế:</strong> ${booking.seats.join(', ')}</p>
            </div>

            <div class="warning">
              <p style="margin: 0; font-weight: bold;">
                ⚠️ Lưu ý quan trọng:
              </p>
              <ul style="margin: 10px 0 0 0;">
                <li>Vui lòng có mặt trước giờ khởi hành 15 phút</li>
                <li>Mang theo CMND/CCCD và vé điện tử</li>
                <li>Liên hệ hotline nếu có vấn đề: 1900-xxxx</li>
              </ul>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Chúc bạn có một chuyến đi an toàn và vui vẻ!<br>
              Đội ngũ QuikRide
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send review invitations for completed trips
   */
  async sendReviewInvitations() {
    try {
      console.log('📧 Checking for review invitations...');

      // Find bookings completed in the last 24 hours that haven't been reviewed
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const completedBookings = await Booking.find({
        status: 'completed',
        updatedAt: { $gte: oneDayAgo },
      })
        .select('_id userId tripId')
        .lean();

      let sent = 0;
      let skipped = 0;

      for (const booking of completedBookings) {
        if (!booking.userId) {
          skipped++;
          continue; // Skip guest bookings
        }

        try {
          const result = await reviewService.sendReviewInvitation(booking.userId, booking._id);
          if (result.success && !result.skipped) {
            sent++;
          } else {
            skipped++;
          }
        } catch (error) {
          console.error(`Error sending review invitation for booking ${booking._id}:`, error.message);
          skipped++;
        }

        // Small delay
        await this.delay(200);
      }

      console.log(`✅ Sent ${sent} review invitations (${skipped} skipped)`);
    } catch (error) {
      console.error('❌ Error sending review invitations:', error);
    }
  }

  /**
   * Cleanup expired loyalty points
   */
  async cleanupExpiredPoints() {
    try {
      console.log('🧹 Cleaning up expired loyalty points...');

      const result = await loyaltyService.cleanupExpiredPoints();

      console.log(
        `✅ Expired points cleanup: ${result.usersAffected} users, ${result.pointsRemoved} points removed`
      );
    } catch (error) {
      console.error('❌ Error cleaning up expired points:', error);
    }
  }

  /**
   * Cleanup expired seat locks
   */
  async cleanupExpiredSeatLocks() {
    try {
      // This would be implemented in seat lock service
      // For now, just log
      console.log('🧹 Cleaning up expired seat locks...');
    } catch (error) {
      console.error('❌ Error cleaning up seat locks:', error);
    }
  }

  /**
   * Utility: Delay execution
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    console.log('🛑 Stopping all scheduled jobs...');
    Object.values(this.jobs).forEach((job) => {
      if (job) job.stop();
    });
    console.log('✅ All jobs stopped');
  }

  /**
   * Start all scheduled jobs
   */
  startAll() {
    console.log('▶️ Starting all scheduled jobs...');
    Object.values(this.jobs).forEach((job) => {
      if (job) job.start();
    });
    console.log('✅ All jobs started');
  }
}

module.exports = new SchedulerService();
