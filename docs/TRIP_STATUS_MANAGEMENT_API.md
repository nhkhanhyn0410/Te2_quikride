# Trip Status Management API Documentation

## Phase 5.4 - Trip Management (UC-21)

This document describes the Trip Status Management API for Trip Managers and Drivers.

---

## Overview

The Trip Status Management API allows trip managers and drivers to update the status of trips in real-time. When a status is changed, the system automatically sends notifications to all passengers via email and SMS.

**Key Features:**
- Unified status update endpoint
- Automatic passenger notifications (Email + SMS)
- Status transition validation
- Support for cancellation with reason
- Real-time status tracking

---

## Authentication

All endpoints require:
- **Authentication**: Bearer token in Authorization header
- **Role**: `trip_manager` or `driver`

```bash
Authorization: Bearer <trip_manager_token>
```

---

## Trip Status Values

The system supports the following status values:

| Status | Description | Can Transition To |
|--------|-------------|-------------------|
| `scheduled` | Trip is scheduled (default) | `ongoing`, `cancelled` |
| `ongoing` | Trip has started/departed | `completed`, `cancelled` |
| `completed` | Trip has finished | None (final state) |
| `cancelled` | Trip was cancelled | None (final state) |

---

## API Endpoint

### Update Trip Status (UC-21)

Update the status of a trip and automatically notify all passengers.

**Endpoint:** `PUT /api/v1/trip-manager/trips/:tripId/status`

**Authentication:** Required (Trip Manager or Driver)

**Request Body:**

```json
{
  "status": "ongoing",
  "reason": "Optional reason (required for cancelled status)"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | New status: `scheduled`, `ongoing`, `completed`, or `cancelled` |
| `reason` | string | No | Reason for status change (max 500 chars). **Required** when status is `cancelled` |

---

## Examples

### Example 1: Start Trip (scheduled → ongoing)

Mark trip as started/departed.

**Request:**

```bash
PUT /api/v1/trip-manager/trips/65a1b2c3d4e5f6g7/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ongoing"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Chuyến xe đã được đánh dấu đang di chuyển. Hành khách đã được thông báo.",
  "data": {
    "trip": {
      "_id": "65a1b2c3d4e5f6g7",
      "status": "ongoing",
      "oldStatus": "scheduled",
      "newStatus": "ongoing",
      "updatedAt": "2024-01-15T08:05:00.000Z",
      "cancelReason": null,
      "cancelledAt": null
    }
  }
}
```

**What Happens:**
- Trip status changes from `scheduled` to `ongoing`
- All passengers receive email notification
- All passengers receive SMS notification
- Emails contain trip details and status update

---

### Example 2: Complete Trip (ongoing → completed)

Mark trip as completed/finished.

**Request:**

```bash
PUT /api/v1/trip-manager/trips/65a1b2c3d4e5f6g7/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Chuyến xe đã hoàn thành. Hành khách đã được thông báo.",
  "data": {
    "trip": {
      "_id": "65a1b2c3d4e5f6g7",
      "status": "completed",
      "oldStatus": "ongoing",
      "newStatus": "completed",
      "updatedAt": "2024-01-15T20:10:00.000Z",
      "cancelReason": null,
      "cancelledAt": null
    }
  }
}
```

**What Happens:**
- Trip status changes from `ongoing` to `completed`
- All passengers receive completion notification
- Email includes thank you message and review request
- SMS confirms trip completion

---

### Example 3: Cancel Trip (scheduled → cancelled)

Cancel a trip with reason.

**Request:**

```bash
PUT /api/v1/trip-manager/trips/65a1b2c3d4e5f6g7/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled",
  "reason": "Xe gặp sự cố kỹ thuật"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Chuyến xe đã bị hủy. Hành khách đã được thông báo.",
  "data": {
    "trip": {
      "_id": "65a1b2c3d4e5f6g7",
      "status": "cancelled",
      "oldStatus": "scheduled",
      "newStatus": "cancelled",
      "updatedAt": "2024-01-15T07:30:00.000Z",
      "cancelReason": "Xe gặp sự cố kỹ thuật",
      "cancelledAt": "2024-01-15T07:30:00.000Z"
    }
  }
}
```

**What Happens:**
- Trip status changes to `cancelled`
- Cancel reason is recorded
- All passengers receive urgent cancellation notification
- Email and SMS include refund instructions
- Operator needs to process refunds separately

---

## Error Responses

### 400 Bad Request - Missing Status

```json
{
  "success": false,
  "message": "Trạng thái mới là bắt buộc"
}
```

### 400 Bad Request - Invalid Status

```json
{
  "success": false,
  "message": "Trạng thái không hợp lệ. Chỉ chấp nhận: scheduled, ongoing, completed, cancelled"
}
```

### 400 Bad Request - Invalid Transition

```json
{
  "success": false,
  "message": "Không thể chuyển từ trạng thái \"completed\" sang \"ongoing\""
}
```

### 400 Bad Request - Missing Cancellation Reason

```json
{
  "success": false,
  "message": "Lý do hủy chuyến là bắt buộc"
}
```

### 404 Not Found - Trip Not Found

```json
{
  "success": false,
  "message": "Không tìm thấy chuyến xe"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Không có quyền truy cập"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Lỗi cập nhật trạng thái chuyến xe",
  "error": "Error details"
}
```

---

## Status Transition Rules

### Valid Transitions

```
scheduled → ongoing     ✅ Trip starts/departs
scheduled → cancelled   ✅ Trip cancelled before departure
ongoing → completed     ✅ Trip finishes
ongoing → cancelled     ✅ Trip cancelled during journey
completed → *           ❌ Final state - no transitions
cancelled → *           ❌ Final state - no transitions
```

### Validation Rules

1. **Status must be valid**: Only `scheduled`, `ongoing`, `completed`, `cancelled`
2. **Transition must be allowed**: Cannot go backwards or skip states
3. **Cancellation requires reason**: `reason` field is mandatory when `status = "cancelled"`
4. **No changes to final states**: Cannot change status of completed or cancelled trips

---

## Notification Details

### Email Notifications

When a trip status changes, all passengers receive a formatted HTML email with:

**For ongoing status:**
- Subject: "🚌 Chuyến xe của bạn đã khởi hành - [Route Name]"
- Trip details (route, time, origin, destination)
- Status change visualization
- Contact information

**For completed status:**
- Subject: "✅ Chuyến xe đã hoàn thành - [Route Name]"
- Thank you message
- Review request
- Contact information

**For cancelled status:**
- Subject: "❌ Chuyến xe đã bị hủy - [Route Name]"
- Cancellation notice
- Refund instructions
- Urgent styling (red highlights)
- Contact information for support

### SMS Notifications

Shorter messages for immediate updates:

**Examples:**
- Ongoing: "QuikRide: Chuyen xe Ha Noi - Da Nang (15/01 08:00) da khoi hanh. Chuc ban hanh trinh tot lanh!"
- Completed: "QuikRide: Chuyen xe Ha Noi - Da Nang da hoan thanh. Cam on ban da su dung dich vu!"
- Cancelled: "QuikRide: Chuyen xe Ha Noi - Da Nang (15/01 08:00) da bi huy. Vui long lien he nha xe de duoc ho tro."

**Note:** SMS is only sent if SMS_ENABLED=true in environment configuration.

---

## Testing with cURL

### 1. Login as Trip Manager

```bash
curl -X POST http://localhost:5000/api/v1/trip-manager/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager1",
    "password": "manager123"
  }'
```

Save the `token` from response.

### 2. Update Trip to Ongoing

```bash
curl -X PUT http://localhost:5000/api/v1/trip-manager/trips/YOUR_TRIP_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ongoing"
  }'
```

### 3. Complete Trip

```bash
curl -X PUT http://localhost:5000/api/v1/trip-manager/trips/YOUR_TRIP_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### 4. Cancel Trip

```bash
curl -X PUT http://localhost:5000/api/v1/trip-manager/trips/YOUR_TRIP_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled",
    "reason": "Xe gặp sự cố kỹ thuật"
  }'
```

---

## Frontend Integration Example

```javascript
// services/tripManagerService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const updateTripStatus = async (tripId, status, reason = null) => {
  try {
    const payload = { status };
    if (reason) {
      payload.reason = reason;
    }

    const response = await axios.put(
      `${API_URL}/trip-manager/trips/${tripId}/status`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('trip_manager_token')}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi cập nhật trạng thái',
    };
  }
};

// Usage in component
const handleStartTrip = async () => {
  const result = await updateTripStatus(tripId, 'ongoing');
  if (result.success) {
    toast.success('Đã bắt đầu chuyến xe');
    // Refresh trip data
  } else {
    toast.error(result.message);
  }
};

const handleCompleteTrip = async () => {
  const result = await updateTripStatus(tripId, 'completed');
  if (result.success) {
    toast.success('Chuyến xe đã hoàn thành');
  }
};

const handleCancelTrip = async (reason) => {
  const result = await updateTripStatus(tripId, 'cancelled', reason);
  if (result.success) {
    toast.success('Đã hủy chuyến xe');
  }
};
```

---

## Environment Configuration

Configure notification settings in `.env`:

```env
# Email Configuration
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@quikride.com
FROM_NAME=QuikRide

# SMS Configuration
SMS_ENABLED=true
SMS_PROVIDER=vnpt
SMS_API_KEY=your-api-key
SMS_API_SECRET=your-secret-key
SMS_BRAND_NAME=QuikRide
VNPT_SMS_URL=https://cloudsms.vietguys.biz:4438/api/
```

**Note:** Set `EMAIL_ENABLED=false` or `SMS_ENABLED=false` to disable notifications during development.

---

## Performance Considerations

1. **Async Notifications**: Notifications are sent asynchronously to avoid blocking the status update
2. **Rate Limiting**: Small 100ms delay between notifications to avoid rate limits
3. **Failure Handling**: If notifications fail, status update still succeeds
4. **Batch Processing**: All passengers notified in single operation

---

## Security Considerations

1. **Authorization**: Only trip managers and drivers can update trip status
2. **Trip Assignment**: In production, verify trip manager is assigned to the trip
3. **Audit Trail**: All status changes are logged with timestamp and user ID
4. **Cancellation Reason**: Required for accountability and passenger communication

---

## Database Changes

### Trip Model Updates

Added methods:
- `updateStatus(newStatus, options)` - Update status with validation and notifications
- `canChangeStatus(newStatus)` - Check if transition is allowed

### Booking Model

No changes required - system queries bookings to find passengers to notify.

---

## Integration with Other Features

### Ticket Verification (UC-19, UC-20)
- Trip managers verify tickets during `ongoing` status
- Cannot verify tickets for `cancelled` or `completed` trips

### Revenue Reports (UC-17)
- Completed trips included in revenue calculations
- Cancelled trips tracked in cancellation reports

### Operator Dashboard (Phase 5.1)
- Trip status updates reflected in real-time dashboard
- Statistics updated automatically

---

## Future Enhancements

- [ ] Push notifications (mobile app)
- [ ] WebSocket real-time updates for dashboard
- [ ] Automated status updates based on GPS
- [ ] Passenger delivery confirmation
- [ ] Rating prompt after completion
- [ ] Scheduled status transitions

---

## Troubleshooting

### Notifications Not Sending

1. Check environment variables are set correctly
2. Verify EMAIL_ENABLED and SMS_ENABLED settings
3. Check SMTP credentials
4. Review logs for error messages
5. Test email configuration: `await NotificationService.testEmailConfiguration()`

### Status Update Fails

1. Verify trip ID is valid
2. Check current status and desired status are compatible
3. Ensure reason is provided for cancellations
4. Check authentication token is valid

### Passengers Not Receiving Notifications

1. Verify bookings have contact information (email/phone)
2. Check booking status is `confirmed` or `completed`
3. Review notification service logs
4. Verify SMTP/SMS service is working

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/nhkhanhyn0410/Te2_quikride/issues
- Email: support@quikride.com

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Phase:** 5.4 - Trip Management
**UC:** UC-21
