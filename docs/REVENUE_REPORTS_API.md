# Revenue Reports API Documentation

## Phase 5.3 - Reports & Analytics (UC-17)

This document describes the Revenue Reports API endpoints for Bus Operators.

---

## Overview

The Revenue Reports API provides comprehensive analytics and reporting capabilities for bus operators, including:
- Revenue breakdown by date range
- Revenue by route analysis
- Top performing routes
- Cancellation statistics
- Growth metrics (compared to previous period)
- Export to Excel and PDF formats

---

## Authentication

All endpoints require:
- **Authentication**: Bearer token in Authorization header
- **Role**: `operator`

```bash
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Get Comprehensive Revenue Report

Get a complete revenue report with all analytics.

**Endpoint:** `GET /api/v1/operators/reports/revenue`

**Query Parameters:**
- `startDate` (optional): Start date in ISO format (default: start of current month)
- `endDate` (optional): End date in ISO format (default: end of current month)
- `routeId` (optional): Filter by specific route ID
- `format` (optional): Export format - `json` (default), `excel`, or `pdf`

**Example Request:**

```bash
# JSON format (default)
GET /api/v1/operators/reports/revenue?startDate=2024-01-01&endDate=2024-01-31

# Excel export
GET /api/v1/operators/reports/revenue?startDate=2024-01-01&endDate=2024-01-31&format=excel

# PDF export
GET /api/v1/operators/reports/revenue?startDate=2024-01-01&endDate=2024-01-31&format=pdf

# Filter by route
GET /api/v1/operators/reports/revenue?routeId=65a1b2c3d4e5f6g7&startDate=2024-01-01&endDate=2024-01-31
```

**Response (JSON format):**

```json
{
  "status": "success",
  "data": {
    "report": {
      "summary": {
        "totalRevenue": 150000000,
        "totalBookings": 450,
        "totalTickets": 850,
        "averageBookingValue": 333333.33,
        "period": {
          "start": "2024-01-01T00:00:00.000Z",
          "end": "2024-01-31T23:59:59.999Z"
        }
      },
      "revenueByRoute": [
        {
          "routeId": "65a1b2c3d4e5f6g7",
          "routeName": "Hà Nội - Đà Nẵng",
          "origin": "Hà Nội",
          "destination": "Đà Nẵng",
          "revenue": 50000000,
          "bookings": 150,
          "tickets": 280
        }
      ],
      "topRoutes": [
        {
          "routeId": "65a1b2c3d4e5f6g7",
          "routeName": "Hà Nội - Đà Nẵng",
          "origin": "Hà Nội",
          "destination": "Đà Nẵng",
          "revenue": 50000000,
          "bookings": 150,
          "tickets": 280
        }
      ],
      "revenueByPaymentMethod": [
        {
          "paymentMethod": "vnpay",
          "revenue": 80000000,
          "count": 250
        },
        {
          "paymentMethod": "momo",
          "revenue": 70000000,
          "count": 200
        }
      ],
      "revenueTrend": [
        {
          "date": "2024-01-01",
          "revenue": 5000000,
          "bookings": 15,
          "tickets": 28
        }
      ],
      "cancellationReport": {
        "totalBookings": 450,
        "totalCancelled": 45,
        "cancellationRate": 10.0,
        "totalRefunded": 15000000,
        "cancellationsByRoute": [
          {
            "routeId": "65a1b2c3d4e5f6g7",
            "routeName": "Hà Nội - Đà Nẵng",
            "count": 15,
            "refundedAmount": 5000000
          }
        ]
      },
      "growthMetrics": {
        "current": {
          "revenue": 150000000,
          "bookings": 450
        },
        "previous": {
          "revenue": 120000000,
          "bookings": 380
        },
        "growth": {
          "revenue": 25.0,
          "bookings": 18.42
        }
      },
      "generatedAt": "2024-01-31T10:30:00.000Z"
    }
  }
}
```

**Response (Excel format):**
- Returns an Excel file with multiple sheets:
  - Tổng Quan (Overview)
  - Doanh Thu Theo Tuyến (Revenue by Route)
  - Xu Hướng Doanh Thu (Revenue Trend)
  - Báo Cáo Hủy Vé (Cancellation Report)

**Response (PDF format):**
- Returns a formatted PDF report with all sections

---

### 2. Get Revenue Summary (Lightweight)

Get a quick summary of revenue metrics.

**Endpoint:** `GET /api/v1/operators/reports/revenue/summary`

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Example Request:**

```bash
GET /api/v1/operators/reports/revenue/summary?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalRevenue": 150000000,
      "totalBookings": 450,
      "totalTickets": 850,
      "averageBookingValue": 333333.33,
      "period": {
        "start": "2024-01-01T00:00:00.000Z",
        "end": "2024-01-31T23:59:59.999Z"
      }
    },
    "topRoutes": [
      {
        "routeId": "65a1b2c3d4e5f6g7",
        "routeName": "Hà Nội - Đà Nẵng",
        "revenue": 50000000,
        "bookings": 150
      }
    ],
    "cancellationRate": 10.0,
    "growth": {
      "revenue": 25.0,
      "bookings": 18.42
    }
  }
}
```

---

### 3. Get Revenue by Route

Get detailed revenue breakdown by route.

**Endpoint:** `GET /api/v1/operators/reports/revenue/by-route`

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Example Request:**

```bash
GET /api/v1/operators/reports/revenue/by-route?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "revenueByRoute": [
      {
        "routeId": "65a1b2c3d4e5f6g7",
        "routeName": "Hà Nội - Đà Nẵng",
        "origin": "Hà Nội",
        "destination": "Đà Nẵng",
        "revenue": 50000000,
        "bookings": 150,
        "tickets": 280
      }
    ],
    "topRoutes": [
      {
        "routeId": "65a1b2c3d4e5f6g7",
        "routeName": "Hà Nội - Đà Nẵng",
        "origin": "Hà Nội",
        "destination": "Đà Nẵng",
        "revenue": 50000000,
        "bookings": 150,
        "tickets": 280
      }
    ]
  }
}
```

---

### 4. Get Revenue Trend

Get daily revenue breakdown over the specified period.

**Endpoint:** `GET /api/v1/operators/reports/revenue/trend`

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Example Request:**

```bash
GET /api/v1/operators/reports/revenue/trend?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "revenueTrend": [
      {
        "date": "2024-01-01",
        "revenue": 5000000,
        "bookings": 15,
        "tickets": 28
      },
      {
        "date": "2024-01-02",
        "revenue": 4800000,
        "bookings": 14,
        "tickets": 26
      }
    ],
    "summary": {
      "totalRevenue": 150000000,
      "averageDaily": 4838709.68
    }
  }
}
```

---

### 5. Get Cancellation Report

Get detailed cancellation statistics.

**Endpoint:** `GET /api/v1/operators/reports/cancellation`

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Example Request:**

```bash
GET /api/v1/operators/reports/cancellation?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "cancellationReport": {
      "totalBookings": 450,
      "totalCancelled": 45,
      "cancellationRate": 10.0,
      "totalRefunded": 15000000,
      "cancellationsByRoute": [
        {
          "routeId": "65a1b2c3d4e5f6g7",
          "routeName": "Hà Nội - Đà Nẵng",
          "count": 15,
          "refundedAmount": 5000000
        }
      ]
    }
  }
}
```

---

### 6. Get Growth Metrics

Get growth comparison with previous period.

**Endpoint:** `GET /api/v1/operators/reports/growth`

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Example Request:**

```bash
GET /api/v1/operators/reports/growth?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "growthMetrics": {
      "current": {
        "revenue": 150000000,
        "bookings": 450
      },
      "previous": {
        "revenue": 120000000,
        "bookings": 380
      },
      "growth": {
        "revenue": 25.0,
        "bookings": 18.42
      }
    }
  }
}
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Ngày bắt đầu phải trước ngày kết thúc"
}
```

**401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Không có quyền truy cập"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Không thể tạo báo cáo doanh thu"
}
```

---

## Testing with cURL

### 1. Login as Operator

```bash
curl -X POST http://localhost:5000/api/v1/operators/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

### 2. Get Revenue Report (JSON)

```bash
curl -X GET "http://localhost:5000/api/v1/operators/reports/revenue?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Export to Excel

```bash
curl -X GET "http://localhost:5000/api/v1/operators/reports/revenue?startDate=2024-01-01&endDate=2024-01-31&format=excel" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --output revenue-report.xlsx
```

### 4. Export to PDF

```bash
curl -X GET "http://localhost:5000/api/v1/operators/reports/revenue?startDate=2024-01-01&endDate=2024-01-31&format=pdf" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --output revenue-report.pdf
```

### 5. Get Revenue Summary

```bash
curl -X GET "http://localhost:5000/api/v1/operators/reports/revenue/summary?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Testing with Postman

1. **Import Collection**: Create a new Postman collection
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000/api/v1`
   - `access_token`: Your operator access token

3. **Create Requests**:
   - Login: `POST {{base_url}}/operators/login`
   - Revenue Report: `GET {{base_url}}/operators/reports/revenue`
   - Add query params: `startDate`, `endDate`, `format`

4. **Set Authorization**:
   - Type: Bearer Token
   - Token: `{{access_token}}`

---

## Frontend Integration Example

```javascript
// services/reportService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getRevenueReport = async (startDate, endDate, routeId = null) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (routeId) params.append('routeId', routeId);

  const response = await axios.get(
    `${API_URL}/operators/reports/revenue?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }
  );

  return response.data.data.report;
};

export const exportRevenueToExcel = async (startDate, endDate) => {
  const params = new URLSearchParams();
  params.append('format', 'excel');
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axios.get(
    `${API_URL}/operators/reports/revenue?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      responseType: 'blob',
    }
  );

  // Download file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `revenue-report-${Date.now()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportRevenueToPDF = async (startDate, endDate) => {
  const params = new URLSearchParams();
  params.append('format', 'pdf');
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axios.get(
    `${API_URL}/operators/reports/revenue?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      responseType: 'blob',
    }
  );

  // Download file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `revenue-report-${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
```

---

## Performance Notes

1. **Caching**: Consider implementing Redis caching for frequently accessed reports
2. **Indexing**: Ensure proper MongoDB indexes are in place:
   - `bookings.operatorId + bookings.createdAt`
   - `bookings.status + bookings.paymentStatus`
   - `trips.routeId + trips.departureTime`

3. **Large Data Sets**: For very large date ranges, consider:
   - Pagination
   - Background job processing
   - Pre-computed aggregations

4. **Export Limits**: Excel/PDF exports may timeout for very large datasets (>10,000 records)

---

## Security Considerations

1. **Authentication Required**: All endpoints require valid operator authentication
2. **Authorization**: Operators can only access their own data
3. **Rate Limiting**: Standard rate limits apply (100 requests/minute)
4. **Input Validation**: Date ranges are validated
5. **Data Privacy**: No sensitive customer data is exposed in reports

---

## Future Enhancements (Phase 7)

- [ ] Schedule automated report generation
- [ ] Email reports to operators
- [ ] Custom report builder
- [ ] Comparative analysis (year-over-year)
- [ ] Predictive analytics
- [ ] Real-time dashboard updates via WebSocket

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/nhkhanhyn0410/Te2_vexenhanh/issues
- Email: support@vexenhanh.com

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Phase:** 5.3 - Reports & Analytics
