# HƯỚNG DẪN XÂY DỰNG DỰ ÁN QUIKRIDE - PART 2
## PHASES 4-5: TICKET MANAGEMENT & OPERATOR ADMIN

---

## 🎯 TỔNG QUAN PART 2

**Nội dung:** Phase 4-5 - Hoàn thiện hệ thống vé điện tử và operator dashboard
**Thời gian:** 4 tuần
**Mục tiêu:** Electronic ticketing, QR verification, operator analytics & reports

### Các Phase trong Part 2:
- **Phase 4:** Ticket Management (2 tuần)
- **Phase 5:** Bus Operator Admin (2 tuần)

---

# PHASE 4: TICKET MANAGEMENT

**Thời gian:** 2 tuần
**Độ ưu tiên:** 🔴 Cao (Critical)

## MỤC TIÊU PHASE 4
Xây dựng hệ thống quản lý vé điện tử với QR code, soát vé, và notifications

---

## 📦 BƯỚC 4.1: ELECTRONIC TICKET GENERATION

### A. Ticket Model

**File: backend/src/models/Ticket.js**
```
Schema fields:

Basic Info:
- ticketCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  }
  // Format: TK + timestamp + random (e.g., TK1234567890ABC)

References:
- booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  }

QR Code Data:
- qrCode: {
    type: String,
    required: true
  }
  // Encrypted string chứa ticket info

- qrCodeImage: {
    type: String
  }
  // Base64 string hoặc URL của QR image

PDF:
- pdfUrl: {
    type: String
  }
  // URL của PDF ticket trên Cloudinary

Status:
- status: {
    type: String,
    enum: ['valid', 'used', 'cancelled', 'expired'],
    default: 'valid',
    index: true
  }

Usage Tracking:
- usedAt: Date
- checkedInBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }
- checkedInLocation: {
    lat: Number,
    lng: Number
  }

Timestamps:
- createdAt
- updatedAt

Indexes:
- ticketCode (unique)
- booking
- status
- booking + status (compound)

Methods:
- isValid(): Check nếu status = valid và chưa expired
- markAsUsed(employeeId): Update status = used
```

### B. QR Service

**File: backend/src/services/qr.service.js**
```
Purpose: Generate và verify QR codes

Dependencies:
- crypto (Node.js built-in)
- qrcode (npm package)

Config:
- QR_SECRET_KEY: Secret key cho encryption (từ .env)
- QR_ALGORITHM: 'aes-256-cbc'

Functions:

1. generateQRData(ticket, booking, trip)
   Input: ticket, booking, trip objects

   Steps:
   1. Create payload object:
      {
        ticketCode: ticket.ticketCode,
        bookingCode: booking.bookingCode,
        tripId: trip._id.toString(),
        seatNumbers: booking.seats.map(s => s.seatNumber),
        passengerNames: booking.seats.map(s => s.passenger.fullName),
        departureTime: trip.departureTime.toISOString(),
        timestamp: Date.now(),
        checksum: '' // Sẽ tính sau
      }

   2. Calculate checksum (để verify integrity):
      - Stringify payload (exclude checksum)
      - Hash với SHA256
      - Take first 16 chars
      - Add vào payload.checksum

   3. Stringify full payload
   4. Encrypt với AES-256-CBC:
      - Generate IV (initialization vector)
      - Encrypt payload
      - Combine IV + encrypted data
      - Convert to base64
   5. Return encrypted string

2. generateQRImage(qrData)
   Input: encrypted QR data string

   Steps:
   1. Use qrcode.toDataURL(qrData, options):
      Options:
      - errorCorrectionLevel: 'H' (high)
      - type: 'image/png'
      - quality: 0.92
      - margin: 1
      - width: 300
      - color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
   2. Return base64 image string (data:image/png;base64,...)

3. decryptQRData(encryptedData)
   Input: encrypted string từ QR scan

   Steps:
   1. Decode base64
   2. Extract IV (first 16 bytes)
   3. Extract encrypted payload
   4. Decrypt với AES-256-CBC using IV và SECRET_KEY
   5. Parse JSON
   6. Verify checksum:
      - Recalculate checksum từ payload
      - Compare với payload.checksum
      - Nếu không match: Throw error 'Invalid QR code'
   7. Return decrypted payload object

4. verifyQR(qrData, tripId)
   Input: encrypted QR data, expected tripId

   Steps:
   1. Decrypt QR data
   2. Verify timestamp not too old (max 24h sau trip.departureTime)
   3. Verify tripId matches
   4. Find ticket by ticketCode
   5. Check ticket exists
   6. Check ticket.status === 'valid'
   7. Find booking
   8. Check booking.status === 'confirmed'
   9. Check booking.paymentStatus === 'paid'
   10. Return validation result:
       {
         isValid: boolean,
         ticket: ticket object,
         booking: booking object,
         passengers: array,
         seats: array,
         message: string (error message nếu invalid)
       }

5. generateTicketQR(ticket, booking, trip)
   High-level function combining above:
   - Generate QR data
   - Generate QR image
   - Return both

Export all functions
```

### C. PDF Service

**File: backend/src/services/pdf.service.js**
```
Purpose: Generate PDF tickets

Dependencies:
- pdfkit (npm package)
- fs, path (Node.js built-in)

Functions:

1. generateTicketPDF(booking, trip, ticket, qrCodeImage)
   Input: booking, trip, ticket objects, QR image (base64)

   Steps:
   1. Create new PDFDocument:
      - Size: 'A4'
      - Margins: 50

   2. Design layout:

      HEADER SECTION:
      - Add logo (nếu có) - left aligned
      - Add title "E-TICKET" - right aligned, large font
      - Add horizontal line separator

      BOOKING INFORMATION:
      - Booking Code: [code] - bold, large
      - Issued Date: [date]
      - Status: CONFIRMED (green badge)

      TRIP INFORMATION:
      - Route: [Origin] → [Destination]
      - Departure: [Date], [Time]
      - Arrival: [Time] (estimated)
      - Duration: [X hours Y minutes]
      - Operator: [Company name]
      - Bus: [Bus number] - [Bus type]

      PASSENGER INFORMATION:
      - Table với columns:
        | Seat | Full Name | Phone | ID Card |
      - For each passenger in booking.seats

      PICKUP & DROPOFF:
      - Pickup Point: [Name], [Address]
      - Dropoff Point: [Name], [Address]

      PRICING:
      - Base Price: [amount] × [seats] = [subtotal]
      - Discount: -[amount] (nếu có)
      - Total Paid: [final amount] (large, bold)

      QR CODE SECTION:
      - Center-aligned
      - Heading: "Scan QR Code for Check-in"
      - QR image (large, 200x200)
      - Ticket Code below QR: [ticket code]

      FOOTER:
      - Terms & conditions (small font):
        * Please arrive 15 minutes before departure
        * Present this ticket at check-in
        * Ticket is non-transferable
        * Cancellation policy applies
      - Contact info:
        * Hotline: [phone]
        * Email: [email]
        * Website: [url]

   3. Finalize PDF:
      - doc.end()
      - Return Buffer

2. uploadPDFToCloudinary(pdfBuffer, ticketCode)
   Input: PDF buffer, ticket code

   Steps:
   1. Convert buffer to base64
   2. Upload to Cloudinary:
      - Use cloudinary.uploader.upload()
      - Resource type: 'raw'
      - Folder: 'tickets'
      - Public ID: ticketCode
      - Format: 'pdf'
   3. Return secure_url

3. generateAndUploadTicketPDF(booking, trip, ticket, qrCodeImage)
   Wrapper function:
   - Generate PDF
   - Upload to Cloudinary
   - Return URL

Export functions
```

### D. Update Booking Confirmation Logic

**File: backend/src/controllers/booking.controller.js**
```
Update confirmBooking function:

Sau khi update booking và trip (step 1-6 đã có từ Phase 3):

7. Generate Electronic Ticket:
   a. Generate ticket code:
      - Format: TK + timestamp + random(4 chars)
      - Check unique

   b. Generate QR data:
      - Call qr.service.generateQRData(ticket, booking, trip)

   c. Generate QR image:
      - Call qr.service.generateQRImage(qrData)

   d. Create Ticket document:
      - ticketCode
      - booking: booking._id
      - qrCode: encrypted QR data
      - qrCodeImage: base64 image
      - status: 'valid'
      - Save ticket

   e. Generate PDF:
      - Call pdf.service.generateAndUploadTicketPDF(
          booking, trip, ticket, qrCodeImage
        )
      - Update ticket.pdfUrl

   f. Save ticket

8. Send Notifications:
   - Send email với PDF attachment
   - Send SMS với ticket code + download link

9. Return success với ticket info
```

### E. Ticket Controller

**File: backend/src/controllers/ticket.controller.js**
```
Functions:

1. getTicketByCode (public)
   Input: ticketCode (from URL param)

   Steps:
   - Find ticket by ticketCode
   - Populate booking, trip, route
   - Return ticket details

2. downloadTicketPDF (public)
   Input: ticketCode

   Steps:
   - Find ticket
   - Nếu ticket.pdfUrl:
     - Redirect to Cloudinary URL
   - Nếu không:
     - Generate PDF on-the-fly
     - Stream to response

3. getMyTickets (protected, user)
   Query: filter (upcoming, past, all), page, limit

   Steps:
   - Find bookings của user (booking.user = req.user._id)
   - Populate tickets
   - Filter:
     - upcoming: trip.departureTime >= now
     - past: trip.departureTime < now
   - Populate trip, route info
   - Sort by trip.departureTime (desc for past, asc for upcoming)
   - Paginate
   - Return tickets với booking + trip info

4. resendTicket (protected/guest)
   Input: ticketCode, email

   Steps:
   - Find ticket, populate booking
   - Verify email matches
   - Regenerate PDF (nếu cần)
   - Send email
   - Return success

5. validateTicketForUse (internal - dùng cho trip manager)
   - Will implement in Step 4.3

Export functions
```

### F. Ticket Routes

**File: backend/src/routes/ticket.routes.js**
```
Routes:

Public:
- GET /tickets/:code - getTicketByCode
- GET /tickets/:code/download - downloadTicketPDF
- POST /tickets/:code/resend - resendTicket

Protected (user authentication):
- GET /tickets/my-tickets - getMyTickets

Mount in main routes
```

---

## 📦 BƯỚC 4.2: EMAIL & SMS NOTIFICATIONS

### A. Email Service (Enhanced)

**File: backend/src/services/email.service.js**
```
Đã có basic setup từ Phase 1, giờ mở rộng:

Email Templates:

1. sendBookingConfirmation(booking, ticket, pdfBuffer)
   Input: booking, ticket objects, PDF buffer

   HTML Template:
   ```html
   Subject: Booking Confirmation - [Booking Code]

   Body:
   - Greeting: Dear [Customer Name],
   - Message: Your booking has been confirmed!
   - Booking details table:
     * Booking Code
     * Trip: Origin → Destination
     * Departure: Date, Time
     * Seats: [seat numbers]
     * Passengers: [names]
     * Total Paid: [amount]
   - QR Code image (embedded)
   - Call to action buttons:
     * Download Ticket
     * View Booking
   - Important notes:
     * Arrive 15 min early
     * Bring this ticket
     * Contact info
   - Footer: Company info, social links

   Attachments:
   - PDF ticket (pdfBuffer)
   ```

   Implementation:
   - Use HTML template engine (handlebars/ejs)
   - Inline CSS cho email compatibility
   - Responsive design
   - Send via nodemailer

2. sendCancellationConfirmation(booking, refundAmount)
   Template:
   - Subject: Booking Cancelled - [Booking Code]
   - Body:
     * Cancellation confirmed
     * Booking details
     * Refund amount: [amount]
     * Refund timeline: 5-7 business days
     * Contact info if questions

3. sendTripReminder(booking, ticket, hoursBeforeDeparture)
   Template:
   - Subject: Trip Reminder - Departure in [X] hours
   - Body:
     * Reminder message
     * Trip details
     * Pickup point with map
     * QR code
     * Download ticket link
     * Hotline

4. sendPasswordReset(user, resetToken)
   - Đã có từ Phase 1, verify template

5. sendTicketResend(booking, ticket, pdfBuffer)
   - Similar to booking confirmation
   - Subject: Your E-Ticket - [Booking Code]

Helper Functions:
- loadTemplate(templateName, data): Load và compile template
- embedImage(imagePath): Convert image to embedded data URI
- formatCurrency(amount): Format VND currency
```

### B. SMS Service

**File: backend/src/services/sms.service.js**
```
Purpose: Send SMS notifications

Providers: VNPT SMS hoặc Viettel SMS

Config (.env):
- SMS_PROVIDER: 'vnpt' | 'viettel'
- SMS_API_KEY
- SMS_API_SECRET
- SMS_BRAND_NAME: 'QuikRide'

Functions:

1. sendSMS(phone, message)
   Generic send function:
   - Validate phone number (VN format: 0XXXXXXXXX)
   - Call provider API based on SMS_PROVIDER:

   VNPT SMS:
   - Endpoint: https://api.viettelsms.vn/api/sms/send
   - Method: POST
   - Headers: Authorization: Bearer [token]
   - Body: {
       phone: phone,
       message: message,
       brandName: SMS_BRAND_NAME
     }

   Viettel SMS:
   - Similar implementation

   - Handle errors
   - Log SMS sent
   - Return result

2. sendBookingConfirmationSMS(booking, ticket)
   Message template:
   ```
   QuikRide: Booking confirmed!
   Code: [BOOKING_CODE]
   Trip: [ORIGIN] - [DESTINATION]
   Date: [DATE] [TIME]
   Seats: [SEATS]
   Ticket: [SHORT_LINK]
   Hotline: 1900xxxx
   ```

   Character limit: 160 chars (1 SMS)
   - Generate short link cho ticket download
   - Call sendSMS()

3. sendCancellationSMS(booking, refundAmount)
   Message:
   ```
   QuikRide: Booking [CODE] cancelled.
   Refund: [AMOUNT]đ
   Refund in 5-7 days.
   Questions? Call 1900xxxx
   ```

4. sendTripReminderSMS(booking, hoursBeforeDeparture)
   Message:
   ```
   QuikRide: Trip in [X]h
   [ORIGIN]-[DESTINATION] [DATE] [TIME]
   Pickup: [LOCATION]
   Code: [BOOKING_CODE]
   Have a safe trip!
   ```

5. sendOTP(phone, otp)
   - Dùng cho verification
   Message:
   ```
   QuikRide OTP: [OTP_CODE]
   Valid for 5 minutes.
   Do not share.
   ```

Helper:
- generateShortLink(ticketCode): Tạo short URL
- formatPhoneNumber(phone): Chuẩn hóa số điện thoại

Export functions
```

### C. OTP Service

**File: backend/src/services/otp.service.js**
```
Purpose: Generate và verify OTP codes

Functions:

1. generateOTP()
   - Generate 6-digit random number
   - Return string: '123456'

2. sendOTP(phone)
   Steps:
   - Generate OTP
   - Lưu vào Redis:
     - Key: `otp:${phone}`
     - Value: OTP code
     - TTL: 5 minutes (300 seconds)
   - Send SMS với OTP
   - Return success (không return OTP code!)

3. verifyOTP(phone, otp)
   Steps:
   - Get OTP from Redis key `otp:${phone}`
   - Compare với input OTP
   - Nếu match:
     - Delete key từ Redis (1 time use)
     - Return true
   - Nếu không match hoặc expired:
     - Return false

4. resendOTP(phone)
   - Check cooldown (không cho resend trong 1 phút)
   - Call sendOTP()

Export functions
```

### D. Notification Scheduler

**File: backend/src/utils/scheduler.js**
```
Purpose: Schedule automated notifications

Use: node-cron (npm package)

Jobs:

1. Trip Reminder Job (chạy mỗi giờ)
   Schedule: '0 * * * *' (minute 0 mỗi giờ)

   Logic:
   - Find trips với departureTime trong khoảng:
     * 24 hours from now (+/- 30 min window)
     * 2 hours from now (+/- 30 min window)
   - For each trip:
     - Find all confirmed bookings
     - Check nếu chưa gửi reminder (flag trong booking)
     - Send email + SMS reminder
     - Mark reminder sent

   Implementation:
   ```javascript
   const cron = require('node-cron');

   cron.schedule('0 * * * *', async () => {
     try {
       const now = new Date();
       const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
       const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);

       // Find trips departing in 24h
       const trips24h = await Trip.find({
         departureTime: {
           $gte: new Date(in24h.getTime() - 30 * 60 * 1000),
           $lte: new Date(in24h.getTime() + 30 * 60 * 1000)
         },
         status: 'scheduled'
       });

       // Send 24h reminders
       for (const trip of trips24h) {
         await sendRemindersForTrip(trip, 24);
       }

       // Similar for 2h reminders
       // ...

     } catch (error) {
       console.error('Reminder job error:', error);
     }
   });

   async function sendRemindersForTrip(trip, hours) {
     const bookings = await Booking.find({
       trip: trip._id,
       status: 'confirmed',
       [`reminderSent${hours}h`]: { $ne: true }
     }).populate('ticket');

     for (const booking of bookings) {
       // Send email
       await emailService.sendTripReminder(booking, booking.ticket, hours);

       // Send SMS
       await smsService.sendTripReminderSMS(booking, hours);

       // Mark sent
       booking[`reminderSent${hours}h`] = true;
       await booking.save();
     }
   }
   ```

2. Auto-Cancel Expired Bookings (chạy mỗi 5 phút)
   Schedule: '*/5 * * * *'

   Logic:
   - Find bookings với:
     * status = 'pending'
     * paymentStatus = 'pending'
     * holdExpiryTime < now
   - For each:
     - Update status = 'cancelled'
     - Release seats
     - Delete from seat locks (Redis)

3. Update Trip Status (chạy mỗi 10 phút)
   Schedule: '*/10 * * * *'

   Logic:
   - Find trips với:
     * status = 'scheduled'
     * departureTime < now
   - Update status = 'ongoing'

   - Find trips với:
     * status = 'ongoing'
     * arrivalTime < now
   - Update status = 'completed'

4. Cleanup Old Data (chạy mỗi ngày lúc 2am)
   Schedule: '0 2 * * *'

   Logic:
   - Delete expired OTP codes (Redis auto TTL)
   - Delete expired seat locks (Redis auto TTL)
   - Archive old bookings (>1 year) to separate collection
   - Cleanup old logs

Start all jobs:
```javascript
function startScheduler() {
  console.log('Starting scheduled jobs...');
  // Jobs auto-start when defined
}

module.exports = { startScheduler };
```

Call trong server.js:
```javascript
const { startScheduler } = require('./utils/scheduler');
startScheduler();
```
```

### E. Update Booking Model

**File: backend/src/models/Booking.js**
```
Thêm fields:

Reminder Tracking:
- reminderSent24h: { type: Boolean, default: false }
- reminderSent2h: { type: Boolean, default: false }

Notification Preferences (optional):
- notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true }
  }
```

---

## 📦 BƯỚC 4.3: TRIP MANAGER WEB APP

### A. Trip Manager Authentication

**File: backend/src/controllers/tripManager.controller.js (tạo mới)**
```
Functions:

1. login
   Input: { employeeId, password }

   Steps:
   - Find employee by employeeId
   - Check role = 'trip_manager'
   - Verify password
   - Check isActive = true
   - Generate JWT token với payload:
     {
       employeeId: employee._id,
       operatorId: employee.operator,
       role: 'trip_manager'
     }
   - Generate refresh token
   - Return token + employee info

2. getMe (protected)
   - Return employee info từ req.employee

3. getAssignedTrips (protected)
   Query: status (upcoming, active, completed), page, limit

   - Find trips where tripManager = req.employee._id
   - Filter:
     * upcoming: departureTime > now, status = scheduled
     * active: status = ongoing
     * completed: status = completed
   - Populate route, bus, operator
   - Sort by departureTime
   - Return trips

4. getTripDetails (protected)
   Params: tripId

   - Find trip
   - Verify trip.tripManager = req.employee._id
   - Populate route, bus, bookings
   - Calculate stats:
     * Total passengers
     * Checked in count
     * Not checked in count
   - Return trip với stats

Export functions
```

### B. Trip Manager Routes

**File: backend/src/routes/tripManager.routes.js**
```
Routes:

Public:
- POST /trip-manager/login

Protected (tripManagerAuth middleware):
- GET /trip-manager/me
- GET /trip-manager/trips
- GET /trip-manager/trips/:id
- POST /trip-manager/trips/:tripId/verify-ticket
- GET /trip-manager/trips/:tripId/passengers
- PUT /trip-manager/trips/:tripId/journey-status

Mount in main routes
```

### C. Trip Manager Auth Middleware

**File: backend/src/middleware/tripManagerAuth.middleware.js**
```
Similar to auth.middleware.js:

Function: authenticateTripManager

Steps:
- Extract token from Authorization header
- Verify JWT
- Decode employeeId
- Find employee by ID
- Check role = 'trip_manager'
- Check isActive = true
- Attach employee to req.employee
- Call next()

Error handling tương tự auth middleware

Export
```

### D. Frontend: Trip Manager Web

**File: frontend/src/pages/tripManager/TripManagerLoginPage.jsx**
```
Structure:

1. Layout:
   - Different branding từ customer/operator
   - Blue/professional theme

2. Form:
   - Employee ID (input)
   - Password (password input)
   - "Remember me" checkbox
   - Login button

3. Handler:
   - Submit: Call tripManagerApi.login()
   - Save token to localStorage (separate key: 'tripManagerToken')
   - Redirect to /trip-manager/dashboard

Styling:
- Full-screen background
- Centered form card
- Bus/travel imagery
```

**File: frontend/src/services/tripManagerApi.js**
```
API functions:

- login(credentials): POST /trip-manager/login
- getMe(): GET /trip-manager/me
- getAssignedTrips(params): GET /trip-manager/trips
- getTripDetails(tripId): GET /trip-manager/trips/:id
- verifyTicket(tripId, qrData): POST /trip-manager/trips/:tripId/verify-ticket
- getPassengers(tripId): GET /trip-manager/trips/:tripId/passengers
- updateJourneyStatus(tripId, status): PUT /trip-manager/trips/:tripId/journey-status
```

**File: frontend/src/components/tripManager/TripManagerLayout.jsx**
```
Layout structure:

1. Header:
   - Logo
   - App name: "Trip Manager"
   - Employee name + avatar
   - Dropdown: Profile, Logout

2. Navigation (tabs/menu):
   - Dashboard
   - Active Trip
   - Trip History

3. Content area:
   - {children}

Styling: Clean, mobile-friendly (trip managers dùng tablet/mobile)
```

**File: frontend/src/pages/tripManager/TripManagerDashboard.jsx**
```
Structure:

1. Welcome section:
   - "Welcome, [Employee Name]"
   - Today's date

2. Assigned Trips:
   - Tabs:
     * Upcoming
     * Active
     * Completed

   - List of trip cards:
     Each card:
     - Route (origin → destination)
     - Departure date & time
     - Bus number
     - Status badge
     - Passenger count (checked in / total)
     - Action button:
       * Upcoming: "View Details"
       * Active: "Start Check-in" (navigate to scanner)

3. Quick Stats:
   - Total trips today
   - Total passengers today
   - Completion rate

Handlers:
- useEffect: Fetch assigned trips
- handleViewTrip: Navigate to trip detail
- handleStartCheckIn: Navigate to QR scanner
```

---

## 📦 BƯỚC 4.4: QR CODE SCANNER & VERIFICATION

### A. Backend: Ticket Verification

**File: backend/src/controllers/tripManager.controller.js (thêm functions)**
```
5. verifyTicket (protected, trip_manager)
   Input: { tripId, qrData }

   Steps:
   1. Find trip by tripId
   2. Verify trip.tripManager = req.employee._id
   3. Call qr.service.verifyQR(qrData, tripId):
      - Returns { isValid, ticket, booking, passengers, seats, message }

   4. Nếu not valid:
      - Return 400 với error message

   5. Nếu valid:
      a. Check ticket.status:
         - Nếu 'used': Return error "Ticket already used"
         - Nếu 'cancelled': Return error "Ticket cancelled"
         - Nếu 'valid': Continue

      b. Mark ticket as used:
         - ticket.status = 'used'
         - ticket.usedAt = now
         - ticket.checkedInBy = req.employee._id
         - Save ticket

      c. Update booking passenger boarding status:
         - booking.seats.forEach(seat => seat.boardingStatus = 'checked_in')
         - booking.checkInTime = now
         - Save booking

      d. Emit WebSocket event:
         - io.to(`trip:${tripId}`).emit('passenger_checked_in', {
             seats: booking.seats.map(s => s.seatNumber),
             passengers: passengers
           })

      e. Return success response:
         {
           success: true,
           message: 'Ticket verified successfully',
           ticket: ticket,
           booking: booking,
           passengers: passengers.map(p => ({
             name: p.fullName,
             seat: p.seatNumber,
             phone: p.phone
           }))
         }

6. getPassengerList (protected, trip_manager)
   Input: tripId

   Steps:
   1. Find trip
   2. Verify assignment
   3. Find all bookings cho trip với status = 'confirmed'
   4. Aggregate passenger data:
      - Flatten all booking.seats
      - For each passenger:
        {
          seatNumber,
          fullName,
          phone,
          idCard,
          boardingStatus: 'checked_in' | 'not_checked_in',
          checkInTime: (nếu checked in)
        }
   5. Sort by seat number
   6. Return list với stats:
      {
        totalPassengers: count,
        checkedIn: count,
        notCheckedIn: count,
        passengers: array
      }

7. updateJourneyStatus (protected, trip_manager)
   Input: tripId, { status, location }
   Status: 'not_started' | 'ongoing' | 'completed'

   Steps:
   1. Find trip, verify assignment
   2. Update trip:
      - status = status
      - journeyTracking.currentLocation = location (nếu có)
      - journeyTracking.statusHistory.push({
          status,
          timestamp: now,
          updatedBy: req.employee._id
        })
   3. Save trip
   4. Nếu status = 'ongoing':
      - Send notification đến passengers (optional)
   5. Nếu status = 'completed':
      - Update all tickets status = 'expired'
      - Send thank you + review request email
   6. Emit WebSocket event
   7. Return success

Export functions
```

### B. Frontend: QR Scanner Page

**File: frontend/src/pages/tripManager/QRScannerPage.jsx**
```
Structure:

1. Trip Info Header:
   - Route: Origin → Destination
   - Departure: Date, Time
   - Bus: [Number]
   - Status badge

2. Stats Cards (row):
   - Total Passengers (large number)
   - Checked In (green, large)
   - Not Checked In (orange, large)
   - Progress bar

3. Scanner Section (main):
   - Tabs:
     a. Camera Scan
     b. Upload Image

   Tab 1: Camera Scan
   - Video preview (full width)
   - Scan frame overlay (square guide)
   - Instructions: "Point camera at QR code"
   - Toggle camera (front/back) button
   - Manual input fallback button

   Tab 2: Upload Image
   - Drag & drop area
   - File input
   - Preview uploaded image
   - Scan button

4. Result Display (modal/alert):
   - Success:
     * Green checkmark icon
     * "Ticket Verified!"
     * Passenger info:
       - Name(s)
       - Seat(s)
       - Phone
     * Sound: Beep (success)
     * Auto-close after 3 seconds

   - Error:
     * Red X icon
     * Error message (e.g., "Ticket already used")
     * Details (nếu có)
     * Sound: Buzz (error)
     * Manual close button

5. Recent Scans (bottom section):
   - List (last 10 scans)
   - Each item:
     * Time
     * Passenger name
     * Seats
     * Status icon (green check)

State:
- trip (trip details)
- stats (passenger stats)
- scanning (boolean)
- scanResult (success/error object)
- recentScans (array)
- cameraActive (boolean)

Implementation:

useEffect:
1. Fetch trip details
2. Fetch passenger stats
3. Initialize QR scanner

QR Scanner Setup (using html5-qrcode):
```javascript
import { Html5QrcodeScanner } from 'html5-qrcode';

useEffect(() => {
  const scanner = new Html5QrcodeScanner(
    "qr-reader", // div id
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
      }
    }
  );

  scanner.render(onScanSuccess, onScanError);

  return () => {
    scanner.clear();
  };
}, []);

async function onScanSuccess(decodedText, decodedResult) {
  // decodedText = encrypted QR data
  setScanning(true);

  try {
    const result = await tripManagerApi.verifyTicket(tripId, decodedText);

    // Success
    setScanResult({
      success: true,
      data: result
    });

    playSuccessSound();
    updateStats();
    addToRecentScans(result);

    // Auto-close after 3s
    setTimeout(() => {
      setScanResult(null);
    }, 3000);

  } catch (error) {
    // Error
    setScanResult({
      success: false,
      message: error.response?.data?.message || 'Invalid QR code'
    });

    playErrorSound();
  } finally {
    setScanning(false);
  }
}

function onScanError(error) {
  // Ignore scan errors (chỉ log)
  console.warn('Scan error:', error);
}
```

Upload Image Scan:
```javascript
async function handleImageUpload(file) {
  const html5QrCode = new Html5Qrcode("qr-reader");

  try {
    const decodedText = await html5QrCode.scanFile(file, true);
    await onScanSuccess(decodedText);
  } catch (error) {
    setScanResult({
      success: false,
      message: 'Could not read QR code from image'
    });
  }
}
```

WebSocket for real-time updates:
```javascript
useEffect(() => {
  socket.on('passenger_checked_in', (data) => {
    // Update stats
    updateStats();
    // Show notification
    notification.success({
      message: 'New Check-in',
      description: `${data.passengers[0].name} checked in`
    });
  });

  return () => {
    socket.off('passenger_checked_in');
  };
}, []);
```
```

**File: frontend/src/pages/tripManager/PassengerListPage.jsx**
```
Structure:

1. Header:
   - Title: "Passenger List"
   - Trip info summary

2. Stats row (same as scanner page)

3. Filters:
   - Status filter: All, Checked In, Not Checked In
   - Search: By name, seat, phone

4. Passenger Table:
   Columns:
   - Seat Number (sortable)
   - Full Name (sortable)
   - Phone
   - ID Card
   - Status (badge: checked in/not checked in)
   - Check-in Time
   - Actions:
     * Manual check-in button (nếu not checked in)

   Features:
   - Sort
   - Filter
   - Search
   - Export to Excel

5. Bulk Actions:
   - Select all checkbox
   - Bulk check-in (nếu operator cho phép)

6. Refresh button (update real-time)

Handlers:
- Fetch passengers on mount
- Filter/search/sort passengers
- Manual check-in (nếu không có QR):
  - Confirm modal
  - Call API (create manual check-in record)
- Export Excel:
  - Generate Excel file với passenger list
  - Download
```

---

## 📦 BƯỚC 4.5: TICKET CANCELLATION & CHANGE

### A. Cancellation Service

**File: backend/src/services/cancellation.service.js**
```
Functions:

1. calculateRefund(booking, trip)
   Input: booking, trip objects

   Steps:
   1. Get cancellation policy từ trip
   2. Calculate hours until departure:
      - hoursUntil = (trip.departureTime - now) / (1000 * 60 * 60)

   3. Find applicable refund rule:
      - Loop through trip.cancellationPolicy.rules
      - Sort by hoursBeforeDeparture descending
      - Find first rule where hoursUntil >= hoursBeforeDeparture

   4. Calculate refund:
      - totalPaid = booking.pricing.finalTotal
      - refundPercentage = rule.refundPercentage
      - refundAmount = totalPaid * refundPercentage / 100
      - cancellationFee = totalPaid - refundAmount

   5. Return object:
      {
        canCancel: true/false,
        refundPercentage: number,
        refundAmount: number,
        cancellationFee: number,
        reason: string (nếu canCancel = false)
      }

2. processRefund(payment, amount, reason)
   Input: payment object, refund amount, reason

   Steps:
   1. Check payment status = 'success'
   2. Check payment method supports refund
   3. Call payment gateway refund API:
      - VNPay: Call VNPay refund API
      - MoMo: Call MoMo refund API
      - Etc.

   4. Create refund record:
      - Update Payment document:
        * Add refund info
        * Update status
        * refundAmount
        * refundedAt
        * refundReason

   5. Return refund result

3. cancelBooking(bookingId, userId/sessionId, reason)
   Input: bookingId, identifier, reason

   Steps:
   1. Find booking, populate trip, payment
   2. Verify ownership
   3. Calculate refund:
      - result = calculateRefund(booking, trip)
      - If not canCancel: Throw error

   4. Update booking:
      - status = 'cancelled'
      - cancellationReason = reason
      - cancelledAt = now
      - Save

   5. Release seats:
      - Remove from trip.bookedSeats
      - Increase trip.availableSeats
      - Save trip

   6. Cancel ticket:
      - Update ticket.status = 'cancelled'
      - Save

   7. Process refund (nếu đã paid):
      - If refundAmount > 0:
        * processRefund(payment, refundAmount, reason)

   8. Send notifications:
      - Email confirmation
      - SMS confirmation

   9. Return cancellation result

Export functions
```

### B. Update Booking Controller

**File: backend/src/controllers/booking.controller.js**
```
Update cancelBooking function:

Input: bookingId, { reason }

Steps:
1. Get userId/sessionId từ req
2. Call cancellation.service.cancelBooking(bookingId, identifier, reason)
3. Return result
```

### C. Ticket Change (Optional - Nice to have)

**File: backend/src/services/ticketChange.service.js**
```
Functions:

1. changeTicket(bookingId, newTripId, newSeats)
   Input: original booking, new trip, new seats

   Steps:
   1. Validate new trip exists, có available seats
   2. Calculate price difference:
      - oldPrice = original booking total
      - newPrice = new trip price * seats
      - difference = newPrice - oldPrice

   3. Nếu difference > 0:
      - Require payment cho phần chênh lệch
      - Create payment request

   4. Nếu difference < 0:
      - Calculate refund
      - Process refund

   5. Cancel old booking:
      - Don't charge cancellation fee (vì đổi vé)
      - Release old seats

   6. Create new booking:
      - Same passenger info
      - New trip, new seats
      - status = pending (nếu cần pay) hoặc confirmed

   7. Link old and new bookings:
      - oldBooking.changedTo = newBooking._id
      - newBooking.changedFrom = oldBooking._id

   8. Return change result

This is complex - có thể skip cho Phase 4 nếu thiếu thời gian
```

### D. Frontend: Cancel Booking

**File: frontend/src/pages/customer/MyTicketsPage.jsx**
```
Update existing page (từ Phase 3):

For each ticket:
- Add "Cancel" button (nếu upcoming và not checked in)
- Click Cancel:
  - Open modal

Cancel Modal:
Structure:
1. Warning message
2. Cancellation policy display:
   - Hours until departure: X
   - Refund percentage: Y%
   - Refund amount: Z VND
   - Cancellation fee: F VND

3. Reason select:
   - Change of plans
   - Found better option
   - Emergency
   - Other (textarea)

4. Confirmation:
   - Checkbox: "I understand the cancellation policy"
   - Cancel button (secondary)
   - Confirm Cancellation button (danger)

Handler:
- handleConfirmCancel:
  - Call API cancel booking
  - On success:
    * Show success message
    * Display refund info
    * Refresh ticket list
  - On error:
    * Show error message
```

---

## 📦 BƯỚC 4.6: FRONTEND TICKET DISPLAY

### A. My Tickets Page

**File: frontend/src/pages/customer/MyTicketsPage.jsx**
```
Full implementation:

Structure:

1. Header:
   - Title: "My Tickets"
   - Tabs:
     * Upcoming Trips
     * Past Trips
     * Cancelled

2. Ticket List:
   - For each ticket, display TicketCard component

3. Empty State (nếu no tickets):
   - Icon
   - Message: "No tickets yet"
   - Button: "Book a Trip"

State:
- tickets (array)
- filter (upcoming/past/cancelled)
- loading

Handlers:
- useEffect: Fetch tickets based on filter
- handleFilterChange: Switch tabs, refetch
- handleViewTicket: Open ticket detail modal
- handleCancelTicket: Open cancel modal
```

**File: frontend/src/components/customer/TicketCard.jsx**
```
Props:
- ticket (object)
- booking (object)
- trip (object)

Structure:

Card layout:
1. Header:
   - Status badge (confirmed/used/cancelled)
   - Booking code

2. Trip Info:
   - Route: Origin → Destination (large, bold)
   - Departure: Date, Time
   - Arrival: Time
   - Duration

3. Passenger Info:
   - Seats: A1, A2 (chips)
   - Names: (comma separated)

4. Actions (button group):
   - "View Ticket" (primary)
   - "Download PDF" (secondary)
   - "Cancel" (danger) - nếu upcoming

Styling:
- Card với shadow
- Color code theo status:
  * Confirmed: Blue border
  * Used: Green border
  * Cancelled: Red border
- Responsive
```

**File: frontend/src/components/customer/TicketDetailModal.jsx**
```
Props:
- visible (boolean)
- ticket (object)
- onClose (function)

Structure:

Modal (full screen on mobile, dialog on desktop):

1. Header:
   - Title: "E-Ticket"
   - Close button

2. Content (scrollable):

   a. Booking Information:
      - Booking Code (large)
      - Ticket Code
      - Issued Date
      - Status badge

   b. Trip Information:
      - Route (origin → destination)
      - Operator (logo + name + rating)
      - Departure date & time
      - Arrival time
      - Duration
      - Bus: Type, Number
      - Amenities icons

   c. Passenger Information:
      - Table:
        | Seat | Name | Phone | ID Card |
      - For each passenger

   d. Pickup & Dropoff:
      - Pickup point: Name, Address
      - Dropoff point: Name, Address

   e. Pricing:
      - Base price × seats
      - Discount (nếu có)
      - Total paid

   f. QR Code:
      - Center-aligned
      - Large QR image
      - Instruction: "Show this QR code at check-in"
      - Ticket code below

3. Footer (sticky):
   - Download PDF button (primary)
   - Share button
   - Cancel button (nếu applicable)

Implementation:
- Display QR from ticket.qrCodeImage (base64)
- Download PDF:
  - Fetch from ticket.pdfUrl
  - Open in new tab hoặc trigger download
- Share:
  - Copy booking link
  - Share via email/SMS (Web Share API)
```

### B. Guest Ticket Lookup

**File: frontend/src/pages/customer/GuestTicketLookupPage.jsx**
```
Structure:

1. Header:
   - Title: "Lookup Your Ticket"
   - Subtitle: "Enter your booking code and email/phone"

2. Form:
   - Booking Code (input, uppercase)
   - Email or Phone (input)
   - Lookup button

3. Handler:
   - handleSubmit:
     - Call API getBookingByCode
     - On success:
       * Open TicketDetailModal với ticket data
     - On error:
       * Show error: "Booking not found or invalid credentials"

4. Help Section:
   - "Where to find booking code?"
   - "Check your email or SMS"
   - Contact support link

Styling:
- Clean, simple
- Guest-friendly
```

---

## ✅ DELIVERABLES PHASE 4

Sau khi hoàn thành Phase 4:

### Backend
- ✅ Ticket model với QR code
- ✅ QR generation service (encryption)
- ✅ PDF ticket generation service
- ✅ Email service với booking confirmation, reminders
- ✅ SMS service với notifications
- ✅ OTP service
- ✅ Automated notification scheduler (cron jobs)
- ✅ Trip manager authentication
- ✅ QR verification API
- ✅ Passenger list API
- ✅ Cancellation service với refund calculation
- ✅ Ticket APIs (view, download, resend)

### Frontend
- ✅ Trip manager login page
- ✅ Trip manager dashboard
- ✅ QR scanner page (camera + upload)
- ✅ Passenger list page
- ✅ My Tickets page (customer)
- ✅ Ticket detail modal
- ✅ Guest ticket lookup page
- ✅ Cancel booking flow

### Testing
- ✅ Ticket được generate sau booking confirm
- ✅ PDF ticket có thể download
- ✅ Email/SMS được gửi
- ✅ Trip manager có thể login
- ✅ QR scanner hoạt động (camera + upload)
- ✅ Ticket verification hoạt động
- ✅ Passenger list real-time update
- ✅ Cancel booking với refund calculation
- ✅ Reminders được gửi tự động

---

# PHASE 5: BUS OPERATOR ADMIN

**Thời gian:** 2 tuần
**Độ ưu tiên:** 🟡 Trung bình

## MỤC TIÊU PHASE 5
Hoàn thiện operator dashboard với analytics, reports, vouchers

---

## 📦 BƯỚC 5.1: OPERATOR DASHBOARD & ANALYTICS

### A. Dashboard Service

**File: backend/src/services/dashboard.service.js**
```
Functions:

1. getOperatorDashboardStats(operatorId, dateRange)
   Input: operatorId, { startDate, endDate }

   Steps:
   1. Aggregate revenue:
      - Find payments where booking.trip.operator = operatorId
      - Filter by date range
      - Sum amounts
      - Group by day/month
      - Return revenue metrics:
        {
          today: amount,
          thisWeek: amount,
          thisMonth: amount,
          thisYear: amount,
          previousMonth: amount,
          growth: percentage
        }

   2. Aggregate bookings:
      - Count bookings
      - Group by status
      - Return booking metrics:
        {
          total: count,
          confirmed: count,
          pending: count,
          cancelled: count,
          todayBookings: count
        }

   3. Aggregate trips:
      - Count trips
      - Group by status
      - Return trip metrics:
        {
          totalTrips: count,
          upcomingTrips: count,
          ongoingTrips: count,
          completedTrips: count,
          todayTrips: count
        }

   4. Calculate occupancy rate:
      - For completed trips:
        * Average of (bookedSeats / totalSeats) * 100
      - Return occupancyRate: percentage

   5. Get rating:
      - Return operator.rating, operator.totalReviews

   6. Top routes:
      - Aggregate bookings by route
      - Sort by count
      - Return top 5 routes với booking count

   7. Return combined dashboard object:
      {
        revenue: {...},
        bookings: {...},
        trips: {...},
        occupancyRate: number,
        rating: number,
        topRoutes: [...]
      }

2. getRevenueTrend(operatorId, period)
   Period: 'week' | 'month' | 'year'

   Steps:
   - Aggregate revenue by day/month
   - Return array of { date, revenue }
   - For chart display

3. getBookingTrend(operatorId, period)
   - Similar to revenue trend
   - Return array of { date, bookings }

Export functions
```

### B. Dashboard Controller

**File: backend/src/controllers/operator.controller.js (update)**
```
Update getDashboardStats function:

Input: query params { startDate, endDate, period }

Steps:
1. Get operatorId từ req.operator._id
2. Parse dateRange từ query hoặc default (this month)
3. Call dashboard.service.getOperatorDashboardStats(operatorId, dateRange)
4. Call dashboard.service.getRevenueTrend(operatorId, period)
5. Call dashboard.service.getBookingTrend(operatorId, period)
6. Combine results
7. Return dashboard data
```

### C. Frontend: Operator Dashboard

**File: frontend/src/pages/operator/OperatorDashboard.jsx**
```
Full implementation (đã có placeholder từ Phase 2):

Structure:

1. Header:
   - Welcome message: "Welcome back, [Operator Name]"
   - Date range picker

2. Stats Cards Row (4 cards):

   Card 1: Total Revenue
   - Icon: Dollar sign
   - Value: [Amount] VND (large)
   - Subtitle: "This month"
   - Growth indicator: +X% vs last month (green/red)

   Card 2: Total Bookings
   - Icon: Ticket
   - Value: [Count] (large)
   - Subtitle: "[X] today"
   - Breakdown: Confirmed, Pending, Cancelled

   Card 3: Active Trips
   - Icon: Bus
   - Value: [Count]
   - Subtitle: "[X] ongoing, [Y] upcoming"
   - Quick link: "View all trips"

   Card 4: Average Rating
   - Icon: Star
   - Value: [Rating] / 5.0
   - Subtitle: "Based on [X] reviews"
   - Stars display

3. Charts Row:

   Chart 1: Revenue Trend (col-md-8)
   - Line chart
   - X-axis: Dates
   - Y-axis: Revenue
   - Period selector: Week, Month, Year
   - Use Recharts library

   Chart 2: Occupancy Rate (col-md-4)
   - Progress circle / Gauge
   - Show percentage
   - Color: Green (>80%), Yellow (50-80%), Red (<50%)

4. Top Routes Table:
   - Title: "Top Performing Routes"
   - Columns:
     | Route | Total Bookings | Revenue | Avg Occupancy |
   - Top 5 routes
   - Link: "View all routes"

5. Upcoming Trips Section:
   - Title: "Upcoming Trips (Next 7 days)"
   - Table:
     | Date | Route | Bus | Departure | Booked Seats | Status |
   - Max 10 trips
   - Actions: View, Edit

6. Quick Actions (sidebar or floating):
   - Button: "Create Trip"
   - Button: "Create Voucher"
   - Button: "View Reports"

State:
- dashboardData (object)
- dateRange (start, end)
- period ('week' | 'month' | 'year')
- loading

Handlers:
- useEffect: Fetch dashboard data on mount và khi dateRange change
- handleDateRangeChange: Update date range, refetch
- handlePeriodChange: Update period, refetch trend data

Implementation Example (Recharts):
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={revenueTrend}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="revenue"
      stroke="#0ea5e9"
      strokeWidth={2}
      activeDot={{ r: 8 }}
    />
  </LineChart>
</ResponsiveContainer>
```
```

---

## 📦 BƯỚC 5.2: VOUCHER MANAGEMENT

### A. Voucher Model

**File: backend/src/models/Voucher.js**
```
Schema fields:

Basic Info:
- code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  }
  // E.g., SUMMER20, NEWYEAR50

- operator: {
    type: Schema.Types.ObjectId,
    ref: 'BusOperator',
    required: true,
    index: true
  }

Discount:
- discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  }

- discountValue: {
    type: Number,
    required: true,
    min: 0
  }
  // If percentage: 1-100
  // If fixed: amount in VND

- maxDiscountAmount: {
    type: Number
  }
  // Max discount cho percentage type

Conditions:
- minBookingAmount: {
    type: Number,
    default: 0
  }
  // Minimum booking total để apply voucher

- applicableRoutes: [{
    type: Schema.Types.ObjectId,
    ref: 'Route'
  }]
  // Empty = all routes

- applicableBusTypes: [{
    type: String,
    enum: ['limousine', 'sleeper', 'seater', 'double_decker']
  }]
  // Empty = all types

Validity:
- startDate: {
    type: Date,
    required: true
  }

- endDate: {
    type: Date,
    required: true
  }

- isActive: {
    type: Boolean,
    default: true
  }

Usage Limits:
- usageLimit: {
    type: Number,
    default: null
  }
  // null = unlimited

- usageLimitPerUser: {
    type: Number,
    default: 1
  }

- usageCount: {
    type: Number,
    default: 0
  }

- usedBy: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date, default: Date.now },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' }
  }]

Description:
- name: String
- description: String

Timestamps

Indexes:
- code (unique)
- operator + isActive
- startDate + endDate

Methods:
- isValid(): Check active, not expired, usage limit
- canBeUsedBy(userId): Check user-specific usage limit
- calculateDiscount(bookingAmount): Calculate discount amount
```

### B. Voucher Service

**File: backend/src/services/voucher.service.js**
```
Functions:

1. validateVoucher(code, bookingData)
   Input: voucher code, { tripId, totalAmount, userId }

   Steps:
   1. Find voucher by code (case-insensitive)
   2. Check voucher exists
   3. Check isActive = true
   4. Check date valid (now between startDate and endDate)
   5. Check usage limit:
      - If usageLimit not null:
        * Check usageCount < usageLimit
   6. Check user usage limit (nếu có userId):
      - Count voucher.usedBy where user = userId
      - Check count < usageLimitPerUser
   7. Check booking amount >= minBookingAmount
   8. Find trip, check conditions:
      - If applicableRoutes not empty:
        * Check trip.route in applicableRoutes
      - If applicableBusTypes not empty:
        * Check trip.bus.busType in applicableBusTypes
   9. Calculate discount:
      - If discountType = 'percentage':
        * discount = totalAmount * discountValue / 100
        * If maxDiscountAmount: discount = min(discount, maxDiscountAmount)
      - If discountType = 'fixed':
        * discount = discountValue
      - discount = min(discount, totalAmount) // không vượt quá total
   10. Return result:
       {
         isValid: true,
         voucher: voucher object,
         discountAmount: number,
         finalAmount: totalAmount - discountAmount
       }

   Errors:
   - "Invalid voucher code"
   - "Voucher expired"
   - "Voucher usage limit reached"
   - "You've already used this voucher"
   - "Minimum booking amount not met"
   - "Voucher not applicable to this route/bus type"

2. applyVoucher(voucherId, bookingId, userId)
   Called after booking confirmed:

   Steps:
   - Find voucher
   - Increment usageCount
   - Add to usedBy array:
     { user: userId, booking: bookingId, usedAt: now }
   - Save voucher

Export functions
```

### C. Voucher Controller

**File: backend/src/controllers/voucher.controller.js (tạo mới)**
```
Functions:

1. createVoucher (protected, operator)
   Input: {
     code, discountType, discountValue, maxDiscountAmount,
     minBookingAmount,
     applicableRoutes, applicableBusTypes,
     startDate, endDate,
     usageLimit, usageLimitPerUser,
     name, description
   }

   Steps:
   - Validate input
   - Check code chưa tồn tại
   - Create voucher với operator = req.operator._id
   - Return created voucher

2. getVouchers (protected, operator)
   Query: page, limit, isActive

   - Find vouchers của operator
   - Filter theo isActive
   - Sort by createdAt desc
   - Paginate
   - Return vouchers

3. getVoucherById (protected, operator)
   - Find voucher
   - Check belongs to operator
   - Return voucher với usage stats

4. updateVoucher (protected, operator)
   - Find voucher, check ownership
   - Update allowed fields (không cho update usageCount)
   - Return updated voucher

5. deleteVoucher (protected, operator)
   - Find voucher
   - Set isActive = false (soft delete)
   - Return success

6. validateVoucherForBooking (public)
   Input: { code, tripId, totalAmount }

   - Call voucher.service.validateVoucher()
   - Return validation result

7. getVoucherStats (protected, operator)
   - Aggregate voucher usage
   - Return stats:
     {
       totalVouchers: count,
       activeVouchers: count,
       totalUsage: sum(usageCount),
       topVouchers: [top 5 by usage]
     }

Export functions
```

### D. Voucher Routes

**File: backend/src/routes/voucher.routes.js**
```
Operator routes (protected):
- POST /operators/vouchers
- GET /operators/vouchers
- GET /operators/vouchers/:id
- PUT /operators/vouchers/:id
- DELETE /operators/vouchers/:id
- GET /operators/vouchers/stats

Public routes:
- POST /vouchers/validate

Mount in main routes
```

### E. Frontend: Voucher Management

**File: frontend/src/pages/operator/VouchersPage.jsx**
```
Structure:

1. Header:
   - Title: "Voucher Management"
   - Button: "Create Voucher"

2. Stats Cards:
   - Total Vouchers
   - Active Vouchers
   - Total Usage
   - Total Discount Given

3. Vouchers Table:
   Columns:
   - Code (bold)
   - Name
   - Discount (e.g., "20%" or "50,000đ")
   - Valid Period (start - end dates)
   - Usage (X / Limit)
   - Status (Active/Expired badge)
   - Actions (Edit, Delete, View Stats)

   Features:
   - Filter: All, Active, Expired
   - Search by code/name
   - Sort by usage, created date

4. Handlers:
   - Fetch vouchers
   - Create voucher (open modal)
   - Edit voucher
   - Delete (deactivate) voucher
   - View stats (open stats modal)
```

**File: frontend/src/components/operator/VoucherFormModal.jsx**
```
Form sections:

1. Basic Info:
   - Code (input, uppercase, auto-generate button)
   - Name
   - Description (textarea)

2. Discount:
   - Discount Type (radio: Percentage, Fixed Amount)
   - Discount Value (number input)
     * If percentage: Show "%"
     * If fixed: Show "VND"
   - Max Discount Amount (nếu percentage)

3. Conditions:
   - Minimum Booking Amount
   - Applicable Routes (multi-select)
     * Empty = all routes
   - Applicable Bus Types (checkboxes)
     * Empty = all types

4. Validity:
   - Start Date & Time
   - End Date & Time

5. Usage Limits:
   - Total Usage Limit (number, checkbox for unlimited)
   - Usage Per User (number, default: 1)

6. Preview:
   - Show example: "Get 20% off (max 100,000đ) on bookings above 500,000đ"

Buttons:
- Cancel
- Create / Update

Validation:
- Code: Required, unique, alphanumeric + underscore
- Discount value: Required, > 0
- Dates: Start < End, Start >= today
```

**File: frontend/src/components/operator/VoucherStatsModal.jsx**
```
Display voucher usage stats:

1. Overview:
   - Total times used
   - Total discount given
   - Unique users

2. Usage Over Time:
   - Line chart (usage by date)

3. Top Users:
   - Table: User, Times Used, Total Discount

4. Usage by Route:
   - Table: Route, Usage Count
```

---

## 📦 BƯỚC 5.3: REPORTS & ANALYTICS

### A. Report Service

**File: backend/src/services/report.service.js**
```
Functions:

1. getRevenueReport(operatorId, options)
   Options: { startDate, endDate, groupBy: 'day'|'month' }

   Steps:
   - Find payments where booking.trip.operator = operatorId
   - Filter by date range
   - Aggregate revenue:
     * Group by groupBy period
     * Sum amounts
     * Count transactions
   - Calculate:
     * Total revenue
     * Average revenue per booking
     * Total bookings
   - Return report data:
     {
       summary: {
         totalRevenue,
         totalBookings,
         avgRevenuePerBooking,
         totalRefunds
       },
       breakdown: [
         { date: '2024-01-01', revenue: 1000000, bookings: 10 },
         ...
       ]
     }

2. getRevenueByRoute(operatorId, dateRange)
   - Aggregate bookings by route
   - Sum revenue per route
   - Calculate occupancy rate per route
   - Sort by revenue desc
   - Return top routes với revenue

3. getCancellationReport(operatorId, dateRange)
   - Find cancelled bookings
   - Aggregate:
     * Total cancellations
     * Cancellation rate (cancelled / total bookings)
     * Total refunds
     * Cancellation reasons (group by reason)
   - Breakdown by:
     * Time before departure (24h+, 12-24h, etc.)
     * Route
   - Return report

4. getGrowthReport(operatorId, dateRange)
   - Compare với previous period (same duration)
   - Calculate growth metrics:
     * Revenue growth %
     * Booking growth %
     * New customers
     * Repeat customers
   - Return growth report

5. exportReportToExcel(reportData)
   Use library: exceljs

   Steps:
   - Create workbook
   - Add sheets:
     * Summary sheet
     * Detailed data sheet
   - Format cells (headers, currency, dates)
   - Add charts (if needed)
   - Return Excel buffer

Export functions
```

### B. Report Controller

**File: backend/src/controllers/report.controller.js (tạo mới)**
```
Functions:

1. getRevenueReport (protected, operator)
   Query: { startDate, endDate, groupBy }

   - Call report.service.getRevenueReport()
   - Return report

2. getRevenueByRoute (protected, operator)
   - Call report.service.getRevenueByRoute()
   - Return report

3. getCancellationReport (protected, operator)
   - Call report.service.getCancellationReport()
   - Return report

4. getGrowthReport (protected, operator)
   - Call report.service.getGrowthReport()
   - Return report

5. exportRevenuReport (protected, operator)
   - Get report data
   - Generate Excel file
   - Set response headers:
     * Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     * Content-Disposition: attachment; filename=report.xlsx
   - Stream Excel buffer
   - Return file

Export functions
```

### C. Report Routes

**File: backend/src/routes/report.routes.js**
```
Protected (operator):
- GET /operators/reports/revenue
- GET /operators/reports/revenue-by-route
- GET /operators/reports/cancellation
- GET /operators/reports/growth
- GET /operators/reports/revenue/export (Excel file)

Mount in operator routes
```

### D. Frontend: Reports Page

**File: frontend/src/pages/operator/ReportsPage.jsx**
```
Structure:

1. Header:
   - Title: "Reports & Analytics"
   - Date Range Picker (global for all reports)

2. Tabs:
   - Revenue Report
   - Route Performance
   - Cancellation Report
   - Growth Report

Tab 1: Revenue Report
- Summary Cards:
  * Total Revenue
  * Total Bookings
  * Avg Revenue per Booking
  * Total Refunds

- Chart: Revenue Over Time
  * Line chart
  * Group by: Day, Week, Month (selector)

- Table: Detailed Breakdown
  * Date, Revenue, Bookings, Avg

- Export Button: "Export to Excel"

Tab 2: Route Performance
- Table:
  | Route | Revenue | Bookings | Avg Occupancy | Trend |
  - Sort by revenue desc
  - Top 10 routes
  - Trend indicator (arrow up/down)

- Chart: Revenue by Route (Bar chart)

Tab 3: Cancellation Report
- Summary:
  * Total Cancellations
  * Cancellation Rate
  * Total Refunds

- Pie Chart: Cancellation Reasons

- Table: Cancellations by Time Before Departure

Tab 4: Growth Report
- Compare current period vs previous:
  * Revenue Growth %
  * Booking Growth %
  * New vs Repeat Customers

- Charts:
  * Revenue comparison (bar chart)
  * Customer growth (line chart)

Implementation:
- Use Recharts for all charts
- Export Excel: Download file từ API
```

---

## 📦 BƯỚC 5.4: DYNAMIC PRICING

### A. Dynamic Pricing Logic

**File: backend/src/services/dynamicPricing.service.js**
```
Functions:

1. calculateDynamicPrice(trip, requestedSeats, bookingTime)
   Input: trip object, number of seats, booking timestamp

   Steps:
   1. Check trip.pricing.dynamicPricingEnabled
      - If false: Return basePrice

   2. Get base price:
      - basePrice = trip.pricing.basePrice

   3. Calculate occupancy rate:
      - occupancyRate = (trip.seatAvailability.bookedSeats.length / trip.seatAvailability.totalSeats) * 100

   4. Apply occupancy-based pricing:
      - Get rules from trip.pricing.dynamicPricingRules
      - If occupancyRate < lowDemand.threshold:
        * Apply discount: price = basePrice * (1 - lowDemand.discount/100)
      - If occupancyRate > highDemand.threshold:
        * Apply markup: price = basePrice * (1 + highDemand.markup/100)
      - Else: price = basePrice

   5. Calculate time-based pricing (optional):
      - Hours until departure:
        * hoursUntil = (trip.departureTime - bookingTime) / (1000 * 60 * 60)
      - Early bird discount (if > 7 days): -5%
      - Last minute markup (if < 24 hours): +10%

   6. Calculate bulk discount (nếu booking nhiều ghế):
      - If requestedSeats >= 4: Apply 5% discount

   7. Apply min/max price limits:
      - minPrice = basePrice * 0.5 (không giảm quá 50%)
      - maxPrice = basePrice * 2.0 (không tăng quá 2x)
      - price = clamp(price, minPrice, maxPrice)

   8. Round to nearest 1000 VND

   9. Return final price

2. updateTripDynamicPrice(tripId)
   Called khi booking mới được tạo:

   - Find trip
   - Recalculate dynamic price based on new occupancy
   - Update trip.pricing.finalPrice
   - Save trip
   - Emit WebSocket event (price updated)

Export functions
```

### B. Update Trip APIs

**File: backend/src/controllers/trip.controller.js (update)**
```
Add function:

getDynamicPrice (public)
   Input: tripId, { seats }

   - Find trip
   - Call dynamicPricing.service.calculateDynamicPrice(trip, seats, Date.now())
   - Return calculated price
```

### C. Frontend: Dynamic Price Display

**File: frontend/src/pages/customer/TripDetailPage.jsx (update)**
```
Add dynamic price display:

1. Fetch dynamic price khi select seats:
   - useEffect with dependency [selectedSeats]
   - Call API getDynamicPrice
   - Update displayed price

2. Show price changes:
   - If price different from base:
     * Show original price (strikethrough)
     * Show dynamic price (highlighted)
     * Show reason: "High demand" / "Early bird discount"

3. Update total price calculation với dynamic price
```

---

## 📦 BƯỚC 5.5: JOURNEY TRACKING

### A. Journey Status Update

**File: backend/src/controllers/tripManager.controller.js (đã có từ Phase 4.4)**
```
Function updateJourneyStatus đã implemented.

Enhance:
- Add location tracking
- Notify passengers on status changes
```

### B. Frontend: Journey Tracking (Customer)

**File: frontend/src/pages/customer/TrackTripPage.jsx (tạo mới)**
```
Structure:

1. Header:
   - Trip info
   - Status badge (Not Started, Ongoing, Completed)

2. Map:
   - Google Maps integration
   - Show route
   - Show current bus location (nếu ongoing)
   - Show origin & destination markers

3. Timeline:
   - Status history:
     * Not Started
     * Ongoing (timestamp)
     * Completed (timestamp)
   - Vertical timeline với icons

4. Auto-refresh (WebSocket):
   - Listen to journey status updates
   - Update UI real-time

Access:
- Link trong ticket detail
- Accessible cho confirmed bookings
```

---

## ✅ DELIVERABLES PHASE 5

Sau khi hoàn thành Phase 5:

### Backend
- ✅ Dashboard service với comprehensive stats
- ✅ Revenue, booking, trip analytics
- ✅ Voucher model và management APIs
- ✅ Voucher validation service
- ✅ Report service (revenue, cancellation, growth)
- ✅ Excel export functionality
- ✅ Dynamic pricing service
- ✅ Journey tracking APIs

### Frontend
- ✅ Operator dashboard với charts
- ✅ Revenue/booking trend charts
- ✅ Top routes display
- ✅ Voucher management page
- ✅ Voucher creation/edit forms
- ✅ Reports page với multiple tabs
- ✅ Revenue, route, cancellation, growth reports
- ✅ Excel export functionality
- ✅ Dynamic price display
- ✅ Journey tracking page (customer)

### Testing
- ✅ Dashboard hiển thị correct stats
- ✅ Charts render correctly
- ✅ Voucher có thể tạo và validate
- ✅ Discount được apply correctly
- ✅ Reports generate accurate data
- ✅ Excel export hoạt động
- ✅ Dynamic pricing calculate correctly
- ✅ Journey status updates real-time

---

## 🎯 KẾT LUẬN PART 2

Sau khi hoàn thành Phases 4-5, bạn đã có:

### Complete Ticketing System
✅ **Electronic tickets:**
- QR code generation với encryption
- PDF tickets với professional design
- Email/SMS notifications
- Automated reminders

✅ **Trip management:**
- Trip manager web app
- QR code scanning (camera + upload)
- Real-time passenger list
- Journey status tracking

✅ **Cancellations:**
- Flexible cancellation policies
- Automated refund calculation
- Email/SMS confirmations

### Complete Operator Admin
✅ **Dashboard & Analytics:**
- Comprehensive statistics
- Revenue/booking trends
- Interactive charts
- Top route analysis

✅ **Voucher System:**
- Flexible discount types
- Usage limits
- Condition-based application
- Usage tracking

✅ **Reports:**
- Revenue reports
- Route performance
- Cancellation analysis
- Growth metrics
- Excel export

✅ **Advanced Features:**
- Dynamic pricing
- Journey tracking
- Real-time updates

### Ready for Phase 6
Tiếp theo sẽ implement:
- System admin dashboard
- User management
- Operator approval workflow
- Content management
- System-wide reports

---

**File này cover Phases 4-5 chi tiết. Tiếp tục với Part 3 (Phases 6-7) trong file riêng.**
