# Hướng Dẫn Sử Dụng Tính Năng Quét Mã QR - Trip Manager

## Tổng Quan

Tính năng quét mã QR cho phép Trip Manager (Quản lý chuyến) và tài xế xác thực vé của hành khách khi lên xe. Hệ thống tự động đánh dấu vé đã sử dụng và cập nhật trạng thái hành khách.

## Cấu Hình Hệ Thống

### SMS Demo Mode

SMS đã được cấu hình ở chế độ demo (tắt) trong file `backend/.env`:

```bash
SMS_ENABLED=false
```

Điều này có nghĩa là:
- ✅ Email vẫn được gửi bình thường (thông báo vé, xác nhận)
- ⏸️ SMS sẽ KHÔNG được gửi (tiết kiệm chi phí)
- 📝 Các hoạt động SMS sẽ bị bỏ qua và ghi log vào console

## Cách Truy Cập Hệ Thống Trip Manager

### Bước 1: Đăng Nhập

1. Truy cập trang đăng nhập Trip Manager:
   ```
   http://localhost:3000/trip-manager/login
   ```

2. Nhập thông tin đăng nhập:
   - **Username**: Tên đăng nhập được cung cấp bởi quản trị viên
   - **Password**: Mật khẩu (tối thiểu 6 ký tự)

3. Nhấn nút **Đăng nhập**

### Bước 2: Xem Dashboard

Sau khi đăng nhập thành công, bạn sẽ thấy Dashboard với:

**Thống Kê:**
- 🚌 Tổng số chuyến được phân công
- ⏰ Chuyến sắp tới (scheduled)
- 🚗 Đang diễn ra (ongoing)
- ✅ Hoàn thành (completed)

**Bảng Chuyến Xe:**
- Danh sách các chuyến xe được phân công
- Thông tin: Tuyến đường, Ngày giờ, Xe, Số ghế, Trạng thái
- Các nút thao tác: Bắt đầu, Hoàn thành, Hủy, Quét vé, Hành khách

## Cách Quét Mã QR Vé

### Phương Pháp 1: Quét Trực Tiếp Từ Dashboard

1. Từ **Trip Manager Dashboard**, tìm chuyến xe cần quét vé
2. Nhấn nút **"Quét vé"** (có icon QR code) ở cột Thao tác
3. Hệ thống sẽ chuyển đến trang quét QR

### Phương Pháp 2: Quét Từ Trang Hành Khách

1. Từ Dashboard, nhấn nút **"Hành khách"** để xem danh sách
2. Trên trang Hành khách, nhấn nút **"Quét vé"** ở góc phải trên
3. Hệ thống sẽ chuyển đến trang quét QR

## Trang Quét QR - Hướng Dẫn Chi Tiết

### URL:
```
http://localhost:3000/trip-manager/trips/{tripId}/scan
```

### Giao Diện Quét QR

**Header:**
- Hiển thị tên tuyến đường và thời gian khởi hành
- Nút "Quay lại" để về Dashboard

**Hai Cách Quét:**

#### 1. Quét Bằng Camera (Khuyến Nghị)

**Các Bước:**

1. Nhấn nút **"Mở camera"** (màu xanh, icon camera)
2. Cho phép trình duyệt truy cập camera khi được yêu cầu
3. Camera sẽ được kích hoạt với khung quét QR màu đỏ
4. Đưa mã QR vào khung hình (250x250px)
5. Hệ thống tự động quét và xác thực

**Lưu Ý:**
- Đảm bảo đủ ánh sáng để camera đọc được QR
- Giữ mã QR ổn định trong khung quét
- Camera sẽ tự động dừng sau khi quét thành công

#### 2. Tải Ảnh QR Code

**Các Bước:**

1. Nhấn nút **"Tải ảnh QR"** (icon upload)
2. Chọn file ảnh chứa mã QR từ thiết bị
3. Hệ thống sẽ đọc và xác thực mã QR từ ảnh

**Lưu Ý:**
- Chấp nhận định dạng: PNG, JPG, JPEG
- Ảnh phải rõ nét, không bị mờ
- Mã QR phải nằm trong ảnh

### Kết Quả Xác Thực

#### ✅ Vé Hợp Lệ

**Hiển thị:**
- Icon dấu tích xanh lá
- Thông báo: "Vé hợp lệ! Hành khách đã được xác nhận lên xe."
- Thông tin vé:
  - **Mã vé**: Mã code của vé (màu xanh, font mono)
  - **Trạng thái**: Tag "Đã xác nhận lên xe" (màu xanh)
  - **Hành khách**: Danh sách hành khách với số ghế, tên, số điện thoại

**Hành Động:**
- Nhấn nút **"Quét vé khác"** để tiếp tục quét vé tiếp theo
- Vé đã được đánh dấu là **"Đã sử dụng"** trong hệ thống
- Hành khách có thể lên xe

#### ❌ Vé Không Hợp Lệ

**Các Trường Hợp Lỗi:**

1. **QR Code không hợp lệ**
   - Mã QR bị hỏng, không đọc được
   - Mã QR không phải của hệ thống QuikRide

2. **Vé đã được sử dụng**
   - Vé đã quét trước đó
   - Hiển thị thời gian sử dụng

3. **Vé không thuộc chuyến này**
   - Mã QR hợp lệ nhưng thuộc chuyến xe khác
   - Hiển thị tuyến đường và thời gian của vé

4. **Vé đã hủy**
   - Hành khách đã hủy vé
   - Không được phép lên xe

5. **Vé đã hết hạn**
   - Vé quá cũ (hơn 72 giờ)
   - Có thể do hệ thống bảo mật

**Hành Động:**
- Kiểm tra lại mã QR của hành khách
- Yêu cầu hành khách xuất trình thông tin đặt vé
- Liên hệ bộ phận hỗ trợ nếu cần

## Trang Danh Sách Hành Khách

### URL:
```
http://localhost:3000/trip-manager/trips/{tripId}/passengers
```

### Tính Năng

**Thống Kê Realtime:**
- 👥 Tổng hành khách: Tổng số ghế đã đặt
- ✅ Đã lên xe: Số hành khách đã quét vé
- ⏳ Chưa lên xe: Số hành khách chưa quét vé
- 📊 Tỷ lệ lên xe: Phần trăm hành khách đã lên xe

**Bộ Lọc:**
- 🔍 **Tìm kiếm**: Tìm theo tên, số điện thoại, số ghế, mã vé
- 📌 **Trạng thái**:
  - Tất cả
  - Đã lên xe
  - Chưa lên xe

**Bảng Hành Khách:**
- Ghế: Số ghế của hành khách
- Họ tên: Tên đầy đủ
- Số điện thoại: Liên hệ
- CMND/CCCD: Giấy tờ tùy thân (nếu có)
- Mã vé: Mã code vé (font mono)
- Trạng thái: Tag đã/chưa lên xe

**Màu Sắc:**
- Hàng màu xanh nhạt: Hành khách đã lên xe
- Hàng màu trắng: Hành khách chưa lên xe

## Quản Lý Trạng Thái Chuyến

### Các Trạng Thái Chuyến

1. **Chưa bắt đầu (scheduled)**
   - Màu xanh dương
   - Chuyến chưa khởi hành
   - Hành động: Bắt đầu hoặc Hủy

2. **Đang diễn ra (ongoing)**
   - Màu xanh lá
   - Chuyến đang di chuyển
   - Hành động: Hoàn thành hoặc Hủy

3. **Hoàn thành (completed)**
   - Màu xám
   - Chuyến đã đến đích
   - Không có hành động

4. **Đã hủy (cancelled)**
   - Màu đỏ
   - Chuyến bị hủy
   - Không có hành động

### Cập Nhật Trạng Thái

#### Bắt Đầu Chuyến

1. Từ Dashboard, tìm chuyến có trạng thái "Chưa bắt đầu"
2. Nhấn nút **"Bắt đầu"**
3. Xác nhận trong dialog
4. Hệ thống sẽ:
   - Cập nhật trạng thái thành "Đang diễn ra"
   - Gửi email thông báo cho hành khách (nếu cấu hình)
   - Không gửi SMS (đã tắt)

#### Hoàn Thành Chuyến

1. Từ Dashboard, tìm chuyến có trạng thái "Đang diễn ra"
2. Nhấn nút **"Hoàn thành"**
3. Xác nhận trong dialog
4. Hệ thống sẽ:
   - Cập nhật trạng thái thành "Hoàn thành"
   - Gửi email cảm ơn hành khách
   - Không gửi SMS (đã tắt)

#### Hủy Chuyến

1. Từ Dashboard, nhấn nút **"Hủy"**
2. Nhập lý do hủy (bắt buộc, tối thiểu 10 ký tự)
3. Xác nhận hủy
4. Hệ thống sẽ:
   - Cập nhật trạng thái thành "Đã hủy"
   - Gửi email thông báo hủy chuyến
   - Hướng dẫn hành khách liên hệ nhà xe để hoàn tiền
   - Không gửi SMS (đã tắt)

## Quy Trình Làm Việc Chuẩn

### Trước Chuyến Đi (1-2 giờ trước)

1. ✅ Đăng nhập vào hệ thống Trip Manager
2. ✅ Kiểm tra danh sách chuyến xe hôm nay
3. ✅ Xem danh sách hành khách đã đặt vé
4. ✅ Kiểm tra số lượng ghế đã đặt vs tổng số ghế
5. ✅ Chuẩn bị thiết bị (điện thoại/tablet) để quét QR

### Khi Bắt Đầu Chuyến

1. ✅ Nhấn nút **"Bắt đầu"** chuyến xe
2. ✅ Hệ thống gửi email thông báo cho hành khách
3. ✅ Bắt đầu quét vé hành khách lên xe

### Trong Quá Trình Lên Xe

1. ✅ Mở trang **"Quét vé"**
2. ✅ Yêu cầu hành khách xuất trình mã QR (từ email hoặc điện thoại)
3. ✅ Quét mã QR bằng camera hoặc tải ảnh
4. ✅ Kiểm tra kết quả xác thực:
   - Nếu hợp lệ: Cho hành khách lên xe
   - Nếu không hợp lệ: Kiểm tra lại hoặc yêu cầu xuất trình thông tin đặt vé
5. ✅ Tiếp tục quét vé khác

### Trước Khi Khởi Hành

1. ✅ Kiểm tra số lượng hành khách đã lên xe
2. ✅ Đối chiếu với danh sách đặt vé
3. ✅ Liên hệ hành khách chưa lên xe (nếu cần)
4. ✅ Chờ đủ thời gian và khởi hành

### Khi Hoàn Thành Chuyến

1. ✅ Đến điểm đích
2. ✅ Nhấn nút **"Hoàn thành"** chuyến xe
3. ✅ Hệ thống gửi email cảm ơn hành khách

## Xử Lý Các Tình Huống Đặc Biệt

### Hành Khách Không Có Mã QR

**Giải pháp:**

1. Yêu cầu hành khách cung cấp:
   - Mã vé (Ticket Code)
   - Mã đặt chỗ (Booking Code)
   - Số điện thoại đặt vé

2. Tra cứu trong trang **"Hành khách"**:
   - Sử dụng bộ lọc tìm kiếm
   - Tìm theo số điện thoại hoặc tên

3. Nếu tìm thấy:
   - Xác nhận thông tin khớp
   - Đánh dấu thủ công (liên hệ support nếu cần)
   - Cho hành khách lên xe

### Mã QR Không Quét Được

**Nguyên nhân có thể:**
- Ảnh QR bị mờ, độ phân giải thấp
- Thiếu ánh sáng
- Camera bị lỗi
- Màn hình điện thoại bị nứt

**Giải pháp:**

1. Thử quét lại với điều kiện ánh sáng tốt hơn
2. Yêu cầu hành khách điều chỉnh độ sáng màn hình
3. Sử dụng chức năng "Tải ảnh QR" nếu có screenshot
4. Tra cứu thủ công bằng mã vé (xem phần trên)

### Vé Đã Được Sử Dụng Nhưng Hành Khách Chưa Lên Xe

**Nguyên nhân:**
- Quét nhầm vé
- Vé bị trùng lặp
- Vé giả mạo

**Giải pháp:**

1. Kiểm tra thời gian sử dụng vé trong hệ thống
2. Xác nhận với hành khách:
   - Có phải đã quét vé trước đó không?
   - Có người khác sử dụng vé này không?
3. Liên hệ support để xác minh
4. Chỉ cho lên xe sau khi xác nhận

### Hành Khách Muốn Hủy Vé Tại Bến

**Quy trình:**

1. Hướng dẫn hành khách liên hệ:
   - Hotline: 1900-xxxx
   - Email: support@quikride.com

2. Giải thích chính sách hủy vé:
   - Hủy trước 24h: Hoàn 70-80%
   - Hủy trước 12h: Hoàn 50%
   - Hủy trước 6h: Hoàn 30%
   - Hủy dưới 6h: Không hoàn

3. Không tự ý hủy vé trong hệ thống Trip Manager

## API Endpoints (Tham Khảo Kỹ Thuật)

### Đăng Nhập

```http
POST /api/trip-manager/login
Content-Type: application/json

{
  "username": "manager01",
  "password": "password123"
}
```

### Lấy Danh Sách Chuyến

```http
GET /api/trip-manager/trips
Authorization: Bearer {token}
```

### Lấy Chi Tiết Chuyến

```http
GET /api/trip-manager/trips/{tripId}
Authorization: Bearer {token}
```

### Lấy Danh Sách Hành Khách

```http
GET /api/trip-manager/trips/{tripId}/passengers
Authorization: Bearer {token}
```

### Xác Thực Vé QR

```http
POST /api/trip-manager/trips/{tripId}/verify-ticket
Authorization: Bearer {token}
Content-Type: application/json

{
  "qrCodeData": "encrypted_qr_data_string"
}
```

**Response Thành Công:**
```json
{
  "success": true,
  "message": "Vé hợp lệ! Hành khách đã được xác nhận lên xe.",
  "data": {
    "ticket": {
      "_id": "...",
      "ticketCode": "TK-20250119-ABCD",
      "status": "used",
      "isUsed": true,
      "usedAt": "2025-01-19T10:30:00.000Z",
      "passengers": [...]
    }
  }
}
```

**Response Lỗi:**
```json
{
  "success": false,
  "message": "Vé đã được sử dụng trước đó vào lúc 10:30 19/01/2025",
  "data": {
    "ticket": {...}
  }
}
```

### Cập Nhật Trạng Thái Chuyến

```http
PUT /api/trip-manager/trips/{tripId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "ongoing",  // scheduled | ongoing | completed | cancelled
  "reason": "Lý do (bắt buộc nếu hủy)"
}
```

## Bảo Mật & Quyền Hạn

### Xác Thực

- Tất cả API đều yêu cầu token xác thực
- Token có thời hạn sử dụng
- Tự động đăng xuất khi hết hạn

### Phân Quyền

**Trip Manager có quyền:**
- ✅ Xem danh sách chuyến được phân công
- ✅ Xem danh sách hành khách
- ✅ Quét và xác thực vé QR
- ✅ Cập nhật trạng thái chuyến (bắt đầu, hoàn thành, hủy)

**Trip Manager KHÔNG có quyền:**
- ❌ Tạo/xóa/sửa chuyến xe
- ❌ Xem chuyến của Trip Manager khác
- ❌ Xem/sửa thông tin tài chính
- ❌ Hoàn tiền cho hành khách

### Bảo Mật QR Code

- Mã QR được mã hóa AES-256-CBC
- Mỗi vé có QR code duy nhất
- QR code chứa:
  - Booking ID
  - Ticket Code
  - Trip ID
  - Seat Numbers
  - Passenger Name
  - Departure Time
  - Timestamp
  - Version

- QR code có thời hạn 72 giờ (3 ngày)
- Không thể giả mạo hoặc chỉnh sửa

## Khắc Phục Sự Cố

### Không Đăng Nhập Được

**Nguyên nhân:**
- Sai tên đăng nhập/mật khẩu
- Tài khoản bị khóa
- Mạng không ổn định

**Giải pháp:**
1. Kiểm tra lại thông tin đăng nhập
2. Liên hệ quản trị viên để reset mật khẩu
3. Kiểm tra kết nối mạng

### Camera Không Hoạt Động

**Nguyên nhân:**
- Chưa cấp quyền camera
- Trình duyệt không hỗ trợ
- Camera bị lỗi phần cứng

**Giải pháp:**
1. Cho phép trình duyệt truy cập camera
2. Sử dụng Chrome hoặc Safari (khuyến nghị)
3. Thử trên thiết bị khác
4. Sử dụng chức năng "Tải ảnh QR" thay thế

### Trang Bị Treo/Chậm

**Giải pháp:**
1. Refresh trang (F5)
2. Xóa cache trình duyệt
3. Đăng xuất và đăng nhập lại
4. Kiểm tra kết nối mạng

### Không Thấy Chuyến Của Mình

**Nguyên nhân:**
- Chưa được phân công chuyến
- Thông tin phân công bị lỗi

**Giải pháp:**
1. Liên hệ quản lý nhà xe để kiểm tra
2. Đảm bảo đã đăng nhập đúng tài khoản
3. Refresh trang để cập nhật dữ liệu

## Liên Hệ Hỗ Trợ

### Hỗ Trợ Kỹ Thuật

- **Email**: support@quikride.com
- **Hotline**: 1900-xxxx
- **Giờ làm việc**: 24/7

### Phản Hồi & Góp Ý

- **Email**: feedback@quikride.com
- **GitHub Issues**: https://github.com/quikride/issues

## Ghi Chú Quan Trọng

⚠️ **Lưu Ý SMS:**
- SMS đã được TẮT để tiết kiệm chi phí
- Chỉ email được gửi tự động
- Nếu cần bật SMS, liên hệ quản trị viên để cấu hình:
  - SMS Provider (VNPT hoặc Viettel)
  - SMS API Key và Secret
  - Đổi `SMS_ENABLED=true` trong .env

⚠️ **Bảo Mật:**
- Không chia sẻ thông tin đăng nhập
- Đăng xuất sau khi hoàn thành công việc
- Không chụp ảnh màn hình chứa thông tin nhạy cảm

⚠️ **Dữ Liệu:**
- Không tự ý xóa hoặc sửa dữ liệu
- Báo cáo ngay nếu phát hiện lỗi hệ thống
- Sao lưu thông tin quan trọng

---

**Phiên bản**: 1.0
**Ngày cập nhật**: 20/11/2025
**Người tạo**: QuikRide Development Team
