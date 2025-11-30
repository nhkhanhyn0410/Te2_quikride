# Phân Tích Các Lớp (Class) Trong Dự Án

## 1. Controllers (Lớp Điều Khiển)

### 1.1 Authentication & Authorization
- **AuthController**: Xử lý đăng ký, đăng nhập, xác thực người dùng
- **GuestController**: Quản lý phiên làm việc khách, xác thực OTP cho khách hàng không đăng ký

### 1.2 User Management
- **AdminController**: Quản lý operators, người dùng (dành cho admin)
- **UserController**: Quản lý thông tin cá nhân người dùng
- **EmployeeController**: Quản lý nhân viên nhà xe
- **OperatorController**: Quản lý thông tin nhà xe

### 1.3 Trip & Booking Management
- **TripController**: Quản lý chuyến xe, lịch trình
- **TripManagerController**: Đăng nhập và quản lý cho quản lý chuyến
- **BookingController**: Xử lý đặt vé, giữ chỗ
- **TicketController**: Tạo và quản lý vé điện tử

### 1.4 Business Operations
- **BusController**: Quản lý thông tin xe buýt, sơ đồ ghế
- **RouteController**: Quản lý tuyến đường
- **PaymentController**: Xử lý thanh toán
- **VoucherController**: Quản lý mã giảm giá

### 1.5 Support & Content
- **ReviewController**: Quản lý đánh giá của khách hàng
- **ComplaintController**: Xử lý khiếu nại
- **ContentController**: Quản lý nội dung website
- **AdminContentController**: Quản lý nội dung (dành cho admin)
- **ReportController**: Tạo báo cáo thống kê

## 2. Services (Lớp Dịch Vụ)

### 2.1 Core Business Services
- **AuthService**: Logic xác thực, tạo JWT token
- **UserService**: Xử lý thông tin người dùng
- **OperatorService**: Logic đăng ký và quản lý nhà xe
- **EmployeeService**: Logic quản lý nhân viên

### 2.2 Trip & Booking Services
- **TripService**: Logic quản lý chuyến xe, lịch trình
- **BookingService**: Logic đặt vé, giữ ghế tạm thời
- **SeatService**: Quản lý khóa/mở khóa ghế sử dụng Redis
- **SeatLockService**: Quản lý khóa ghế tạm thời với TTL
- **RouteService**: Logic xử lý tuyến đường
- **BusService**: Logic quản lý xe buýt, tính toán ghế

### 2.3 Payment & Financial Services
- **PaymentService**: Xử lý thanh toán, tích hợp cổng thanh toán
- **VNPayService**: Tích hợp cổng thanh toán VNPay
- **VoucherService**: Quản lý mã giảm giá, xác thực sử dụng
- **CancellationService**: Xử lý chính sách hủy vé và hoàn tiền
- **LoyaltyService**: Logic chương trình tích điểm

### 2.4 Communication Services
- **NotificationService**: Gửi email và SMS thông báo
- **SMSService**: Xử lý gửi SMS qua VNPT hoặc Viettel
- **WebSocketService**: Cập nhật trạng thái ghế real-time

### 2.5 Document & Security Services
- **TicketService**: Tạo vé điện tử với mã QR
- **PDFService**: Tạo vé PDF với thiết kế chuyên nghiệp
- **QRService**: Tạo mã QR có mã hóa để xác thực vé
- **OTPService**: Tạo, lưu trữ và xác thực mã OTP

### 2.6 Session & Analytics Services
- **GuestSessionService**: Quản lý phiên tạm thời cho khách
- **ReportService**: Tạo báo cáo doanh thu toàn diện
- **DashboardService**: Thống kê dashboard cho nhà xe
- **ReviewService**: Logic xử lý đánh giá khách hàng

### 2.7 System Services
- **SchedulerService**: Xử lý các tác vụ định kỳ (cron jobs)

## 3. Middleware & Utilities

### 3.1 Error Handling
- **AppError**: Lớp lỗi tùy chỉnh kế thừa từ Error

### 3.2 Frontend Components
- **ErrorBoundary**: Component React xử lý lỗi JavaScript trong UI

## 4. Tổng Quan Kiến Trúc

### Phân Tầng Rõ Ràng:
1. **Controller Layer**: Xử lý HTTP requests/responses
2. **Service Layer**: Chứa business logic chính
3. **Model Layer**: Tương tác với database (không sử dụng class)

### Đặc Điểm Thiết Kế:
- **Single Responsibility**: Mỗi class có trách nhiệm cụ thể
- **Separation of Concerns**: Tách biệt logic xử lý HTTP và business logic
- **Modular Architecture**: Các service độc lập, dễ bảo trì
- **Real-time Support**: WebSocket cho cập nhật trạng thái ghế
- **Security Focus**: OTP, JWT, mã hóa QR code
- **Payment Integration**: Hỗ trợ nhiều cổng thanh toán
- **Notification System**: Email và SMS đa kênh

### Tổng Số Lớp:
- **Controllers**: 15 lớp
- **Services**: 25 lớp  
- **Utilities**: 2 lớp
- **Tổng cộng**: 42 lớp chính