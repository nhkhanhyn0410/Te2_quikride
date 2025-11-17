# Admin System Reports API Documentation

## Overview
API endpoints for system-wide reports and analytics for administrators.

Base URL: `/api/v1/admin/reports`

**Authentication Required:** Yes (Admin only)

---

## Endpoints

### 1. Get System Overview Report

Get comprehensive system statistics and analytics.

**Endpoint:** `GET /api/v1/admin/reports/overview`

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | ISO Date String | No | 30 days ago | Start date for the report period |
| endDate | ISO Date String | No | Now | End date for the report period |

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Lấy thông tin tổng quan thành công",
  "data": {
    "period": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    },
    "users": {
      "total": 1250,
      "new": 87,
      "active": 1180,
      "growth": 7.5
    },
    "operators": {
      "total": 45,
      "approved": 38,
      "pending": 5,
      "rejected": 2
    },
    "bookings": {
      "total": 3456,
      "paid": 3120,
      "cancelled": 336,
      "cancellationRate": 9.7,
      "growth": 12.3
    },
    "revenue": {
      "total": 125000000,
      "averageOrderValue": 40064,
      "totalTickets": 4567,
      "growth": 15.8
    },
    "trips": {
      "total": 890,
      "completed": 845
    },
    "topRoutes": [
      {
        "_id": "route123",
        "routeName": "Hà Nội - Hải Phòng",
        "origin": "Hà Nội",
        "destination": "Hải Phòng",
        "totalBookings": 245,
        "totalRevenue": 12500000,
        "totalTickets": 312
      }
    ],
    "topOperators": [
      {
        "_id": "operator123",
        "operatorName": "Xe Khách Phương Trang",
        "totalBookings": 456,
        "totalRevenue": 28500000,
        "totalTickets": 589
      }
    ],
    "revenueTrend": [
      {
        "_id": {
          "year": 2024,
          "month": 1,
          "day": 1
        },
        "date": "2024-01-01",
        "revenue": 2500000,
        "bookings": 45
      }
    ]
  }
}
```

**Error Responses:**

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

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Ngày không hợp lệ"
}
```

---

## Response Field Descriptions

### Period
- `startDate`: Start of the reporting period
- `endDate`: End of the reporting period

### Users
- `total`: Total number of users in the system
- `new`: New users registered during the period
- `active`: Currently active users (not blocked)
- `growth`: Percentage growth compared to previous period

### Operators
- `total`: Total number of operators
- `approved`: Approved operators
- `pending`: Operators pending approval
- `rejected`: Rejected operators

### Bookings
- `total`: Total bookings in the period
- `paid`: Paid bookings
- `cancelled`: Cancelled bookings
- `cancellationRate`: Percentage of cancelled bookings
- `growth`: Percentage growth compared to previous period

### Revenue
- `total`: Total revenue (VND) from paid bookings
- `averageOrderValue`: Average revenue per booking
- `totalTickets`: Total number of tickets sold
- `growth`: Percentage growth compared to previous period

### Trips
- `total`: Total trips in the period
- `completed`: Completed trips

### Top Routes (Array)
Top 10 routes by revenue in the period:
- `_id`: Route ID
- `routeName`: Route name
- `origin`: Starting location
- `destination`: End location
- `totalBookings`: Number of bookings
- `totalRevenue`: Total revenue (VND)
- `totalTickets`: Number of tickets sold

### Top Operators (Array)
Top 10 operators by revenue in the period:
- `_id`: Operator ID
- `operatorName`: Operator business name
- `totalBookings`: Number of bookings
- `totalRevenue`: Total revenue (VND)
- `totalTickets`: Number of tickets sold

### Revenue Trend (Array)
Daily revenue breakdown:
- `_id`: Date object (year, month, day)
- `date`: ISO date string
- `revenue`: Revenue for that day
- `bookings`: Number of bookings for that day

---

## Usage Examples

### Example 1: Get Last 30 Days Overview

```bash
curl -X GET \
  'http://localhost:5000/api/v1/admin/reports/overview' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Example 2: Get Custom Date Range

```bash
curl -X GET \
  'http://localhost:5000/api/v1/admin/reports/overview?startDate=2024-01-01&endDate=2024-01-31' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Example 3: Get Last 7 Days

```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const response = await fetch(
  `http://localhost:5000/api/v1/admin/reports/overview?startDate=${sevenDaysAgo.toISOString()}`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();
console.log(data.data);
```

---

## Frontend Integration Example

### React Component for System Overview Dashboard

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemOverviewDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });

  useEffect(() => {
    fetchOverview();
  }, [dateRange]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await axios.get(
        '/api/v1/admin/reports/overview',
        {
          params: dateRange,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setOverview(response.data.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
      alert('Không thể tải báo cáo tổng quan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!overview) return <div>Không có dữ liệu</div>;

  return (
    <div className="system-overview">
      <h1>Tổng Quan Hệ Thống</h1>

      {/* Date Range Selector */}
      <div className="date-range">
        <input
          type="date"
          value={dateRange.startDate.split('T')[0]}
          onChange={(e) => setDateRange({
            ...dateRange,
            startDate: new Date(e.target.value).toISOString()
          })}
        />
        <input
          type="date"
          value={dateRange.endDate.split('T')[0]}
          onChange={(e) => setDateRange({
            ...dateRange,
            endDate: new Date(e.target.value).toISOString()
          })}
        />
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Người Dùng</h3>
          <p className="metric-value">{overview.users.total.toLocaleString()}</p>
          <p className="metric-growth">
            +{overview.users.growth.toFixed(1)}% so với kỳ trước
          </p>
        </div>

        <div className="metric-card">
          <h3>Doanh Thu</h3>
          <p className="metric-value">
            {overview.revenue.total.toLocaleString()} đ
          </p>
          <p className="metric-growth">
            +{overview.revenue.growth.toFixed(1)}% so với kỳ trước
          </p>
        </div>

        <div className="metric-card">
          <h3>Đặt Vé</h3>
          <p className="metric-value">{overview.bookings.total.toLocaleString()}</p>
          <p className="metric-growth">
            +{overview.bookings.growth.toFixed(1)}% so với kỳ trước
          </p>
        </div>

        <div className="metric-card">
          <h3>Tỷ Lệ Hủy</h3>
          <p className="metric-value">
            {overview.bookings.cancellationRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Top Routes */}
      <div className="top-routes">
        <h2>Top Tuyến Đường</h2>
        <table>
          <thead>
            <tr>
              <th>Tuyến</th>
              <th>Đặt Vé</th>
              <th>Doanh Thu</th>
              <th>Vé Bán</th>
            </tr>
          </thead>
          <tbody>
            {overview.topRoutes.map(route => (
              <tr key={route._id}>
                <td>{route.routeName}</td>
                <td>{route.totalBookings}</td>
                <td>{route.totalRevenue.toLocaleString()} đ</td>
                <td>{route.totalTickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Operators */}
      <div className="top-operators">
        <h2>Top Nhà Xe</h2>
        <table>
          <thead>
            <tr>
              <th>Nhà Xe</th>
              <th>Đặt Vé</th>
              <th>Doanh Thu</th>
              <th>Vé Bán</th>
            </tr>
          </thead>
          <tbody>
            {overview.topOperators.map(operator => (
              <tr key={operator._id}>
                <td>{operator.operatorName}</td>
                <td>{operator.totalBookings}</td>
                <td>{operator.totalRevenue.toLocaleString()} đ</td>
                <td>{operator.totalTickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue Trend Chart - Integration with Chart.js or similar */}
      <div className="revenue-trend">
        <h2>Xu Hướng Doanh Thu</h2>
        {/* Add chart component here */}
      </div>
    </div>
  );
};

export default SystemOverviewDashboard;
```

---

## Notes

1. **Date Handling**: All dates are in ISO 8601 format (UTC)
2. **Default Period**: If no date range is specified, defaults to last 30 days
3. **Growth Metrics**: Calculated by comparing current period with an equivalent previous period
4. **Performance**: Uses MongoDB aggregation pipelines for efficient data processing
5. **Caching**: Consider implementing caching for frequently requested date ranges

## Future Enhancements

- Export to Excel/PDF
- Email scheduled reports
- Custom report builder
- Real-time dashboard updates
- Comparative period analysis
- Forecasting and predictions
