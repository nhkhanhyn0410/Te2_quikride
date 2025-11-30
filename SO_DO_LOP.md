# Sơ Đồ Lớp (Class Diagram) - Hệ Thống Đặt Vé Xe Buýt

## Sơ Đồ Tổng Quan

```mermaid
classDiagram
    %% Controllers Layer
    class AuthController {
        +register()
        +login()
        +logout()
        +refreshToken()
    }
    
    class BookingController {
        +holdSeats()
        +confirmBooking()
        +getBookings()
        +cancelBooking()
    }
    
    class TripController {
        +searchTrips()
        +getTripDetails()
        +createTrip()
        +updateTrip()
    }
    
    class PaymentController {
        +createPayment()
        +handleCallback()
        +getPaymentStatus()
    }
    
    class TicketController {
        +generateTicket()
        +verifyTicket()
        +downloadTicket()
    }
    
    %% Services Layer
    class AuthService {
        +createToken()
        +verifyToken()
        +hashPassword()
        +comparePassword()
    }
    
    class BookingService {
        +holdSeats()
        +confirmBooking()
        +calculatePrice()
        +validateBooking()
    }
    
    class TripService {
        +create()
        +search()
        +validateReferences()
        +updateAvailableSeats()
    }
    
    class PaymentService {
        +createPayment()
        +processCallback()
        +validatePayment()
        +handleRefund()
    }
    
    class TicketService {
        +generateTicket()
        +createQRCode()
        +validateTicket()
    }
    
    class SeatLockService {
        +lockSeats()
        +unlockSeats()
        +checkLockStatus()
        +extendLock()
    }
    
    class VoucherService {
        +validateVoucher()
        +applyDiscount()
        +markAsUsed()
    }
    
    class NotificationService {
        +sendEmail()
        +sendSMS()
        +sendBookingConfirmation()
    }
    
    class PDFService {
        +generateTicketPDF()
        +addQRCode()
        +formatTicketData()
    }
    
    class QRService {
        +generateQR()
        +encryptData()
        +decryptData()
        +validateQR()
    }
    
    class VNPayService {
        +createPaymentURL()
        +verifyCallback()
        +generateSignature()
    }
    
    class WebSocketService {
        +broadcastSeatUpdate()
        +joinTripRoom()
        +leaveRoom()
    }
    
    %% Utility Classes
    class AppError {
        +message: string
        +statusCode: number
        +isOperational: boolean
    }
    
    class ErrorBoundary {
        +componentDidCatch()
        +render()
    }
    
    %% Relationships - Controllers to Services
    AuthController --> AuthService : uses
    BookingController --> BookingService : uses
    TripController --> TripService : uses
    PaymentController --> PaymentService : uses
    TicketController --> TicketService : uses
    
    %% Service Dependencies
    BookingService --> SeatLockService : uses
    BookingService --> VoucherService : uses
    BookingService --> PaymentService : uses
    BookingService --> TripService : uses
    
    PaymentService --> VNPayService : uses
    PaymentService --> TicketService : uses
    PaymentService --> NotificationService : uses
    
    TicketService --> QRService : uses
    TicketService --> PDFService : uses
    
    TripService --> WebSocketService : uses
    
    NotificationService --> SMSService : uses
    
    %% Error Handling
    AuthController --> AppError : throws
    BookingController --> AppError : throws
    PaymentController --> AppError : throws
```

## Sơ Đồ Chi Tiết Theo Module

### 1. Authentication & User Management Module

```mermaid
classDiagram
    class AuthController {
        +register(req, res, next)
        +login(req, res, next)
        +logout(req, res, next)
        +refreshToken(req, res, next)
        +forgotPassword(req, res, next)
    }
    
    class UserController {
        +getProfile(req, res, next)
        +updateProfile(req, res, next)
        +changePassword(req, res, next)
        +deleteAccount(req, res, next)
    }
    
    class GuestController {
        +requestOTP(req, res, next)
        +verifyOTP(req, res, next)
        +getGuestSession(req, res, next)
    }
    
    class AuthService {
        -jwtSecret: string
        -jwtExpire: string
        +createToken(payload): string
        +verifyToken(token): object
        +hashPassword(password): string
        +comparePassword(password, hash): boolean
        +generateRefreshToken(): string
    }
    
    class UserService {
        +getProfile(userId): User
        +updateProfile(userId, data): User
        +changePassword(userId, passwords): boolean
        +deleteUser(userId): boolean
    }
    
    class OTPService {
        -otpLength: number
        -otpExpiry: number
        +generateOTP(): string
        +storeOTP(phone, otp): boolean
        +verifyOTP(phone, otp): boolean
        +cleanupExpiredOTPs(): void
    }
    
    class GuestSessionService {
        -sessionExpiry: number
        +generateGuestToken(phone): string
        +validateGuestSession(token): object
        +extendSession(token): string
    }
    
    AuthController --> AuthService
    UserController --> UserService
    GuestController --> OTPService
    GuestController --> GuestSessionService
    AuthService --> UserService
```

### 2. Booking & Trip Management Module

```mermaid
classDiagram
    class BookingController {
        +holdSeats(req, res)
        +confirmBooking(req, res)
        +getBookings(req, res)
        +cancelBooking(req, res)
        +getBookingDetails(req, res)
    }
    
    class TripController {
        +searchTrips(req, res)
        +getTripDetails(req, res)
        +createTrip(req, res)
        +updateTrip(req, res)
        +deleteTrip(req, res)
    }
    
    class BookingService {
        -lockDuration: number
        +holdSeats(holdData): Booking
        +confirmBooking(bookingId): Booking
        +calculateTotalPrice(seats, voucher): number
        +validateBookingData(data): boolean
        +cancelBooking(bookingId): boolean
    }
    
    class TripService {
        +create(operatorId, tripData): Trip
        +search(searchCriteria): Trip[]
        +validateReferences(operatorId, tripData): object
        +updateAvailableSeats(tripId, seatCount): Trip
        +getTripById(tripId): Trip
    }
    
    class SeatLockService {
        -lockDuration: number
        -redisClient: Redis
        +lockSeats(tripId, seats, userId): boolean
        +unlockSeats(tripId, seats): boolean
        +checkLockStatus(tripId, seats): object
        +extendLock(tripId, seats): boolean
        +cleanupExpiredLocks(): void
    }
    
    class SeatService {
        +lockSeatsForUser(tripId, seats, userId): boolean
        +unlockSeats(tripId, seats): boolean
        +getLockedSeats(tripId): string[]
        +isSeatsAvailable(tripId, seats): boolean
    }
    
    BookingController --> BookingService
    TripController --> TripService
    BookingService --> SeatLockService
    BookingService --> SeatService
    BookingService --> VoucherService
    TripService --> WebSocketService
```

### 3. Payment & Financial Module

```mermaid
classDiagram
    class PaymentController {
        +createPayment(req, res)
        +handleVNPayCallback(req, res)
        +getPaymentStatus(req, res)
        +processRefund(req, res)
    }
    
    class VoucherController {
        +createVoucher(req, res)
        +validateVoucher(req, res)
        +getVouchers(req, res)
        +updateVoucher(req, res)
    }
    
    class PaymentService {
        +createPayment(paymentData): Payment
        +processVNPayCallback(callbackData): Payment
        +validatePayment(paymentId): boolean
        +processRefund(paymentId, amount): Refund
        +calculateRefundAmount(booking): number
    }
    
    class VNPayService {
        -vnpTmnCode: string
        -vnpHashSecret: string
        -vnpUrl: string
        +createPaymentURL(paymentData): string
        +verifyCallback(callbackData): boolean
        +generateSignature(data): string
        +validateSignature(data, signature): boolean
    }
    
    class VoucherService {
        +createVoucher(voucherData): Voucher
        +validateVoucher(code, bookingData): object
        +applyDiscount(voucher, amount): number
        +markAsUsed(voucherId, bookingId): boolean
        +getAvailableVouchers(userId): Voucher[]
    }
    
    class CancellationService {
        -defaultPolicy: object
        +calculateRefund(booking): object
        +getCancellationPolicy(operatorId): object
        +processRefund(booking): Refund
        +validateCancellation(booking): boolean
    }
    
    class LoyaltyService {
        +calculatePoints(booking): number
        +awardPoints(userId, points): boolean
        +redeemPoints(userId, points): boolean
        +getPointsBalance(userId): number
    }
    
    PaymentController --> PaymentService
    VoucherController --> VoucherService
    PaymentService --> VNPayService
    PaymentService --> CancellationService
    BookingService --> VoucherService
    BookingService --> LoyaltyService
```

### 4. Ticket & Document Generation Module

```mermaid
classDiagram
    class TicketController {
        +generateTicket(req, res)
        +verifyTicket(req, res)
        +downloadTicketPDF(req, res)
        +resendTicket(req, res)
    }
    
    class TicketService {
        +generateTicket(bookingId): Ticket
        +createDigitalTicket(booking): object
        +validateTicket(ticketCode): boolean
        +getTicketByBooking(bookingId): Ticket
    }
    
    class PDFService {
        +generateTicketPDF(ticketData): Buffer
        +addQRCodeToPDF(pdf, qrCode): Buffer
        +formatTicketLayout(ticketData): object
        +addWatermark(pdf): Buffer
    }
    
    class QRService {
        -encryptionKey: string
        -algorithm: string
        +generateQRCode(ticketData): string
        +encryptTicketData(data): string
        +decryptTicketData(encryptedData): object
        +validateQRCode(qrCode): boolean
    }
    
    TicketController --> TicketService
    TicketService --> PDFService
    TicketService --> QRService
    PaymentService --> TicketService
```

### 5. Communication & Notification Module

```mermaid
classDiagram
    class NotificationService {
        -emailTransporter: object
        +sendEmail(emailData): boolean
        +sendSMS(smsData): boolean
        +sendBookingConfirmation(booking): boolean
        +sendPaymentConfirmation(payment): boolean
        +sendCancellationNotice(booking): boolean
    }
    
    class SMSService {
        -provider: string
        -apiKey: string
        +sendSMS(phone, message): boolean
        +sendOTP(phone, otp): boolean
        +validatePhoneNumber(phone): boolean
        +getDeliveryStatus(messageId): string
    }
    
    class WebSocketService {
        -io: SocketIO
        -connectedClients: Map
        +initialize(server): void
        +broadcastSeatUpdate(tripId, seatData): void
        +joinTripRoom(socketId, tripId): void
        +leaveRoom(socketId, roomId): void
        +notifyBookingUpdate(bookingId, status): void
    }
    
    NotificationService --> SMSService
    TripService --> WebSocketService
    BookingService --> NotificationService
    PaymentService --> NotificationService
```

### 6. System & Utility Module

```mermaid
classDiagram
    class SchedulerService {
        -jobs: Map
        +addJob(name, schedule, task): boolean
        +removeJob(name): boolean
        +startAllJobs(): void
        +stopAllJobs(): void
        +getJobStatus(name): object
    }
    
    class ReportService {
        +generateRevenueReport(operatorId, period): object
        +getBookingStatistics(operatorId): object
        +getTripPerformance(operatorId): object
        +exportReportToPDF(reportData): Buffer
    }
    
    class DashboardService {
        +getOperatorDashboard(operatorId): object
        +getAdminDashboard(): object
        +getRealTimeStats(operatorId): object
        +getRevenueChart(operatorId, period): object
    }
    
    class AppError {
        +message: string
        +statusCode: number
        +isOperational: boolean
        +constructor(message, statusCode)
    }
    
    class ErrorBoundary {
        +state: object
        +componentDidCatch(error, errorInfo): void
        +render(): ReactElement
        +static getDerivedStateFromError(error): object
    }
    
    SchedulerService --> BookingService
    SchedulerService --> SeatLockService
    ReportService --> DashboardService
```

## Mối Quan Hệ Chính

### Dependency Flow
1. **Controllers** → **Services** (Sử dụng business logic)
2. **Services** → **Other Services** (Phụ thuộc chức năng)
3. **Services** → **Models** (Tương tác database)
4. **Services** → **Utilities** (Sử dụng tiện ích)

### Key Dependencies
- `BookingService` phụ thuộc vào `SeatLockService`, `VoucherService`, `PaymentService`
- `PaymentService` phụ thuộc vào `VNPayService`, `TicketService`, `NotificationService`
- `TicketService` phụ thuộc vào `QRService`, `PDFService`
- `NotificationService` phụ thuộc vào `SMSService`

### Circular Dependency Prevention
- Sử dụng lazy loading cho các service có thể gây circular dependency
- Tách interface và implementation khi cần thiết
- Sử dụng dependency injection pattern

## Đặc Điểm Thiết Kế

1. **Layered Architecture**: Controller → Service → Model
2. **Single Responsibility**: Mỗi class có một trách nhiệm cụ thể
3. **Dependency Injection**: Services được inject vào controllers
4. **Error Handling**: Centralized error handling với AppError
5. **Real-time Updates**: WebSocket cho cập nhật trạng thái
6. **Security**: Encryption, JWT, OTP validation
7. **Scalability**: Redis cho caching và session management