# 🔧 Fix Trip Validation Error

## Vấn đề

Khi tạo trip, gặp lỗi:
```
Trip validation failed: availableSeats: Path `availableSeats` is required.,
totalSeats: Path `totalSeats` is required., finalPrice: Path `finalPrice` is required.
```

## Nguyên nhân

Có 3 trường bắt buộc không được tự động tính toán:
1. **finalPrice** - Tính từ `basePrice` và `discount`
2. **totalSeats** - Lấy từ `Bus.seatLayout.totalSeats`
3. **availableSeats** - Ban đầu bằng `totalSeats`

Lỗi xảy ra khi **Bus không có `seatLayout`** hợp lệ trong database.

---

## ✅ Giải pháp 1: Truyền trực tiếp các trường bắt buộc (Nhanh nhất)

Khi tạo trip, **truyền thêm** `totalSeats` và `availableSeats`:

```javascript
// Frontend request body
const tripData = {
  routeId: "...",
  busId: "...",
  driverId: "...",
  tripManagerId: "...",
  departureTime: "2025-01-20T08:00:00Z",
  arrivalTime: "2025-01-20T12:00:00Z",
  basePrice: 150000,
  discount: 0,

  // ✅ THÊM 2 TRƯỜNG NÀY
  totalSeats: 40,      // Tổng số ghế của xe
  availableSeats: 40   // Ban đầu = totalSeats
};
```

**Lưu ý:** `finalPrice` sẽ tự động tính = `basePrice * (1 - discount/100)`

---

## ✅ Giải pháp 2: Fix Bus trong Database

### Cách 1: Sử dụng MongoDB Compass hoặc mongosh

```javascript
// 1. Kết nối MongoDB
mongosh "mongodb://localhost:27017/quikride"

// 2. Kiểm tra Bus nào thiếu seatLayout
db.buses.find({
  $or: [
    { seatLayout: { $exists: false } },
    { "seatLayout.totalSeats": { $exists: false } }
  ]
}).pretty()

// 3. Update Bus với default seatLayout
// Ví dụ: Bus limousine 8 chỗ
db.buses.updateOne(
  { busNumber: "29A-12345" }, // Thay bằng biển số xe thực tế
  {
    $set: {
      seatLayout: {
        floors: 1,
        rows: 4,
        columns: 2,
        layout: [
          ["1", "2"],
          ["3", "4"],
          ["5", "6"],
          ["7", "8"]
        ],
        totalSeats: 8
      }
    }
  }
)

// 4. Verify
db.buses.findOne({ busNumber: "29A-12345" })
```

### Default Layouts theo Bus Type

#### Limousine (8 chỗ)
```json
{
  "floors": 1,
  "rows": 4,
  "columns": 2,
  "layout": [
    ["1", "2"],
    ["3", "4"],
    ["5", "6"],
    ["7", "8"]
  ],
  "totalSeats": 8
}
```

#### Sleeper (18 giường)
```json
{
  "floors": 1,
  "rows": 6,
  "columns": 3,
  "layout": [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["10", "11", "12"],
    ["13", "14", "15"],
    ["16", "17", "18"]
  ],
  "totalSeats": 18
}
```

#### Seater (40 chỗ ngồi)
```json
{
  "floors": 1,
  "rows": 10,
  "columns": 5,
  "layout": [
    ["1", "2", "", "3", "4"],
    ["5", "6", "", "7", "8"],
    ["9", "10", "", "11", "12"],
    ["13", "14", "", "15", "16"],
    ["17", "18", "", "19", "20"],
    ["21", "22", "", "23", "24"],
    ["25", "26", "", "27", "28"],
    ["29", "30", "", "31", "32"],
    ["33", "34", "", "35", "36"],
    ["37", "38", "", "39", "40"]
  ],
  "totalSeats": 40
}
```

#### Double Decker (32 giường 2 tầng)
```json
{
  "floors": 2,
  "rows": 8,
  "columns": 4,
  "layout": [
    ["1", "2", "", "3", "4"],
    ["5", "6", "", "7", "8"],
    ["9", "10", "", "11", "12"],
    ["13", "14", "", "15", "16"],
    ["17", "18", "", "19", "20"],
    ["21", "22", "", "23", "24"],
    ["25", "26", "", "27", "28"],
    ["29", "30", "", "31", "32"]
  ],
  "totalSeats": 32
}
```

### Cách 2: Sử dụng API (Nếu có Bus Update endpoint)

```bash
# PUT /api/v1/operators/buses/:busId
curl -X PUT http://localhost:5000/api/v1/operators/buses/BUS_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "seatLayout": {
      "floors": 1,
      "rows": 4,
      "columns": 2,
      "layout": [
        ["1", "2"],
        ["3", "4"],
        ["5", "6"],
        ["7", "8"]
      ],
      "totalSeats": 8
    }
  }'
```

---

## ✅ Giải pháp 3: Chạy Fix Script (Tự động)

**Yêu cầu:** Đã install dependencies

```bash
# 1. Install dependencies (nếu chưa)
cd backend
npm install

# 2. Chạy fix script
node scripts/fix-bus-seat-layout.js
```

Script sẽ:
- Tìm tất cả Bus không có `seatLayout`
- Tự động áp default layout theo `busType`
- Báo cáo kết quả

---

## 🧪 Kiểm tra sau khi Fix

### 1. Kiểm tra Bus
```javascript
// MongoDB
db.buses.find({}).forEach(bus => {
  print(`${bus.busNumber}: ${bus.seatLayout?.totalSeats || 'MISSING'} seats`)
})
```

### 2. Thử tạo Trip
```bash
curl -X POST http://localhost:5000/api/v1/operators/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "routeId": "ROUTE_ID",
    "busId": "BUS_ID",
    "driverId": "DRIVER_ID",
    "tripManagerId": "MANAGER_ID",
    "departureTime": "2025-01-20T08:00:00Z",
    "arrivalTime": "2025-01-20T12:00:00Z",
    "basePrice": 150000,
    "discount": 0
  }'
```

Nếu thành công, response sẽ có:
```json
{
  "status": "success",
  "message": "Tạo chuyến xe thành công",
  "data": {
    "trip": {
      "_id": "...",
      "totalSeats": 40,
      "availableSeats": 40,
      "finalPrice": 150000,
      ...
    }
  }
}
```

---

## 📋 Tóm tắt

| Giải pháp | Ưu điểm | Nhược điểm |
|-----------|---------|------------|
| **Giải pháp 1**: Truyền trực tiếp | Nhanh nhất, không cần DB | Phải nhớ truyền mỗi lần |
| **Giải pháp 2**: Fix Bus DB | Fix một lần, không lo nữa | Cần access MongoDB |
| **Giải pháp 3**: Run script | Tự động cho tất cả Bus | Cần install dependencies |

**Khuyến nghị:** Sử dụng **Giải pháp 2** để fix vĩnh viễn.

---

## 🔍 Debug Tips

```bash
# Kiểm tra Bus cụ thể
mongosh
> use quikride
> db.buses.findOne({ busNumber: "YOUR_BUS_NUMBER" })

# Xem tất cả Bus và seatLayout
> db.buses.find({}, { busNumber: 1, busType: 1, "seatLayout.totalSeats": 1 }).pretty()

# Count Bus thiếu seatLayout
> db.buses.countDocuments({ "seatLayout.totalSeats": { $exists: false } })
```

---

## 💡 Notes

- `finalPrice` = `basePrice * (1 - discount/100)` (tự động tính)
- `availableSeats` = `totalSeats - bookedSeats.length` (tự động update)
- Khi tạo Trip mới, `availableSeats` = `totalSeats`
- Nếu Bus có `seatLayout`, không cần truyền `totalSeats` & `availableSeats`
