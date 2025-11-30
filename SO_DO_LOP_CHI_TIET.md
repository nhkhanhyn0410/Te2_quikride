# Sơ Đồ Lớp Chi Tiết - Hệ Thống QuikRide Bus Booking

## 1. Sơ Đồ Lớp Tổng Quan

```mermaid
classDiagram
    %% ===== NHÓM QUẢN LÝ NGƯỜI DÙNG =====
    class User {
        -ObjectId _id
        -String email
        -String phone
        -String password
        -String fullName
        -String loyaltyTier
        -Integer totalPoints
        -Array pointsHistory
        -Array savedPassengers
        -Boolean isActive
        +register()
        +login()
        +verifyEmail()
        +updateProfile()
        +earnPoints()
        +redeemPoints()
        +checkTier()
    }

    class Operator {
        -ObjectId _id
        -String email
        -String companyName
        -String businessLicense
        -String verificationStatus
        -Float averageRating
        -Integer totalTrips
        -Float totalRevenue
        -Boolean isActive
        +register()
        +submitVerification()
        +createRoute()
        +addBus()
        +scheduleTrip()
        +viewReports()
        +createVoucher()
        +updateProfile()
    }

    class Employee {
        -ObjectId _id
        -ObjectId operatorId
        -String role
        -String fullName
        -String phone
        -String licenseNumber
        -String status
        -Date licenseExpiry
        +login()
        +updateProfile()
        +viewAssignedTrips()
        +updateTripStatus()
        +scanTicket()
        +reportIssue()
    }

    class Admin {
        -ObjectId _id
        -String username
        -String email
        -String role
        -Array permissions
        -Boolean isActive
        +login()
        +verifyOperator()
        +manageUsers()
        +handleComplaints()
        +createContent()
        +viewSystemReports()
        +moderateReviews()
    }

    %% ===== NHÓM HỆ THỐNG VẬN CHUYỂN =====
    class Route {
        -ObjectId _id
        -ObjectId operatorId
        -String routeCode
        -Object origin
        -Object destination
        -Array pickupPoints
        -Array dropoffPoints
        -Float distance
        -Integer estimatedDuration
        -Boolean isActive
        +calculateDistance()
        +addPickupPoint()
        +removePickupPoint()
        +updateStops()
        +validateRoute()
        +getEstimatedTime()
    }

    class Bus {
        -ObjectId _id
        -ObjectId operatorId
        -String busNumber
        -String busType
        -Object seatLayout
        -Integer totalSeats
        -Array amenities
        -String status
        -Date lastMaintenanceDate
        +configureSeatLayout()
        +updateAmenities()
        +scheduleMaintenance()
        +checkAvailability()
        +updateStatus()
        +getSeatMap()
    }

    class Trip {
        -ObjectId _id
        -ObjectId routeId
        -ObjectId busId
        -ObjectId driverId
        -ObjectId tripManagerId
        -DateTime departureTime
        -DateTime arrivalTime
        -Float basePrice
        -Float finalPrice
        -Integer availableSeats
        -Array bookedSeats
        -String status
        -Object journeyTracking
        +calculatePrice()
        +updateSeatAvailability()
        +startJourney()
        +updateLocation()
        +completeTrip()
        +cancelTrip()
        +getPassengerList()
    }

    %% ===== NHÓM HỆ THỐNG ĐẶT VÉ =====
    class Booking {
        -ObjectId _id
        -String bookingCode
        -ObjectId tripId
        -ObjectId customerId
        -ObjectId voucherId
        -Array seats
        -Object contactInfo
        -Float totalPrice
        -Float finalPrice
        -String status
        -String paymentMethod
        -Boolean isHeld
        -Date heldUntil
        +lockSeats()
        +releaseLock()
        +applyVoucher()
        +calculateTotal()
        +confirmBooking()
        +cancelBooking()
        +processPayment()
        +generateTicket()
    }

    class Payment {
        -ObjectId _id
        -String paymentCode
        -ObjectId bookingId
        -String paymentMethod
        -Float amount
        -String status
        -String transactionId
        -String paymentUrl
        -Date processedAt
        +initiatePayment()
        +processPayment()
        +verifyPayment()
        +handleCallback()
        +refundPayment()
        +updateStatus()
        +generateReceipt()
    }

    class Ticket {
        -ObjectId _id
        -String ticketCode
        -ObjectId bookingId
        -String qrCode
        -String qrCodeData
        -Array passengers
        -Object routeInfo
        -String status
        -Date verifiedAt
        -ObjectId verifiedBy
        +generateQRCode()
        +verifyTicket()
        +scanTicket()
        +sendTicketEmail()
        +updateStatus()
        +getTicketInfo()
    }

    class Voucher {
        -ObjectId _id
        -String code
        -ObjectId operatorId
        -String discountType
        -Float discountValue
        -Float maxDiscountAmount
        -Integer maxUsageTotal
        -Integer currentUsageCount
        -Date validUntil
        -Boolean isActive
        +validateVoucher()
        +applyDiscount()
        +checkUsageLimit()
        +incrementUsage()
        +deactivate()
        +getDiscountAmount()
    }

    %% ===== NHÓM ĐÁNH GIÁ & PHẢN HỒI =====
    class Review {
        -ObjectId _id
        -ObjectId userId
        -ObjectId bookingId
        -ObjectId tripId
        -ObjectId operatorId
        -Integer overallRating
        -Integer vehicleRating
        -Integer driverRating
        -Integer punctualityRating
        -String comment
        -Array images
        -String status
        -Boolean isVerified
        +submitReview()
        +updateRating()
        +moderateReview()
        +approveReview()
        +rejectReview()
        +calculateAverageRating()
    }

    class Complaint {
        -ObjectId _id
        -String ticketNumber
        -String subject
        -String description
        -String category
        -String priority
        -String status
        -ObjectId userId
        -ObjectId bookingId
        -ObjectId assignedTo
        -Array attachments
        -Array notes
        -Date resolutionDate
        +fileComplaint()
        +assignToAdmin()
        +updateStatus()
        +addNote()
        +resolveComplaint()
        +escalate()
        +closeComplaint()
    }

    %% ===== NHÓM QUẢN LÝ NỘI DUNG =====
    class Banner {
        -ObjectId _id
        -String title
        -String description
        -String imageUrl
        -String link
        -Boolean isActive
        -Integer displayOrder
        -Date validFrom
        -Date validUntil
        -ObjectId createdBy
        +createBanner()
        +updateBanner()
        +toggleActive()
        +reorder()
        +uploadImage()
        +scheduleBanner()
    }

    class Blog {
        -ObjectId _id
        -String title
        -String slug
        -String content
        -String excerpt
        -String featuredImage
        -ObjectId authorId
        -String category
        -Array tags
        -Boolean isPublished
        -Date publishedAt
        -Integer viewCount
        +createPost()
        +updateContent()
        +publishPost()
        +unpublishPost()
        +addTags()
        +incrementViews()
        +generateSlug()
    }

    class FAQ {
        -ObjectId _id
        -String question
        -String answer
        -String category
        -Integer displayOrder
        -Boolean isActive
        -Integer viewCount
        -ObjectId createdBy
        +addFAQ()
        +updateFAQ()
        +reorderFAQs()
        +toggleActive()
        +incrementViews()
        +searchFAQs()
    }

    %% ===== NHÓM DỊCH VỤ HỖ TRỢ =====
    class SeatLockService {
        -Map lockedSeats
        -Integer lockDuration
        +lockSeats(tripId, seatNumbers, userId)
        +releaseLock(tripId, seatNumbers)
        +checkLockStatus(tripId, seatNumber)
        +autoReleaseLocks()
        +extendLock(tripId, seatNumbers)
        +getLockedSeats(tripId)
    }

    class NotificationService {
        -Object emailConfig
        -Object smsConfig
        +sendEmail(to, subject, content)
        +sendSMS(phone, message)
        +pushNotification(userId, message)
        +sendBookingConfirmation(booking)
        +sendTicketEmail(ticket)
        +sendPaymentNotification(payment)
        +sendTripReminder(booking)
    }

    class LoyaltyService {
        -Object tierRules
        -Object pointRules
        +calculatePoints(bookingAmount)
        +updateTier(userId)
        +redeemRewards(userId, points)
        +getAvailableRewards(userId)
        +checkTierBenefits(tier)
        +processPointsEarning(booking)
    }

    class WebSocketService {
        -Map activeConnections
        +broadcastTripUpdate(tripId, data)
        +notifyBookingStatus(bookingId, status)
        +trackLocation(tripId, coordinates)
        +sendRealTimeNotification(userId, message)
        +joinTripRoom(tripId, userId)
        +leaveTripRoom(tripId, userId)
    }

    %% ===== QUAN HỆ GIỮA CÁC LỚP =====
    
    %% Quan hệ User Management
    Operator "1" --> "*" Employee : employs
    Operator "1" --> "*" Route : creates
    Operator "1" --> "*" Bus : owns
    Operator "1" --> "*" Trip : operates
    Operator "1" --> "*" Voucher : creates

    %% Quan hệ Transportation
    Route "1" --> "*" Trip : has
    Bus "1" --> "*" Trip : assigned_to
    Employee "1" --> "*" Trip : drives/manages

    %% Quan hệ Booking System
    User "1" --> "*" Booking : creates
    Trip "1" --> "*" Booking : receives
    Booking "1" --> "1" Payment : has
    Booking "1" --> "1" Ticket : generates
    Voucher "0..1" --> "*" Booking : applied_to

    %% Quan hệ Reviews & Complaints
    User "1" --> "*" Review : writes
    User "1" --> "*" Complaint : files
    Booking "1" --> "0..1" Review : reviewed_by
    Booking "1" --> "*" Complaint : about
    Admin "0..1" --> "*" Complaint : handles

    %% Quan hệ Content Management
    Admin "1" --> "*" Banner : creates
    Admin "1" --> "*" Blog : writes
    Admin "1" --> "*" FAQ : manages

    %% Quan hệ Services
    SeatLockService ..> Trip : locks_seats
    NotificationService ..> Booking : sends_notifications
    NotificationService ..> Payment : sends_notifications
    NotificationService ..> Ticket : sends_tickets
    LoyaltyService ..> User : manages_points
    LoyaltyService ..> Booking : calculates_points
    WebSocketService ..> Trip : broadcasts_updates
    WebSocketService ..> Booking : notifies_status
```

## 2. Sơ Đồ Lớp Theo Nhóm Chức Năng

### 2.1. Nhóm Quản Lý Người Dùng

```mermaid
classDiagram
    class User {
        -ObjectId _id
        -String email
        -String phone
        -String fullName
        -String loyaltyTier
        -Integer totalPoints
        -Boolean isActive
        +register()
        +login()
        +verifyEmail()
        +updateProfile()
        +earnPoints()
        +redeemPoints()
    }

    class Operator {
        -ObjectId _id
        -String companyName
        -String businessLicense
        -String verificationStatus
        -Float averageRating
        -Float totalRevenue
        +submitVerification()
        +createRoute()
        +addBus()
        +scheduleTrip()
        +viewReports()
    }

    class Employee {
        -ObjectId _id
        -ObjectId operatorId
        -String role
        -String licenseNumber
        -String status
        +viewAssignedTrips()
        +updateTripStatus()
        +scanTicket()
    }

    class Admin {
        -ObjectId _id
        -String username
        -String role
        -Array permissions
        +verifyOperator()
        +manageUsers()
        +handleComplaints()
    }

    Operator "1" --> "*" Employee : employs
    Admin "1" --> "*" Operator : verifies
    Admin "1" --> "*" User : manages
```

### 2.2. Nhóm Hệ Thống Vận Chuyển

```mermaid
classDiagram
    class Route {
        -ObjectId _id
        -ObjectId operatorId
        -String routeCode
        -Object origin
        -Object destination
        -Float distance
        +calculateDistance()
        +addPickupPoint()
        +updateStops()
    }

    class Bus {
        -ObjectId _id
        -ObjectId operatorId
        -String busNumber
        -String busType
        -Object seatLayout
        -Integer totalSeats
        +configureSeatLayout()
        +updateAmenities()
        +scheduleMaintenance()
    }

    class Trip {
        -ObjectId _id
        -ObjectId routeId
        -ObjectId busId
        -ObjectId driverId
        -DateTime departureTime
        -Float finalPrice
        -String status
        +calculatePrice()
        +updateSeatAvailability()
        +startJourney()
        +completeTrip()
    }

    Route "1" --> "*" Trip : has
    Bus "1" --> "*" Trip : assigned_to
    Operator "1" --> "*" Route : creates
    Operator "1" --> "*" Bus : owns
```

### 2.3. Nhóm Hệ Thống Đặt Vé

```mermaid
classDiagram
    class Booking {
        -ObjectId _id
        -String bookingCode
        -ObjectId tripId
        -ObjectId customerId
        -Float finalPrice
        -String status
        +lockSeats()
        +applyVoucher()
        +confirmBooking()
        +cancelBooking()
    }

    class Payment {
        -ObjectId _id
        -String paymentCode
        -ObjectId bookingId
        -String paymentMethod
        -String status
        +initiatePayment()
        +processPayment()
        +verifyPayment()
        +refundPayment()
    }

    class Ticket {
        -ObjectId _id
        -String ticketCode
        -ObjectId bookingId
        -String qrCode
        -String status
        +generateQRCode()
        +verifyTicket()
        +scanTicket()
        +sendTicketEmail()
    }

    class Voucher {
        -ObjectId _id
        -String code
        -String discountType
        -Float discountValue
        -Date validUntil
        +validateVoucher()
        +applyDiscount()
        +checkUsageLimit()
    }

    Trip "1" --> "*" Booking : receives
    User "1" --> "*" Booking : creates
    Booking "1" --> "1" Payment : has
    Booking "1" --> "1" Ticket : generates
    Voucher "0..1" --> "*" Booking : applied_to
```

### 2.4. Nhóm Dịch Vụ Hỗ Trợ

```mermaid
classDiagram
    class SeatLockService {
        +lockSeats(tripId, seatNumbers, userId)
        +releaseLock(tripId, seatNumbers)
        +checkLockStatus(tripId, seatNumber)
        +autoReleaseLocks()
    }

    class NotificationService {
        +sendEmail(to, subject, content)
        +sendSMS(phone, message)
        +pushNotification(userId, message)
        +sendBookingConfirmation(booking)
    }

    class LoyaltyService {
        +calculatePoints(bookingAmount)
        +updateTier(userId)
        +redeemRewards(userId, points)
        +processPointsEarning(booking)
    }

    class WebSocketService {
        +broadcastTripUpdate(tripId, data)
        +notifyBookingStatus(bookingId, status)
        +trackLocation(tripId, coordinates)
        +sendRealTimeNotification(userId, message)
    }

    SeatLockService ..> Trip : locks_seats
    NotificationService ..> Booking : sends_notifications
    LoyaltyService ..> User : manages_points
    WebSocketService ..> Trip : broadcasts_updates
```

## 3. Sơ Đồ Luồng Tương Tác Chính

### 3.1. Luồng Đặt Vé

```mermaid
sequenceDiagram
    participant U as User
    participant B as Booking
    participant SLS as SeatLockService
    participant P as Payment
    participant T as Ticket
    participant NS as NotificationService

    U->>B: createBooking()
    B->>SLS: lockSeats()
    SLS-->>B: seats locked
    B->>B: applyVoucher()
    B->>B: calculateTotal()
    B->>P: initiatePayment()
    P-->>B: payment URL
    U->>P: processPayment()
    P->>P: verifyPayment()
    P-->>B: payment confirmed
    B->>B: confirmBooking()
    B->>T: generateTicket()
    T->>T: generateQRCode()
    T->>NS: sendTicketEmail()
    NS-->>U: ticket sent
```

### 3.2. Luồng Quản Lý Chuyến

```mermaid
sequenceDiagram
    participant E as Employee
    participant T as Trip
    participant WS as WebSocketService
    participant Ticket as Ticket

    E->>T: startJourney()
    T->>WS: broadcastTripUpdate()
    E->>Ticket: scanTicket()
    Ticket->>Ticket: verifyTicket()
    E->>T: updateLocation()
    T->>WS: trackLocation()
    E->>T: completeTrip()
    T->>WS: broadcastTripUpdate()
```

## 4. Ghi Chú Thiết Kế

### Nguyên Tắc Thiết Kế:
1. **Single Responsibility**: Mỗi lớp có một trách nhiệm duy nhất
2. **Encapsulation**: Thuộc tính private (-), phương thức public (+)
3. **Dependency Injection**: Services được inject vào controllers
4. **Observer Pattern**: WebSocketService để thông báo real-time
5. **Strategy Pattern**: Payment methods, notification channels

### Quan Hệ Chính:
- **Composition**: Booking có Payment và Ticket
- **Aggregation**: Operator có nhiều Employee, Route, Bus
- **Association**: User tạo nhiều Booking
- **Dependency**: Services phụ thuộc vào domain objects