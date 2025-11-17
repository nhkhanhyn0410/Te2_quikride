# QuikRide Backend API

Backend API cho hệ thống đặt vé xe khách trực tuyến QuikRide.

## 📋 Tổng Quan

Backend được xây dựng với:

- **Node.js** (≥18.0.0)
- **Express** 4.18.2 - Web framework
- **MongoDB** (≥6.0) - NoSQL database
- **Redis** (≥6.0) - Caching & session store
- **JWT** - Authentication

## 🏗️ Cấu Trúc Thư Mục

```
backend/
├── src/
│   ├── config/              # Cấu hình ứng dụng
│   │   ├── database.js      # MongoDB connection
│   │   ├── redis.js         # Redis connection
│   │   ├── cloudinary.js    # Cloudinary upload
│   │   ├── email.js         # Email service
│   │   └── payment.js       # Payment gateways (VNPay, MoMo, ZaloPay)
│   │
│   ├── controllers/         # Request handlers (sẽ được tạo trong Phase tiếp theo)
│   │
│   ├── models/              # MongoDB Schemas (sẽ được tạo trong Phase tiếp theo)
│   │
│   ├── routes/              # API Routes (sẽ được tạo trong Phase tiếp theo)
│   │
│   ├── middleware/          # Express Middleware
│   │   └── error.middleware.js   # Error handling
│   │
│   ├── services/            # Business Logic (sẽ được tạo trong Phase tiếp theo)
│   │
│   ├── utils/               # Utilities
│   │   ├── constants.js     # Application constants
│   │   ├── validators.js    # Validation functions
│   │   ├── helpers.js       # Helper functions
│   │   └── logger.js        # Logging utility
│   │
│   └── server.js            # Entry point
│
├── tests/                   # Tests (sẽ được tạo sau)
├── logs/                    # Log files (auto-generated)
├── .env.example             # Environment variables template
├── .env                     # Environment variables (gitignored)
├── .gitignore
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── package.json
└── README.md                # This file
```

## 🚀 Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- MongoDB ≥ 6.0
- Redis ≥ 6.0

### Bước 1: Cài Đặt Dependencies

```bash
cd backend
npm install
```

### Bước 2: Cấu Hình Environment Variables

Sao chép file `.env.example` thành `.env` và cập nhật các giá trị:

```bash
cp .env.example .env
```

Các biến môi trường quan trọng:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/quikride

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (IMPORTANT: Change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Bước 3: Khởi Động MongoDB và Redis

**MongoDB:**

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# Hoặc dùng Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

**Redis:**

```bash
# Ubuntu/Debian
sudo systemctl start redis

# Hoặc dùng Docker
docker run -d -p 6379:6379 --name redis redis:6
```

### Bước 4: Chạy Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api/v1
```

### Health Check

```bash
GET /health
```

Response:

```json
{
  "status": "success",
  "message": "QuikRide API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### API Version Info

```bash
GET /api/v1
```

Response:

```json
{
  "status": "success",
  "message": "QuikRide API v1",
  "version": "1.0.0",
  "documentation": "/api/v1/docs"
}
```

> **Note:** Các API endpoints khác sẽ được thêm vào trong các Phase tiếp theo.

## 🔧 Scripts

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check
```

## 🗄️ Database Schema

Chi tiết database schema được mô tả trong file `docs/DATABASE_SCHEMA.md`.

### Collections Chính:

1. **users** - Khách hàng
2. **busoperators** - Nhà xe
3. **routes** - Tuyến đường
4. **buses** - Phương tiện
5. **trips** - Lịch trình chuyến xe
6. **bookings** - Đặt vé
7. **tickets** - Vé điện tử
8. **payments** - Thanh toán
9. **reviews** - Đánh giá
10. **vouchers** - Mã giảm giá
11. **employees** - Nhân viên

## 🔐 Security

Các biện pháp bảo mật đã được triển khai:

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Rate Limiting** - 100 requests/phút/IP
- ✅ **JWT** - Authentication tokens
- ✅ **bcrypt** - Password hashing (12 rounds)
- ✅ **Input validation** - express-validator
- ✅ **Environment variables** - Sensitive data protection

## 📦 Dependencies

### Production Dependencies

| Package            | Version | Purpose            |
| ------------------ | ------- | ------------------ |
| express            | ^4.18.2 | Web framework      |
| mongoose           | ^8.0.0  | MongoDB ODM        |
| redis              | ^4.6.0  | Redis client       |
| jsonwebtoken       | ^9.0.2  | JWT authentication |
| bcryptjs           | ^2.4.3  | Password hashing   |
| helmet             | ^7.1.0  | Security headers   |
| cors               | ^2.8.5  | CORS middleware    |
| express-rate-limit | ^7.1.0  | Rate limiting      |
| express-validator  | ^7.0.1  | Input validation   |
| nodemailer         | ^6.9.7  | Email sending      |
| cloudinary         | ^1.41.0 | Image upload       |
| qrcode             | ^1.5.3  | QR code generation |
| pdfkit             | ^0.13.0 | PDF generation     |
| socket.io          | ^4.6.0  | WebSocket          |

### Dev Dependencies

| Package  | Version | Purpose           |
| -------- | ------- | ----------------- |
| nodemon  | ^3.0.1  | Auto-reload       |
| jest     | ^29.7.0 | Testing framework |
| eslint   | ^8.54.0 | Code linting      |
| prettier | ^3.1.0  | Code formatting   |

## 🛠️ Development

### Code Style

Dự án sử dụng:

- **ESLint** với Airbnb style guide
- **Prettier** cho code formatting

Format code trước khi commit:

```bash
npm run format
npm run lint:fix
```

### Git Hooks

Husky được cấu hình để chạy:

- Pre-commit: Lint và format code
- Pre-push: Run tests

### Environment Variables

Các biến môi trường quan trọng:

```env
# Server Configuration
NODE_ENV=development|production|test
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/quikride
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Email (SendGrid)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@quikride.com

# Payment Gateways
VNPAY_TMN_CODE=your-code
VNPAY_HASH_SECRET=your-secret
MOMO_PARTNER_CODE=your-code
MOMO_SECRET_KEY=your-secret
ZALOPAY_APP_ID=your-app-id
ZALOPAY_KEY1=your-key1

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Giải pháp:**

```bash
# Kiểm tra MongoDB đang chạy
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Giải pháp:**

```bash
# Kiểm tra Redis đang chạy
redis-cli ping

# Start Redis
sudo systemctl start redis
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Giải pháp:**

```bash
# Tìm process đang dùng port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Hoặc thay đổi PORT trong .env
PORT=5001
```

## 📝 Logging

Logs được lưu trong thư mục `logs/`:

- `logs/app.log` - All logs
- `logs/error.log` - Error logs only

Xem logs:

```bash
# Tail app logs
tail -f logs/app.log

# Tail error logs
tail -f logs/error.log
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📖 Further Reading

- [Project Phases](../docs/PROJECT_PHASES.md) - Development roadmap
- [Database Schema](../docs/DATABASE_SCHEMA.md) - Database design
- [Main README](../README.md) - Project overview

## 📄 License

MIT

---

**QuikRide Backend API v1.0.0**
