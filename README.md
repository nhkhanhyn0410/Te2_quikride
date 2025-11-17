# QuikRide - Hệ Thống Đặt Vé Xe Khách Trực Tuyến

<div align="center">
  <h3>🚌 Nền tảng đặt vé xe khách hiện đại, nhanh chóng và tiện lợi</h3>
  <p>Kết nối khách hàng với các nhà xe, tạo nên trải nghiệm đặt vé trực tuyến tuyệt vời</p>
</div>

---

## Tổng Quan

**QuikRide** là một ứng dụng web đặt vé xe khách trực tuyến, cho phép:
- 🔍 Khách hàng tìm kiếm, đặt vé và thanh toán dễ dàng
- 🎫 Quản lý vé điện tử với mã QR
- 🏢 Nhà xe quản lý tuyến đường, lịch trình và doanh thu
- 📊 Admin hệ thống giám sát và quản trị tổng thể

## Tính Năng Chính

### Dành cho Khách Hàng
- ✅ Tìm kiếm chuyến xe theo tuyến, ngày giờ
- ✅ Xem thông tin chi tiết: giá, xe, tiện ích, đánh giá
- ✅ Chọn ghế ngồi trên sơ đồ real-time
- ✅ Thanh toán online đa dạng (MoMo, VNPay, ZaloPay, ATM, Visa/Master)
- ✅ Nhận vé điện tử có mã QR qua email/SMS
- ✅ Quản lý vé: xem, hủy, đổi
- ✅ Đánh giá và review chuyến đi
- ✅ Tích lũy điểm thưởng

### Dành cho Nhà Xe
- 🚐 Quản lý thông tin nhà xe
- 🛣️ Quản lý tuyến đường và điểm đón/trả
- 🚌 Quản lý xe và sơ đồ ghế
- 📅 Tạo lịch trình chuyến xe
- 💰 Thiết lập giá vé và voucher
- 👥 Quản lý nhân viên (tài xế, quản lý chuyến)
- 📈 Báo cáo doanh thu chi tiết
- 📊 Dashboard theo dõi real-time

### Dành cho Tài Xế/Quản Lý Chuyến
- 📱 Web quản lý chuyến xe
- 📷 Quét mã QR để xác thực vé
- ✅ Đánh dấu hành khách đã lên xe
- 📋 Xem danh sách hành khách
- 🔄 Cập nhật trạng thái chuyến xe

### Dành cho Admin Hệ Thống
- 👥 Quản lý người dùng
- ✅ Duyệt đăng ký nhà xe mới
- 🎨 Quản lý nội dung (banner, blog, FAQ)
- 🎫 Xử lý khiếu nại
- 📊 Báo cáo tổng hợp hệ thống

## Công Nghệ Sử Dụng

### Frontend
- ⚛️ **React 18** - UI Framework
- ⚡ **Vite** - Build Tool
- 🎨 **Tailwind CSS** - Styling
- 🧩 **Ant Design** - UI Components
- 🔄 **Redux/Zustand** - State Management
- 🛣️ **React Router** - Routing

### Backend
- 🟢 **Node.js** - Runtime
- 🚂 **Express** - Web Framework
- 🍃 **MongoDB** - Database
- 🔴 **Redis** - Caching & Queue
- 🔐 **JWT** - Authentication
- 🔒 **bcrypt** - Password Hashing

### Third-party Services
- 💳 **VNPay, MoMo, ZaloPay** - Payment Gateway
- 📧 **SendGrid/AWS SES** - Email Service
- 📱 **VNPT SMS/Viettel SMS** - SMS Service
- 🗺️ **Google Maps API** - Maps & Geocoding

### DevOps & Infrastructure
- 🐳 **Docker** - Containerization
- ☁️ **AWS/Azure/GCP** - Cloud Platform
- 🔄 **GitHub Actions** - CI/CD
- 🌐 **Nginx** - Web Server
- 📊 **CloudFlare** - CDN

## Cấu Trúc Dự Án

```
Te2_quikride/
├── backend/                # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   └── config/         # Configuration
│   ├── tests/              # Backend tests
│   └── package.json
│
├── frontend/               # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # State management
│   │   └── assets/         # Static assets
│   ├── public/             # Public files
│   └── package.json
│
├── docs/                   # Documentation
│   ├── PROJECT_PHASES.md   # Lộ trình phát triển
│   ├── API.md              # API documentation
│   └── ARCHITECTURE.md     # Architecture diagram
│
├── shared/                 # Shared code (types, constants)
│
├── PTTKHDT (1).docx       # Tài liệu phân tích yêu cầu
└── README.md              # This file
```

## Lộ Trình Phát Triển

Dự án được chia thành **7 giai đoạn (phases)** phát triển:

| Phase | Tên | Thời gian | Độ ưu tiên |
|-------|-----|-----------|------------|
| **Phase 1** | Setup & Core Infrastructure | 2 tuần | 🔴 Cao |
| **Phase 2** | Route & Bus Management | 2 tuần | 🔴 Cao |
| **Phase 3** | Booking System | 3 tuần | 🔴 Cao |
| **Phase 4** | Ticket Management | 2 tuần | 🔴 Cao |
| **Phase 5** | Bus Operator Admin | 2 tuần | 🟡 Trung bình |
| **Phase 6** | System Admin | 1.5 tuần | 🟡 Trung bình |
| **Phase 7** | Additional Features & Polish | 2 tuần | 🟢 Thấp |

**Tổng thời gian:** ~14.5 tuần (≈ 3.5 tháng)

📖 **Chi tiết:** Xem [docs/PROJECT_PHASES.md](docs/PROJECT_PHASES.md)

## Hướng Dẫn Cài Đặt

### Yêu cầu
- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 6.x
- npm hoặc yarn

### Backend Setup

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
# - MONGODB_URI
# - REDIS_URL
# - JWT_SECRET
# - Payment gateway credentials
# - Email/SMS service credentials

# Chạy development server
npm run dev

# Chạy tests
npm test
```

### Frontend Setup

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env
# - VITE_API_URL

# Chạy development server
npm run dev

# Build for production
npm run build
```

## API Documentation

API documentation sẽ được cung cấp qua Swagger/OpenAPI tại:
```
http://localhost:5000/api-docs
```

## Testing

### Backend Tests
```bash
cd backend
npm test                 # Chạy tất cả tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Chạy tất cả tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Deployment

### Docker
```bash
# Build images
docker-compose build

# Chạy containers
docker-compose up -d

# Stop containers
docker-compose down
```

### Manual Deployment
Xem [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) để biết chi tiết.

## Yêu Cầu Phi Chức Năng

- ⚡ **Performance:** Thời gian tải trang ≤ 2s, API response ≤ 200ms
- 🔒 **Security:** HTTPS/TLS 1.3, PCI-DSS compliant, OWASP best practices
- 📈 **Availability:** Uptime 99.9%, RTO ≤ 1 giờ
- ♿ **Accessibility:** WCAG 2.1 Level AA
- 📱 **Responsive:** Hỗ trợ desktop, tablet, mobile (320px - 4K)
- 🌐 **Browser Support:** Chrome, Firefox, Safari, Edge (2 versions mới nhất)

## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước khi bắt đầu.

### Git Workflow
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phát hành dưới [MIT License](LICENSE).

## Team

- **Backend Team:** [Tên thành viên]
- **Frontend Team:** [Tên thành viên]
- **DevOps:** [Tên thành viên]
- **QA/Tester:** [Tên thành viên]

## Liên Hệ

- 📧 Email: support@quikride.com
- 🌐 Website: https://quikride.com
- 📱 Hotline: 1900-xxxx

---

<div align="center">
  Made with ❤️ by QuikRide Team
</div>
