# Models Documentation - QuikRide Backend

## Overview

This directory contains all Mongoose models for the QuikRide application.

## Models

### 1. User (Customer)
- **File**: `User.js`
- **Collection**: `users`
- **Purpose**: Manages customer accounts
- **Key Features**:
  - Email/Phone registration
  - OAuth support (Google, Facebook)
  - Email/Phone verification
  - Password reset functionality
  - Loyalty points system
  - Saved passengers

### 2. BusOperator (Bus Company)
- **File**: `BusOperator.js`
- **Collection**: `busoperators`
- **Purpose**: Manages bus operator (company) accounts
- **Key Features**:
  - Company registration with business license
  - Admin verification workflow (pending/approved/rejected)
  - Bank account information for settlements
  - Rating and review aggregation
  - Suspension/Resume functionality
  - Statistics tracking (trips, revenue)

**Verification Workflow**:
1. Operator registers → Status: `pending`
2. Admin reviews → Approve or Reject
3. If approved → Status: `approved`, can create routes/trips
4. If rejected → Status: `rejected`, must re-register or contact admin

**Instance Methods**:
- `approve(adminId)` - Approve operator
- `reject(adminId, reason)` - Reject operator with reason
- `suspend(reason)` - Suspend operator
- `resume()` - Resume suspended operator
- `comparePassword(candidatePassword)` - Verify password

**Static Methods**:
- `findByEmail(email)` - Find operator by email
- `findByCompanyName(companyName)` - Find by company name

## Schema Validation

All models include:
- Field-level validation
- Required field checks
- Type validation
- Custom error messages in Vietnamese
- Index optimization for queries

## Security Features

### Password Hashing
Both User and BusOperator models use bcrypt with 12 salt rounds:
```javascript
// Pre-save hook
BusOperatorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Sensitive Field Protection
Password fields are excluded from queries by default:
```javascript
password: {
  type: String,
  required: true,
  select: false  // Won't be returned in queries
}
```

## Timestamps

All models include automatic timestamps:
- `createdAt` - Created timestamp
- `updatedAt` - Last update timestamp

## Virtuals

Virtual fields are computed properties not stored in database:

**BusOperator Virtuals**:
- `fullAddress` - Concatenated address string
- `verificationStatusLabel` - Human-readable status in Vietnamese

## Indexes

Indexes are created for frequently queried fields:

```javascript
// BusOperator indexes
busoperators.index({ companyName: 1 }, { unique: true })
busoperators.index({ email: 1 }, { unique: true })
busoperators.index({ verificationStatus: 1 })
busoperators.index({ averageRating: -1 })
```

## Usage Examples

### Create BusOperator
```javascript
const operator = await BusOperator.create({
  companyName: 'QuikRide Express',
  email: 'contact@quikride.com',
  phone: '0901234567',
  password: 'SecurePass123',
  businessLicense: 'BL123456',
  taxCode: 'TAX123456',
  address: {
    street: '123 Main St',
    city: 'Ho Chi Minh',
    country: 'Vietnam'
  }
});
```

### Approve Operator
```javascript
const operator = await BusOperator.findById(operatorId);
await operator.approve(adminId);
```

### Find Approved Operators
```javascript
const operators = await BusOperator.find({
  verificationStatus: 'approved',
  isActive: true
});
```

## Future Models (To be implemented)

- Route
- Bus
- Trip
- Booking
- Ticket
- Payment
- Review
- Voucher
- Employee

See `docs/DATABASE_SCHEMA.md` for complete schema definitions.
