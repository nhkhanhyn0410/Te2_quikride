# 🚌 QUIKRIDE - HƯỚNG DẪN TRUY CẬP HỆ THỐNG

Hướng dẫn chi tiết cách truy cập và sử dụng các trang quản trị trong hệ thống QuikRide.

---

## 📋 MỤC LỤC

1. [Thiết Lập Ban Đầu](#thiết-lập-ban-đầu)
2. [Tài Khoản Mẫu](#tài-khoản-mẫu)
3. [Truy Cập Các Trang](#truy-cập-các-trang)
4. [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)

---

## 🔧 THIẾT LẬP BAN ĐẦU

### 1. Chạy Seed Data (Tạo dữ liệu mẫu)

```bash
# Di chuyển đến thư mục backend
cd backend

# Chạy seed script
npm run seed

# Hoặc chạy trực tiếp
node scripts/seedData.js
```

**Lưu ý:** Script sẽ xóa toàn bộ dữ liệu cũ và tạo dữ liệu mẫu mới.

### 2. Khởi Động Hệ Thống

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server chạy tại: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend chạy tại: http://localhost:3000
```

---

## 👤 TÀI KHOẢN MẪU

### 1. ADMIN (Quản Trị Viên Hệ Thống)

**Vai trò:** Quản lý toàn bộ hệ thống, duyệt nhà xe, quản lý người dùng

> **Lưu ý:** Chức năng admin dashboard đang được phát triển. Hiện tại admin có thể đăng nhập như customer để test hệ thống.

```
Email: admin@quikride.com
Mật khẩu: admin123
```

---

### 2. KHÁCH HÀNG (Customers)

**Vai trò:** Đặt vé, quản lý vé đã đặt, xem lịch sử

#### Khách hàng 1 - VIP Gold
```
Email: customer1@gmail.com
Số điện thoại: 0912345678
Mật khẩu: 123456
Họ tên: Nguyễn Văn An
Hạng thành viên: Gold (5,500 điểm)
```
💡 **Đăng nhập bằng**: Email HOẶC Số điện thoại

#### Khách hàng 2 - VIP Silver
```
Email: customer2@gmail.com
Số điện thoại: 0923456789
Mật khẩu: 123456
Họ tên: Trần Thị Bình
Hạng thành viên: Silver (3,200 điểm)
```

#### Khách hàng 3 - Thành viên mới
```
Email: customer3@gmail.com
Số điện thoại: 0934567890
Mật khẩu: 123456
Họ tên: Lê Hoàng Cường
Hạng thành viên: Bronze
```

---

### 3. NHÀ XE (Bus Operators)

**Vai trò:** Quản lý tuyến xe, xe, nhân viên, doanh thu

#### Nhà xe 1 - Phương Trang (FUTA)
```
Email: futabus@example.com
Mật khẩu: operator123
Công ty: Phương Trang (FUTA Bus Lines)
Trạng thái: Đã duyệt ✅
```

**Tuyến đường:**
- Sài Gòn - Đà Lạt (308km, ~7h)
- Sài Gòn - Nha Trang (450km, ~9h)

**Xe:** 2 xe (Limousine 18 chỗ, Sleeper 40 chỗ)

#### Nhà xe 2 - Thanh Bưởi
```
Email: thanhbuoi@example.com
Mật khẩu: operator123
Công ty: Thanh Bưởi
Trạng thái: Đã duyệt ✅
```

**Tuyến đường:**
- Sài Gòn - Vũng Tàu (125km, ~2h)

**Xe:** 1 xe (Ghế ngồi 34 chỗ)

#### Nhà xe 3 - Hải Vân
```
Email: haivan@example.com
Mật khẩu: operator123
Công ty: Hải Vân
Trạng thái: Đang chờ duyệt ⏳
```

---

### 4. QUẢN LÝ CHUYẾN (Trip Managers)

**Vai trò:** Quản lý chuyến xe, soát vé, xem danh sách hành khách

#### Trip Manager 1 - FUTA
```
Email: tripmanager1@futa.com
Mật khẩu: tripmanager123
Họ tên: Nguyễn Minh Quản
Mã NV: TM001
Nhà xe: Phương Trang
```

#### Trip Manager 2 - FUTA
```
Email: tripmanager2@futa.com
Mật khẩu: tripmanager123
Họ tên: Trần Văn Hùng
Mã NV: TM002
Nhà xe: Phương Trang
```

#### Trip Manager 3 - Thanh Bưởi
```
Email: tripmanager@thanhbuoi.com
Mật khẩu: tripmanager123
Họ tên: Võ Thị Mai
Mã NV: TM001
Nhà xe: Thanh Bưởi
```

---

## 🌐 TRUY CẬP CÁC TRANG

### 🏠 TRANG KHÁCH HÀNG

| Trang | URL | Mô tả |
|-------|-----|-------|
| **Trang chủ** | http://localhost:3000/ | Tìm kiếm chuyến xe |
| **Đăng ký** | http://localhost:3000/register | Đăng ký tài khoản mới |
| **Đăng nhập** | http://localhost:3000/login | Đăng nhập khách hàng |
| **Danh sách chuyến** | http://localhost:3000/trips | Kết quả tìm kiếm |
| **Chi tiết chuyến** | http://localhost:3000/trips/:tripId | Thông tin và chọn ghế |
| **Thông tin hành khách** | http://localhost:3000/booking/passenger-info | Nhập thông tin đặt vé |
| **Xác nhận đặt vé** | http://localhost:3000/booking/confirmation/:code | Vé điện tử |
| **Vé của tôi** | http://localhost:3000/my-tickets | Quản lý vé (yêu cầu đăng nhập) |
| **Tra cứu vé** | http://localhost:3000/tickets/lookup | Tra cứu vé cho khách |

---

### 🏢 TRANG NHÀ XE (OPERATOR)

| Trang | URL | Yêu cầu |
|-------|-----|---------|
| **Đăng nhập** | http://localhost:3000/operator/login | - |
| **Dashboard** | http://localhost:3000/operator/dashboard | Đăng nhập ✅ |
| **Quản lý tuyến** | http://localhost:3000/operator/routes | Đăng nhập ✅ |
| **Quản lý xe** | http://localhost:3000/operator/buses | Đăng nhập ✅ |
| **Quản lý nhân viên** | http://localhost:3000/operator/employees | Đăng nhập ✅ |
| **Báo cáo doanh thu** | http://localhost:3000/operator/reports | Đăng nhập ✅ |
| **Quản lý voucher** | http://localhost:3000/operator/vouchers | Đăng nhập ✅ |

---

### 🎫 TRANG QUẢN LÝ CHUYẾN (TRIP MANAGER)

| Trang | URL | Yêu cầu |
|-------|-----|---------|
| **Đăng nhập** | http://localhost:3000/trip-manager/login | - |
| **Dashboard** | http://localhost:3000/trip-manager/dashboard | Đăng nhập ✅ |
| **Soát vé QR** | http://localhost:3000/trip-manager/trips/:tripId/scan | Đăng nhập ✅ |
| **Danh sách khách** | http://localhost:3000/trip-manager/trips/:tripId/passengers | Đăng nhập ✅ |

---

## 📖 HƯỚNG DẪN SỬ DỤNG

### 🎯 1. KHÁCH HÀNG - ĐẶT VÉ XE

#### Bước 1: Tìm kiếm chuyến xe
1. Truy cập http://localhost:3000/
2. Nhập thông tin:
   - Điểm đi: "TP. Hồ Chí Minh"
   - Điểm đến: "Đà Lạt"
   - Ngày đi: Chọn ngày trong tương lai
   - Số ghế: 1-10
3. Click "Tìm chuyến xe"

#### Bước 2: Chọn chuyến và ghế
1. Xem danh sách chuyến xe
2. Click "Đặt vé" trên chuyến muốn đi
3. Chọn ghế trên sơ đồ xe
4. Chọn điểm đón/trả (nếu có)
5. Nhập mã voucher (nếu có)
6. Click "Tiếp tục"

#### Bước 3: Nhập thông tin
1. Nhập thông tin liên hệ
2. Nhập thông tin hành khách
3. Chọn phương thức thanh toán
4. Click "Xác nhận đặt vé"

#### Bước 4: Thanh toán & Nhận vé
1. Thanh toán theo hướng dẫn
2. Nhận mã vé qua email/SMS
3. Xem vé tại "Vé của tôi"

---

### 🏢 2. NHÀ XE - QUẢN LÝ HOẠT ĐỘNG

#### A. Đăng nhập
```
URL: http://localhost:3000/operator/login
Sử dụng tài khoản nhà xe (xem phần Tài khoản mẫu)
```

#### B. Quản lý tuyến đường
1. Vào menu "Tuyến đường"
2. Thêm tuyến mới:
   - Mã tuyến
   - Điểm đi/đến
   - Khoảng cách, thời gian
   - Điểm đón/trả khách
3. Chỉnh sửa/Xóa tuyến

#### C. Quản lý xe
1. Vào menu "Xe"
2. Thêm xe mới:
   - Biển số
   - Loại xe (Limousine, Sleeper, Ghế ngồi)
   - Sơ đồ ghế
   - Tiện ích (WiFi, AC, TV...)
3. Theo dõi bảo trì, đăng kiểm

#### D. Quản lý nhân viên
1. Vào menu "Nhân viên"
2. Thêm nhân viên:
   - Tài xế: Cần giấy phép lái xe
   - Quản lý chuyến: Thông tin cơ bản
3. Phân công chuyến xe

#### E. Báo cáo doanh thu
1. Vào menu "Báo cáo"
2. Xem:
   - Doanh thu theo ngày/tháng
   - Số vé bán ra
   - Tỷ lệ lấp đầy xe
   - Top tuyến đường
3. Xuất Excel

---

### 🎫 3. QUẢN LÝ CHUYẾN - SOÁT VÉ

#### A. Đăng nhập
```
URL: http://localhost:3000/trip-manager/login
Sử dụng tài khoản trip manager (xem phần Tài khoản mẫu)
```

#### B. Xem danh sách chuyến
1. Sau khi đăng nhập, xem các chuyến được phân công
2. Click vào chuyến để xem chi tiết

#### C. Soát vé QR Code
1. Click "Quét QR"
2. Cho phép truy cập camera
3. Quét mã QR trên vé của khách
4. Hệ thống tự động:
   - Kiểm tra vé hợp lệ
   - Đánh dấu đã lên xe
   - Hiển thị thông tin khách

#### D. Xem danh sách hành khách
1. Click "Danh sách khách"
2. Xem:
   - Tổng số khách
   - Số đã lên xe
   - Thông tin từng khách
3. Đánh dấu thủ công (nếu cần)

---

## 🔐 BẢO MẬT & LƯU Ý

### Mật khẩu mặc định
- **Admin:** admin123
- **Operator:** operator123
- **Customer:** 123456
- **Trip Manager:** tripmanager123
- **Driver:** driver123

⚠️ **CẢNH BÁO:** Đây là mật khẩu mẫu cho môi trường development. **KHÔNG** sử dụng trên production!

### Vai trò & Quyền hạn

| Vai trò | Quyền truy cập |
|---------|----------------|
| **Admin** | Toàn bộ hệ thống |
| **Operator** | Dashboard nhà xe, Routes, Buses, Employees, Reports, Vouchers |
| **Trip Manager** | Dashboard chuyến, QR Scanner, Danh sách khách |
| **Driver** | Đăng nhập cơ bản (chưa có dashboard riêng) |
| **Customer** | Trang chủ, Đặt vé, Quản lý vé của bản thân |
| **Guest** | Trang chủ, Tra cứu vé (không cần đăng nhập) |

---

## 📞 HỖ TRỢ

### Các vấn đề thường gặp

**1. Không đăng nhập được?**
- **Khách hàng**: Dùng EMAIL hoặc SỐ ĐIỆN THOẠI để đăng nhập (không cần cả hai)
  - Ví dụ: `customer1@gmail.com` hoặc `0912345678`
- **Nhà xe**: Dùng EMAIL (ví dụ: `futabus@example.com`)
- **Trip Manager**: Dùng EMAIL (ví dụ: `tripmanager1@futa.com`)
- Kiểm tra mật khẩu đúng chưa
- Chạy lại seed data: `cd backend && npm run seed`
- Xóa localStorage trình duyệt (F12 > Application > Local Storage > Clear All)
- Kiểm tra backend đang chạy (port 5000)

**2. Không có dữ liệu?**
- Chạy seed script: `npm run seed`
- Kiểm tra kết nối MongoDB

**3. Trang trắng/lỗi?**
- Kiểm tra backend đang chạy (port 5000)
- Kiểm tra frontend đang chạy (port 3000)
- Xem console log (F12)

**4. Lỗi CORS?**
- Kiểm tra backend config CORS
- Khởi động lại cả backend và frontend

---

## 🚀 TÍNH NĂNG ĐANG PHÁT TRIỂN

- ✅ Đăng nhập/Đăng ký khách hàng
- ✅ Tìm kiếm và đặt vé
- ✅ Dashboard nhà xe
- ✅ Dashboard quản lý chuyến
- ⏳ Admin dashboard (đang phát triển)
- ⏳ Thanh toán VNPay/MoMo (đang phát triển)
- ⏳ OAuth Google/Facebook (UI đã sẵn sàng)
- ⏳ Email/SMS notification
- ⏳ Rating & Reviews

---

## 📝 GHI CHÚ

### API Endpoints

Backend API chạy tại: `http://localhost:5000/api/v1`

Xem tài liệu API:
- Authentication: `/backend/AUTHENTICATION.md`
- README: `/backend/README.md`

### Database

MongoDB chạy tại: `mongodb://localhost:27017/quikride`

Sử dụng MongoDB Compass để xem dữ liệu:
```
mongodb://localhost:27017/quikride
```

---

**Chúc bạn test thành công! 🎉**

_Cập nhật lần cuối: 2024-11-17_
