# Sơ Đồ Hệ Thống QuikRide Bus Booking

## 1. Kiến Trúc Tổng Quan

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser - React + Vite]
    end

    subgraph "API Gateway"
        API[Express.js REST API]
        SOCKET[Socket.IO Server]
    end

    subgraph "Services Layer"
        AUTH[Authentication Service]
        BOOKING[Booking Service]
        PAYMENT[Payment Service]
        TICKET[Ticket Service]
        LOYALTY[Loyalty Service]
        NOTIFICATION[Notification Service]
        SEATLOCK[Seat Lock Service]
    end

    subgraph "Data Layer"
        MONGO[(MongoDB)]
        REDIS[(Redis Cache)]
    end

    subgraph "External Services"
        VNPAY[VNPay Gateway]
        CLOUDINARY[Cloudinary Storage]
        EMAIL[Email Service]
        SMS[SMS Service]
    end

    WEB --> API
    WEB --> SOCKET
    API --> AUTH
    API --> BOOKING
    API --> PAYMENT
    API --> TICKET
    API --> LOYALTY
    API --> NOTIFICATION

    BOOKING --> SEATLOCK
    SEATLOCK --> REDIS

    AUTH --> MONGO
    BOOKING --> MONGO
    PAYMENT --> MONGO
    TICKET --> MONGO
    LOYALTY --> MONGO

    PAYMENT --> VNPAY
    NOTIFICATION --> EMAIL
    NOTIFICATION --> SMS
    TICKET --> CLOUDINARY

    SOCKET --> REDIS
```

## 2. Phân Quyền Người Dùng

```mermaid
graph TD
    USERS[Users] --> CUSTOMER[Customer/Guest]
    USERS --> OPERATOR[Bus Operator]
    USERS --> TRIPMGR[Trip Manager]
    USERS --> ADMIN[Admin]

    CUSTOMER --> |Search & Book| SEARCH[Search Trips]
    CUSTOMER --> |Manage| MYTICKETS[My Tickets]
    CUSTOMER --> |Earn| LOYALTY[Loyalty Points]
    CUSTOMER --> |Review| REVIEW[Review & Rating]
    CUSTOMER --> |Report| COMPLAINT[Complaints]

    OPERATOR --> |Manage| ROUTES[Routes Management]
    OPERATOR --> |Manage| BUSES[Buses Management]
    OPERATOR --> |Schedule| TRIPS[Trips Scheduling]
    OPERATOR --> |Manage| EMPLOYEES[Employee Management]
    OPERATOR --> |Create| VOUCHERS[Vouchers]
    OPERATOR --> |View| REPORTS[Revenue Reports]

    TRIPMGR --> |View| DASHBOARD[Active Trips Dashboard]
    TRIPMGR --> |Scan| QRSCANNER[QR Code Scanner]
    TRIPMGR --> |Update| STATUS[Journey Status]
    TRIPMGR --> |Track| PASSENGERS[Passenger List]

    ADMIN --> |Verify| OPERATORS[Operator Verification]
    ADMIN --> |Manage| ALLUSERS[User Management]
    ADMIN --> |Handle| COMPLAINTS[Complaint Resolution]
    ADMIN --> |Manage| CONTENT[Content Management]
    ADMIN --> |View| SYSREPORTS[System Reports]
```

## 3. Luồng Đặt Vé Của Khách Hàng

```mermaid
sequenceDiagram
    participant C as Customer
    participant UI as React Frontend
    participant API as Express API
    participant LOCK as Seat Lock Service
    participant DB as MongoDB
    participant PAY as Payment Gateway
    participant EMAIL as Email Service

    C->>UI: Tìm kiếm chuyến xe
    UI->>API: GET /trips?origin&destination&date
    API->>DB: Query available trips
    DB-->>API: Return trips with availability
    API-->>UI: List of trips

    C->>UI: Chọn chuyến & ghế
    UI->>API: POST /bookings/lock-seats
    API->>LOCK: Lock seats (15 min)
    LOCK->>DB: Update seat status
    DB-->>LOCK: Seats locked
    LOCK-->>API: Lock confirmed
    API-->>UI: Seats reserved

    C->>UI: Điền thông tin hành khách
    UI->>API: POST /bookings/create
    API->>DB: Create booking (status: pending)
    DB-->>API: Booking created

    C->>UI: Áp dụng voucher
    UI->>API: POST /bookings/apply-voucher
    API->>DB: Validate & calculate discount
    DB-->>API: Updated price
    API-->>UI: Final price

    C->>UI: Chọn phương thức thanh toán
    UI->>API: POST /payments/initiate
    API->>DB: Create payment record
    API->>PAY: Generate payment URL
    PAY-->>API: Payment URL
    API-->>UI: Redirect URL

    UI->>PAY: Redirect to payment
    C->>PAY: Complete payment
    PAY->>API: Webhook callback
    API->>DB: Update payment status
    API->>DB: Update booking (status: confirmed)

    API->>DB: Generate ticket with QR
    API->>EMAIL: Send ticket email
    EMAIL-->>C: Email with ticket

    API->>DB: Update loyalty points
    API-->>UI: Payment success
    UI-->>C: Show confirmation
```

## 4. Luồng Quản Lý Chuyến Đi (Trip Manager)

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Trip created

    Scheduled --> Preparing: Trip Manager starts shift
    Preparing --> CheckingTickets: Begin boarding
    CheckingTickets --> InTransit: All passengers boarded

    InTransit --> AtStop: Arrive at stop
    AtStop --> InTransit: Depart from stop
    InTransit --> Completed: Arrive at destination

    Scheduled --> Cancelled: Cancel trip
    CheckingTickets --> Cancelled: Emergency cancellation

    Completed --> [*]
    Cancelled --> [*]

    note right of CheckingTickets
        Trip Manager scans
        passenger QR codes
    end note

    note right of InTransit
        Real-time location
        tracking via Socket.IO
    end note

    note right of AtStop
        Update actual arrival
        and departure times
    end note
```

## 5. Sơ Đồ Database - Quan Hệ Chính

```mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    USER ||--o{ REVIEW : writes
    USER ||--o{ COMPLAINT : files
    USER {
        ObjectId _id
        string email
        string fullName
        string loyaltyTier
        int totalPoints
    }

    OPERATOR ||--o{ ROUTE : manages
    OPERATOR ||--o{ BUS : owns
    OPERATOR ||--o{ TRIP : operates
    OPERATOR ||--o{ EMPLOYEE : employs
    OPERATOR ||--o{ VOUCHER : creates
    OPERATOR {
        ObjectId _id
        string companyName
        string businessLicense
        string verificationStatus
        float averageRating
    }

    ROUTE ||--o{ TRIP : has
    ROUTE {
        ObjectId _id
        ObjectId operatorId
        string routeCode
        object origin
        object destination
        array stops
    }

    BUS ||--o{ TRIP : assigned
    BUS {
        ObjectId _id
        ObjectId operatorId
        string busNumber
        object seatLayout
        array amenities
    }

    TRIP ||--o{ BOOKING : receives
    TRIP {
        ObjectId _id
        ObjectId routeId
        ObjectId busId
        ObjectId driverId
        ObjectId tripManagerId
        DateTime departureTime
        float finalPrice
        array bookedSeats
        string status
    }

    BOOKING ||--|| PAYMENT : has
    BOOKING ||--|| TICKET : generates
    BOOKING {
        ObjectId _id
        string bookingCode
        ObjectId tripId
        ObjectId customerId
        array seats
        float finalPrice
        string status
        string paymentStatus
    }

    PAYMENT {
        ObjectId _id
        string paymentCode
        ObjectId bookingId
        string paymentMethod
        float amount
        string status
        string transactionId
    }

    TICKET {
        ObjectId _id
        string ticketCode
        ObjectId bookingId
        string qrCode
        string qrCodeData
        array passengers
        string status
    }

    EMPLOYEE ||--o{ TRIP : manages
    EMPLOYEE {
        ObjectId _id
        ObjectId operatorId
        string role
        string licenseNumber
        string status
    }

    VOUCHER ||--o{ BOOKING : appliedTo
    VOUCHER {
        ObjectId _id
        string code
        ObjectId operatorId
        string discountType
        float discountValue
        DateTime validFrom
        DateTime validUntil
    }

    REVIEW }o--|| BOOKING : reviews
    REVIEW }o--|| TRIP : rates
    REVIEW {
        ObjectId _id
        ObjectId userId
        ObjectId tripId
        int overallRating
        string comment
        DateTime createdAt
    }

    COMPLAINT }o--|| USER : filedBy
    COMPLAINT }o--|| BOOKING : about
    COMPLAINT {
        ObjectId _id
        string ticketNumber
        string subject
        string category
        string status
        string priority
    }
```

## 6. Luồng Thanh Toán

```mermaid
flowchart TD
    START([Khách hàng xác nhận đặt vé]) --> SELECT{Chọn phương thức thanh toán}

    SELECT -->|VNPay| VNPAY[Tạo payment URL VNPay]
    SELECT -->|Momo| MOMO[Tạo QR Momo]
    SELECT -->|ZaloPay| ZALO[Tạo QR ZaloPay]
    SELECT -->|Thẻ tín dụng| CARD[Payment gateway thẻ]
    SELECT -->|Tiền mặt| CASH[Giữ chỗ - Thanh toán sau]

    VNPAY --> REDIRECT[Redirect đến VNPay]
    MOMO --> QRCODE[Hiển thị QR code]
    ZALO --> QRCODE
    CARD --> CARDFORM[Form nhập thẻ]

    REDIRECT --> CUSTOMER_PAY{Khách thanh toán}
    QRCODE --> CUSTOMER_PAY
    CARDFORM --> CUSTOMER_PAY

    CUSTOMER_PAY -->|Thành công| WEBHOOK[Webhook callback]
    CUSTOMER_PAY -->|Thất bại| FAILED
    CUSTOMER_PAY -->|Timeout| FAILED

    WEBHOOK --> UPDATE_PAYMENT[Update payment status: completed]
    UPDATE_PAYMENT --> UPDATE_BOOKING[Update booking status: confirmed]
    UPDATE_BOOKING --> GEN_TICKET[Generate ticket + QR code]
    GEN_TICKET --> SEND_EMAIL[Gửi email ticket]
    SEND_EMAIL --> ADD_POINTS[Cộng điểm loyalty]
    ADD_POINTS --> SUCCESS([Đặt vé thành công])

    CASH --> HOLD[Hold booking 24h]
    HOLD --> MANUAL_CONFIRM{Admin xác nhận thanh toán}
    MANUAL_CONFIRM -->|Đã thanh toán| UPDATE_BOOKING
    MANUAL_CONFIRM -->|Không thanh toán| TIMEOUT

    FAILED[Payment failed] --> RELEASE_SEATS[Giải phóng ghế]
    TIMEOUT[Timeout] --> RELEASE_SEATS
    RELEASE_SEATS --> CANCEL_BOOKING[Cancel booking]
    CANCEL_BOOKING --> END([Đặt vé thất bại])
```

## 7. Hệ Thống Loyalty Points

```mermaid
graph LR
    subgraph "Earning Points"
        BOOK[Complete Trip] -->|1000 VND = 1 point| EARN[Earn Points]
        REVIEW[Write Review] -->|+10 points| EARN
        REFERRAL[Refer Friend] -->|+50 points| EARN
    end

    subgraph "Point Tiers"
        EARN --> CALC{Calculate Total}
        CALC -->|0-999 points| BRONZE[Bronze Tier]
        CALC -->|1000-4999 points| SILVER[Silver Tier<br/>2% discount]
        CALC -->|5000-9999 points| GOLD[Gold Tier<br/>5% discount]
        CALC -->|10000+ points| PLATINUM[Platinum Tier<br/>10% discount]
    end

    subgraph "Redeeming Points"
        BRONZE --> REDEEM{Redeem Points}
        SILVER --> REDEEM
        GOLD --> REDEEM
        PLATINUM --> REDEEM

        REDEEM -->|100 points = 10,000 VND| DISCOUNT[Discount on Booking]
    end

    subgraph "Point Expiry"
        EARN --> EXPIRY[Points expire after 1 year]
        EXPIRY --> DEDUCT[Deduct expired points]
    end
```

## 8. Quy Trình Xác Minh Vé (QR Code)

```mermaid
sequenceDiagram
    participant TM as Trip Manager
    participant APP as Mobile App
    participant API as Backend API
    participant DB as Database
    participant CRYPT as Encryption Service

    Note over TM,CRYPT: Passenger shows ticket QR code

    TM->>APP: Scan QR code
    APP->>API: POST /tickets/verify {qrCodeData}

    API->>CRYPT: Decrypt QR data
    CRYPT-->>API: Decrypted data {ticketId, bookingId, tripId}

    API->>DB: Verify ticket exists
    DB-->>API: Ticket found

    API->>DB: Check ticket status
    DB-->>API: Status: issued

    API->>DB: Verify trip matches
    DB-->>API: Trip matched

    API->>DB: Verify booking is confirmed
    DB-->>API: Booking confirmed

    API->>DB: Update ticket status to "verified"
    API->>DB: Record verifiedAt, verifiedBy
    API->>DB: Add to trip's checked-in passengers

    DB-->>API: Update successful

    API-->>APP: Verification success + passenger details
    APP-->>TM: Show green checkmark + passenger info

    Note over TM: Passenger allowed to board
```

## 9. Workflow Operator

```mermaid
flowchart TD
    START([Operator đăng ký]) --> SUBMIT[Submit business info<br/>Business license, Tax code]
    SUBMIT --> PENDING[Status: Pending verification]

    PENDING --> ADMIN_REVIEW{Admin review}
    ADMIN_REVIEW -->|Approved| ACTIVE[Status: Active]
    ADMIN_REVIEW -->|Rejected| REJECTED[Status: Rejected<br/>Reason provided]

    ACTIVE --> SETUP[Setup Operations]

    SETUP --> ROUTE[Create Routes<br/>Origin, Destination, Stops]
    SETUP --> BUS[Add Buses<br/>Seat layout, Amenities]
    SETUP --> EMP[Add Employees<br/>Drivers, Trip Managers]

    ROUTE --> TRIP[Create Trips]
    BUS --> TRIP
    EMP --> TRIP

    TRIP --> PRICING[Set Pricing<br/>Base price, Dynamic pricing]
    PRICING --> SCHEDULE[Schedule Trips<br/>One-time or Recurring]

    SCHEDULE --> VOUCHER[Create Vouchers<br/>Optional]
    VOUCHER --> MONITOR[Monitor Bookings]

    MONITOR --> REPORTS[View Reports<br/>Revenue, Occupancy]
    REPORTS --> MANAGE{Manage Operations}

    MANAGE -->|Update| ROUTE
    MANAGE -->|Update| BUS
    MANAGE -->|Update| TRIP
    MANAGE -->|Create new| SCHEDULE
```

## 10. Complaint Resolution Flow

```mermaid
stateDiagram-v2
    [*] --> Open: Customer files complaint

    Open --> InProgress: Admin assigns to team
    InProgress --> NeedMoreInfo: Request additional info
    NeedMoreInfo --> InProgress: Customer provides info

    InProgress --> Resolved: Solution found
    InProgress --> Escalated: Complex issue

    Escalated --> InProgress: Escalation team handles

    Resolved --> Closed: Customer confirms resolution
    Resolved --> Reopened: Customer not satisfied

    Reopened --> InProgress: Re-investigate

    Open --> Rejected: Invalid complaint

    Closed --> [*]
    Rejected --> [*]

    note right of Open
        Auto-generate ticket number
        Priority: urgent/high/medium/low
        Category: booking/payment/service/etc
    end note

    note right of InProgress
        Admin adds resolution notes
        Can attach documents
        Track response time SLA
    end note

    note right of Resolved
        Refund processed if applicable
        Compensation points added
        Resolution notes saved
    end note
```

## 11. Real-time Updates với Socket.IO

```mermaid
graph TB
    subgraph "Clients"
        CUSTOMER[Customer Web App]
        OPERATOR[Operator Dashboard]
        TRIPMGR[Trip Manager App]
    end

    subgraph "Socket.IO Server"
        SOCKET[Socket.IO Server]
        REDIS[Redis Pub/Sub]
    end

    subgraph "Events"
        BOOK_UPDATE[Booking Updates]
        TRIP_STATUS[Trip Status Changes]
        SEAT_AVAIL[Seat Availability]
        PAYMENT_STATUS[Payment Status]
        LOCATION[Real-time Location]
    end

    CUSTOMER -->|Connect| SOCKET
    OPERATOR -->|Connect| SOCKET
    TRIPMGR -->|Connect| SOCKET

    SOCKET <-->|Pub/Sub| REDIS

    SOCKET -->|Emit| BOOK_UPDATE
    SOCKET -->|Emit| TRIP_STATUS
    SOCKET -->|Emit| SEAT_AVAIL
    SOCKET -->|Emit| PAYMENT_STATUS
    SOCKET -->|Emit| LOCATION

    BOOK_UPDATE -->|Subscribe| CUSTOMER
    SEAT_AVAIL -->|Subscribe| CUSTOMER
    PAYMENT_STATUS -->|Subscribe| CUSTOMER

    BOOK_UPDATE -->|Subscribe| OPERATOR
    TRIP_STATUS -->|Subscribe| OPERATOR

    LOCATION -->|Subscribe| CUSTOMER
    TRIP_STATUS -->|Subscribe| TRIPMGR
```

## 12. Seat Locking Mechanism

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant API as API Server
    participant REDIS as Redis
    participant DB as MongoDB

    Note over U1,DB: Both users viewing same trip

    U1->>API: Select seats [A1, A2]
    API->>REDIS: SET seat_lock:trip123:A1 = user1 (TTL: 15min)
    API->>REDIS: SET seat_lock:trip123:A2 = user1 (TTL: 15min)
    REDIS-->>API: Locks created
    API-->>U1: Seats locked for you

    U2->>API: Select seats [A2, A3]
    API->>REDIS: CHECK seat_lock:trip123:A2
    REDIS-->>API: Already locked by user1
    API-->>U2: Seat A2 unavailable

    API->>REDIS: SET seat_lock:trip123:A3 = user2 (TTL: 15min)
    REDIS-->>API: Lock created
    API-->>U2: Seat A3 locked for you

    Note over U1,REDIS: User 1 completes booking within 15 min

    U1->>API: Complete booking
    API->>DB: Create booking with seats A1, A2
    API->>REDIS: DEL seat_lock:trip123:A1
    API->>REDIS: DEL seat_lock:trip123:A2
    API->>DB: Mark seats as booked

    Note over U2,REDIS: User 2 abandons booking (15 min timeout)

    REDIS->>REDIS: TTL expires for A3
    Note over REDIS: seat_lock:trip123:A3 auto-deleted

    Note over U2: Seat A3 becomes available again
```

---

## Tổng Kết Kiến Trúc

### Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
|------------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Ant Design |
| **State Management** | Zustand (with persistence) |
| **Real-time** | Socket.IO |
| **Backend** | Express.js + Node.js |
| **Database** | MongoDB + Mongoose |
| **Caching** | Redis |
| **Authentication** | JWT Tokens |
| **File Storage** | Cloudinary |
| **Payment** | VNPay, Momo, ZaloPay |
| **QR Codes** | qrcode + crypto encryption |
| **Email** | Nodemailer + Resend |
| **Testing** | Jest + Vitest + React Testing Library |

### Đặc Điểm Nổi Bật

1. **Multi-tenant System**: Hỗ trợ nhiều nhà xe độc lập
2. **Real-time Updates**: Socket.IO cho thông tin chuyến xe và ghế trống
3. **Dynamic Pricing**: Giá linh hoạt theo nhu cầu, giờ cao điểm, cuối tuần
4. **Loyalty Program**: 4 tier với điểm thưởng tự động
5. **Seat Locking**: Redis-based locking mechanism (15 phút)
6. **QR Code Verification**: Mã hóa QR code để bảo mật
7. **Guest Booking**: Không bắt buộc tài khoản
8. **Recurring Trips**: Tạo chuyến xe định kỳ tự động
9. **Multi-payment**: 6 phương thức thanh toán
10. **Responsive Design**: Mobile-first approach
