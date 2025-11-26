# ⚡ QUICK FIX: Trip Validation Error

## 🔴 Lỗi bạn đang gặp

```
Trip validation failed:
- availableSeats: Path 'availableSeats' is required.
- totalSeats: Path 'totalSeats' is required.
- finalPrice: Path 'finalPrice' is required.
```

---

## ✅ GIẢI PHÁP NHANH NHẤT (2 phút)

### Thêm 2 trường vào request body khi tạo trip:

**TRƯỚC ĐÂY (BỊ LỖI):**
```json
{
  "routeId": "67...",
  "busId": "67...",
  "driverId": "67...",
  "tripManagerId": "67...",
  "departureTime": "2025-01-20T08:00:00.000Z",
  "arrivalTime": "2025-01-20T12:00:00.000Z",
  "basePrice": 150000,
  "discount": 0
}
```

**SAU KHI SỬA (HOẠT ĐỘNG):**
```json
{
  "routeId": "67...",
  "busId": "67...",
  "driverId": "67...",
  "tripManagerId": "67...",
  "departureTime": "2025-01-20T08:00:00.000Z",
  "arrivalTime": "2025-01-20T12:00:00.000Z",
  "basePrice": 150000,
  "discount": 0,

  "totalSeats": 40,
  "availableSeats": 40
}
```

### Giá trị totalSeats theo loại xe:

| Bus Type | totalSeats |
|----------|-----------|
| limousine | 8 |
| sleeper | 18 |
| seater | 40 |
| double_decker | 32 |

**Lưu ý:**
- `availableSeats` lúc đầu = `totalSeats`
- `finalPrice` sẽ tự động tính = `basePrice * (1 - discount/100)`

---

## ✅ GIẢI PHÁP VĨNh VIỄN (Fix Database)

### Cách 1: Sử dụng MongoDB Compass

1. Mở MongoDB Compass
2. Connect: `mongodb://localhost:27017`
3. Database: `vexenhanh`
4. Collection: `buses`
5. Tìm bus bị thiếu seatLayout:

```javascript
// Filter
{
  "seatLayout.totalSeats": { $exists: false }
}
```

6. Click vào bus → Edit Document → Thêm field `seatLayout`:

**Limousine (8 chỗ):**
```json
{
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
}
```

**Seater (40 chỗ):**
```json
{
  "seatLayout": {
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
}
```

### Cách 2: Sử dụng mongo shell

```bash
# Windows
mongo

# Hoặc
mongosh
```

```javascript
// Chọn database
use vexenhanh

// Kiểm tra bus nào thiếu seatLayout
db.buses.find({
  $or: [
    { seatLayout: { $exists: false } },
    { "seatLayout.totalSeats": { $exists: false } }
  ]
}).pretty()

// Update bus (thay BUS_NUMBER bằng biển số thực tế)
db.buses.updateOne(
  { busNumber: "29A-12345" },
  {
    $set: {
      seatLayout: {
        floors: 1,
        rows: 10,
        columns: 5,
        layout: [
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
        totalSeats: 40
      }
    }
  }
)

// Verify
db.buses.findOne({ busNumber: "29A-12345" })
```

### Cách 3: Update tất cả buses cùng lúc

```javascript
// Update tất cả buses loại seater
db.buses.updateMany(
  {
    busType: "seater",
    $or: [
      { seatLayout: { $exists: false } },
      { "seatLayout.totalSeats": { $exists: false } }
    ]
  },
  {
    $set: {
      seatLayout: {
        floors: 1,
        rows: 10,
        columns: 5,
        layout: [
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
        totalSeats: 40
      }
    }
  }
)

// Update limousine
db.buses.updateMany(
  {
    busType: "limousine",
    $or: [
      { seatLayout: { $exists: false } },
      { "seatLayout.totalSeats": { $exists: false } }
    ]
  },
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

// Update sleeper
db.buses.updateMany(
  {
    busType: "sleeper",
    $or: [
      { seatLayout: { $exists: false } },
      { "seatLayout.totalSeats": { $exists: false } }
    ]
  },
  {
    $set: {
      seatLayout: {
        floors: 1,
        rows: 6,
        columns: 3,
        layout: [
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["10", "11", "12"],
          ["13", "14", "15"],
          ["16", "17", "18"]
        ],
        totalSeats: 18
      }
    }
  }
)

// Update double_decker
db.buses.updateMany(
  {
    busType: "double_decker",
    $or: [
      { seatLayout: { $exists: false } },
      { "seatLayout.totalSeats": { $exists: false } }
    ]
  },
  {
    $set: {
      seatLayout: {
        floors: 2,
        rows: 8,
        columns: 5,
        layout: [
          ["1", "2", "", "3", "4"],
          ["5", "6", "", "7", "8"],
          ["9", "10", "", "11", "12"],
          ["13", "14", "", "15", "16"],
          ["17", "18", "", "19", "20"],
          ["21", "22", "", "23", "24"],
          ["25", "26", "", "27", "28"],
          ["29", "30", "", "31", "32"]
        ],
        totalSeats: 32
      }
    }
  }
)

// Kiểm tra kết quả
db.buses.find({}).forEach(bus => {
  print(bus.busNumber + " (" + bus.busType + "): " +
        (bus.seatLayout?.totalSeats || "MISSING") + " seats")
})
```

---

## 🧪 Test sau khi fix

### Frontend (React)

```javascript
const createTrip = async () => {
  const tripData = {
    routeId: selectedRoute,
    busId: selectedBus,
    driverId: selectedDriver,
    tripManagerId: selectedManager,
    departureTime: departureDate.toISOString(),
    arrivalTime: arrivalDate.toISOString(),
    basePrice: 150000,
    discount: 0,

    // ✅ Add these
    totalSeats: 40,
    availableSeats: 40
  };

  const response = await fetch('/api/v1/operators/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tripData)
  });

  const result = await response.json();
  console.log(result);
};
```

### cURL

```bash
curl -X POST http://localhost:5000/api/v1/operators/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "routeId": "674...",
    "busId": "674...",
    "driverId": "674...",
    "tripManagerId": "674...",
    "departureTime": "2025-01-20T08:00:00.000Z",
    "arrivalTime": "2025-01-20T12:00:00.000Z",
    "basePrice": 150000,
    "discount": 0,
    "totalSeats": 40,
    "availableSeats": 40
  }'
```

### Expected Success Response

```json
{
  "status": "success",
  "message": "Tạo chuyến xe thành công",
  "data": {
    "trip": {
      "_id": "674...",
      "routeId": {...},
      "busId": {...},
      "totalSeats": 40,
      "availableSeats": 40,
      "finalPrice": 150000,
      "status": "scheduled",
      ...
    }
  }
}
```

---

## 📋 TÓM TẮT

| Cách | Thời gian | Ưu điểm | Nhược điểm |
|------|-----------|---------|------------|
| **Giải pháp 1**: Truyền totalSeats | 2 phút | Nhanh nhất, không cần DB | Phải nhớ mỗi lần |
| **Giải pháp 2**: Fix DB (Compass) | 5 phút | Giao diện trực quan | Cần cài MongoDB Compass |
| **Giải pháp 3**: Fix DB (Shell) | 3 phút | Fix nhiều buses cùng lúc | Cần biết MongoDB query |

**KHUYẾN NGHỊ:**
- **Ngay lập tức:** Dùng Giải pháp 1 (thêm totalSeats vào request)
- **Lâu dài:** Dùng Giải pháp 3 (fix tất cả buses trong DB)

---

## ❓ FAQs

**Q: Tại sao lại thiếu seatLayout?**
A: Buses có thể được tạo trước khi có validation seatLayout, hoặc migration chưa chạy.

**Q: Có cần chạy lại server không?**
A: Không cần! Thay đổi trong DB có hiệu lực ngay.

**Q: Nếu đã fix DB nhưng vẫn lỗi?**
A: Kiểm tra lại bus đang dùng: `db.buses.findOne({ _id: ObjectId("YOUR_BUS_ID") })`

**Q: totalSeats có thể khác với số ghế thực tế không?**
A: Có, nhưng nên đúng với seatLayout để tránh conflict.
