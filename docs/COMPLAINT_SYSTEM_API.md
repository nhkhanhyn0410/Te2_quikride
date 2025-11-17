# Complaint System API Documentation

## Overview
Complete complaint and support ticket management system for customers and administrators.

---

## Table of Contents
1. [User Complaint APIs](#user-complaint-apis)
2. [Admin Complaint Management APIs](#admin-complaint-management-apis)
3. [Models & Enums](#models--enums)
4. [Usage Examples](#usage-examples)

---

## User Complaint APIs

### 1. Create Complaint

Create a new support ticket/complaint.

**Endpoint:** `POST /api/v1/complaints`

**Authentication:** Required (Customer or Admin)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "subject": "Sự cố thanh toán không thành công",
  "description": "Tôi đã thanh toán nhưng vẫn chưa nhận được vé. Mã đặt vé: BK-20240117-00123",
  "category": "payment",
  "priority": "high",
  "bookingId": "65a7f3e4b8c9d2e1f4a5b6c7",
  "operatorId": "65a7f3e4b8c9d2e1f4a5b6c8",
  "tripId": "65a7f3e4b8c9d2e1f4a5b6c9",
  "attachments": [
    {
      "fileName": "payment_proof.jpg",
      "fileUrl": "https://storage.example.com/complaints/payment_proof.jpg",
      "fileType": "image/jpeg"
    }
  ]
}
```

**Field Descriptions:**
- `subject` (required): Tiêu đề khiếu nại (max 200 chars)
- `description` (required): Mô tả chi tiết vấn đề
- `category` (required): Danh mục (booking, payment, service, driver, vehicle, refund, technical, other)
- `priority` (optional): Độ ưu tiên (low, medium, high, urgent) - default: medium
- `bookingId` (optional): ID đặt vé liên quan
- `operatorId` (optional): ID nhà xe liên quan
- `tripId` (optional): ID chuyến đi liên quan
- `attachments` (optional): Danh sách file đính kèm

**Success Response (201 Created):**

```json
{
  "status": "success",
  "message": "Tạo khiếu nại thành công",
  "data": {
    "_id": "65a7f3e4b8c9d2e1f4a5b6ca",
    "ticketNumber": "TCKT-20240117-00001",
    "subject": "Sự cố thanh toán không thành công",
    "description": "Tôi đã thanh toán nhưng vẫn chưa nhận được vé...",
    "category": "payment",
    "priority": "high",
    "status": "open",
    "userId": "65a7f3e4b8c9d2e1f4a5b6c1",
    "userEmail": "customer@example.com",
    "userPhone": "0912345678",
    "bookingId": "65a7f3e4b8c9d2e1f4a5b6c7",
    "attachments": [...],
    "notes": [],
    "createdAt": "2024-01-17T10:30:00.000Z",
    "updatedAt": "2024-01-17T10:30:00.000Z"
  }
}
```

---

### 2. Get My Complaints

Get list of current user's complaints with filtering and pagination.

**Endpoint:** `GET /api/v1/complaints`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | - | Filter by status (open, in_progress, resolved, closed, rejected) |
| category | string | No | - | Filter by category |
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |
| sort | string | No | -createdAt | Sort field (prefix with - for descending) |

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "65a7f3e4b8c9d2e1f4a5b6ca",
      "ticketNumber": "TCKT-20240117-00001",
      "subject": "Sự cố thanh toán không thành công",
      "category": "payment",
      "priority": "high",
      "status": "in_progress",
      "assignedTo": {
        "_id": "65a7f3e4b8c9d2e1f4a5b6c2",
        "fullName": "Admin User",
        "email": "admin@example.com"
      },
      "bookingId": {
        "_id": "65a7f3e4b8c9d2e1f4a5b6c7",
        "bookingCode": "BK-20240117-00123",
        "totalPrice": 250000
      },
      "createdAt": "2024-01-17T10:30:00.000Z",
      "updatedAt": "2024-01-17T11:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 2,
    "limit": 10
  }
}
```

---

### 3. Get Complaint Details

Get detailed information about a specific complaint.

**Endpoint:** `GET /api/v1/complaints/:id`

**Authentication:** Required (Owner or Admin)

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "_id": "65a7f3e4b8c9d2e1f4a5b6ca",
    "ticketNumber": "TCKT-20240117-00001",
    "subject": "Sự cố thanh toán không thành công",
    "description": "Tôi đã thanh toán nhưng vẫn chưa nhận được vé...",
    "category": "payment",
    "priority": "high",
    "status": "resolved",
    "userId": {
      "_id": "65a7f3e4b8c9d2e1f4a5b6c1",
      "fullName": "Nguyễn Văn A",
      "email": "customer@example.com",
      "phone": "0912345678"
    },
    "assignedTo": {
      "_id": "65a7f3e4b8c9d2e1f4a5b6c2",
      "fullName": "Admin User",
      "email": "admin@example.com"
    },
    "resolvedBy": {
      "_id": "65a7f3e4b8c9d2e1f4a5b6c2",
      "fullName": "Admin User",
      "email": "admin@example.com"
    },
    "bookingId": {...},
    "operatorId": {...},
    "attachments": [...],
    "notes": [
      {
        "_id": "65a7f3e4b8c9d2e1f4a5b6cb",
        "content": "Chúng tôi đang kiểm tra giao dịch của bạn",
        "addedBy": {
          "_id": "65a7f3e4b8c9d2e1f4a5b6c2",
          "fullName": "Admin User",
          "email": "admin@example.com",
          "role": "admin"
        },
        "addedByRole": "admin",
        "isInternal": false,
        "createdAt": "2024-01-17T11:00:00.000Z"
      }
    ],
    "resolution": "Đã hoàn tiền và tạo lại vé. Vui lòng kiểm tra email.",
    "resolvedAt": "2024-01-17T14:30:00.000Z",
    "satisfactionRating": 5,
    "satisfactionFeedback": "Giải quyết nhanh chóng, hài lòng",
    "createdAt": "2024-01-17T10:30:00.000Z",
    "updatedAt": "2024-01-17T15:00:00.000Z"
  }
}
```

**Note:** Internal notes (isInternal: true) are filtered out for non-admin users.

---

### 4. Add Note to Complaint

Add a comment/note to a complaint.

**Endpoint:** `POST /api/v1/complaints/:id/notes`

**Authentication:** Required (Owner or Admin)

**Request Body:**

```json
{
  "content": "Tôi đã nhận được email xác nhận hoàn tiền. Cảm ơn!",
  "isInternal": false
}
```

**Field Descriptions:**
- `content` (required): Nội dung ghi chú
- `isInternal` (optional): Ghi chú nội bộ (chỉ admin mới thấy) - only admins can set this to true

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Thêm ghi chú thành công",
  "data": {
    // ... complaint object with updated notes
  }
}
```

---

### 5. Add Satisfaction Rating

Rate the complaint resolution (only after complaint is resolved).

**Endpoint:** `PUT /api/v1/complaints/:id/satisfaction`

**Authentication:** Required (Owner only)

**Request Body:**

```json
{
  "rating": 5,
  "feedback": "Giải quyết nhanh chóng và chuyên nghiệp"
}
```

**Field Descriptions:**
- `rating` (required): Rating from 1 to 5 stars
- `feedback` (optional): Additional feedback text

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Cảm ơn bạn đã đánh giá",
  "data": {
    // ... complaint object with satisfaction rating
  }
}
```

---

## Admin Complaint Management APIs

All admin APIs require admin authentication.

**Base URL:** `/api/v1/admin/complaints`

### 1. Get All Complaints (Admin)

Get all complaints with advanced filtering.

**Endpoint:** `GET /api/v1/admin/complaints`

**Authentication:** Required (Admin only)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | - | Filter by status |
| category | string | No | - | Filter by category |
| priority | string | No | - | Filter by priority |
| assignedTo | string | No | - | Filter by assigned admin (use 'unassigned' or 'me' or admin ID) |
| search | string | No | - | Search in ticket number, subject, description, email |
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |
| sort | string | No | -createdAt | Sort field |

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "65a7f3e4b8c9d2e1f4a5b6ca",
      "ticketNumber": "TCKT-20240117-00001",
      "subject": "Sự cố thanh toán không thành công",
      "category": "payment",
      "priority": "high",
      "status": "in_progress",
      "userId": {
        "_id": "65a7f3e4b8c9d2e1f4a5b6c1",
        "fullName": "Nguyễn Văn A",
        "email": "customer@example.com",
        "phone": "0912345678"
      },
      "assignedTo": {
        "_id": "65a7f3e4b8c9d2e1f4a5b6c2",
        "fullName": "Admin User",
        "email": "admin@example.com"
      },
      "bookingId": {...},
      "operatorId": {...},
      "createdAt": "2024-01-17T10:30:00.000Z",
      "updatedAt": "2024-01-17T11:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8,
    "limit": 20
  }
}
```

---

### 2. Assign Complaint

Assign a complaint to an admin.

**Endpoint:** `PUT /api/v1/admin/complaints/:id/assign`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "adminId": "65a7f3e4b8c9d2e1f4a5b6c2"
}
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Phân công khiếu nại thành công",
  "data": {
    // ... updated complaint with assignedTo populated
  }
}
```

**Note:** When assigned, if status is 'open', it will automatically change to 'in_progress'.

---

### 3. Update Complaint Status

Update the status of a complaint.

**Endpoint:** `PUT /api/v1/admin/complaints/:id/status`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "status": "in_progress"
}
```

**Valid Statuses:**
- `open` - Newly created
- `in_progress` - Being worked on
- `resolved` - Resolved (use resolve endpoint instead)
- `closed` - Closed by admin
- `rejected` - Rejected as invalid

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Cập nhật trạng thái thành công",
  "data": {
    // ... updated complaint
  }
}
```

---

### 4. Update Complaint Priority

Update the priority level of a complaint.

**Endpoint:** `PUT /api/v1/admin/complaints/:id/priority`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "priority": "urgent"
}
```

**Valid Priorities:**
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority
- `urgent` - Urgent priority

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Cập nhật độ ưu tiên thành công",
  "data": {
    // ... updated complaint
  }
}
```

---

### 5. Resolve Complaint

Mark a complaint as resolved with resolution details.

**Endpoint:** `PUT /api/v1/admin/complaints/:id/resolve`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "resolution": "Đã kiểm tra và hoàn tiền 250,000 VND vào tài khoản. Đã tạo lại vé và gửi qua email. Vui lòng kiểm tra."
}
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Giải quyết khiếu nại thành công",
  "data": {
    "_id": "65a7f3e4b8c9d2e1f4a5b6ca",
    "status": "resolved",
    "resolution": "Đã kiểm tra và hoàn tiền...",
    "resolvedBy": {
      "_id": "65a7f3e4b8c9d2e1f4a5b6c2",
      "fullName": "Admin User",
      "email": "admin@example.com"
    },
    "resolvedAt": "2024-01-17T14:30:00.000Z",
    // ... rest of complaint data
  }
}
```

---

### 6. Get Complaint Statistics

Get comprehensive complaint statistics.

**Endpoint:** `GET /api/v1/admin/complaints/statistics`

**Authentication:** Required (Admin only)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | ISO Date | No | - | Start date for statistics |
| endDate | ISO Date | No | - | End date for statistics |

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "total": 350,
    "open": 45,
    "inProgress": 78,
    "resolved": 210,
    "unassigned": 15,
    "byStatus": [
      { "_id": "open", "count": 45 },
      { "_id": "in_progress", "count": 78 },
      { "_id": "resolved", "count": 210 },
      { "_id": "closed", "count": 15 },
      { "_id": "rejected", "count": 2 }
    ],
    "byCategory": [
      { "_id": "payment", "count": 120 },
      { "_id": "service", "count": 85 },
      { "_id": "booking", "count": 65 },
      { "_id": "driver", "count": 40 },
      { "_id": "vehicle", "count": 25 },
      { "_id": "refund", "count": 10 },
      { "_id": "technical", "count": 3 },
      { "_id": "other", "count": 2 }
    ],
    "byPriority": [
      { "_id": "low", "count": 50 },
      { "_id": "medium", "count": 200 },
      { "_id": "high", "count": 80 },
      { "_id": "urgent", "count": 20 }
    ],
    "avgResolutionTime": 7200000,
    "satisfaction": {
      "avgRating": 4.5,
      "totalRatings": 180
    }
  }
}
```

**Field Descriptions:**
- `avgResolutionTime`: Average time to resolve (in milliseconds)
- `satisfaction.avgRating`: Average satisfaction rating (1-5)
- `satisfaction.totalRatings`: Total number of ratings received

---

## Models & Enums

### Complaint Status

```javascript
const ComplaintStatus = {
  OPEN: 'open',           // Newly created, not assigned
  IN_PROGRESS: 'in_progress',  // Assigned and being worked on
  RESOLVED: 'resolved',   // Resolved by admin
  CLOSED: 'closed',       // Closed by admin
  REJECTED: 'rejected'    // Rejected as invalid
};
```

### Complaint Category

```javascript
const ComplaintCategory = {
  BOOKING: 'booking',     // Booking-related issues
  PAYMENT: 'payment',     // Payment issues
  SERVICE: 'service',     // Service quality issues
  DRIVER: 'driver',       // Driver-related complaints
  VEHICLE: 'vehicle',     // Vehicle condition issues
  REFUND: 'refund',       // Refund requests
  TECHNICAL: 'technical', // Technical/app issues
  OTHER: 'other'          // Other issues
};
```

### Complaint Priority

```javascript
const ComplaintPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};
```

---

## Usage Examples

### Example 1: Customer Creates Complaint

```javascript
// Customer creates a payment-related complaint
const response = await fetch('http://localhost:5000/api/v1/complaints', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${customerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    subject: 'Thanh toán thành công nhưng không nhận được vé',
    description: 'Tôi đã thanh toán 250,000 VND lúc 10:00 sáng nhưng vẫn chưa nhận được vé qua email. Mã đặt vé: BK-20240117-00123',
    category: 'payment',
    priority: 'high',
    bookingId: '65a7f3e4b8c9d2e1f4a5b6c7',
    attachments: [
      {
        fileName: 'payment_screenshot.jpg',
        fileUrl: 'https://storage.example.com/payment_screenshot.jpg',
        fileType: 'image/jpeg'
      }
    ]
  })
});

const data = await response.json();
console.log('Ticket Number:', data.data.ticketNumber);
```

### Example 2: Admin Views Unassigned Complaints

```javascript
// Admin gets all unassigned urgent complaints
const response = await fetch(
  'http://localhost:5000/api/v1/admin/complaints?assignedTo=unassigned&priority=urgent',
  {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  }
);

const data = await response.json();
console.log(`Found ${data.pagination.total} unassigned urgent complaints`);
```

### Example 3: Admin Assigns and Resolves Complaint

```javascript
const complaintId = '65a7f3e4b8c9d2e1f4a5b6ca';
const adminId = '65a7f3e4b8c9d2e1f4a5b6c2';

// Step 1: Assign to admin
await fetch(`http://localhost:5000/api/v1/admin/complaints/${complaintId}/assign`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ adminId })
});

// Step 2: Add internal note
await fetch(`http://localhost:5000/api/v1/complaints/${complaintId}/notes`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Đã liên hệ payment gateway, đang chờ xác nhận',
    isInternal: true
  })
});

// Step 3: Add customer-facing note
await fetch(`http://localhost:5000/api/v1/complaints/${complaintId}/notes`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Chúng tôi đang kiểm tra giao dịch của bạn. Vui lòng chờ trong 24h.',
    isInternal: false
  })
});

// Step 4: Resolve complaint
await fetch(`http://localhost:5000/api/v1/admin/complaints/${complaintId}/resolve`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    resolution: 'Đã xác nhận giao dịch thành công. Vé đã được gửi lại qua email. Vui lòng kiểm tra hộp thư và spam folder.'
  })
});
```

### Example 4: Customer Rates Resolution

```javascript
// Customer rates the resolution
await fetch(`http://localhost:5000/api/v1/complaints/${complaintId}/satisfaction`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${customerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    rating: 5,
    feedback: 'Giải quyết nhanh chóng và chuyên nghiệp. Cảm ơn!'
  })
});
```

### Example 5: React Component for Customer Complaints

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/v1/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || '';
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="complaints-list">
      <h2>Khiếu Nại Của Tôi</h2>
      {complaints.map(complaint => (
        <div key={complaint._id} className="complaint-card">
          <div className="flex justify-between">
            <h3>{complaint.subject}</h3>
            <span className={`badge ${getStatusBadge(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
          <p>Mã ticket: {complaint.ticketNumber}</p>
          <p>Danh mục: {complaint.category}</p>
          <p>Độ ưu tiên: {complaint.priority}</p>
          {complaint.assignedTo && (
            <p>Được xử lý bởi: {complaint.assignedTo.fullName}</p>
          )}
          <button onClick={() => viewDetails(complaint._id)}>
            Xem chi tiết
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyComplaints;
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Thiếu thông tin bắt buộc"
}
```

**401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Vui lòng đăng nhập để truy cập",
  "code": "NO_TOKEN"
}
```

**403 Forbidden:**
```json
{
  "status": "error",
  "message": "Bạn không có quyền truy cập tài nguyên này"
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "message": "Không tìm thấy khiếu nại"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Lỗi khi xử lý khiếu nại",
  "error": "Error details..."
}
```

---

## Best Practices

1. **Always attach relevant information** (booking ID, screenshots) when creating complaints
2. **Use appropriate categories** to help route complaints to the right team
3. **Set priority levels accurately** - only use 'urgent' for critical issues
4. **Add notes regularly** to keep customers informed of progress
5. **Internal notes** should be used for sensitive information or internal discussions
6. **Resolve complaints promptly** and provide detailed resolution explanations
7. **Encourage satisfaction ratings** to track support quality
8. **Monitor statistics** to identify common issues and improve service

---

## Notes

1. **Ticket Number Format:** TCKT-YYYYMMDD-XXXXX (auto-generated)
2. **Average Resolution Time:** Calculated in milliseconds for resolved tickets
3. **Satisfaction Rating:** Can only be added after complaint is resolved or closed
4. **Internal Notes:** Only visible to admins, useful for team communication
5. **Assignment:** Auto-changes status from 'open' to 'in_progress' when assigned
6. **Filtering:** Admins can filter by 'me' to see their assigned complaints
