# Lộ Trình Phát Triển Dự Án Vé xe nhanh
## Hệ Thống Đặt Vé Xe Khách Trực Tuyến

---

## Tổng Quan

Dự án được chia thành 7 giai đoạn (phases) phát triển, mỗi giai đoạn tập trung vào một nhóm chức năng cụ thể. Các giai đoạn được sắp xếp theo độ ưu tiên và phụ thuộc kỹ thuật.

---

## Phase 1: Setup & Core Infrastructure
**Thời gian dự kiến:** 2 tuần
**Độ ưu tiên:** Cao (Critical)

### Mục tiêu
Thiết lập nền tảng cơ sở hạ tầng cho toàn bộ dự án, bao gồm cấu trúc project, database, và hệ thống xác thực.

### Công việc chi tiết

#### 1.1 Setup Project Structure
- [x] Khởi tạo Monorepo (Frontend + Backend)
- [x] Cấu hình Git workflow và branching strategy
- [x] Setup CI/CD pipeline cơ bản
- [x] Cấu hình ESLint, Prettier, Husky

#### 1.2 Backend Setup
- [x] Khởi tạo Node.js + Express project
- [x] Cấu hình TypeScript (nếu sử dụng)
- [x] Setup MongoDB connection
- [x] Cấu hình Redis cho caching
- [x] Setup environment variables (.env)
- [x] Tạo folder structure chuẩn:
  - `controllers/`
  - `models/`
  - `routes/`
  - `middleware/`
  - `services/`
  - `utils/`
  - `config/`

#### 1.3 Frontend Setup
- [ ] Khởi tạo React 18 + Vite project
- [ ] Setup Tailwind CSS
- [ ] Cài đặt UI Library (Ant Design hoặc Material-UI)
- [ ] Cấu hình React Router
- [ ] Setup State Management (Redux/Zustand)
- [ ] Cấu hình Axios cho API calls

#### 1.4 Authentication System
- [ ] Implement User Model (MongoDB Schema)
  - Email/Phone, Password
  - OAuth fields (Google, Facebook)
  - Verification status
  - Loyalty points
- [ ] JWT Authentication middleware
- [ ] Password hashing với bcrypt (salt rounds: 12)
- [ ] Session management
- [ ] Rate limiting (100 requests/phút/IP)

#### 1.5 User Management APIs
- [ ] **UC-1:** Đăng ký tài khoản
  - POST `/api/auth/register`
  - Email/SMS OTP verification
- [ ] **UC-2:** Đăng nhập
  - POST `/api/auth/login`
  - OAuth integration (Google, Facebook)
  - Remember me functionality
- [ ] Quên mật khẩu & Reset password
  - POST `/api/auth/forgot-password`
  - POST `/api/auth/reset-password`
- [ ] Quản lý profile
  - GET/PUT `/api/users/profile`
  - Upload avatar

#### 1.6 Security & Compliance
- [ ] HTTPS/TLS 1.3 configuration
- [ ] CORS configuration
- [ ] Helmet.js for security headers
- [ ] Input validation & sanitization
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Session timeout (30 phút)

#### 1.7 Testing Setup
- [ ] Setup Jest cho Backend
- [ ] Setup React Testing Library cho Frontend
- [ ] Viết unit tests cho authentication

### Deliverables
- Project structure hoàn chỉnh
- Database connection hoạt động
- Authentication APIs hoạt động
- Basic UI components (Login, Register)
- Documentation (API docs, Setup guide)

### Tech Stack
- **Backend:** Node.js, Express, MongoDB, Redis, JWT, bcrypt
- **Frontend:** React 18, Vite, Tailwind CSS, Ant Design
- **DevOps:** Docker (optional), Git, ESLint, Prettier

---

## Phase 2: Route & Bus Management
**Thời gian dự kiến:** 2 tuần
**Độ ưu tiên:** Cao (Critical)

### Mục tiêu
Xây dựng hệ thống quản lý nhà xe, tuyến đường, và phương tiện - nền tảng cho việc đặt vé.

### Công việc chi tiết

#### 2.1 Bus Operator Management
- [ ] Implement BusOperator Model
  - Company info
  - Business license & tax code
  - Bank info
  - Verification status
  - Rating & statistics
- [ ] **Đăng ký nhà xe**
  - POST `/api/operators/register`
- [ ] **UC-23:** System Admin duyệt nhà xe
  - GET/PUT `/api/admin/operators/:id/verify`

#### 2.2 Route Management
- [ ] Implement Route Model
  - Origin & Destination (city, province, station)
  - Pickup & Dropoff points
  - Distance & estimated duration
- [ ] **UC-12:** APIs quản lý tuyến đường
  - POST `/api/operators/routes` - Tạo tuyến
  - GET `/api/operators/routes` - Danh sách tuyến
  - PUT `/api/operators/routes/:id` - Cập nhật
  - DELETE `/api/operators/routes/:id` - Xóa


#### 2.3 Bus Management
- [ ] Implement Bus Model
  - Bus number (license plate)
  - Bus type (limousine, sleeper, seater, double_decker)
  - Seat layout configuration
  - Amenities
  - Status (active/maintenance)
- [ ] **UC-13:** APIs quản lý xe
  - POST `/api/operators/buses` - Thêm xe
  - GET `/api/operators/buses` - Danh sách xe
  - PUT `/api/operators/buses/:id` - Cập nhật
  - DELETE `/api/operators/buses/:id` - Xóa

#### 2.4 Seat Layout Configuration
- [ ] Thiết kế sơ đồ ghế linh hoạt
  - Floors (1 hoặc 2 tầng)
  - Rows & Columns
  - Layout matrix
- [ ] UI cho việc tạo/chỉnh sửa sơ đồ ghế
- [ ] Preview sơ đồ ghế

#### 2.5 Employee Management
- [ ] Implement Employee Model
  - Driver
  - Trip Manager
  - Roles & permissions
- [ ] **UC-16:** APIs quản lý nhân viên
  - CRUD operations
  - Assign to trips

#### 2.6 Frontend - Operator Dashboard
- [ ] Sidebar navigation
- [ ] Route management UI
- [ ] Bus management UI
- [ ] Employee management UI
- [ ] Seat layout builder

### Deliverables
- Nhà xe có thể đăng ký và được duyệt
- Quản lý tuyến đường hoàn chỉnh
- Quản lý xe và sơ đồ ghế
- Quản lý nhân viên

### Dependencies
- Phase 1 (Authentication & Infrastructure)

---

## Phase 3: Booking System



### Mục tiêu
Xây dựng hệ thống tìm kiếm, đặt vé và thanh toán - core functionality của ứng dụng.

### Công việc chi tiết

#### 3.1 Trip Scheduling
- [ ] Implement Trip Model
  - Route reference
  - Bus reference
  - Driver & Trip Manager reference
  - Departure & arrival time
  - Pricing
  - Seat availability
  - Status (scheduled, ongoing, completed, cancelled)
- [ ] **UC-14:** APIs tạo lịch trình
  - POST `/api/operators/trips` - Tạo chuyến
  - GET `/api/operators/trips` - Danh sách chuyến
  - PUT `/api/operators/trips/:id` - Cập nhật
  - DELETE `/api/operators/trips/:id` - Hủy chuyến
  - Recurring trip creation

#### 3.2 Search & Filter
- [ ] **UC-3:** Tìm kiếm chuyến xe
  - GET `/api/trips/search?from=...&to=...&date=...`
  - Indexing cho performance
  - Filter: price, time, operator, bus type
  - Sort: price, time, rating
- [ ] **UC-4:** Chi tiết chuyến
  - GET `/api/trips/:id`
  - Trip info, bus info, operator info
  - Reviews & ratings
  - Real-time seat availability

#### 3.3 Seat Selection
- [ ] Implement SeatHold/Lock mechanism
  - Lock ghế trong 15 phút
  - Redis cho real-time seat status
- [ ] **UC-5:** APIs đặt vé
  - POST `/api/bookings/hold-seats` - Lock ghế tạm
  - Real-time seat availability WebSocket

#### 3.4 Booking Flow
- [ ] Implement Booking Model
  - User/Guest info
  - Trip reference
  - Seats selected
  - Passenger info (per seat)
  - Pickup & dropoff points
  - Total price
  - Voucher applied
  - Status (pending, confirmed, cancelled)
- [ ] POST `/api/bookings` - Tạo booking
- [ ] Validate voucher
- [ ] Countdown timer (15 phút)

#### 3.5 Payment Integration
- [ ] **UC-6:** Thanh toán
  - VNPay integration
  - ATM card integration
- [ ] POST `/api/payments/create` - Khởi tạo thanh toán
- [ ] GET `/api/payments/callback` - Xử lý callback
- [ ] Payment status tracking
- [ ] Auto refund on failure

#### 3.6 Frontend - Booking Flow
- [ ] Search page với filter & sort
- [ ] Trip listing page
- [ ] Trip detail page
- [ ] Seat selection UI (interactive seat map)
- [ ] Passenger info form
- [ ] Payment method selection
- [ ] Payment gateway redirect
- [ ] Booking confirmation page

#### 3.7 Guest Booking
- [ ] Cho phép đặt vé không cần đăng nhập
- [ ] Email/Phone + OTP verification
- [ ] Temporary session management

### Deliverables
- Nhà xe tạo được lịch trình chuyến xe
- Khách hàng tìm kiếm được chuyến xe
- Chọn ghế real-time
- Đặt vé và thanh toán thành công
- Guest booking hoạt động

### Dependencies
- Phase 1 (Authentication)
- Phase 2 (Route & Bus Management)

---

## Phase 4: Ticket Management


### Mục tiêu
Quản lý vé điện tử, mã QR, và hệ thống soát vé.

### Công việc chi tiết

#### 4.1 Digital Ticket Generation
- [ ] **UC-7:** Tạo vé điện tử
  - Generate PDF ticket
  - QR code với mã hóa (chứa: bookingId, tripId, seatNumbers, timestamp)
  - Ticket design template
- [ ] Email notification service
  - SendGrid hoặc AWS SES integration
  - Email template cho vé
- [ ] SMS notification
  - VNPT SMS hoặc Viettel SMS
  - Link tải vé

#### 4.2 Ticket Management APIs
- [ ] **UC-8:** Quản lý vé (Customer)
  - GET `/api/users/tickets` - Danh sách vé
  - GET `/api/users/tickets/:id` - Chi tiết vé
  - Filter: upcoming, past, cancelled
- [ ] **UC-27:** Tra cứu vé (Guest)
  - POST `/api/tickets/lookup` - Email/Phone + OTP
  - Download ticket

#### 4.3 Cancel & Refund
- [ ] **UC-9:** Hủy vé
  - POST `/api/tickets/:id/cancel`
  - Kiểm tra chính sách hủy
  - Tính tiền hoàn
  - Auto refund qua payment gateway
  - Email confirmation

#### 4.4 Change Ticket
- [ ] **UC-10:** Đổi vé
  - POST `/api/tickets/:id/change`
  - Find new trip
  - Calculate price difference
  - Payment/refund difference
  - Cancel old + create new ticket

#### 4.5 Ticket Verification (Web for Trip Manager)
- [ ] **UC-18:** Đăng nhập quản lý chuyến
  - Separate login cho Trip Manager/Driver
  - View assigned trips
- [ ] **UC-19:** Quét QR xác thực vé
  - POST `/api/trips/:tripId/verify-ticket`
  - QR scanner UI (camera or upload)
  - Decode & validate QR
  - Check: valid, correct trip, not used, not cancelled
  - Mark as used
- [ ] **UC-20:** Danh sách hành khách
  - GET `/api/trips/:tripId/passengers`
  - Filter: boarded / not boarded
  - Search by name, seat

#### 4.6 Frontend
- [ ] Customer ticket management page
- [ ] Guest ticket lookup page
- [ ] Trip Manager web app
  - QR scanner
  - Passenger list
  - Trip status update

### Deliverables
- Vé điện tử PDF với QR code
- Email/SMS notification hoạt động
- Khách hàng quản lý vé (xem, hủy, đổi)
- Trip Manager quét QR và soát vé
- Passenger list real-time

### Dependencies
- Phase 3 (Booking System)

---

## Phase 5: Bus Operator Admin

### Mục tiêu
Hoàn thiện hệ thống quản trị cho nhà xe với dashboard, báo cáo, và quản lý khuyến mãi.

### Công việc chi tiết

#### 5.1 Operator Dashboard
- [ ] Dashboard tổng quan
  - Tổng doanh thu (ngày, tuần, tháng)
  - Số vé bán
  - Tỷ lệ lấp đầy
  - Chuyến xe sắp khởi hành
  - Charts: doanh thu, booking trends
- [ ] GET `/api/operators/dashboard/stats`

#### 5.2 Pricing & Promotions
- [ ] Implement Voucher Model
  - Code
  - Discount type (percentage, fixed)
  - Conditions
  - Validity
  - Usage limit
- [ ] **UC-15:** APIs quản lý voucher
  - CRUD voucher
  - Activate/deactivate
  - Usage report
- [ ] Dynamic pricing for trips

#### 5.3 Reports & Analytics
- [ ] **UC-17:** Báo cáo doanh thu
  - GET `/api/operators/reports/revenue`
  - Filter by date range
  - Revenue breakdown by route
  - Top performing routes
  - Cancellation report
  - Export Excel/PDF

#### 5.4 Trip Management
- [ ] **UC-21:** Cập nhật trạng thái chuyến (Trip Manager)
  - PUT `/api/trips/:id/status`
  - Status: not_started, ongoing, completed
  - Notify passengers on status change

#### 5.5 Frontend
- [ ] Dashboard with charts (Chart.js hoặc Recharts)
- [ ] Voucher management UI
- [ ] Reports page with export
- [ ] Trip management UI

### Deliverables
- Operator dashboard hoàn chỉnh
- Quản lý voucher & pricing
- Báo cáo chi tiết
- Export Excel/PDF

### Dependencies
- Phase 4 (Ticket Management)

---

## Phase 6: System Admin
**Thời gian dự kiến:** 1.5 tuần
**Độ ưu tiên:** Trung bình

### Mục tiêu
Xây dựng hệ thống quản trị tổng thể cho admin hệ thống.

### Công việc chi tiết

#### 6.1 User Management
- [ ] **UC-22:** Quản lý người dùng
  - GET `/api/admin/users` - List all users
  - GET `/api/admin/users/:id` - User detail
  - PUT `/api/admin/users/:id/block` - Block user
  - PUT `/api/admin/users/:id/unblock` - Unblock
  - POST `/api/admin/users/:id/reset-password`

#### 6.2 Operator Management
- [ ] **UC-23:** Duyệt nhà xe (đã có ở Phase 2)
- [ ] Suspend/Resume operator
- [ ] View operator details & statistics

#### 6.3 Content Management
- [ ] **UC-24:** Quản lý nội dung
  - Banner management (upload, order, activate)
  - Blog posts (CRUD)
  - FAQ (CRUD)
  - SEO settings

#### 6.4 Support & Complaints
- [ ] Implement Ticket/Complaint Model
  - User reference
  - Subject, description
  - Status (open, in_progress, resolved, closed)
  - Priority
  - Assigned to
- [ ] **UC-25:** APIs xử lý khiếu nại
  - CRUD tickets
  - Assign to staff
  - Update status
  - Add notes
  - Close ticket

#### 6.5 System Reports
- [ ] **UC-26:** Báo cáo tổng hợp
  - GET `/api/admin/reports/overview`
  - Total users, operators, bookings
  - Revenue metrics
  - Growth charts
  - Top routes, operators
  - Export reports

#### 6.6 Frontend - Admin Dashboard
- [ ] User management UI
- [ ] Operator approval UI
- [ ] Content management UI
- [ ] Ticket/complaint management UI
- [ ] System reports & analytics

### Deliverables
- Admin có thể quản lý toàn bộ users
- Duyệt và quản lý nhà xe
- Quản lý nội dung website
- Hệ thống support tickets
- Báo cáo tổng hợp

### Dependencies
- Phase 5 (Operator Admin)

---

## Phase 7: Additional Features & Polish
**Thời gian dự kiến:** 2 tuần
**Độ ưu tiên:** Thấp (Nice to have)

### Mục tiêu
Bổ sung các tính năng nâng cao và hoàn thiện trải nghiệm người dùng.

### Công việc chi tiết

#### 7.1 Ratings & Reviews
- [ ] Implement Review Model
  - Booking reference
  - Rating (1-5 stars)
  - Detailed ratings (vehicle, driver, punctuality, service)
  - Comment
- [ ] **UC-11:** Đánh giá chuyến đi
  - POST `/api/bookings/:id/review`
  - Email invitation after trip completion
- [ ] Display reviews on trip details
- [ ] Aggregate ratings for operators

#### 7.2 Loyalty Program
- [ ] **UC-28:** Xem lịch sử tích điểm
  - GET `/api/users/loyalty/history`
  - Points calculation logic
  - Redeem points for discounts
- [ ] Loyalty tiers (bronze, silver, gold, platinum)
- [ ] Points expiry logic

#### 7.3 Notifications
- [ ] **UC-9:** Email notifications (đã có cơ bản)
  - Booking confirmation
  - Payment confirmation
  - Trip reminder (24h before, 2h before)
  - Cancellation confirmation
  - Schedule changes
- [ ] **UC-9:** SMS notifications
  - OTP
  - Booking code
  - Trip reminder
  - Important alerts

#### 7.4 Advanced Search & Recommendations
- [ ] Search history
- [ ] Recommended routes based on history
- [ ] Popular routes
- [ ] Price alerts

#### 7.5 UI/UX Improvements
- [ ] Loading states & skeletons
- [ ] Error handling & user-friendly messages
- [ ] Responsive design polish
- [ ] Accessibility (WCAG 2.1)
- [ ] Dark mode (optional)
- [ ] i18n (Vietnamese + English)

#### 7.6 Performance Optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] CDN setup (CloudFlare)
- [ ] Redis caching optimization
- [ ] Database indexing
- [ ] API response time optimization (target: < 200ms)

#### 7.7 Testing & Quality
- [ ] Unit tests (target: 70% coverage)
- [ ] Integration tests
- [ ] E2E tests (Cypress hoặc Playwright)
- [ ] Load testing (Artillery, k6)
- [ ] Security audit

#### 7.8 Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] User manual
- [ ] Admin manual
- [ ] Deployment guide
- [ ] Architecture diagram

#### 7.9 Deployment & Monitoring
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deploy to cloud (AWS/Azure/GCP)
- [ ] Monitoring (Prometheus, Grafana)
- [ ] Logging (ELK stack hoặc CloudWatch)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring

### Deliverables
- Rating & review system
- Loyalty program hoàn chỉnh
- Email/SMS notifications đầy đủ
- Performance tối ưu
- Test coverage ≥ 70%
- Documentation đầy đủ
- Production deployment

### Dependencies
- All previous phases

---

## Tổng Kết

### Timeline Tổng Thể
- **Phase 1:** 2 tuần
- **Phase 2:** 2 tuần
- **Phase 3:** 3 tuần
- **Phase 4:** 2 tuần
- **Phase 5:** 2 tuần
- **Phase 6:** 1.5 tuần
- **Phase 7:** 2 tuần

**Tổng cộng:** ~14.5 tuần (≈ 3.5 tháng)

### Milestone Quan Trọng
1. **End of Phase 1:** Authentication hoạt động ✅
2. **End of Phase 2:** Nhà xe có thể quản lý tuyến và xe ✅
3. **End of Phase 3:** Khách hàng đặt vé và thanh toán được (MVP)
4. **End of Phase 4:** Hệ thống vé điện tử hoàn chỉnh ✅
5. **End of Phase 5:** Operator dashboard đầy đủ ✅
6. **End of Phase 6:** System admin hoàn chỉnh ✅
7. **End of Phase 7:** Production ready ✅

### Phân Công Nhóm (Đề xuất)
- **Backend Developer (2-3 người):** Phụ trách APIs, database, business logic
- **Frontend Developer (2-3 người):** Phụ trách UI/UX, React components
- **Full-stack Developer (1-2 người):** Support cả backend và frontend
- **DevOps (1 người):** CI/CD, deployment, monitoring
- **QA/Tester (1 người):** Testing, quality assurance

### Tech Stack Tổng Hợp
- **Frontend:** React 18, Vite, Tailwind CSS, Ant Design
- **Backend:** Node.js, Express, MongoDB, Redis
- **Authentication:** JWT, bcrypt, OAuth
- **Payment:** VNPay, MoMo, ZaloPay
- **Notifications:** SendGrid, AWS SES, VNPT SMS
- **Cloud:** AWS/Azure/GCP
- **DevOps:** Docker, GitHub Actions, Nginx

---

## Ghi Chú
- Mỗi phase nên có sprint review và demo
- Ưu tiên Phase 1-4 cho MVP (Minimum Viable Product)
- Phase 5-7 có thể điều chỉnh dựa trên feedback
- Luôn cập nhật tài liệu khi có thay đổi
- Code review bắt buộc trước khi merge
