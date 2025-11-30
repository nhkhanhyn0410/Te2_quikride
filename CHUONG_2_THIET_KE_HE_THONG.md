# CHƯƠNG 2. THIẾT KẾ HỆ THỐNG

## 2.1. Thiết kế kiến trúc tổng thể

### 2.1.1. Tổng quan kiến trúc hệ thống

Hệ thống đặt vé xe buýt QuikRide được thiết kế theo mô hình kiến trúc phân lớp (Layered Architecture) kết hợp với Microservices để đảm bảo tính mở rộng, bảo trì và hiệu suất cao. Kiến trúc được chia thành 6 lớp chính:

#### **Lớp 1: Client Layer (Lớp Giao Diện Người Dùng)**

**Web Application (React.js)**
- Giao diện chính cho khách hàng đặt vé
- Responsive design tương thích với mọi thiết bị
- Progressive Web App (PWA) hỗ trợ offline
- Real-time updates thông qua WebSocket

**Mobile Application (React Native)**
- Ứng dụng di động cross-platform
- Push notifications cho cập nhật đặt vé
- GPS tracking cho theo dõi chuyến xe
- Offline booking với sync khi có mạng

**Admin Dashboard (React.js)**
- Giao diện quản trị cho admin hệ thống
- Analytics và reporting dashboard
- User management và system monitoring
- Real-time system health monitoring

**Operator Dashboard (React.js)**
- Giao diện quản lý cho nhà xe
- Trip management và scheduling
- Revenue analytics và reporting
- Driver và vehicle management

#### **Lớp 2: Load Balancer & API Gateway**

**Load Balancer (Nginx)**
- Phân phối tải đều giữa các server instances
- SSL termination và HTTPS redirect
- Static file serving và caching
- Health check và failover tự động
- Rate limiting để chống DDoS

**API Gateway (Express.js)**
- Single entry point cho tất cả API requests
- Authentication và authorization centralized
- Request/response transformation
- API versioning và backward compatibility
- Logging và monitoring tất cả requests

#### **Lớp 3: Application Services Layer**

**Authentication Service**
- JWT token generation và validation
- Multi-factor authentication (MFA)
- OAuth 2.0 integration với social login
- Session management với Redis
- Password reset và email verification

**Booking Service**
- Core business logic cho đặt vé
- Seat selection và temporary locking
- Booking confirmation và cancellation
- Integration với Payment Service
- Real-time seat availability updates

**Payment Service**
- Multiple payment gateway integration (VNPay, MoMo)
- Payment processing và callback handling
- Refund management và dispute resolution
- Transaction logging và audit trail
- PCI DSS compliance

**Trip Management Service**
- Trip scheduling và route management
- Bus và driver assignment
- Real-time trip tracking
- Trip status updates và notifications
- Dynamic pricing algorithms

**Notification Service**
- Multi-channel notifications (Email, SMS, Push)
- Template-based messaging
- Delivery status tracking
- Notification preferences management
- Real-time WebSocket notifications

#### **Lớp 4: Business Logic & Support Services**

**Seat Lock Service (Redis)**
- Temporary seat reservations (15 phút)
- Distributed locking mechanism
- Lock expiration và cleanup
- Concurrent booking prevention
- Real-time seat status broadcasting

**Voucher Service**
- Discount code generation và validation
- Usage tracking và limits enforcement
- Expiration management
- Bulk voucher operations
- Integration với Loyalty Service

**Loyalty Service**
- Points accumulation và redemption
- Tier management (Bronze, Silver, Gold, Platinum)
- Reward calculation algorithms
- Member benefits management
- Gamification features

**Reporting Service**
- Business intelligence và analytics
- Revenue reporting và forecasting
- Performance metrics tracking
- Custom report generation
- Data export capabilities

#### **Lớp 5: Data Layer**

**MongoDB (Primary Database)**
- Document-based storage cho flexibility
- Horizontal scaling với sharding
- Replica sets cho high availability
- Aggregation pipeline cho complex queries
- GridFS cho file storage

**Redis (Cache & Sessions)**
- Session storage cho user authentication
- Application-level caching
- Real-time data như seat locks
- Pub/Sub cho real-time notifications
- Rate limiting counters

**AWS S3 (File Storage)**
- Static assets (images, documents)
- Backup storage cho database dumps
- CDN integration cho fast delivery
- Versioning và lifecycle management
- Security với IAM policies

#### **Lớp 6: External Services Integration**

**VNPay Gateway**
- Primary payment processor tại Việt Nam
- Secure payment processing
- Multiple payment methods support
- Real-time transaction status
- Webhook callbacks cho payment updates

**SMS Provider (Twilio/SMSAPI)**
- OTP delivery cho authentication
- Booking confirmations và updates
- Emergency notifications
- Delivery status tracking
- International SMS support

**Email Service (SendGrid/AWS SES)**
- Transactional emails (confirmations, receipts)
- Marketing campaigns
- Template management
- Bounce và complaint handling
- Analytics và tracking

**Google Maps API**
- Route calculation và optimization
- Real-time traffic data
- Geocoding cho addresses
- Distance matrix calculations
- Places API cho location search

### 2.1.2. Kiến trúc Microservices

#### **Nguyên tắc thiết kế Microservices**

**Domain-Driven Design (DDD)**
- Mỗi service quản lý một business domain cụ thể
- Bounded contexts rõ ràng giữa các services
- Shared kernel tối thiểu để giảm coupling
- Event-driven communication giữa services

**Service Independence**
- Mỗi service có database riêng biệt
- Independent deployment và scaling
- Technology stack flexibility
- Fault isolation và resilience

**API-First Approach**
- Well-defined API contracts
- Versioning strategy cho backward compatibility
- Documentation với OpenAPI/Swagger
- Contract testing giữa services

#### **Core Services**

**User Service**
- User registration, authentication, và profile management
- Role-based access control (RBAC)
- Social login integration
- User preferences và settings
- Account verification và security

**Booking Service**
- Seat selection và reservation logic
- Booking lifecycle management
- Integration với Payment và Notification services
- Cancellation và refund processing
- Booking history và analytics

**Trip Service**
- Trip creation và scheduling
- Route và bus management
- Driver assignment và tracking
- Real-time location updates
- Trip performance analytics

**Payment Service**
- Payment gateway abstraction
- Transaction processing và reconciliation
- Refund và chargeback handling
- Payment method management
- Financial reporting

**Notification Service**
- Multi-channel notification delivery
- Template management và personalization
- Delivery tracking và retry logic
- User preference management
- Real-time push notifications

#### **Support Services**

**Seat Lock Service**
- Distributed seat locking với Redis
- Lock timeout và cleanup mechanisms
- Concurrent access handling
- Real-time seat availability broadcasting
- Performance optimization cho high concurrency

**Loyalty Service**
- Points calculation và tier management
- Reward redemption logic
- Member benefit calculations
- Gamification features
- Integration với Booking Service

**Reporting Service**
- Data aggregation từ multiple services
- Real-time analytics dashboard
- Scheduled report generation
- Custom query builder
- Data export và visualization

**File Service**
- Document upload và processing
- Image resizing và optimization
- Virus scanning và security checks
- CDN integration
- Backup và archival

### 2.1.3. Kiến trúc bảo mật

#### **Network Security**

**Web Application Firewall (WAF)**
- Protection against OWASP Top 10 vulnerabilities
- SQL injection và XSS prevention
- Rate limiting và DDoS protection
- Geo-blocking cho suspicious regions
- Custom rules cho business logic protection

**SSL/TLS Encryption**
- End-to-end encryption cho all communications
- Certificate management với auto-renewal
- Perfect Forward Secrecy (PFS)
- HSTS headers cho browser security
- Certificate pinning cho mobile apps

#### **Authentication & Authorization**

**JWT Tokens**
- Stateless authentication với signed tokens
- Short-lived access tokens (15 phút)
- Refresh token rotation
- Token blacklisting cho logout
- Secure token storage practices

**Role-Based Access Control (RBAC)**
- Granular permissions system
- Role hierarchy và inheritance
- Dynamic permission checking
- Audit trail cho access attempts
- Principle of least privilege

**Multi-Factor Authentication (MFA)**
- SMS-based OTP verification
- Time-based OTP (TOTP) support
- Backup codes cho recovery
- Risk-based authentication
- Device trust management

#### **Data Security**

**Encryption at Rest**
- Database encryption với AES-256
- File encryption trên S3
- Key management với AWS KMS
- Regular key rotation
- Secure key storage practices

**Password Security**
- bcrypt hashing với high cost factor
- Password complexity requirements
- Breach detection và forced resets
- Secure password recovery
- Password history tracking

**Data Privacy**
- GDPR compliance implementation
- Data minimization principles
- Right to be forgotten
- Data anonymization techniques
- Privacy by design approach

#### **API Security**

**Input Validation**
- Schema-based validation
- Sanitization của user inputs
- File upload restrictions
- SQL injection prevention
- XSS protection

**Rate Limiting**
- Per-user và per-IP rate limits
- Sliding window algorithms
- Burst protection
- API quota management
- Graceful degradation

#### **Monitoring & Compliance**

**Security Monitoring**
- Real-time threat detection
- Anomaly detection algorithms
- Security incident response
- Automated alerting systems
- Forensic logging capabilities

**Audit Logging**
- Comprehensive audit trails
- Immutable log storage
- Log integrity verification
- Compliance reporting
- Real-time log analysis

**Compliance Standards**
- PCI DSS cho payment processing
- GDPR cho data protection
- ISO 27001 security standards
- Regular security assessments
- Third-party security audits

---

## 2.3. Sequence Diagram

### 2.3.1. Sequence Diagram - Quy trình đăng ký và đăng nhập

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Gateway
    participant AUTH as Auth Service
    participant DB as Database
    participant EMAIL as Email Service

    Note over U,EMAIL: User Registration Process

    U->>FE: Nhập thông tin đăng ký
    FE->>FE: Validate form client-side
    FE->>API: POST /auth/register
    API->>AUTH: Validate & process registration
    
    AUTH->>DB: Check email exists
    DB-->>AUTH: Email availability
    
    alt Email already exists
        AUTH-->>API: Error: Email đã tồn tại
        API-->>FE: 409 Conflict
        FE-->>U: Hiển thị lỗi
    else Email available
        AUTH->>AUTH: Hash password
        AUTH->>DB: Create user record
        DB-->>AUTH: User created
        
        AUTH->>EMAIL: Send verification email
        EMAIL-->>AUTH: Email sent
        
        AUTH-->>API: Registration successful
        API-->>FE: 201 Created
        FE-->>U: Thông báo kiểm tra email
    end

    Note over U,EMAIL: Email Verification

    U->>U: Click verification link
    U->>FE: GET /verify-email?token=xxx
    FE->>API: GET /auth/verify-email
    API->>AUTH: Verify token
    
    AUTH->>DB: Update user status
    DB-->>AUTH: User activated
    
    AUTH-->>API: Verification successful
    API-->>FE: 200 OK
    FE-->>U: Tài khoản đã được kích hoạt

    Note over U,EMAIL: User Login Process

    U->>FE: Nhập email/password
    FE->>API: POST /auth/login
    API->>AUTH: Authenticate user
    
    AUTH->>DB: Find user by email
    DB-->>AUTH: User data
    
    AUTH->>AUTH: Compare password hash
    
    alt Invalid credentials
        AUTH-->>API: Error: Invalid credentials
        API-->>FE: 401 Unauthorized
        FE-->>U: Hiển thị lỗi đăng nhập
    else Valid credentials
        AUTH->>AUTH: Generate JWT token
        AUTH->>DB: Update last login
        
        AUTH-->>API: Login successful + token
        API-->>FE: 200 OK + user data
        FE->>FE: Store token & user info
        FE-->>U: Redirect to dashboard
    end
```

### 2.3.2. Sequence Diagram - Quy trình tìm kiếm và đặt vé

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Gateway
    participant TRIP as Trip Service
    participant BOOKING as Booking Service
    participant SEAT as Seat Lock Service
    participant PAYMENT as Payment Service
    participant DB as Database
    participant REDIS as Redis Cache

    Note over U,REDIS: Trip Search Process

    U->>FE: Nhập điều kiện tìm kiếm
    FE->>API: GET /trips/search?from=HCM&to=HN&date=2024-01-15
    API->>TRIP: Search available trips
    
    TRIP->>DB: Query trips with filters
    DB-->>TRIP: Trip results
    
    TRIP->>TRIP: Filter by availability
    TRIP-->>API: Available trips list
    API-->>FE: Trip search results
    FE-->>U: Hiển thị danh sách chuyến

    Note over U,REDIS: Seat Selection & Booking

    U->>FE: Chọn chuyến và ghế
    FE->>API: POST /bookings/hold-seats
    API->>BOOKING: Hold selected seats
    
    BOOKING->>SEAT: Lock seats temporarily
    SEAT->>REDIS: Set seat locks (15 min TTL)
    REDIS-->>SEAT: Locks created
    SEAT-->>BOOKING: Seats locked successfully
    
    BOOKING->>DB: Create temporary booking
    DB-->>BOOKING: Booking created
    
    BOOKING-->>API: Seats held successfully
    API-->>FE: Booking hold confirmation
    FE-->>U: Hiển thị form thông tin

    Note over U,REDIS: Booking Confirmation

    U->>FE: Nhập thông tin hành khách
    FE->>API: POST /bookings/confirm
    API->>BOOKING: Confirm booking
    
    BOOKING->>SEAT: Verify seat locks
    SEAT->>REDIS: Check lock status
    REDIS-->>SEAT: Locks valid
    SEAT-->>BOOKING: Seats still locked
    
    BOOKING->>BOOKING: Calculate final price
    BOOKING->>DB: Update booking details
    DB-->>BOOKING: Booking updated
    
    BOOKING-->>API: Booking confirmed
    API-->>FE: Confirmation + payment info
    FE-->>U: Redirect to payment

    Note over U,REDIS: Payment Process

    U->>FE: Chọn phương thức thanh toán
    FE->>API: POST /payments/create
    API->>PAYMENT: Create payment
    
    PAYMENT->>DB: Create payment record
    DB-->>PAYMENT: Payment created
    
    PAYMENT->>PAYMENT: Generate VNPay URL
    PAYMENT-->>API: Payment URL
    API-->>FE: Redirect URL
    FE-->>U: Redirect to VNPay

    U->>U: Thực hiện thanh toán
    
    Note over U,REDIS: Payment Callback

    activate PAYMENT
    PAYMENT->>API: VNPay callback
    API->>PAYMENT: Process callback
    
    PAYMENT->>PAYMENT: Verify signature
    PAYMENT->>DB: Update payment status
    
    alt Payment successful
        PAYMENT->>BOOKING: Confirm booking payment
        BOOKING->>SEAT: Release seat locks
        SEAT->>REDIS: Remove locks
        BOOKING->>DB: Update booking status
        
        PAYMENT->>PAYMENT: Generate ticket
        PAYMENT-->>API: Payment successful
        API-->>FE: Success notification
        FE-->>U: Hiển thị vé điện tử
    else Payment failed
        PAYMENT->>BOOKING: Cancel booking
        BOOKING->>SEAT: Release seat locks
        SEAT->>REDIS: Remove locks
        BOOKING->>DB: Cancel booking
        
        PAYMENT-->>API: Payment failed
        API-->>FE: Error notification
        FE-->>U: Thông báo lỗi thanh toán
    end
    deactivate PAYMENT
```

### 2.3.3. Sequence Diagram - Quy trình quản lý chuyến xe

```mermaid
sequenceDiagram
    participant OP as Operator
    participant FE as Frontend
    participant API as API Gateway
    participant TRIP as Trip Service
    participant NOTIFY as Notification Service
    participant DB as Database
    participant WS as WebSocket Service

    Note over OP,WS: Create Trip Process

    OP->>FE: Tạo chuyến xe mới
    FE->>API: POST /operators/trips
    API->>TRIP: Create trip
    
    TRIP->>DB: Validate route exists
    DB-->>TRIP: Route data
    
    TRIP->>DB: Validate bus availability
    DB-->>TRIP: Bus data
    
    TRIP->>DB: Validate driver availability
    DB-->>TRIP: Driver data
    
    TRIP->>DB: Check schedule conflicts
    DB-->>TRIP: No conflicts
    
    TRIP->>DB: Create trip record
    DB-->>TRIP: Trip created
    
    TRIP->>NOTIFY: Send notifications
    NOTIFY->>NOTIFY: Notify driver & trip manager
    
    TRIP-->>API: Trip created successfully
    API-->>FE: 201 Created
    FE-->>OP: Thông báo tạo thành công

    Note over OP,WS: Trip Status Management

    OP->>FE: Cập nhật trạng thái chuyến
    FE->>API: PUT /operators/trips/:id/status
    API->>TRIP: Update trip status
    
    TRIP->>DB: Update trip record
    DB-->>TRIP: Status updated
    
    TRIP->>WS: Broadcast status change
    WS->>WS: Notify connected clients
    
    TRIP->>NOTIFY: Send status notifications
    NOTIFY->>NOTIFY: Notify stakeholders
    
    TRIP-->>API: Status updated
    API-->>FE: 200 OK
    FE-->>OP: Cập nhật thành công

    Note over OP,WS: Real-time Trip Monitoring

    loop Real-time Updates
        TRIP->>WS: Broadcast trip updates
        WS-->>FE: Real-time data
        FE-->>OP: Hiển thị cập nhật
        
        alt Emergency/Issue
            OP->>FE: Báo cáo sự cố
            FE->>API: POST /trips/:id/incidents
            API->>TRIP: Log incident
            TRIP->>DB: Save incident
            TRIP->>NOTIFY: Alert management
        end
    end
```

### 2.3.4. Sequence Diagram - Quy trình thanh toán VNPay

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Gateway
    participant PAY as Payment Service
    participant VNPAY as VNPay Gateway
    participant DB as Database
    participant NOTIFY as Notification Service

    Note over U,NOTIFY: VNPay Payment Flow

    U->>FE: Xác nhận thanh toán
    FE->>API: POST /payments/vnpay/create
    API->>PAY: Create VNPay payment
    
    PAY->>DB: Create payment record
    DB-->>PAY: Payment ID created
    
    PAY->>PAY: Generate VNPay parameters
    PAY->>PAY: Create secure hash
    PAY->>PAY: Build payment URL
    
    PAY-->>API: VNPay payment URL
    API-->>FE: Redirect URL
    FE-->>U: Redirect to VNPay

    U->>VNPAY: Thực hiện thanh toán
    VNPAY->>VNPAY: Process payment
    
    alt Payment Success
        VNPAY->>API: Success callback
        API->>PAY: Process success callback
        
        PAY->>PAY: Verify callback signature
        PAY->>PAY: Validate transaction data
        
        PAY->>DB: Update payment status = 'completed'
        DB-->>PAY: Status updated
        
        PAY->>NOTIFY: Send success notification
        NOTIFY->>NOTIFY: Send confirmation email/SMS
        
        PAY-->>API: Payment confirmed
        API-->>FE: Success response
        FE-->>U: Hiển thị thành công + vé
        
    else Payment Failed
        VNPAY->>API: Failure callback
        API->>PAY: Process failure callback
        
        PAY->>PAY: Verify callback signature
        PAY->>DB: Update payment status = 'failed'
        
        PAY->>NOTIFY: Send failure notification
        
        PAY-->>API: Payment failed
        API-->>FE: Failure response
        FE-->>U: Thông báo lỗi
        
    else Payment Cancelled
        VNPAY->>API: Cancel callback
        API->>PAY: Process cancel callback
        
        PAY->>DB: Update payment status = 'cancelled'
        PAY-->>API: Payment cancelled
        API-->>FE: Cancel response
        FE-->>U: Thanh toán đã hủy
    end

    Note over U,NOTIFY: Payment Verification

    FE->>API: GET /payments/:id/status
    API->>PAY: Check payment status
    PAY->>DB: Query payment record
    DB-->>PAY: Payment details
    PAY-->>API: Payment status
    API-->>FE: Status response
    FE-->>U: Cập nhật trạng thái
```

---

## 2.4. Thiết kế cơ sở dữ liệu

### 2.4.1. Sơ đồ ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    %% User Management
    USER {
        ObjectId _id PK
        string email UK
        string phone UK
        string password
        string fullName
        enum role "customer, operator, admin"
        string loyaltyTier "bronze, silver, gold, platinum"
        number totalPoints
        boolean isActive
        boolean isEmailVerified
        datetime createdAt
        datetime updatedAt
        datetime lastLogin
    }

    OPERATOR {
        ObjectId _id PK
        ObjectId userId FK
        string companyName
        string businessLicense
        string taxCode
        enum verificationStatus "pending, verified, rejected"
        number averageRating
        number totalReviews
        number totalRevenue
        object bankInfo
        datetime verifiedAt
        datetime createdAt
        datetime updatedAt
    }

    EMPLOYEE {
        ObjectId _id PK
        ObjectId operatorId FK
        string employeeCode UK
        string fullName
        string phone
        string email
        enum role "driver, trip_manager, staff"
        string licenseNumber
        datetime licenseExpiry
        enum status "active, inactive, suspended"
        datetime createdAt
        datetime updatedAt
    }

    %% Transportation System
    ROUTE {
        ObjectId _id PK
        ObjectId operatorId FK
        string routeName
        string routeCode UK
        object origin "province, city, district, address"
        object destination "province, city, district, address"
        array pickupPoints
        array dropoffPoints
        number distance
        number estimatedDuration
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    BUS {
        ObjectId _id PK
        ObjectId operatorId FK
        string busNumber UK
        enum busType "limousine, sleeper, seater, double_decker"
        object seatLayout
        number totalSeats
        array amenities
        enum status "active, maintenance, inactive"
        datetime lastMaintenance
        datetime nextMaintenance
        datetime createdAt
        datetime updatedAt
    }

    TRIP {
        ObjectId _id PK
        ObjectId operatorId FK
        ObjectId routeId FK
        ObjectId busId FK
        ObjectId driverId FK
        ObjectId tripManagerId FK
        datetime departureTime
        datetime arrivalTime
        number basePrice
        number discount
        number finalPrice
        number totalSeats
        number availableSeats
        array bookedSeats
        enum status "scheduled, ongoing, completed, cancelled"
        boolean isRecurring
        string recurringGroupId
        object policies
        object cancellationPolicy
        string notes
        datetime createdAt
        datetime updatedAt
    }

    %% Booking System
    BOOKING {
        ObjectId _id PK
        string bookingCode UK
        ObjectId tripId FK
        ObjectId customerId FK
        array passengers
        array selectedSeats
        number totalPrice
        number discount
        number finalPrice
        ObjectId voucherId FK
        enum status "pending, confirmed, cancelled, completed"
        object cancellationInfo
        datetime bookingTime
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }

    PAYMENT {
        ObjectId _id PK
        string paymentCode UK
        ObjectId bookingId FK
        enum paymentMethod "vnpay, momo, banking, cash"
        number amount
        enum status "pending, completed, failed, refunded"
        string transactionId
        object gatewayResponse
        datetime paidAt
        datetime createdAt
        datetime updatedAt
    }

    TICKET {
        ObjectId _id PK
        string ticketCode UK
        ObjectId bookingId FK
        string qrCode
        array passengers
        enum status "active, used, cancelled, expired"
        datetime issuedAt
        datetime usedAt
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }

    %% Voucher & Loyalty
    VOUCHER {
        ObjectId _id PK
        ObjectId operatorId FK
        string code UK
        string title
        string description
        enum discountType "percentage, fixed"
        number discountValue
        number minOrderValue
        number maxDiscountAmount
        number maxUsageTotal
        number currentUsage
        datetime validFrom
        datetime validUntil
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    VOUCHER_USAGE {
        ObjectId _id PK
        ObjectId voucherId FK
        ObjectId userId FK
        ObjectId bookingId FK
        number discountAmount
        datetime usedAt
    }

    %% Review & Feedback
    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId bookingId FK
        ObjectId tripId FK
        ObjectId operatorId FK
        number overallRating
        number vehicleRating
        number driverRating
        number serviceRating
        string comment
        array images
        boolean isVerified
        datetime createdAt
        datetime updatedAt
    }

    COMPLAINT {
        ObjectId _id PK
        string ticketNumber UK
        ObjectId userId FK
        ObjectId bookingId FK
        string subject
        string description
        enum category "service, payment, vehicle, driver, other"
        enum priority "low, medium, high, urgent"
        enum status "open, in_progress, resolved, closed"
        ObjectId assignedTo FK
        array attachments
        string resolution
        datetime resolvedAt
        datetime createdAt
        datetime updatedAt
    }

    %% Content Management
    BANNER {
        ObjectId _id PK
        string title
        string description
        string imageUrl
        string link
        enum position "hero, sidebar, footer"
        number displayOrder
        boolean isActive
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }

    BLOG {
        ObjectId _id PK
        string title
        string slug UK
        string content
        string excerpt
        string featuredImage
        ObjectId authorId FK
        enum category "news, guide, promotion"
        array tags
        boolean isPublished
        number viewCount
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    FAQ {
        ObjectId _id PK
        string question
        string answer
        enum category "booking, payment, policy, general"
        number displayOrder
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    %% Relationships
    USER ||--o{ OPERATOR : "can be"
    OPERATOR ||--o{ EMPLOYEE : "employs"
    OPERATOR ||--o{ ROUTE : "owns"
    OPERATOR ||--o{ BUS : "owns"
    OPERATOR ||--o{ TRIP : "operates"
    OPERATOR ||--o{ VOUCHER : "creates"

    ROUTE ||--o{ TRIP : "has"
    BUS ||--o{ TRIP : "assigned to"
    EMPLOYEE ||--o{ TRIP : "driver"
    EMPLOYEE ||--o{ TRIP : "trip manager"

    USER ||--o{ BOOKING : "makes"
    TRIP ||--o{ BOOKING : "booked for"
    BOOKING ||--|| PAYMENT : "has"
    BOOKING ||--|| TICKET : "generates"
    BOOKING ||--o| VOUCHER_USAGE : "uses voucher"

    USER ||--o{ REVIEW : "writes"
    BOOKING ||--|| REVIEW : "reviewed"
    TRIP ||--o{ REVIEW : "receives"
    OPERATOR ||--o{ REVIEW : "receives"

    USER ||--o{ COMPLAINT : "files"
    BOOKING ||--o{ COMPLAINT : "about"
    USER ||--o{ COMPLAINT : "assigned to"

    USER ||--o{ BLOG : "authors"
```

### 2.4.2. Thiết kế Collection MongoDB

#### Collection: users
```javascript
{
  _id: ObjectId,
  email: String, // unique, required
  phone: String, // unique, sparse
  password: String, // hashed with bcrypt
  fullName: String,
  avatar: String, // URL to profile image
  dateOfBirth: Date,
  gender: String, // enum: ['male', 'female', 'other']
  role: String, // enum: ['customer', 'operator', 'admin']
  
  // Loyalty Program
  loyaltyTier: String, // enum: ['bronze', 'silver', 'gold', 'platinum']
  totalPoints: Number, // default: 0
  pointsHistory: [{
    amount: Number,
    type: String, // enum: ['earned', 'redeemed', 'expired']
    description: String,
    createdAt: Date
  }],
  
  // Account Status
  isActive: Boolean, // default: true
  isEmailVerified: Boolean, // default: false
  isPhoneVerified: Boolean, // default: false
  
  // Security
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Preferences
  preferences: {
    language: String, // default: 'vi'
    currency: String, // default: 'VND'
    notifications: {
      email: Boolean, // default: true
      sms: Boolean, // default: true
      push: Boolean // default: true
    }
  },
  
  // Timestamps
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: trips
```javascript
{
  _id: ObjectId,
  operatorId: ObjectId, // ref: 'Operator'
  routeId: ObjectId, // ref: 'Route'
  busId: ObjectId, // ref: 'Bus'
  driverId: ObjectId, // ref: 'Employee'
  tripManagerId: ObjectId, // ref: 'Employee'
  
  // Schedule
  departureTime: Date,
  arrivalTime: Date,
  
  // Pricing
  basePrice: Number,
  discount: Number, // percentage (0-100)
  finalPrice: Number, // calculated field
  
  // Dynamic Pricing (optional)
  dynamicPricing: {
    enabled: Boolean,
    rules: [{
      condition: String, // 'occupancy_rate', 'days_before', 'time_of_day'
      operator: String, // 'gt', 'lt', 'eq', 'between'
      value: Mixed, // threshold value
      adjustment: Number, // percentage adjustment
      priority: Number // rule priority
    }]
  },
  
  // Seat Management
  totalSeats: Number,
  availableSeats: Number,
  bookedSeats: [{
    seatNumber: String,
    bookingId: ObjectId,
    passengerName: String,
    bookedAt: Date
  }],
  
  // Status
  status: String, // enum: ['scheduled', 'ongoing', 'completed', 'cancelled']
  
  // Recurring Trip Info
  isRecurring: Boolean, // default: false
  recurringGroupId: String, // UUID for grouping recurring trips
  
  // Policies
  policies: {
    cancellationPolicy: {
      allowCancellation: Boolean,
      freeUntilHours: Number, // hours before departure
      refundPercentage: [{
        hoursBeforeDeparture: Number,
        refundPercent: Number
      }]
    },
    baggage: {
      allowedWeight: Number, // kg
      extraFeePerKg: Number
    },
    children: {
      freeAgeLimit: Number, // children under this age travel free
      discountAgeLimit: Number, // children under this age get discount
      discountPercent: Number
    }
  },
  
  // Trip Details
  notes: String, // special instructions
  amenities: [String], // inherited from bus but can be overridden
  
  // Cancellation Info (if cancelled)
  cancelledAt: Date,
  cancelReason: String,
  cancelledBy: ObjectId, // ref: 'User'
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: bookings
```javascript
{
  _id: ObjectId,
  bookingCode: String, // unique, auto-generated (e.g., "BUS240115001")
  
  // References
  tripId: ObjectId, // ref: 'Trip'
  customerId: ObjectId, // ref: 'User', can be null for guest bookings
  
  // Guest Booking Info (if customerId is null)
  guestInfo: {
    fullName: String,
    phone: String,
    email: String
  },
  
  // Passenger Information
  passengers: [{
    fullName: String,
    phone: String,
    email: String,
    idNumber: String, // CCCD/CMND
    dateOfBirth: Date,
    gender: String,
    seatNumber: String,
    ticketType: String // enum: ['adult', 'child', 'infant']
  }],
  
  // Seat Selection
  selectedSeats: [String], // array of seat numbers
  
  // Pricing
  totalPrice: Number, // base price * number of seats
  discount: Number, // discount amount (not percentage)
  finalPrice: Number, // total after discount
  
  // Voucher
  voucherId: ObjectId, // ref: 'Voucher'
  voucherDiscount: Number,
  
  // Loyalty Points
  pointsEarned: Number,
  pointsUsed: Number,
  
  // Booking Status
  status: String, // enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']
  
  // Timing
  bookingTime: Date,
  expiresAt: Date, // booking expires if not paid within time limit
  confirmedAt: Date,
  
  // Cancellation
  cancellationInfo: {
    cancelledAt: Date,
    cancelReason: String,
    refundAmount: Number,
    refundStatus: String, // enum: ['pending', 'processed', 'failed']
    refundedAt: Date
  },
  
  // Contact Preferences
  contactPreferences: {
    smsUpdates: Boolean,
    emailUpdates: Boolean
  },
  
  // Special Requests
  specialRequests: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4.3. Indexes và Performance Optimization

#### Indexes Strategy
```javascript
// Users Collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 }, { sparse: true, unique: true })
db.users.createIndex({ role: 1, isActive: 1 })

// Trips Collection
db.trips.createIndex({ operatorId: 1, departureTime: 1 })
db.trips.createIndex({ "routeId": 1, "departureTime": 1, "status": 1 })
db.trips.createIndex({ departureTime: 1, status: 1 })
db.trips.createIndex({ recurringGroupId: 1 })

// Bookings Collection
db.bookings.createIndex({ bookingCode: 1 }, { unique: true })
db.bookings.createIndex({ customerId: 1, createdAt: -1 })
db.bookings.createIndex({ tripId: 1, status: 1 })
db.bookings.createIndex({ status: 1, expiresAt: 1 })

// Payments Collection
db.payments.createIndex({ paymentCode: 1 }, { unique: true })
db.payments.createIndex({ bookingId: 1 })
db.payments.createIndex({ status: 1, createdAt: -1 })

// Routes Collection
db.routes.createIndex({ operatorId: 1, isActive: 1 })
db.routes.createIndex({ "origin.city": 1, "destination.city": 1 })

// Reviews Collection
db.reviews.createIndex({ operatorId: 1, createdAt: -1 })
db.reviews.createIndex({ tripId: 1 })
db.reviews.createIndex({ userId: 1, bookingId: 1 }, { unique: true })
```

#### Sharding Strategy (for scale)
```javascript
// Shard key for trips collection (high write volume)
sh.shardCollection("busBooking.trips", { "operatorId": 1, "departureTime": 1 })

// Shard key for bookings collection
sh.shardCollection("busBooking.bookings", { "customerId": 1, "createdAt": 1 })

// Shard key for payments collection
sh.shardCollection("busBooking.payments", { "bookingId": 1 })
```

### 2.4.4. Data Archival Strategy

```javascript
// Archive old completed trips (older than 2 years)
const archiveTrips = {
  source: "trips",
  destination: "trips_archive",
  criteria: {
    status: "completed",
    departureTime: { $lt: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000) }
  }
}

// Archive old bookings (older than 3 years)
const archiveBookings = {
  source: "bookings", 
  destination: "bookings_archive",
  criteria: {
    status: { $in: ["completed", "cancelled"] },
    createdAt: { $lt: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000) }
  }
}
```

Thiết kế cơ sở dữ liệu này đảm bảo:
1. **Scalability**: Sharding và indexing phù hợp
2. **Performance**: Indexes tối ưu cho các query thường dùng
3. **Data Integrity**: Proper relationships và constraints
4. **Flexibility**: Schema linh hoạt cho future requirements
5. **Archival**: Strategy để quản lý dữ liệu cũ