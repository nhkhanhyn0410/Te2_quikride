# Phase 3.3: Seat Selection & Booking Implementation

## Overview
This document describes the implementation of Phase 3.3 - Seat Selection with seat hold/lock mechanism and real-time seat availability using Redis and WebSocket.

## Implemented Features

### 1. Booking Model (`/src/models/Booking.js`)
- Complete booking schema with all required fields
- Automatic booking code generation (format: `QR-YYYYMMDD-XXXX`)
- 15-minute seat hold expiry with TTL index
- Automatic booking confirmation and cancellation logic
- Refund calculation based on cancellation policy
- Virtual fields for expired status and time remaining
- Post-save middleware to update trip's booked seats

**Key Features:**
- Guest booking support (userId can be null)
- Passenger information validation
- Pickup/dropoff point tracking
- Voucher support (prepared for Phase 5)
- Loyalty points calculation

### 2. Seat Locking Service (`/src/services/seat.service.js`)
Redis-based seat locking with 15-minute TTL:

**Core Methods:**
- `lockSeats(tripId, seats, userId)` - Lock seats for 15 minutes
- `unlockSeats(tripId, seats, userId)` - Release seat locks
- `confirmSeats(tripId, seats, userId)` - Confirm booking after payment
- `isSeatAvailable(tripId, seat)` - Check single seat availability
- `getTripSeatStatus(tripId)` - Get all seats status (available/locked/booked)
- `getAvailableSeats(tripId)` - Get list of available seats
- `batchCheckSeats(tripId, seats)` - Check multiple seats at once
- `extendSeatLock(tripId, seats, userId)` - Extend lock by 15 minutes

**Features:**
- Real-time seat status from Redis
- Automatic TTL expiration (900 seconds)
- WebSocket broadcasting on seat changes
- Seat availability caching (5 minutes)

### 3. Booking Service (`/src/services/booking.service.js`)
Business logic for booking operations:

**Core Methods:**
- `holdSeats(data, userId)` - Create pending booking with seat hold
- `extendSeatHold(bookingId, userId)` - Extend hold time
- `releaseSeatHold(bookingId, userId)` - Cancel pending booking
- `confirmBooking(bookingId, paymentId)` - Confirm after payment
- `getTripSeatStatus(tripId)` - Get real-time seat status
- `getUserBookings(userId, filters)` - Get user's bookings
- `getBookingByCode(bookingCode, email, phone)` - Guest lookup
- `cancelBooking(bookingId, reason, cancelledBy)` - Cancel booking with refund

**Validation:**
- Trip availability check
- Seat count validation (1-6 seats)
- Passenger count matching seats
- Expiry time validation

### 4. Booking Controller (`/src/controllers/booking.controller.js`)
HTTP request handlers for all booking endpoints:

**Endpoints:**
- `POST /api/bookings/hold-seats` - Hold seats temporarily
- `POST /api/bookings/:id/extend` - Extend seat hold
- `DELETE /api/bookings/:id/release` - Release seat hold
- `POST /api/bookings/:id/confirm` - Confirm booking
- `POST /api/bookings/lookup` - Guest booking lookup
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/apply-voucher` - Apply voucher
- `POST /api/bookings/batch-check-seats` - Batch seat check
- `GET /api/trips/:tripId/seat-status` - Real-time seat status
- `GET /api/trips/:tripId/available-seats` - Available seats list

### 5. Booking Routes (`/src/routes/booking.routes.js`)
Complete routing with validation:

**Validation Rules:**
- Hold seats: trip ID, seats (1-6), contact info, passengers, pickup/dropoff
- Lookup: booking code, email, phone
- Cancel: booking ID, optional reason
- Voucher: booking ID, voucher code
- Batch check: trip ID, seat list

**Authentication:**
- `optionalAuth` - Allows both guest and authenticated users
- `protect` - Requires authentication

### 6. WebSocket Service (`/src/services/websocket.service.js`)
Real-time seat availability updates:

**WebSocket Events:**

**Client → Server:**
- `authenticate` - Optional user authentication
- `join-trip` - Subscribe to trip updates
- `leave-trip` - Unsubscribe from trip
- `request-seat-status` - Request current seat status

**Server → Client:**
- `seat-status` - Full seat status update
- `seat-action` - Specific seat action (locked/unlocked/booked)
- `error` - Error messages

**Features:**
- Room-based subscriptions (`trip:{tripId}`)
- Automatic broadcasting on seat changes
- Client tracking per trip
- Graceful disconnect handling

### 7. Server Integration (`/src/server.js`)
- HTTP server creation for Socket.IO
- WebSocket service initialization
- Booking routes mounting at `/api/v1/bookings`

## Data Flow

### Seat Hold Flow
```
1. User selects seats → Client calls POST /api/bookings/hold-seats
2. Server validates trip and seats
3. SeatService.batchCheckSeats() checks availability
4. SeatService.lockSeats() locks in Redis (15min TTL)
5. Booking created with status='pending'
6. WebSocket broadcasts 'seat-action' (locked)
7. Client receives booking + expiresAt timestamp
8. Timer starts on client (15 minutes countdown)
```

### Payment Confirmation Flow
```
1. User completes payment
2. Payment gateway callback → POST /api/bookings/:id/confirm
3. BookingService.confirmBooking() validates and confirms
4. Booking status → 'confirmed'
5. SeatService.confirmSeats() removes Redis locks
6. Trip.bookedSeats updated in MongoDB
7. WebSocket broadcasts 'seat-action' (booked)
8. All clients receive updated seat status
```

### Real-time Seat Updates
```
1. Client connects to WebSocket
2. Emits 'join-trip' with tripId
3. Server adds client to room 'trip:{tripId}'
4. Server sends initial 'seat-status'
5. Any seat change triggers broadcast to room
6. All watching clients receive updates instantly
```

## Redis Data Structure

### Seat Locks
```
Key: trip:{tripId}:seat:{seatNumber}
Value: {userId or sessionId}
TTL: 900 seconds (15 minutes)
```

### Seat Availability Cache
```
Key: trip:{tripId}:available_count
Value: {number of available seats}
TTL: 300 seconds (5 minutes)
```

## MongoDB Collections

### Bookings
- Indexed by: bookingCode, userId, tripId, contactEmail+Phone
- TTL index on seatHoldExpiry for auto-cleanup
- Post-save hook updates Trip.bookedSeats

## API Examples

### 1. Hold Seats
```bash
POST /api/v1/bookings/hold-seats
Content-Type: application/json
Authorization: Bearer {token} # Optional for guests

{
  "tripId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "seats": ["A1", "A2"],
  "contactEmail": "user@example.com",
  "contactPhone": "0901234567",
  "passengers": [
    {
      "seatNumber": "A1",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "idCard": "001234567890"
    },
    {
      "seatNumber": "A2",
      "fullName": "Nguyen Thi B",
      "phone": "0909876543",
      "idCard": "001234567891"
    }
  ],
  "pickupPoint": {
    "name": "Ben xe Luong Yen",
    "address": "Luong Yen, Hanoi"
  },
  "dropoffPoint": {
    "name": "Ben xe Da Nang",
    "address": "Da Nang"
  }
}

Response:
{
  "success": true,
  "message": "Ghế đã được giữ thành công",
  "data": {
    "booking": { ... },
    "expiresAt": "2024-01-15T10:15:00.000Z",
    "timeRemaining": 15
  }
}
```

### 2. Get Real-time Seat Status (WebSocket)
```javascript
// Client-side
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join trip room
socket.emit('join-trip', { tripId: '65a1b2c3d4e5f6g7h8i9j0k1' });

// Listen for seat updates
socket.on('seat-status', (data) => {
  console.log('Seat status:', data.seatStatus);
  // {
  //   'A1': 'booked',
  //   'A2': 'booked',
  //   'A3': 'available',
  //   'A4': 'locked',
  //   ...
  // }
});

// Listen for specific seat actions
socket.on('seat-action', (data) => {
  console.log(`Seats ${data.seats} are ${data.action}`);
});
```

### 3. Extend Seat Hold
```bash
POST /api/v1/bookings/65a1b2c3d4e5f6g7h8i9j0k2/extend

Response:
{
  "success": true,
  "message": "Thời gian giữ ghế đã được gia hạn",
  "data": {
    "booking": { ... },
    "expiresAt": "2024-01-15T10:30:00.000Z",
    "timeRemaining": 15
  }
}
```

## Security Features

1. **Rate Limiting**: 100 requests/minute per IP
2. **Input Validation**: Express-validator for all inputs
3. **Seat Ownership**: Redis locks tied to userId/sessionId
4. **Expiry Protection**: Automatic cleanup of expired locks
5. **Guest Access**: Secure guest booking with email+phone verification

## Performance Optimizations

1. **Redis Caching**:
   - Seat locks with TTL
   - Seat availability count (5min cache)

2. **WebSocket Rooms**:
   - Room-based broadcasting reduces overhead
   - Only watching clients receive updates

3. **Database Indexes**:
   - Compound indexes for common queries
   - TTL index for auto-cleanup

4. **Batch Operations**:
   - Batch seat checking reduces Redis calls
   - Promise.all for parallel operations

## Testing Checklist

- [ ] Hold seats successfully
- [ ] Seat lock expires after 15 minutes
- [ ] Cannot book already locked seats
- [ ] Extend seat hold works
- [ ] Release seat hold works
- [ ] Confirm booking after payment
- [ ] WebSocket broadcasts seat updates
- [ ] Multiple clients receive updates
- [ ] Guest booking works
- [ ] User booking works
- [ ] Booking lookup by code works
- [ ] Cancel booking calculates refund correctly

## Next Steps (Phase 3.4 - Payment Integration)

1. Integrate VNPay payment gateway
2. Integrate MoMo payment gateway
3. Payment callback handling
4. Auto-refund on payment failure
5. Payment status tracking
6. Generate ticket after payment success

## Files Created/Modified

**Created:**
- `/src/models/Booking.js`
- `/src/services/seat.service.js`
- `/src/services/booking.service.js`
- `/src/services/websocket.service.js`
- `/src/controllers/booking.controller.js`
- `/src/routes/booking.routes.js`

**Modified:**
- `/src/server.js` - Added HTTP server, WebSocket, booking routes
- `/src/middleware/auth.middleware.js` - Added 'protect' alias

## Dependencies

All dependencies already installed:
- `socket.io` v4.6.0 - WebSocket server
- `redis` v4.6.0 - Seat locking
- `mongoose` v8.0.0 - Database ODM
- `express-validator` v7.0.1 - Input validation

## Notes

- Redis must be running for seat locking to work
- MongoDB must be running for booking persistence
- WebSocket connects on same port as HTTP server
- Guest bookings require email+phone for lookup
- Loyalty points calculated at 1 point per 10,000 VND
- Refund policy: 90% (>24h), 70% (12-24h), 50% (6-12h), 0% (<6h)
