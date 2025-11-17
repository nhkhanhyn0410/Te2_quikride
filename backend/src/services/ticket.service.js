const Ticket = require('../models/Ticket');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const QRService = require('./qr.service');
const PDFService = require('./pdf.service');
const { sendEmail, emailTemplates } = require('../config/email');
const SMSService = require('./sms.service');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

/**
 * Ticket Service
 * UC-7: Generate digital tickets with QR codes and PDF
 */
class TicketService {
  /**
   * Generate ticket for a confirmed booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Ticket>} Generated ticket
   */
  static async generateTicket(bookingId) {
    try {
      // Check if ticket already exists
      const existingTicket = await Ticket.findOne({ bookingId });
      if (existingTicket) {
        console.log('⚠️ Ticket already exists for booking:', bookingId);
        return existingTicket;
      }

      // Get booking with populated references
      const booking = await Booking.findById(bookingId)
        .populate('tripId')
        .populate('operatorId')
        .populate('customerId');

      if (!booking) {
        throw new Error('Không tìm thấy booking');
      }

      if (booking.status !== 'confirmed' || booking.paymentStatus !== 'paid') {
        throw new Error('Booking chưa được xác nhận hoặc chưa thanh toán');
      }

      // Get full trip details
      const trip = await Trip.findById(booking.tripId._id)
        .populate('routeId')
        .populate('busId');

      if (!trip) {
        throw new Error('Không tìm thấy chuyến xe');
      }

      // Generate ticket code
      const ticketCode = await Ticket.generateTicketCode();

      // Prepare passenger data
      const passengers = booking.seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        fullName: seat.passengerName,
        phone: seat.passengerPhone,
        email: seat.passengerEmail,
        idCard: seat.passengerIdCard,
      }));

      const seatNumbers = booking.seats.map((s) => s.seatNumber);

      // Generate QR Code
      const qrData = await QRService.generateTicketQR({
        bookingId: booking._id.toString(),
        ticketCode,
        tripId: trip._id.toString(),
        seatNumbers,
        passengerName: passengers[0].fullName,
        departureTime: trip.departureTime,
      });

      // Create ticket document
      const ticket = await Ticket.create({
        ticketCode,
        bookingId: booking._id,
        customerId: booking.customerId?._id || null,
        tripId: trip._id,
        operatorId: booking.operatorId._id,
        qrCode: qrData.qrCode, // Base64 image
        qrCodeData: qrData.qrCodeData, // Encrypted data
        passengers,
        tripInfo: {
          routeName: trip.routeId.routeName,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          origin: {
            city: trip.routeId.origin.city,
            station: trip.routeId.origin.station,
            address: trip.routeId.origin.address,
          },
          destination: {
            city: trip.routeId.destination.city,
            station: trip.routeId.destination.station,
            address: trip.routeId.destination.address,
          },
          pickupPoint: booking.pickupPoint
            ? {
                name: booking.pickupPoint.name,
                address: booking.pickupPoint.address,
              }
            : null,
          dropoffPoint: booking.dropoffPoint
            ? {
                name: booking.dropoffPoint.name,
                address: booking.dropoffPoint.address,
              }
            : null,
          busNumber: trip.busId.busNumber,
          busType: trip.busId.busType,
        },
        totalPrice: booking.finalPrice,
        status: 'valid',
      });

      // Generate PDF in background (don't block response)
      this.generateAndUploadPDF(ticket, booking, trip, qrData.qrCodeData)
        .then((pdfUrl) => {
          ticket.pdfUrl = pdfUrl;
          ticket.save();
        })
        .catch((error) => {
          console.error('❌ PDF generation failed:', error);
        });

      console.log('✅ Ticket generated successfully:', ticketCode);
      return ticket;
    } catch (error) {
      console.error('❌ Ticket generation error:', error);
      throw error;
    }
  }

  /**
   * Generate PDF and upload to Cloudinary
   * @param {Ticket} ticket - Ticket document
   * @param {Booking} booking - Booking document
   * @param {Trip} trip - Trip document
   * @param {string} qrCodeData - QR code encrypted data
   * @returns {Promise<string>} PDF URL
   */
  static async generateAndUploadPDF(ticket, booking, trip, qrCodeData) {
    try {
      // Generate QR buffer for PDF
      const qrBuffer = await QRService.generateQRBuffer(qrCodeData);

      // Create temp directory if not exists
      const tempDir = path.join(__dirname, '../../temp/tickets');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Generate PDF
      const pdfFileName = `ticket_${ticket.ticketCode}.pdf`;
      const pdfPath = path.join(tempDir, pdfFileName);

      const pdfData = {
        ticketCode: ticket.ticketCode,
        bookingCode: booking.bookingCode,
        qrCodeBuffer: qrBuffer,
        passengers: ticket.passengers,
        tripInfo: {
          routeName: ticket.tripInfo.routeName,
          departureTime: ticket.tripInfo.departureTime,
          arrivalTime: ticket.tripInfo.arrivalTime,
          origin: ticket.tripInfo.origin,
          destination: ticket.tripInfo.destination,
          pickupPoint: ticket.tripInfo.pickupPoint,
          dropoffPoint: ticket.tripInfo.dropoffPoint,
          busNumber: ticket.tripInfo.busNumber,
          busType: ticket.tripInfo.busType,
        },
        operator: {
          companyName: booking.operatorId.companyName,
          phone: booking.operatorId.phone,
          email: booking.operatorId.email,
        },
        pricing: {
          total: ticket.totalPrice,
        },
        contactInfo: booking.contactInfo,
      };

      await PDFService.generateTicket(pdfData, pdfPath);

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(pdfPath, {
        folder: 'quikride/tickets',
        resource_type: 'raw',
        public_id: `ticket_${ticket.ticketCode}`,
      });

      // Delete temp file
      fs.unlinkSync(pdfPath);

      ticket.pdfFileName = pdfFileName;
      console.log('✅ PDF uploaded to Cloudinary:', uploadResult.secure_url);

      return uploadResult.secure_url;
    } catch (error) {
      console.error('❌ PDF upload error:', error);
      throw error;
    }
  }

  /**
   * Send ticket via email and SMS
   * @param {string} ticketId - Ticket ID
   * @returns {Promise<Object>} Send result
   */
  static async sendTicketNotifications(ticketId) {
    try {
      const ticket = await Ticket.findById(ticketId)
        .populate('bookingId')
        .populate('operatorId');

      if (!ticket) {
        throw new Error('Không tìm thấy vé');
      }

      const booking = ticket.bookingId;
      const contactEmail = booking.contactInfo.email;
      const contactPhone = booking.contactInfo.phone;

      const results = {
        email: { sent: false },
        sms: { sent: false },
      };

      // Prepare ticket data for email
      const departureTime = moment(ticket.tripInfo.departureTime)
        .tz('Asia/Ho_Chi_Minh')
        .format('HH:mm, DD/MM/YYYY');

      const ticketData = {
        bookingCode: booking.bookingCode,
        ticketCode: ticket.ticketCode,
        passengerName: ticket.passengers[0].fullName,
        routeName: ticket.tripInfo.routeName,
        departureTime,
        pickupPoint: ticket.tripInfo.pickupPoint?.name || ticket.tripInfo.origin.station,
        seatNumbers: ticket.passengers.map((p) => p.seatNumber).join(', '),
        totalPrice: `${ticket.totalPrice.toLocaleString('vi-VN')} VNĐ`,
        qrCodeImage: ticket.qrCode, // Base64 data URL
        ticketUrl: ticket.pdfUrl || `${process.env.FRONTEND_URL}/tickets/${ticket.ticketCode}`,
        operatorName: ticket.operatorId.companyName,
        operatorPhone: ticket.operatorId.phone,
        operatorEmail: ticket.operatorId.email,
      };

      // Send email
      if (contactEmail && !ticket.emailSent) {
        try {
          const emailTemplate = emailTemplates.ticketConfirmation(ticketData);

          // Prepare attachments if PDF is ready
          const attachments = [];
          if (ticket.pdfUrl) {
            attachments.push({
              filename: ticket.pdfFileName || `ticket_${ticket.ticketCode}.pdf`,
              path: ticket.pdfUrl,
            });
          }

          await sendEmail({
            to: contactEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            attachments,
          });

          ticket.markEmailSent();
          results.email.sent = true;
          console.log('✅ Ticket email sent to:', contactEmail);
        } catch (error) {
          console.error('❌ Email sending failed:', error);
          results.email.error = error.message;
        }
      }

      // Send SMS
      if (contactPhone && !ticket.smsSent) {
        try {
          const smsData = {
            phone: contactPhone,
            bookingCode: booking.bookingCode,
            ticketCode: ticket.ticketCode,
            routeName: ticket.tripInfo.routeName,
            departureTime,
            seatNumbers: ticket.passengers.map((p) => p.seatNumber).join(', '),
            ticketUrl: ticketData.ticketUrl,
          };

          const smsResult = await SMSService.sendTicketSMS(smsData);

          if (smsResult.success) {
            ticket.markSmsSent();
            results.sms.sent = true;
            console.log('✅ Ticket SMS sent to:', contactPhone);
          } else {
            results.sms.error = smsResult.error;
          }
        } catch (error) {
          console.error('❌ SMS sending failed:', error);
          results.sms.error = error.message;
        }
      }

      await ticket.save();

      return results;
    } catch (error) {
      console.error('❌ Notification sending error:', error);
      throw error;
    }
  }

  /**
   * Get ticket by ID
   * @param {string} ticketId - Ticket ID
   * @param {string} customerId - Customer ID (optional, for authorization)
   * @returns {Promise<Ticket>} Ticket details
   */
  static async getTicketById(ticketId, customerId = null) {
    const ticket = await Ticket.findById(ticketId)
      .populate('tripId')
      .populate('operatorId', 'companyName phone email logo')
      .populate('bookingId');

    if (!ticket) {
      throw new Error('Không tìm thấy vé');
    }

    // Verify ownership if customerId provided
    if (customerId && ticket.customerId && ticket.customerId.toString() !== customerId) {
      throw new Error('Không có quyền truy cập vé này');
    }

    return ticket;
  }

  /**
   * Get ticket by code (for guests)
   * @param {string} ticketCode - Ticket code
   * @param {string} phone - Contact phone for verification
   * @returns {Promise<Ticket>} Ticket details
   */
  static async getTicketByCode(ticketCode, phone) {
    const ticket = await Ticket.findByCode(ticketCode);

    if (!ticket) {
      throw new Error('Không tìm thấy vé');
    }

    // Verify phone number
    const booking = ticket.bookingId;
    if (booking.contactInfo.phone !== phone) {
      throw new Error('Số điện thoại không khớp');
    }

    return ticket;
  }

  /**
   * Get customer tickets
   * @param {string} customerId - Customer ID
   * @param {Object} filters - Filters
   * @returns {Promise<Array>} Tickets
   */
  static async getCustomerTickets(customerId, filters = {}) {
    return await Ticket.findByCustomer(customerId, filters);
  }

  /**
   * Get trip tickets (for trip manager)
   * @param {string} tripId - Trip ID
   * @param {Object} filters - Filters
   * @returns {Promise<Array>} Tickets
   */
  static async getTripTickets(tripId, filters = {}) {
    return await Ticket.findByTrip(tripId, filters);
  }

  /**
   * Verify ticket QR code
   * @param {string} qrCodeData - Encrypted QR data
   * @param {string} tripId - Trip ID to verify against
   * @param {string} verifiedBy - Employee ID who verified
   * @returns {Promise<Object>} Verification result
   */
  static async verifyTicketQR(qrCodeData, tripId, verifiedBy) {
    try {
      // Verify QR code structure and data
      const qrVerification = await QRService.verifyTicketQR(qrCodeData, { tripId });

      if (!qrVerification.valid) {
        return {
          success: false,
          error: qrVerification.error,
        };
      }

      const { ticketCode, bookingId } = qrVerification.data;

      // Find ticket
      const ticket = await Ticket.findOne({ ticketCode })
        .populate('tripId')
        .populate('bookingId');

      if (!ticket) {
        return {
          success: false,
          error: 'Vé không tồn tại trong hệ thống',
        };
      }

      // Check ticket status
      if (ticket.status === 'cancelled') {
        return {
          success: false,
          error: 'Vé đã bị hủy',
          ticket,
        };
      }

      if (ticket.status === 'used' || ticket.isUsed) {
        return {
          success: false,
          error: `Vé đã được sử dụng lúc ${moment(ticket.usedAt).format('HH:mm DD/MM/YYYY')}`,
          ticket,
        };
      }

      if (ticket.isExpired) {
        return {
          success: false,
          error: 'Vé đã hết hạn (chuyến xe đã khởi hành)',
          ticket,
        };
      }

      // Check if ticket matches the trip
      if (ticket.tripId._id.toString() !== tripId) {
        return {
          success: false,
          error: 'Vé không thuộc chuyến xe này',
          ticket,
        };
      }

      // Mark ticket as used
      ticket.markAsUsed(verifiedBy);
      await ticket.save();

      return {
        success: true,
        message: 'Vé hợp lệ',
        ticket,
        passengers: ticket.passengers,
      };
    } catch (error) {
      console.error('❌ QR verification error:', error);
      return {
        success: false,
        error: error.message || 'Lỗi xác thực QR code',
      };
    }
  }

  /**
   * Cancel ticket
   * @param {string} ticketId - Ticket ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Ticket>} Cancelled ticket
   */
  static async cancelTicket(ticketId, reason) {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Không tìm thấy vé');
    }

    if (ticket.status === 'cancelled') {
      throw new Error('Vé đã bị hủy trước đó');
    }

    if (ticket.isUsed) {
      throw new Error('Không thể hủy vé đã sử dụng');
    }

    ticket.cancel(reason);
    await ticket.save();

    return ticket;
  }

  /**
   * Resend ticket notifications
   * @param {string} ticketId - Ticket ID
   * @returns {Promise<Object>} Send result
   */
  static async resendTicket(ticketId) {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error('Không tìm thấy vé');
    }

    // Reset notification flags
    ticket.emailSent = false;
    ticket.smsSent = false;
    await ticket.save();

    // Resend notifications
    return await this.sendTicketNotifications(ticketId);
  }
}

module.exports = TicketService;
