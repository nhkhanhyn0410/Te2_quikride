# Database Schema - Vé xe nhanh

## Tổng Quan

Vé xe nhanh sử dụng **MongoDB** làm database chính với các lý do:
- **Flexibility:** Schema linh hoạt cho việc mở rộng tính năng
- **Scalability:** Dễ dàng scale horizontal
- **Performance:** Tối ưu cho read-heavy operations (tìm kiếm chuyến xe)
- **Document-based:** Phù hợp với dữ liệu phân cấp (seat layout, embedded documents)

### Database Statistics

- **Total Collections:** 11 collections
- **Estimated Size:** ~5GB (cho 100,000 users, 1,000 operators, 1M bookings/year)
- **Indexes:** 25+ compound indexes
- **Relationships:** Mix of embedded và referenced documents

---

## Collections Overview

| Collection | Description | Estimated Documents | Size |
|------------|-------------|---------------------|------|
| **users** | Khách hàng | 100,000+ | 50MB |
| **busoperators** | Nhà xe | 1,000+ | 10MB |
| **routes** | Tuyến đường | 5,000+ | 5MB |
| **buses** | Xe | 10,000+ | 20MB |
| **trips** | Lịch trình chuyến xe | 500,000+/year | 200MB |
| **bookings** | Đặt vé | 1,000,000+/year | 500MB |
| **tickets** | Vé điện tử | 1,000,000+/year | 300MB |
| **payments** | Thanh toán | 1,000,000+/year | 200MB |
| **reviews** | Đánh giá | 200,000+/year | 50MB |
| **vouchers** | Mã giảm giá | 1,000+ | 1MB |
| **employees** | Nhân viên | 20,000+ | 10MB |

---

## Detailed Schema Definitions

### 1. Users Collection

**Purpose:** Lưu trữ thông tin khách hàng

```javascript
{
  _id: ObjectId,

  // Basic Info
  email: String,              // unique, required, lowercase
  phone: String,              // unique, required
  password: String,           // hashed với bcrypt, select: false
  fullName: String,           // required
  dateOfBirth: Date,          // optional
  gender: String,             // enum: ['male', 'female', 'other']
  avatar: String,             // URL từ Cloudinary

  // Role
  role: String,               // enum: ['customer', 'admin'], default: 'customer'

  // OAuth
  googleId: String,           // unique, sparse
  facebookId: String,         // unique, sparse

  // Verification
  isEmailVerified: Boolean,   // default: false
  isPhoneVerified: Boolean,   // default: false
  emailVerificationToken: String,
  phoneVerificationOTP: String,
  otpExpires: Date,

  // Security
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,

  // Preferences
  savedPassengers: [          // Danh sách hành khách thường đi (max 5)
    {
      fullName: String,
      phone: String,
      idCard: String
    }
  ],

  // Loyalty Program
  loyaltyTier: String,        // enum: ['bronze', 'silver', 'gold', 'platinum']
  totalPoints: Number,        // default: 0
  pointsHistory: [
    {
      points: Number,
      reason: String,
      tripId: ObjectId,       // ref: 'Trip'
      createdAt: Date
    }
  ],

  // Status
  isActive: Boolean,          // default: true
  isBlocked: Boolean,         // default: false
  blockedReason: String,
  blockedAt: Date,

  // Timestamps
  createdAt: Date,            // auto
  updatedAt: Date             // auto
}
```

**Indexes:**
```javascript
users.createIndex({ email: 1 }, { unique: true })
users.createIndex({ phone: 1 }, { unique: true })
users.createIndex({ googleId: 1 }, { unique: true, sparse: true })
users.createIndex({ facebookId: 1 }, { unique: true, sparse: true })
users.createIndex({ createdAt: -1 })
users.createIndex({ loyaltyTier: 1, totalPoints: -1 })
```

---

### 2. BusOperators Collection

**Purpose:** Lưu trữ thông tin nhà xe

```javascript
{
  _id: ObjectId,

  // Basic Info
  companyName: String,        // unique, required
  email: String,              // unique, required, lowercase
  phone: String,              // required
  password: String,           // hashed, select: false

  // Business Info
  businessLicense: String,    // Giấy phép kinh doanh, required
  taxCode: String,            // Mã số thuế, required
  logo: String,               // URL
  description: String,
  website: String,

  // Address
  address: {
    street: String,
    ward: String,
    district: String,
    city: String,
    country: String           // default: 'Vietnam'
  },

  // Bank Info (for payment settlements)
  bankInfo: {
    bankName: String,
    accountNumber: String,
    accountHolder: String
  },

  // Approval Status
  verificationStatus: String, // enum: ['pending', 'approved', 'rejected']
  verifiedAt: Date,
  verifiedBy: ObjectId,       // ref: 'User' (admin)
  rejectionReason: String,

  // Rating & Reviews
  averageRating: Number,      // 0-5, default: 0
  totalReviews: Number,       // default: 0

  // Statistics
  totalTrips: Number,         // default: 0
  totalRevenue: Number,       // default: 0

  // Commission
  commissionRate: Number,     // Percentage (0-100), default: 5

  // Status
  isActive: Boolean,          // default: true
  isSuspended: Boolean,       // default: false
  suspensionReason: String,
  suspendedAt: Date,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
busoperators.createIndex({ companyName: 1 }, { unique: true })
busoperators.createIndex({ email: 1 }, { unique: true })
busoperators.createIndex({ verificationStatus: 1 })
busoperators.createIndex({ averageRating: -1 })
busoperators.createIndex({ createdAt: -1 })
```

---

### 3. Routes Collection

**Purpose:** Lưu trữ các tuyến đường

```javascript
{
  _id: ObjectId,

  // Owner
  operatorId: ObjectId,       // ref: 'BusOperator', required

  // Route Info
  routeName: String,          // e.g., "Hà Nội - Đà Nẵng"
  routeCode: String,          // unique, uppercase, e.g., "HN-DN-001"

  // Origin & Destination (Embedded)
  origin: {
    city: String,             // required, e.g., "Hà Nội"
    province: String,         // required
    station: String,          // e.g., "Bến xe Mỹ Đình"
    address: String,
    coordinates: {            // For maps
      lat: Number,
      lng: Number
    }
  },

  destination: {
    city: String,
    province: String,
    station: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Pickup & Dropoff Points (Embedded array)
  pickupPoints: [
    {
      name: String,           // e.g., "Bến xe Mỹ Đình"
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  ],

  dropoffPoints: [
    {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  ],

  // Route Details
  distance: Number,           // km, required
  estimatedDuration: Number,  // minutes, required

  // Status
  isActive: Boolean,          // default: true

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
routes.createIndex({ routeCode: 1 }, { unique: true })
routes.createIndex({ operatorId: 1 })
routes.createIndex({ 'origin.city': 1, 'destination.city': 1 })
routes.createIndex({ isActive: 1 })
```

---

### 4. Buses Collection

**Purpose:** Lưu trữ thông tin xe

```javascript
{
  _id: ObjectId,

  // Owner
  operatorId: ObjectId,       // ref: 'BusOperator', required

  // Bus Info
  busNumber: String,          // License plate, unique, required, uppercase
  busType: String,            // enum: ['limousine', 'sleeper', 'seater', 'double_decker']

  // Seat Configuration (Embedded)
  seatLayout: {
    floors: Number,           // 1 or 2, required
    rows: Number,             // required
    columns: Number,          // required
    layout: [[String]],       // 2D array, e.g., [['A1','A2'], ['B1','B2']]
                              // null or empty string for no seat
    totalSeats: Number        // Calculated from layout
  },

  // Amenities
  amenities: [String],        // e.g., ['wifi', 'ac', 'toilet', 'tv', 'water']

  // Status
  status: String,             // enum: ['active', 'maintenance', 'retired']

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
buses.createIndex({ busNumber: 1 }, { unique: true })
buses.createIndex({ operatorId: 1 })
buses.createIndex({ status: 1 })
```

---

### 5. Trips Collection

**Purpose:** Lưu trữ lịch trình chuyến xe

```javascript
{
  _id: ObjectId,

  // References
  routeId: ObjectId,          // ref: 'Route', required
  busId: ObjectId,            // ref: 'Bus', required
  operatorId: ObjectId,       // ref: 'BusOperator', required, indexed
  driverId: ObjectId,         // ref: 'Employee', required
  tripManagerId: ObjectId,    // ref: 'Employee', required

  // Trip Details
  departureTime: Date,        // required, indexed
  arrivalTime: Date,          // required

  // Pricing
  basePrice: Number,          // required, VND
  discount: Number,           // Percentage, default: 0
  finalPrice: Number,         // Calculated

  // Seat Availability (Real-time)
  totalSeats: Number,         // From bus
  availableSeats: Number,     // Dynamic
  bookedSeats: [String],      // e.g., ['A1', 'B2']

  // Status
  status: String,             // enum: ['scheduled', 'ongoing', 'completed', 'cancelled']

  // Cancellation
  cancelledAt: Date,
  cancelReason: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
trips.createIndex({ routeId: 1, departureTime: 1 })
trips.createIndex({ operatorId: 1, status: 1 })
trips.createIndex({ departureTime: 1 })
trips.createIndex({ status: 1 })
trips.createIndex({ 'route.origin.city': 1, 'route.destination.city': 1, departureTime: 1 })
```

---

### 6. Bookings Collection

**Purpose:** Lưu trữ đặt vé

```javascript
{
  _id: ObjectId,

  // References
  userId: ObjectId,           // ref: 'User', optional (null for guest)
  tripId: ObjectId,           // ref: 'Trip', required, indexed
  operatorId: ObjectId,       // ref: 'BusOperator', required

  // Booking Code
  bookingCode: String,        // unique, e.g., "QR-20240115-ABCD"

  // Contact Info (for guests)
  contactEmail: String,       // required
  contactPhone: String,       // required

  // Seats
  seats: [String],            // e.g., ['A1', 'A2'], required

  // Passengers (Embedded)
  passengers: [
    {
      seatNumber: String,
      fullName: String,
      phone: String,
      idCard: String          // CMND/CCCD
    }
  ],

  // Pickup & Dropoff
  pickupPoint: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  dropoffPoint: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Pricing
  basePrice: Number,          // Per seat
  totalSeats: Number,
  subtotal: Number,           // basePrice * totalSeats
  discount: Number,           // From voucher
  total: Number,              // Final amount

  // Voucher
  voucherCode: String,
  voucherId: ObjectId,        // ref: 'Voucher'

  // Status
  status: String,             // enum: ['pending', 'confirmed', 'cancelled', 'completed']

  // Seat Hold (for pending bookings)
  seatHoldExpiry: Date,       // 15 minutes from creation

  // Cancellation
  cancelledAt: Date,
  cancelReason: String,
  refundAmount: Number,
  refundStatus: String,       // enum: ['pending', 'completed', 'failed']

  // Loyalty Points
  pointsEarned: Number,       // default: 0

  // Notes
  notes: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
bookings.createIndex({ bookingCode: 1 }, { unique: true })
bookings.createIndex({ userId: 1, status: 1 })
bookings.createIndex({ tripId: 1, status: 1 })
bookings.createIndex({ contactEmail: 1, contactPhone: 1 })
bookings.createIndex({ createdAt: -1 })
bookings.createIndex({ seatHoldExpiry: 1 }, { expireAfterSeconds: 0 }) // TTL index
```

---

### 7. Tickets Collection

**Purpose:** Lưu trữ vé điện tử

```javascript
{
  _id: ObjectId,

  // References
  bookingId: ObjectId,        // ref: 'Booking', required, unique
  userId: ObjectId,           // ref: 'User', optional
  tripId: ObjectId,           // ref: 'Trip', required

  // Ticket Code
  ticketCode: String,         // unique, e.g., "TKT-20240115-ABCDEFGH"

  // QR Code
  qrCode: String,             // Base64 encoded or URL
  qrCodeData: String,         // JSON string with encrypted data

  // PDF
  pdfUrl: String,             // Cloudinary URL or S3 URL

  // Passenger Info (Denormalized for quick access)
  passengers: [
    {
      seatNumber: String,
      fullName: String,
      phone: String
    }
  ],

  // Trip Info (Denormalized)
  tripInfo: {
    route: String,            // e.g., "Hà Nội - Đà Nẵng"
    departureTime: Date,
    arrivalTime: Date,
    pickupPoint: String,
    dropoffPoint: String
  },

  // Verification
  isUsed: Boolean,            // default: false
  usedAt: Date,
  verifiedBy: ObjectId,       // ref: 'Employee' (Trip Manager)

  // Status
  status: String,             // enum: ['valid', 'cancelled', 'expired', 'used']

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
tickets.createIndex({ ticketCode: 1 }, { unique: true })
tickets.createIndex({ bookingId: 1 }, { unique: true })
tickets.createIndex({ userId: 1, status: 1 })
tickets.createIndex({ tripId: 1, status: 1 })
tickets.createIndex({ qrCodeData: 1 })
```

---

### 8. Payments Collection

**Purpose:** Lưu trữ giao dịch thanh toán

```javascript
{
  _id: ObjectId,

  // References
  bookingId: ObjectId,        // ref: 'Booking', required
  userId: ObjectId,           // ref: 'User', optional

  // Transaction Info
  transactionId: String,      // unique, from payment gateway
  paymentMethod: String,      // enum: ['vnpay', 'momo', 'zalopay', 'atm', 'visa', 'mastercard', 'cod']

  // Amount
  amount: Number,             // VND, required
  currency: String,           // default: 'VND'

  // Status
  status: String,             // enum: ['pending', 'completed', 'failed', 'refunded']

  // Payment Gateway Response
  gatewayResponse: {
    code: String,
    message: String,
    data: Object              // Raw response from gateway
  },

  // Refund Info
  refundAmount: Number,
  refundedAt: Date,
  refundReason: String,
  refundTransactionId: String,

  // Metadata
  ipAddress: String,
  userAgent: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  paidAt: Date
}
```

**Indexes:**
```javascript
payments.createIndex({ transactionId: 1 }, { unique: true, sparse: true })
payments.createIndex({ bookingId: 1 })
payments.createIndex({ userId: 1, status: 1 })
payments.createIndex({ status: 1, createdAt: -1 })
```

---

### 9. Reviews Collection

**Purpose:** Lưu trữ đánh giá

```javascript
{
  _id: ObjectId,

  // References
  userId: ObjectId,           // ref: 'User', required
  bookingId: ObjectId,        // ref: 'Booking', required, unique
  tripId: ObjectId,           // ref: 'Trip', required
  operatorId: ObjectId,       // ref: 'BusOperator', required

  // Rating (1-5 stars)
  overallRating: Number,      // required, min: 1, max: 5

  // Detailed Ratings
  vehicleRating: Number,      // 1-5
  driverRating: Number,       // 1-5
  punctualityRating: Number,  // 1-5
  serviceRating: Number,      // 1-5

  // Comment
  comment: String,            // optional, max 500 chars

  // Media
  images: [String],           // URLs, max 5

  // Operator Response
  operatorResponse: String,
  respondedAt: Date,

  // Status
  isPublished: Boolean,       // default: true
  isReported: Boolean,        // default: false
  reportReason: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
reviews.createIndex({ bookingId: 1 }, { unique: true })
reviews.createIndex({ userId: 1, createdAt: -1 })
reviews.createIndex({ operatorId: 1, isPublished: 1 })
reviews.createIndex({ tripId: 1 })
reviews.createIndex({ overallRating: -1, createdAt: -1 })
```

---

### 10. Vouchers Collection

**Purpose:** Lưu trữ mã giảm giá

```javascript
{
  _id: ObjectId,

  // Owner (null for system-wide vouchers)
  operatorId: ObjectId,       // ref: 'BusOperator', optional

  // Voucher Info
  code: String,               // unique, uppercase, e.g., "SUMMER2024"
  name: String,               // Display name
  description: String,

  // Discount
  discountType: String,       // enum: ['percentage', 'fixed']
  discountValue: Number,      // Percentage (0-100) or Fixed amount
  maxDiscount: Number,        // Max discount for percentage type

  // Conditions
  minPurchase: Number,        // Minimum booking amount
  applicableRoutes: [ObjectId], // ref: 'Route', empty = all routes
  applicableBusTypes: [String], // empty = all types

  // Usage Limits
  totalLimit: Number,         // Total uses, null = unlimited
  usedCount: Number,          // default: 0
  perUserLimit: Number,       // Uses per user, null = unlimited

  // Validity
  validFrom: Date,            // required
  validUntil: Date,           // required

  // Status
  isActive: Boolean,          // default: true

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
vouchers.createIndex({ code: 1 }, { unique: true })
vouchers.createIndex({ operatorId: 1, isActive: 1 })
vouchers.createIndex({ validFrom: 1, validUntil: 1 })
```

---

### 11. Employees Collection

**Purpose:** Lưu trữ nhân viên (tài xế, quản lý chuyến)

```javascript
{
  _id: ObjectId,

  // Owner
  operatorId: ObjectId,       // ref: 'BusOperator', required

  // Employee Info
  employeeCode: String,       // unique per operator
  fullName: String,           // required
  phone: String,              // required
  email: String,
  idCard: String,             // CMND/CCCD
  address: String,
  dateOfBirth: Date,

  // Authentication
  password: String,           // hashed, select: false

  // Role
  role: String,               // enum: ['driver', 'trip_manager'], required

  // Driver-specific
  licenseNumber: String,      // For drivers
  licenseClass: String,       // e.g., "D", "E"
  licenseExpiry: Date,

  // Status
  status: String,             // enum: ['active', 'on_leave', 'suspended', 'terminated']

  // Work History
  hireDate: Date,
  terminationDate: Date,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
employees.createIndex({ operatorId: 1, employeeCode: 1 }, { unique: true })
employees.createIndex({ operatorId: 1, role: 1, status: 1 })
employees.createIndex({ phone: 1 })
```

---

## Relationships Diagram

```
┌─────────────┐
│    Users    │────┐
└─────────────┘    │
                   ├──> Bookings ──> Tickets ──> Payments
┌─────────────┐    │       │             │
│   Trips     │────┘       └───────> Reviews
└──────┬──────┘
       │
       ├── Routes
       ├── Buses
       ├── BusOperators
       └── Employees (Driver, Trip Manager)

Vouchers ──> Bookings (optional)
```

---

## Data Flow Examples

### 1. Booking Flow

```javascript
// Step 1: User searches for trips
GET /api/trips/search?from=HN&to=DN&date=2024-01-15

// Returns trips with available seats
// Check: trips.status = 'scheduled' && trips.availableSeats > 0

// Step 2: User selects seats and creates booking
POST /api/bookings
{
  tripId: "...",
  seats: ["A1", "A2"],
  ...
}

// Backend:
// 1. Lock seats in Redis (15 min TTL)
// 2. Create booking with status='pending'
// 3. Update trip.bookedSeats (temporary)

// Step 3: User pays
POST /api/payments/create
{
  bookingId: "...",
  paymentMethod: "vnpay"
}

// Backend:
// 1. Redirect to payment gateway
// 2. Await callback

// Step 4: Payment callback
GET /api/payments/vnpay/callback?...

// Backend:
// 1. Update payment.status = 'completed'
// 2. Update booking.status = 'confirmed'
// 3. Confirm trip.bookedSeats
// 4. Create ticket with QR code
// 5. Send email/SMS with ticket
// 6. Add loyalty points to user
```

### 2. Seat Locking Mechanism (Redis)

```javascript
// When user selects seats
SET trip:{tripId}:seat:{seatNumber} userId EX 900 // 15 minutes

// Before confirming booking
seats.forEach(seat => {
  const locked = await redis.get(`trip:${tripId}:seat:${seat}`);
  if (locked && locked !== userId) {
    throw new Error('Seat already taken');
  }
});

// After payment success
seats.forEach(seat => {
  await redis.del(`trip:${tripId}:seat:${seat}`);
});

// After payment timeout (15 min)
// Seats automatically released by Redis TTL
```

---

## Sample Data

### Sample User
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "email": "nguyen.van.a@gmail.com",
  "phone": "0901234567",
  "fullName": "Nguyễn Văn A",
  "loyaltyTier": "gold",
  "totalPoints": 1250,
  "isEmailVerified": true,
  "isPhoneVerified": true,
  "savedPassengers": [
    {
      "fullName": "Nguyễn Văn B",
      "phone": "0909876543",
      "idCard": "001234567890"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Sample Trip
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "routeId": "65a1...",
  "busId": "65a2...",
  "operatorId": "65a3...",
  "driverId": "65a4...",
  "tripManagerId": "65a5...",
  "departureTime": "2024-01-15T08:00:00.000Z",
  "arrivalTime": "2024-01-15T20:00:00.000Z",
  "basePrice": 350000,
  "finalPrice": 350000,
  "totalSeats": 40,
  "availableSeats": 35,
  "bookedSeats": ["A1", "A2", "B1", "C3", "D5"],
  "status": "scheduled"
}
```

---

## Migration & Seeding

### Initial Seed Data

```bash
# Seed script location: backend/src/seeds/

# Seed order (important for relationships):
1. Users (admin accounts)
2. BusOperators
3. Routes
4. Buses
5. Employees
6. Trips
7. Vouchers (optional)
8. Sample Bookings (optional for demo)
```

### Sample Seed Command

```javascript
// backend/src/seeds/index.js
const seedUsers = require('./users.seed');
const seedOperators = require('./operators.seed');
const seedRoutes = require('./routes.seed');

async function runSeeds() {
  await seedUsers();
  await seedOperators();
  await seedRoutes();
  // ...
}

// Run: npm run seed
```

---

## Performance Considerations

### 1. Indexing Strategy

```javascript
// Compound indexes for common queries
trips.createIndex({
  'route.origin.city': 1,
  'route.destination.city': 1,
  departureTime: 1
});

// Index for seat availability check
trips.createIndex({
  status: 1,
  availableSeats: 1,
  departureTime: 1
});
```

### 2. Caching Strategy (Redis)

```javascript
// Cache frequently accessed data
- Seat availability: 1 minute TTL
- Trip search results: 5 minutes TTL
- Route info: 1 hour TTL
- User sessions: 30 minutes TTL
```

### 3. Query Optimization

```javascript
// Use projection to limit fields
db.trips.find({ status: 'scheduled' }, {
  _id: 1,
  departureTime: 1,
  basePrice: 1,
  availableSeats: 1
});

// Use lean() in Mongoose for read-only data
Trip.find().lean().exec();
```

---

## Backup & Recovery

### Backup Strategy

```bash
# Daily backup
mongodump --uri="mongodb://localhost:27017/vexenhanh" --out=/backup/daily/$(date +%Y%m%d)

# Weekly full backup
mongodump --uri="mongodb://localhost:27017/vexenhanh" --archive=/backup/weekly/week_$(date +%W).gz --gzip

# Retention: 7 days (daily), 4 weeks (weekly)
```

### Recovery

```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/vexenhanh" /backup/daily/20240115
```

---

## Security Considerations

### 1. Data Encryption

```javascript
// Encrypt sensitive fields
- User.password: bcrypt hashing
- Payment.gatewayResponse: encryption at rest
- Ticket.qrCodeData: AES-256 encryption
```

### 2. Data Retention

```javascript
// Personal data retention policy (GDPR compliance)
- Inactive users: Delete after 3 years
- Completed bookings: Archive after 2 years
- Payment records: Keep for 5 years (legal requirement)
```

### 3. Access Control

```javascript
// Field-level security
User.password: { select: false }
Payment.gatewayResponse: { select: false }

// Role-based access
- Customer: Can only access their own bookings
- Operator: Can only access their own data
- Admin: Full access
```

---

## Conclusion

Database schema được thiết kế để:
- **Flexible:** Dễ dàng mở rộng tính năng
- **Performant:** Tối ưu với indexes và caching
- **Scalable:** Sẵn sàng cho horizontal scaling
- **Secure:** Bảo mật data với encryption và access control
- **Maintainable:** Document structure rõ ràng, dễ maintain

Các relationships được thiết kế cân bằng giữa **normalization** (tránh duplicate) và **denormalization** (performance cho read operations).
