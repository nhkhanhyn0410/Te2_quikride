# Admin User Management API Documentation (UC-22)

API endpoints for admin user management including listing users, viewing details, blocking/unblocking, and password reset.

**Base URL**: `/api/admin`

**Authentication Required**: Yes (Admin role only)

All requests must include the admin JWT token in the Authorization header:
```
Authorization: Bearer <admin_access_token>
```

---

## Endpoints

### 1. Get All Users

List all users with filtering, searching, and pagination.

**Endpoint**: `GET /api/admin/users`

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `role` (string, optional): Filter by role (`customer`, `admin`)
- `isBlocked` (boolean, optional): Filter by blocked status (`true`, `false`)
- `isActive` (boolean, optional): Filter by active status (`true`, `false`)
- `search` (string, optional): Search by email, phone, or name
- `sortBy` (string, optional): Sort field (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc`, `desc`) (default: `desc`)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user123",
        "email": "user@example.com",
        "phone": "0901234567",
        "fullName": "Nguyễn Văn A",
        "role": "customer",
        "isActive": true,
        "isBlocked": false,
        "loyaltyTier": "silver",
        "totalPoints": 3500,
        "isEmailVerified": true,
        "isPhoneVerified": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T15:45:00.000Z",
        "totalBookings": 15,
        "totalSpent": 4500000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=20&search=nguyen&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <admin_token>"
```

---

### 2. Get User by ID

Get detailed information about a specific user including booking statistics and recent bookings.

**Endpoint**: `GET /api/admin/users/:id`

**Path Parameters**:
- `id` (string, required): User ID

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "phone": "0901234567",
      "fullName": "Nguyễn Văn A",
      "dateOfBirth": "1990-05-15T00:00:00.000Z",
      "gender": "male",
      "role": "customer",
      "isActive": true,
      "isBlocked": false,
      "loyaltyTier": "silver",
      "totalPoints": 3500,
      "pointsHistory": [
        {
          "points": 100,
          "reason": "Booking completed",
          "tripId": "trip123",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "savedPassengers": [
        {
          "fullName": "Nguyễn Văn B",
          "phone": "0909876543",
          "idCard": "012345678901"
        }
      ],
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "lastLogin": "2024-01-20T15:45:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    },
    "stats": {
      "totalBookings": 15,
      "paidBookings": 12,
      "pendingBookings": 1,
      "cancelledBookings": 2,
      "totalSpent": 4500000
    },
    "recentBookings": [
      {
        "_id": "booking123",
        "bookingCode": "QR20240120ABC",
        "tripId": {
          "_id": "trip123",
          "routeId": {
            "_id": "route123",
            "routeName": "Hà Nội - Đà Nẵng",
            "origin": {
              "city": "Hà Nội",
              "province": "Hà Nội"
            },
            "destination": {
              "city": "Đà Nẵng",
              "province": "Đà Nẵng"
            }
          },
          "departureTime": "2024-01-25T08:00:00.000Z"
        },
        "seats": [1, 2],
        "totalPrice": 600000,
        "finalPrice": 540000,
        "paymentStatus": "paid",
        "createdAt": "2024-01-20T10:00:00.000Z"
      }
    ]
  }
}
```

**Response**: `404 Not Found`
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng"
}
```

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/admin/users/user123" \
  -H "Authorization: Bearer <admin_token>"
```

---

### 3. Block User

Block a user account with a reason. Blocked users cannot log in or perform any actions.

**Endpoint**: `PUT /api/admin/users/:id/block`

**Path Parameters**:
- `id` (string, required): User ID

**Request Body**:
```json
{
  "reason": "Violating terms of service - spam behavior detected"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Đã khóa tài khoản người dùng",
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "isBlocked": true,
      "blockedReason": "Violating terms of service - spam behavior detected",
      "blockedAt": "2024-01-20T16:00:00.000Z"
    }
  }
}
```

**Response**: `400 Bad Request` (Already blocked)
```json
{
  "success": false,
  "message": "Tài khoản đã bị khóa trước đó"
}
```

**Response**: `400 Bad Request` (Missing reason)
```json
{
  "success": false,
  "message": "Vui lòng cung cấp lý do khóa tài khoản"
}
```

**Response**: `403 Forbidden` (Trying to block admin)
```json
{
  "success": false,
  "message": "Không thể khóa tài khoản admin"
}
```

**Response**: `404 Not Found`
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng"
}
```

**Example Request**:
```bash
curl -X PUT "http://localhost:5000/api/admin/users/user123/block" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Violating terms of service - spam behavior detected"
  }'
```

**Important Notes**:
- Admin users cannot be blocked by other admins
- Reason is required and should clearly explain why the user is being blocked
- Blocked users will receive an error message when attempting to log in
- Once blocked, the user will immediately be logged out from all active sessions

---

### 4. Unblock User

Unblock a previously blocked user account.

**Endpoint**: `PUT /api/admin/users/:id/unblock`

**Path Parameters**:
- `id` (string, required): User ID

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Đã mở khóa tài khoản người dùng",
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "isBlocked": false
    }
  }
}
```

**Response**: `400 Bad Request` (Not blocked)
```json
{
  "success": false,
  "message": "Tài khoản không bị khóa"
}
```

**Response**: `404 Not Found`
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng"
}
```

**Example Request**:
```bash
curl -X PUT "http://localhost:5000/api/admin/users/user123/unblock" \
  -H "Authorization: Bearer <admin_token>"
```

**Important Notes**:
- Unblocking removes all block-related fields (blockedReason, blockedAt)
- User can immediately log in after being unblocked

---

### 5. Reset User Password

Reset a user's password as admin. Useful when users forget their password and cannot receive reset emails.

**Endpoint**: `POST /api/admin/users/:id/reset-password`

**Path Parameters**:
- `id` (string, required): User ID

**Request Body**:
```json
{
  "newPassword": "NewSecure123!",
  "sendEmail": true
}
```

**Fields**:
- `newPassword` (string, required): New password (minimum 6 characters)
- `sendEmail` (boolean, optional): Send email notification to user (default: true)

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Đã đặt lại mật khẩu cho người dùng",
  "data": {
    "user": {
      "_id": "user123",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A"
    }
  }
}
```

**Response**: `400 Bad Request` (Missing password)
```json
{
  "success": false,
  "message": "Vui lòng cung cấp mật khẩu mới"
}
```

**Response**: `400 Bad Request` (Password too short)
```json
{
  "success": false,
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

**Response**: `403 Forbidden` (Trying to reset other admin's password)
```json
{
  "success": false,
  "message": "Không thể đặt lại mật khẩu cho admin khác"
}
```

**Response**: `404 Not Found`
```json
{
  "success": false,
  "message": "Không tìm thấy người dùng"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/admin/users/user123/reset-password" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "NewSecure123!",
    "sendEmail": true
  }'
```

**Important Notes**:
- Password will be automatically hashed before storage
- Any existing password reset tokens will be invalidated
- Admin cannot reset password of other admin users (security measure)
- Admin can reset their own password
- User will need to use the new password on next login
- TODO: Email notification feature is not yet implemented

---

### 6. Get User Statistics

Get comprehensive statistics about users for admin dashboard.

**Endpoint**: `GET /api/admin/users/statistics`

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 1180,
    "blockedUsers": 15,
    "newUsersThisMonth": 85,
    "usersByRole": {
      "customer": 1245,
      "admin": 5
    },
    "usersByTier": {
      "bronze": 800,
      "silver": 300,
      "gold": 120,
      "platinum": 25
    },
    "userGrowth": [
      {
        "_id": {
          "year": 2024,
          "month": 1
        },
        "count": 85
      },
      {
        "_id": {
          "year": 2024,
          "month": 2
        },
        "count": 92
      }
    ]
  }
}
```

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/admin/users/statistics" \
  -H "Authorization: Bearer <admin_token>"
```

**Statistics Included**:
- **totalUsers**: Total number of registered users
- **activeUsers**: Users who are active and not blocked
- **blockedUsers**: Number of blocked users
- **newUsersThisMonth**: Users registered in current month
- **usersByRole**: Count of users by role (customer, admin)
- **usersByTier**: Count of customers by loyalty tier (bronze, silver, gold, platinum)
- **userGrowth**: Monthly user registration trend for last 12 months

---

## Error Responses

### Authentication Errors

**401 Unauthorized** - Missing or invalid token:
```json
{
  "status": "error",
  "message": "Vui lòng đăng nhập để truy cập",
  "code": "NO_TOKEN"
}
```

**403 Forbidden** - Not an admin:
```json
{
  "status": "error",
  "message": "Bạn không có quyền truy cập tài nguyên này"
}
```

### Validation Errors

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### Server Errors

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message (development only)"
}
```

---

## Testing with cURL

### 1. Get All Users (with filters)
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10&role=customer&isBlocked=false" \
  -H "Authorization: Bearer <admin_token>"
```

### 2. Search Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?search=nguyen&page=1&limit=20" \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Get User Details
```bash
curl -X GET "http://localhost:5000/api/admin/users/user_id_here" \
  -H "Authorization: Bearer <admin_token>"
```

### 4. Block User
```bash
curl -X PUT "http://localhost:5000/api/admin/users/user_id_here/block" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Spam behavior detected"
  }'
```

### 5. Unblock User
```bash
curl -X PUT "http://localhost:5000/api/admin/users/user_id_here/unblock" \
  -H "Authorization: Bearer <admin_token>"
```

### 6. Reset Password
```bash
curl -X POST "http://localhost:5000/api/admin/users/user_id_here/reset-password" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "NewPassword123!",
    "sendEmail": true
  }'
```

### 7. Get Statistics
```bash
curl -X GET "http://localhost:5000/api/admin/users/statistics" \
  -H "Authorization: Bearer <admin_token>"
```

---

## Frontend Integration Example

```javascript
// Admin User Management Service
const adminUserApi = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/admin/users?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    return response.json();
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    return response.json();
  },

  // Block user
  blockUser: async (userId, reason) => {
    const response = await fetch(`/api/admin/users/${userId}/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await fetch(`/api/admin/users/${userId}/unblock`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    return response.json();
  },

  // Reset password
  resetPassword: async (userId, newPassword, sendEmail = true) => {
    const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
      body: JSON.stringify({ newPassword, sendEmail }),
    });
    return response.json();
  },

  // Get statistics
  getStatistics: async () => {
    const response = await fetch(`/api/admin/users/statistics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    return response.json();
  },
};

export default adminUserApi;
```

---

## Security Considerations

1. **Admin Only**: All endpoints require admin authentication
2. **Admin Protection**: Admin users cannot be blocked by other admins
3. **Password Reset Security**: Admins can only reset passwords of customer users, not other admins (except their own)
4. **Audit Trail**: Consider logging all admin actions for security audit
5. **Rate Limiting**: Implement rate limiting on these endpoints to prevent abuse
6. **Input Validation**: All inputs are validated before processing
7. **Sensitive Data**: Passwords and tokens are never returned in responses

---

## Future Enhancements

1. **Email Notifications**: Implement email notifications when user is blocked or password is reset
2. **Audit Logs**: Add comprehensive audit logging for all admin actions
3. **Bulk Operations**: Add endpoints for bulk block/unblock operations
4. **Export**: Add ability to export user list to CSV/Excel
5. **Advanced Filters**: Add more filtering options (registration date range, loyalty tier, etc.)
6. **User Activity Log**: Add endpoint to view user activity history
7. **Role Management**: Add endpoints to promote users to admin or demote admins

---

## Related Documentation

- [Authentication API](./AUTH_API.md)
- [User Model Schema](./DATABASE_SCHEMA.md#user-schema)
- [Admin Operator Management API](./ADMIN_OPERATOR_API.md)
