# Mô Tả Các Lớp Hệ Thống QuikRide Bus Booking

## 1. Lớp Quản Lý Người Dùng

### User (Người Dùng)
**Thuộc tính chính:**
- `_id`: ID duy nhất
- `email`, `phone`: Thông tin liên lạc
- `fullName`: Họ tên đầy đủ
- `loyaltyTier`: Hạng thành viên (bronze/silver/gold/platinum)
- `totalPoints`: Tổng điểm tích lũy
- `isActive`: Trạng thái hoạt động

**Phương thức chính:**
- `register()`: Đăng ký tài khoản
- `login()`: Đăng nhập
- `verifyEmail()`: Xác thực email
- `updateProfile()`: Cập nhật thông tin
- `earnPoints()`: Tích điểm
- `redeemPoints()`: Đổi điểm

### Operator (Nhà Xe)
**Thuộc tính chính:**
- `companyName`: Tên công ty
- `businessLicense`: Giấy phép kinh doanh
- `verificationStatus`: Trạng thái xác minh
- `averageRating`: Đánh giá trung bình
- `totalRevenue`: Tổng doanh thu

**Phương thức chính:**
- `submitVerification()`: Gửi xác minh
- `createRoute()`: Tạo tuyến đường
- `addBus()`: Thêm xe buýt
- `scheduleTrip()`: Lên lịch chuyến
- `viewReports()`: Xem báo cáo

### Employee (Nhân Viên)
**Thuộc tính chính:**
- `operatorId`: ID nhà xe
- `role`: Vai trò (driver/trip_manager)
- `licenseNumber`: Số bằng lái
- `status`: Trạng thái làm việc

**Phương thức chính:**
- `viewAssignedTrips()`: Xem chuyến được giao
- `updateTripStatus()`: Cập nhật trạng thái chuyến

### Admin (Quản Trị Viên)
**Thuộc tính chính:**
- `username`: Tên đăng nhập
- `role`: Vai trò quản trị
- `permissions`: Quyền hạn

**Phương thức chính:**
- `verifyOperator()`: Xác minh nhà xe
- `manageUsers()`: Quản lý người dùng
- `handleComplaints()`: Xử lý khiếu nại

## 2. Lớp Hệ Thống Vận Chuyển

### Route (Tuyến Đường)
**Thuộc tính chính:**
- `routeCode`: Mã tuyến
- `origin`, `destination`: Điểm đi và đến
- `pickupPoints`: Điểm đón
- `dropoffPoints`: Điểm trả
- `distance`: Khoảng cách
- `estimatedDuration`: Thời gian ước tính

**Phương thức chính:**
- `calculateDistance()`: Tính khoảng cách
- `addPickupPoint()`: Thêm điểm đón
- `updateStops()`: Cập nhật điểm dừng

### Bus (Xe Buýt)
**Thuộc tính chính:**
- `busNumber`: Biển số xe
- `busType`: Loại xe (limousine/sleeper/seater)
- `seatLayout`: Sơ đồ ghế
- `totalSeats`: Tổng số ghế
- `amenities`: Tiện ích

**Phương thức chính:**
- `configureSeatLayout()`: Cấu hình sơ đồ ghế
- `updateAmenities()`: Cập nhật tiện ích
- `scheduleMaintenance()`: Lên lịch bảo trì

### Trip (Chuyến Đi)
**Thuộc tính chính:**
- `routeId`: ID tuyến đường
- `busId`: ID xe buýt
- `driverId`: ID tài xế
- `tripManagerId`: ID quản lý chuyến
- `departureTime`: Thời gian khởi hành
- `basePrice`: Giá cơ bản
- `availableSeats`: Ghế còn trống
- `status`: Trạng thái chuyến

**Phương thức chính:**
- `calculatePrice()`: Tính giá vé
- `updateSeatAvailability()`: Cập nhật ghế trống
- `startJourney()`: Bắt đầu hành trình
- `completeTrip()`: Hoàn thành chuyến

## 3. Lớp Hệ Thống Đặt Vé

### Booking (Đặt Vé)
**Thuộc tính chính:**
- `bookingCode`: Mã đặt vé
- `tripId`: ID chuyến đi
- `customerId`: ID khách hàng
- `seats`: Danh sách ghế đặt
- `totalPrice`: Tổng giá
- `finalPrice`: Giá cuối cùng
- `status`: Trạng thái đặt vé

**Phương thức chính:**
- `lockSeats()`: Khóa ghế tạm thời
- `applyVoucher()`: Áp dụng voucher
- `calculateTotal()`: Tính tổng tiền
- `confirmBooking()`: Xác nhận đặt vé
- `cancelBooking()`: Hủy đặt vé

### Payment (Thanh Toán)
**Thuộc tính chính:**
- `paymentCode`: Mã thanh toán
- `bookingId`: ID đặt vé
- `paymentMethod`: Phương thức thanh toán
- `amount`: Số tiền
- `status`: Trạng thái thanh toán
- `transactionId`: ID giao dịch

**Phương thức chính:**
- `initiatePayment()`: Khởi tạo thanh toán
- `processPayment()`: Xử lý thanh toán
- `verifyPayment()`: Xác minh thanh toán
- `refundPayment()`: Hoàn tiền

### Ticket (Vé)
**Thuộc tính chính:**
- `ticketCode`: Mã vé
- `bookingId`: ID đặt vé
- `qrCode`: Mã QR
- `passengers`: Thông tin hành khách
- `status`: Trạng thái vé

**Phương thức chính:**
- `generateQRCode()`: Tạo mã QR
- `verifyTicket()`: Xác minh vé
- `scanTicket()`: Quét vé
- `sendTicketEmail()`: Gửi vé qua email

### Voucher (Phiếu Giảm Giá)
**Thuộc tính chính:**
- `code`: Mã voucher
- `discountType`: Loại giảm giá (percentage/fixed)
- `discountValue`: Giá trị giảm
- `validUntil`: Hạn sử dụng
- `maxUsageTotal`: Số lần sử dụng tối đa

**Phương thức chính:**
- `validateVoucher()`: Kiểm tra voucher
- `applyDiscount()`: Áp dụng giảm giá
- `checkUsageLimit()`: Kiểm tra giới hạn sử dụng

## 4. Lớp Đánh Giá & Phản Hồi

### Review (Đánh Giá)
**Thuộc tính chính:**
- `userId`: ID người dùng
- `bookingId`: ID đặt vé
- `tripId`: ID chuyến đi
- `overallRating`: Đánh giá tổng thể (1-5 sao)
- `vehicleRating`: Đánh giá xe
- `driverRating`: Đánh giá tài xế
- `comment`: Bình luận

**Phương thức chính:**
- `submitReview()`: Gửi đánh giá
- `updateRating()`: Cập nhật điểm
- `moderateReview()`: Kiểm duyệt đánh giá

### Complaint (Khiếu Nại)
**Thuộc tính chính:**
- `ticketNumber`: Số ticket khiếu nại
- `subject`: Tiêu đề
- `description`: Mô tả chi tiết
- `category`: Danh mục khiếu nại
- `priority`: Độ ưu tiên
- `status`: Trạng thái xử lý
- `assignedTo`: Người được giao xử lý

**Phương thức chính:**
- `fileComplaint()`: Nộp khiếu nại
- `assignToAdmin()`: Giao cho admin
- `updateStatus()`: Cập nhật trạng thái
- `resolveComplaint()`: Giải quyết khiếu nại

## 5. Lớp Quản Lý Nội Dung

### Banner (Banner Quảng Cáo)
**Thuộc tính chính:**
- `title`: Tiêu đề
- `imageUrl`: URL hình ảnh
- `link`: Liên kết
- `isActive`: Trạng thái hiển thị
- `displayOrder`: Thứ tự hiển thị

**Phương thức chính:**
- `createBanner()`: Tạo banner
- `updateBanner()`: Cập nhật banner
- `toggleActive()`: Bật/tắt hiển thị

### Blog (Bài Viết)
**Thuộc tính chính:**
- `title`: Tiêu đề
- `slug`: URL thân thiện
- `content`: Nội dung
- `authorId`: ID tác giả
- `category`: Danh mục
- `isPublished`: Trạng thái xuất bản

**Phương thức chính:**
- `createPost()`: Tạo bài viết
- `publishPost()`: Xuất bản bài viết
- `updateContent()`: Cập nhật nội dung

### FAQ (Câu Hỏi Thường Gặp)
**Thuộc tính chính:**
- `question`: Câu hỏi
- `answer`: Câu trả lời
- `category`: Danh mục
- `displayOrder`: Thứ tự hiển thị
- `isActive`: Trạng thái hiển thị

**Phương thức chính:**
- `addFAQ()`: Thêm FAQ
- `updateFAQ()`: Cập nhật FAQ
- `reorderFAQs()`: Sắp xếp lại thứ tự

## 6. Các Lớp Dịch Vụ Hỗ Trợ

### SeatLockService (Dịch Vụ Khóa Ghế)
**Phương thức chính:**
- `lockSeats()`: Khóa ghế tạm thời (15 phút)
- `releaseLock()`: Giải phóng khóa
- `checkLockStatus()`: Kiểm tra trạng thái khóa

### NotificationService (Dịch Vụ Thông Báo)
**Phương thức chính:**
- `sendEmail()`: Gửi email
- `sendSMS()`: Gửi SMS
- `pushNotification()`: Gửi thông báo đẩy

### LoyaltyService (Dịch Vụ Tích Điểm)
**Phương thức chính:**
- `calculatePoints()`: Tính điểm tích lũy
- `updateTier()`: Cập nhật hạng thành viên
- `redeemRewards()`: Đổi thưởng

### WebSocketService (Dịch Vụ Thời Gian Thực)
**Phương thức chính:**
- `broadcastTripUpdate()`: Phát thông tin cập nhật chuyến
- `notifyBookingStatus()`: Thông báo trạng thái đặt vé
- `trackLocation()`: Theo dõi vị trí thời gian thực