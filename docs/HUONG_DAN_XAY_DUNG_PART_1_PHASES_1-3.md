# HƯỚNG DẪN XÂY DỰNG DỰ ÁN VÉ XE NHANH - PART 1
## PHASES 1-3: SETUP ĐẾN BOOKING SYSTEM (MVP CORE)

---

## 🎯 TỔNG QUAN PART 1

**Nội dung:** Phase 1-3 - Xây dựng MVP (Minimum Viable Product)
**Thời gian:** 7 tuần
**Mục tiêu:** Hoàn thành core features cho phép khách hàng đặt vé và thanh toán

### Các Phase trong Part 1:
- **Phase 1:** Setup & Core Infrastructure (2 tuần)
- **Phase 2:** Route & Bus Management (2 tuần)
- **Phase 3:** Booking System (3 tuần)

---

# PHASE 1: SETUP & CORE INFRASTRUCTURE

**Thời gian:** 2 tuần
**Độ ưu tiên:** 🔴 Cao (Critical)

## MỤC TIÊU PHASE 1
Thiết lập nền tảng cơ sở hạ tầng cho toàn bộ dự án, bao gồm:
- Cấu trúc project monorepo
- Database & Cache setup
- Hệ thống authentication hoàn chỉnh
- Security middleware
- Basic UI components

---

## 📦 BƯỚC 1.1: SETUP PROJECT STRUCTURE

### A. Backend Setup

#### 1. Khởi tạo Monorepo
```
Thực hiện:
1. Tạo thư mục gốc: Te2_vexenhanh
2. Khởi tạo Git repository:
   - git init
   - Tạo .gitignore (loại trừ: node_modules, .env, logs, dist, build)
3. Tạo thư mục con: backend, frontend, docs
4. Tạo file README.md gốc với project overview
```

#### 2. Setup Backend Project
```
Di chuyển vào thư mục backend:

1. Khởi tạo npm:
   - npm init -y
   - Đặt name: "vexenhanh-backend"
   - Đặt version: "1.0.0"

2. Cài đặt Dependencies chính:
   Core Framework:
   - express: Web framework
   - mongoose: MongoDB ODM
   - redis: Redis client
   - dotenv: Environment variables

   Authentication & Security:
   - jsonwebtoken: JWT tokens
   - bcryptjs: Password hashing
   - helmet: Security headers
   - cors: CORS handling
   - express-rate-limit: Rate limiting

   Validation & Utilities:
   - express-validator: Input validation
   - morgan: HTTP request logger
   - winston: Application logger

   Development:
   - nodemon: Auto-reload
   - eslint: Code linting
   - prettier: Code formatting

3. Cài đặt Development Dependencies:
   - jest: Testing framework
   - supertest: HTTP testing
   - eslint: Linting
   - prettier: Formatting
```

#### 3. Tạo Cấu trúc Thư mục Backend
```
Tạo các thư mục và files:

backend/
├── src/
│   ├── config/           # Configurations
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── cloudinary.js
│   │   └── payment.js
│   │
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── (sẽ thêm sau)
│   │
│   ├── models/          # MongoDB Schemas
│   │   ├── User.js
│   │   └── (sẽ thêm sau)
│   │
│   ├── routes/          # API Routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── index.js (aggregate all routes)
│   │
│   ├── middleware/      # Express Middleware
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── security.middleware.js
│   │
│   ├── services/        # Business Logic
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   └── (sẽ thêm sau)
│   │
│   ├── utils/          # Helper Functions
│   │   ├── logger.js
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   └── server.js       # Entry Point
│
├── tests/              # Tests
│   ├── unit/
│   ├── integration/
│   └── setup.js
│
├── logs/               # Log files (gitignored)
├── .env.example        # Environment template
├── .eslintrc.json     # ESLint config
├── .prettierrc.json   # Prettier config
├── jest.config.js     # Jest config
└── package.json
```

#### 4. Tạo File Cấu hình

**File: backend/.env.example**
```
Nội dung template:

# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/vexenhanh

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email (SendGrid/Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@vexenhanh.com

# SMS (VNPT/Viettel)
SMS_PROVIDER=vnpt
SMS_API_KEY=
SMS_API_SECRET=
SMS_BRAND_NAME=Vé xe nhanh

# Payment Gateways
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**File: backend/.eslintrc.json**
```
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "error"
  }
}
```

**File: backend/.prettierrc.json**
```
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**File: backend/jest.config.js**
```
Nội dung:
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

**File: backend/package.json - scripts section**
```
Thêm scripts:
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "test": "jest --coverage",
  "test:watch": "jest --watch",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "seed": "node src/utils/seeders/index.js"
}
```

### B. Frontend Setup

#### 1. Khởi tạo React + Vite Project
```
Di chuyển vào thư mục frontend:

1. Khởi tạo Vite:
   - npm create vite@latest . -- --template react
   - Chọn: React
   - Chọn: JavaScript (hoặc TypeScript nếu muốn)

2. Cài đặt Dependencies:
   Routing & HTTP:
   - react-router-dom: Client-side routing
   - axios: HTTP client

   UI Framework:
   - antd: Ant Design components
   - @ant-design/icons: Icons

   Styling:
   - tailwindcss: Utility-first CSS
   - postcss: PostCSS
   - autoprefixer: CSS autoprefixer

   State Management:
   - zustand: Lightweight state management

   Real-time:
   - socket.io-client: WebSocket client

   Utilities:
   - dayjs: Date manipulation
   - react-hot-toast: Notifications
   - qrcode.react: QR code generation
   - html5-qrcode: QR scanner
   - recharts: Charts (cho Phase 5)

   Development:
   - eslint: Linting
   - prettier: Formatting
   - vite: Build tool

3. Setup Tailwind CSS:
   - npm install -D tailwindcss postcss autoprefixer
   - npx tailwindcss init -p
   - Cấu hình tailwind.config.js
   - Thêm directives vào index.css
```

#### 2. Tạo Cấu trúc Thư mục Frontend
```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/         # Common components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── customer/       # Customer components
│   │   │   └── (sẽ thêm sau)
│   │   │
│   │   ├── operator/       # Operator components
│   │   │   └── (sẽ thêm sau)
│   │   │
│   │   └── admin/          # Admin components
│   │       └── (sẽ thêm sau)
│   │
│   ├── pages/              # Page components
│   │   ├── auth/           # Auth pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   │
│   │   ├── customer/       # Customer pages
│   │   │   ├── HomePage.jsx
│   │   │   └── (sẽ thêm sau)
│   │   │
│   │   ├── operator/       # Operator pages
│   │   │   └── (sẽ thêm sau)
│   │   │
│   │   ├── tripManager/    # Trip Manager pages
│   │   │   └── (sẽ thêm sau)
│   │   │
│   │   └── admin/          # Admin pages
│   │       └── (sẽ thêm sau)
│   │
│   ├── services/           # API Services
│   │   ├── api.js         # Axios instance
│   │   ├── authApi.js     # Auth APIs
│   │   └── (sẽ thêm sau)
│   │
│   ├── store/             # Zustand stores
│   │   ├── authStore.js   # Auth state
│   │   └── (sẽ thêm sau)
│   │
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   │
│   ├── utils/             # Utilities
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   │
│   ├── assets/            # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── public/                # Public files
│   └── favicon.ico
│
├── .env.example          # Environment template
├── .eslintrc.json        # ESLint config
├── .prettierrc.json      # Prettier config
├── vite.config.js        # Vite config
├── tailwind.config.js    # Tailwind config
├── postcss.config.js     # PostCSS config
└── package.json
```

#### 3. Cấu hình Files

**File: frontend/.env.example**
```
# API Base URL
VITE_API_URL=http://localhost:5000/api/v1

# WebSocket URL
VITE_WS_URL=ws://localhost:5000

# App Info
VITE_APP_NAME=Vé xe nhanh
VITE_APP_VERSION=1.0.0
```

**File: frontend/tailwind.config.js**
```
Cấu hình:
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',    // Sky blue
        secondary: '#64748b',   // Slate
        success: '#10b981',     // Green
        danger: '#ef4444',      // Red
        warning: '#f59e0b',     // Amber
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**File: frontend/vite.config.js**
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

**File: frontend/src/index.css**
```
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 📦 BƯỚC 1.2: DATABASE & CACHE SETUP

### A. Cài đặt MongoDB

#### 1. Cài MongoDB Local (Development)
```
Option 1: MongoDB Community Edition
1. Tải và cài MongoDB Community Edition từ mongodb.com
2. Start MongoDB service:
   - Windows: MongoDB chạy tự động sau khi cài
   - Mac: brew services start mongodb-community
   - Linux: sudo systemctl start mongod

3. Verify installation:
   - Mở MongoDB Shell: mongosh
   - Kiểm tra databases: show dbs

Option 2: MongoDB Atlas (Cloud - Recommended)
1. Đăng ký tài khoản tại mongodb.com/atlas
2. Tạo cluster miễn phí (M0 Sandbox)
3. Tạo database user với username/password
4. Whitelist IP address (0.0.0.0/0 cho dev)
5. Get connection string
6. Copy connection string vào .env
```

#### 2. Tạo Database Config File

**File: backend/src/config/database.js**
```
Mục đích: Kết nối MongoDB với Mongoose

Các bước implementation:
1. Import mongoose và dotenv
2. Tạo function connectDB():
   - Đọc MONGODB_URI từ process.env
   - Sử dụng mongoose.connect() với options:
     - useNewUrlParser: true
     - useUnifiedTopology: true
   - Handle connection events:
     - 'connected': Log success message
     - 'error': Log error và exit process
     - 'disconnected': Log disconnection
3. Export function connectDB

Testing:
- Import connectDB trong server.js
- Gọi connectDB() trước khi start server
- Verify console log "MongoDB Connected Successfully"
```

### B. Cài đặt Redis

#### 1. Cài Redis Local
```
Option 1: Redis trực tiếp
- Windows: Download từ github.com/microsoftarchive/redis/releases
- Mac: brew install redis
- Linux: sudo apt-get install redis-server

Start Redis:
- Windows: Chạy redis-server.exe
- Mac: brew services start redis
- Linux: sudo systemctl start redis

Verify:
- redis-cli ping
- Nên return: PONG

Option 2: Redis Cloud (Recommended for production)
1. Đăng ký tại redis.com/try-free
2. Tạo database miễn phí
3. Get connection URL (redis://...)
4. Copy vào .env
```

#### 2. Tạo Redis Config File

**File: backend/src/config/redis.js**
```
Mục đích: Kết nối Redis client

Implementation:
1. Import redis package
2. Tạo Redis client với:
   - url: process.env.REDIS_URL
   - retry_strategy: Retry khi connection failed
3. Handle events:
   - 'connect': Log success
   - 'error': Log error
   - 'ready': Log ready
4. Export Redis client

Các function utilities:
- setCache(key, value, ttl): Set cache với TTL
- getCache(key): Get cache
- deleteCache(key): Delete cache
- clearCache(pattern): Clear multiple keys
```

---

## 📦 BƯỚC 1.3: XÂY DỰNG HỆ THỐNG AUTHENTICATION

### A. User Model

**File: backend/src/models/User.js**
```
Mục đích: Định nghĩa schema cho User collection

Các bước implementation:

1. Import mongoose và bcryptjs

2. Định nghĩa UserSchema với các fields:

   Basic Info:
   - email: { type: String, unique: true, required: true, lowercase: true, trim: true }
   - phone: { type: String, unique: true, sparse: true, validate: regex phone VN }
   - password: { type: String, required: true, minlength: 6, select: false }
   - fullName: { type: String, required: true, trim: true }
   - avatar: { type: String, default: null }

   Personal Info:
   - dateOfBirth: { type: Date }
   - gender: { type: String, enum: ['male', 'female', 'other'] }
   - address: {
       street: String,
       city: String,
       province: String
     }

   Account Status:
   - isEmailVerified: { type: Boolean, default: false }
   - isPhoneVerified: { type: Boolean, default: false }
   - isActive: { type: Boolean, default: true }
   - isBlocked: { type: Boolean, default: false }
   - blockedReason: { type: String }

   OAuth:
   - oauthProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' }
   - oauthId: { type: String }

   Loyalty Program:
   - loyaltyTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' }
   - loyaltyPoints: { type: Number, default: 0 }
   - pointsHistory: [{
       points: Number,
       type: { type: String, enum: ['earn', 'redeem'] },
       description: String,
       createdAt: { type: Date, default: Date.now }
     }]

   Saved Data:
   - savedPassengers: [{
       fullName: String,
       phone: String,
       idCard: String,
       email: String
     }]

   Timestamps:
   - createdAt, updatedAt (tự động bởi mongoose)

3. Thêm Indexes:
   - Index email (unique)
   - Index phone (unique, sparse)
   - Index oauthProvider + oauthId (compound)

4. Pre-save Hook (hash password):
   - Kiểm tra nếu password bị modified
   - Hash password bằng bcryptjs với salt rounds = 12
   - Lưu hashed password

5. Methods:
   - comparePassword(candidatePassword):
     - Sử dụng bcrypt.compare()
     - Return true/false

   - generateAuthToken():
     - Tạo JWT token chứa { userId: this._id, email: this.email }
     - Expire: JWT_EXPIRE từ .env (7 days)
     - Return token

   - toJSON():
     - Override method để remove password khi return user object

6. Export model: mongoose.model('User', UserSchema)
```

### B. Authentication Middleware

**File: backend/src/middleware/auth.middleware.js**
```
Mục đích: Verify JWT token và protect routes

1. Import jsonwebtoken và User model

2. Middleware: authenticate
   Implementation:
   - Lấy token từ header: Authorization: Bearer <token>
   - Extract token (remove 'Bearer ')
   - Nếu không có token: Return 401 Unauthorized
   - Verify token bằng jwt.verify(token, JWT_SECRET)
   - Nếu invalid: Return 401 Unauthorized
   - Decode userId từ token payload
   - Tìm user trong database bằng userId
   - Nếu user không tồn tại hoặc isActive = false: Return 401
   - Attach user vào req.user
   - Call next()

   Error handling:
   - JsonWebTokenError: Invalid token
   - TokenExpiredError: Token expired

3. Middleware: authorize(roles)
   Implementation:
   - Input: Array of allowed roles ['admin', 'operator', etc.]
   - Check req.user.role in allowed roles
   - Nếu không: Return 403 Forbidden
   - Call next()

4. Export: { authenticate, authorize }
```

**File: backend/src/middleware/security.middleware.js**
```
Mục đích: Setup security measures

1. Import helmet, cors, express-rate-limit, express-mongo-sanitize

2. Setup các middleware:

   a. Helmet (security headers):
      - helmet() với default config

   b. CORS:
      - cors({
          origin: process.env.FRONTEND_URL hoặc whitelist domains,
          credentials: true,
          optionsSuccessStatus: 200
        })

   c. Rate Limiting:
      - rateLimit({
          windowMs: 60000 (1 phút),
          max: 100 (100 requests/phút),
          message: 'Too many requests'
        })

   d. Input Sanitization:
      - mongoSanitize() - Chống NoSQL injection
      - Trim và escape inputs

   e. XSS Protection:
      - Sanitize input data
      - Set Content-Security-Policy header

3. Export tất cả middleware
```

**File: backend/src/middleware/error.middleware.js**
```
Mục đích: Global error handler

Implementation:
1. Error handler middleware với 4 params (err, req, res, next)

2. Log error:
   - Log error stack nếu NODE_ENV = development
   - Log error message nếu production

3. Handle các loại errors:

   a. ValidationError (Mongoose):
      - Status: 400
      - Message: Extract validation errors

   b. CastError (MongoDB):
      - Status: 400
      - Message: Invalid ID format

   c. Duplicate Key Error (code 11000):
      - Status: 400
      - Message: Field already exists

   d. JsonWebTokenError:
      - Status: 401
      - Message: Invalid token

   e. TokenExpiredError:
      - Status: 401
      - Message: Token expired

   f. Default Error:
      - Status: err.statusCode || 500
      - Message: err.message || 'Server Error'

4. Response format:
   {
     success: false,
     error: {
       message: string,
       statusCode: number,
       ...(development ? { stack: err.stack } : {})
     }
   }

5. Export error handler
```

### C. Auth Controller & Routes

**File: backend/src/controllers/auth.controller.js**
```
Mục đích: Handle authentication logic

1. Import User model, jwt, bcrypt, email service

2. Controller functions:

a. register
   Input: { email, phone, password, fullName }

   Steps:
   1. Validate input using express-validator
   2. Check email đã tồn tại chưa (User.findOne({ email }))
   3. Check phone đã tồn tại chưa (nếu có phone)
   4. Nếu tồn tại: Return 400 Bad Request
   5. Create new user: new User({ email, phone, password, fullName })
   6. Save user (password sẽ tự động hash nhờ pre-save hook)
   7. Generate email verification token (random string)
   8. Lưu verification token vào Redis với TTL 24h
   9. Send verification email (gọi email.service)
   10. Return response:
       {
         success: true,
         message: 'Registration successful. Please verify email.',
         user: { id, email, fullName }
       }

b. login
   Input: { email, password }

   Steps:
   1. Validate input
   2. Tìm user bằng email, select password field: User.findOne({ email }).select('+password')
   3. Nếu không tìm thấy: Return 401 Invalid credentials
   4. Check password: user.comparePassword(password)
   5. Nếu sai password: Return 401
   6. Check isBlocked: Nếu true, return 403 Account blocked
   7. Generate access token: user.generateAuthToken()
   8. Generate refresh token (random string hoặc JWT với longer expire)
   9. Lưu refresh token vào Redis với TTL 30 days:
      - Key: `refresh_token:${user._id}`
      - Value: refresh token
   10. Return response:
       {
         success: true,
         token: access token,
         refreshToken: refresh token,
         user: { id, email, fullName, avatar, loyaltyTier }
       }

c. refreshToken
   Input: { refreshToken }

   Steps:
   1. Validate refreshToken có trong request
   2. Verify refreshToken trong Redis
   3. Get userId từ Redis key
   4. Generate new access token
   5. Return new access token

d. logout
   Input: userId (từ req.user)

   Steps:
   1. Xóa refresh token khỏi Redis
   2. Return success message

e. forgotPassword
   Input: { email }

   Steps:
   1. Tìm user bằng email
   2. Nếu không tồn tại: Return success (không reveal user existence)
   3. Generate reset token (crypto.randomBytes(32))
   4. Lưu vào Redis với TTL 1 hour:
      - Key: `reset_token:${resetToken}`
      - Value: user._id
   5. Send email với reset link: FRONTEND_URL/reset-password?token=${resetToken}
   6. Return success message

f. resetPassword
   Input: { token, newPassword }

   Steps:
   1. Lấy userId từ Redis bằng token
   2. Nếu không tồn tại hoặc expired: Return 400 Invalid/expired token
   3. Tìm user bằng userId
   4. Update password: user.password = newPassword
   5. Save user (password auto hash)
   6. Xóa reset token khỏi Redis
   7. Return success message

g. verifyEmail
   Input: { token } (từ URL param)

   Steps:
   1. Lấy userId từ Redis bằng token
   2. Tìm user và update isEmailVerified = true
   3. Xóa verification token khỏi Redis
   4. Return success hoặc redirect về login page

h. getMe
   Input: req.user (từ authenticate middleware)

   Steps:
   1. Return user info từ req.user
   2. Populate thêm thông tin nếu cần

3. Export all controller functions
```

**File: backend/src/routes/auth.routes.js**
```
Mục đích: Define auth API routes

1. Import express.Router() và auth.controller

2. Define routes:
   - POST /register - authController.register
   - POST /login - authController.login
   - POST /refresh-token - authController.refreshToken
   - POST /logout - authController.logout (protected)
   - POST /forgot-password - authController.forgotPassword
   - POST /reset-password - authController.resetPassword
   - GET /verify-email/:token - authController.verifyEmail
   - GET /me - authController.getMe (protected)

3. Apply middleware:
   - Validation middleware cho mỗi route (express-validator)
   - Authenticate middleware cho protected routes

4. Export router
```

**File: backend/src/routes/index.js**
```
Mục đích: Aggregate all routes

1. Import express.Router()
2. Import all route modules (auth.routes, user.routes, etc.)

3. Use routes:
   - router.use('/auth', authRoutes)
   - router.use('/users', userRoutes)
   - (sẽ thêm các routes khác sau)

4. Export router
```

### D. Email Service (Basic Setup)

**File: backend/src/services/email.service.js**
```
Mục đích: Send emails

1. Import nodemailer

2. Create transporter:
   - Nếu EMAIL_SERVICE = 'gmail':
     - Use Gmail SMTP
   - Nếu EMAIL_SERVICE = 'sendgrid':
     - Use SendGrid API

3. Functions:

   a. sendEmail({ to, subject, html, text })
      - Use transporter.sendMail()
      - Return result

   b. sendVerificationEmail(user, token)
      - Generate verification link
      - Create HTML email template
      - Call sendEmail()

   c. sendPasswordResetEmail(user, token)
      - Generate reset link
      - Create HTML template
      - Call sendEmail()

   d. sendBookingConfirmation(booking) - Sẽ implement sau

4. Export all functions
```

### E. Server Setup

**File: backend/src/server.js**
```
Mục đích: Entry point, start server

Implementation:

1. Import dependencies:
   - express
   - dotenv
   - cors, helmet (security middleware)
   - morgan (logger)
   - Database config
   - Redis config
   - Routes
   - Error middleware

2. Load environment variables:
   - dotenv.config()

3. Create Express app:
   - const app = express()

4. Apply global middleware:
   - app.use(express.json()) - Parse JSON body
   - app.use(express.urlencoded({ extended: true }))
   - app.use(morgan('dev')) - Log requests
   - app.use(helmet()) - Security headers
   - app.use(cors()) - CORS

5. Connect databases:
   - await connectDB() - MongoDB
   - Connect Redis client

6. Define routes:
   - app.use('/api/v1', routes) - All API routes
   - Health check: app.get('/health', (req, res) => res.send('OK'))

7. Apply error handling middleware:
   - app.use(errorHandler)

8. Start server:
   - const PORT = process.env.PORT || 5000
   - app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

9. Handle unhandled rejections:
   - process.on('unhandledRejection', (err) => { log and exit })
```

---

## 📦 BƯỚC 1.4: FRONTEND AUTHENTICATION

### A. API Service Setup

**File: frontend/src/services/api.js**
```
Mục đích: Axios instance với interceptors

Implementation:

1. Import axios

2. Create axios instance:
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     headers: { 'Content-Type': 'application/json' }
   })

3. Request interceptor:
   - Lấy token từ localStorage
   - Nếu có token: Thêm vào header Authorization: Bearer ${token}
   - Return config

4. Response interceptor:
   - Success: Return response.data
   - Error:
     - Nếu 401 (Unauthorized):
       - Try refresh token
       - Nếu refresh thành công: Retry original request
       - Nếu thất bại: Xóa token, redirect về login
     - Return Promise.reject(error)

5. Export api instance
```

**File: frontend/src/services/authApi.js**
```
Mục đích: Auth API calls

1. Import api instance

2. Functions:

   - register(data):
     - POST /auth/register với data
     - Return response

   - login(credentials):
     - POST /auth/login với { email, password }
     - Return { token, refreshToken, user }

   - logout():
     - POST /auth/logout
     - Return response

   - refreshToken(refreshToken):
     - POST /auth/refresh-token
     - Return new access token

   - forgotPassword(email):
     - POST /auth/forgot-password
     - Return response

   - resetPassword(token, password):
     - POST /auth/reset-password
     - Return response

   - getMe():
     - GET /auth/me
     - Return user info

3. Export all functions
```

### B. Zustand Auth Store

**File: frontend/src/store/authStore.js**
```
Mục đích: Manage authentication state

1. Import create from zustand
2. Import authApi

3. Create store:

   State:
   - user: null (current user object)
   - token: localStorage.getItem('token') || null
   - refreshToken: localStorage.getItem('refreshToken') || null
   - isAuthenticated: false
   - loading: false
   - error: null

   Actions:

   - login: async (credentials) => {
       - Set loading = true
       - Try: Call authApi.login(credentials)
       - On success:
         - Save token, refreshToken vào localStorage
         - Update state: user, token, refreshToken, isAuthenticated = true
       - On error:
         - Set error message
       - Set loading = false
     }

   - register: async (data) => {
       - Call authApi.register(data)
       - Handle response
     }

   - logout: async () => {
       - Call authApi.logout()
       - Clear localStorage
       - Reset state
     }

   - loadUser: async () => {
       - Nếu có token:
         - Call authApi.getMe()
         - Update user state
       - Nếu error: logout
     }

   - clearError: () => {
       - Set error = null
     }

4. Export store: export const useAuthStore = create(...)
```

### C. Custom Hooks

**File: frontend/src/hooks/useAuth.js**
```
Mục đích: Wrapper hook cho auth store

1. Import useAuthStore
2. Import useEffect

3. Custom hook:
   const useAuth = () => {
     const store = useAuthStore()

     useEffect(() => {
       // Load user on mount nếu có token
       if (store.token && !store.user) {
         store.loadUser()
       }
     }, [])

     return store
   }

4. Export useAuth
```

**File: frontend/src/hooks/useDebounce.js**
```
Mục đích: Debounce input (cho search)

Implementation:
- Input: value, delay
- Return: debounced value
- Use setTimeout và cleanup
```

### D. Auth Pages

**File: frontend/src/pages/auth/LoginPage.jsx**
```
Mục đích: Login UI

Component structure:

1. Import:
   - useState from react
   - useNavigate from react-router-dom
   - useAuth hook
   - Ant Design components: Form, Input, Button, message

2. Component LoginPage:

   State:
   - loading (local loading state)

   Hooks:
   - const navigate = useNavigate()
   - const { login, isAuthenticated, error } = useAuth()

   Effect:
   - useEffect: Nếu isAuthenticated, redirect về home

   Handler:
   - onFinish = async (values) => {
       - Set loading = true
       - Try: await login(values)
       - On success: message.success, navigate('/')
       - On error: message.error
       - Set loading = false
     }

   JSX:
   - Container div với Tailwind classes
   - Ant Design Form:
     - Form.Item cho Email (rules: required, email)
     - Form.Item cho Password (rules: required, min 6)
     - Checkbox "Remember me"
     - Submit Button (loading state)
   - Link "Forgot password?"
   - Link "Don't have account? Register"
   - Social login buttons (Google, Facebook) - placeholder

3. Export LoginPage
```

**File: frontend/src/pages/auth/RegisterPage.jsx**
```
Mục đích: Register UI

Similar structure to LoginPage:

Form fields:
- Full Name (required)
- Email (required, email format)
- Phone (required, VN phone format)
- Password (required, min 6)
- Confirm Password (required, match password)

onFinish:
- Call register API
- On success: Show success message, redirect to login

Link: "Already have account? Login"
```

**File: frontend/src/pages/auth/ForgotPasswordPage.jsx**
```
Form với email field:
- Submit: Call forgotPassword API
- Show success message: Check your email
```

### E. Protected Route Component

**File: frontend/src/components/common/ProtectedRoute.jsx**
```
Mục đích: Protect routes requiring authentication

Component:

1. Import:
   - Navigate from react-router-dom
   - useAuth

2. Component ProtectedRoute({ children }):

   const { isAuthenticated, loading } = useAuth()

   if (loading) {
     return <div>Loading...</div>
   }

   if (!isAuthenticated) {
     return <Navigate to="/login" replace />
   }

   return children

3. Export ProtectedRoute
```

### F. App Routing Setup

**File: frontend/src/App.jsx**
```
Mục đích: Setup routes

1. Import:
   - BrowserRouter, Routes, Route from react-router-dom
   - All page components
   - ProtectedRoute

2. Component App:

   return (
     <BrowserRouter>
       <Routes>
         {/* Public routes */}
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />

         {/* Customer routes */}
         <Route path="/" element={<HomePage />} />

         {/* Protected routes - sẽ thêm sau */}
         <Route path="/my-tickets" element={
           <ProtectedRoute>
             <MyTicketsPage />
           </ProtectedRoute>
         } />

         {/* Operator routes - sẽ thêm sau */}
         {/* Admin routes - sẽ thêm sau */}
         {/* Trip Manager routes - sẽ thêm sau */}
       </Routes>
     </BrowserRouter>
   )

3. Export App
```

**File: frontend/src/main.jsx**
```
1. Import React, ReactDOM, App
2. Render:
   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   )
```

---

## 📦 BƯỚC 1.5: TESTING & VALIDATION

### A. Backend Testing

**File: backend/tests/auth.test.js**
```
Mục đích: Test authentication flow

1. Import:
   - supertest
   - app (express app)
   - User model

2. Setup:
   - beforeAll: Connect test database
   - afterAll: Cleanup, close connections
   - beforeEach: Clear User collection

3. Test cases:

   describe('POST /api/v1/auth/register', () => {
     test('Should register new user', async () => {
       - Send POST với valid data
       - Expect status 201
       - Expect response có user object
       - Verify user saved in database
     })

     test('Should not register duplicate email', async () => {
       - Create user trước
       - Try register với cùng email
       - Expect status 400
     })
   })

   describe('POST /api/v1/auth/login', () => {
     test('Should login with valid credentials', async () => {
       - Create user trước
       - Send POST login
       - Expect status 200
       - Expect response có token
     })

     test('Should not login with wrong password', async () => {
       - Send POST với wrong password
       - Expect status 401
     })
   })

   describe('GET /api/v1/auth/me', () => {
     test('Should get user info with valid token', async () => {
       - Login to get token
       - Send GET /me với token in header
       - Expect status 200
       - Expect user info
     })

     test('Should not access without token', async () => {
       - Send GET /me without token
       - Expect status 401
     })
   })
```

**Chạy tests:**
```
npm test
```

### B. Input Validation

**File: backend/src/middleware/validate.middleware.js**
```
Mục đích: Validate request inputs

1. Import express-validator functions

2. Validation rules:

   - validateRegister:
     - email: isEmail, notEmpty
     - phone: matches VN phone regex
     - password: isLength min 6
     - fullName: notEmpty, trim

   - validateLogin:
     - email: isEmail
     - password: notEmpty

   - validateResetPassword:
     - newPassword: isLength min 6
     - confirmPassword: equals to newPassword

3. Validation result handler:
   - Check validation errors
   - Nếu có errors: Return 400 với error messages

4. Export validators
```

**Apply validators trong routes:**
```
routes/auth.routes.js:
- router.post('/register', validateRegister, authController.register)
- router.post('/login', validateLogin, authController.login)
```

---

## ✅ DELIVERABLES PHASE 1

Sau khi hoàn thành Phase 1, bạn có:

### Backend
- ✅ Project structure hoàn chỉnh với cấu hình chuẩn
- ✅ MongoDB connection hoạt động
- ✅ Redis connection hoạt động
- ✅ User model với password hashing
- ✅ JWT authentication hoàn chỉnh
- ✅ Auth APIs: register, login, logout, refresh token, forgot/reset password
- ✅ Security middleware: helmet, CORS, rate limiting
- ✅ Error handling middleware
- ✅ Email service setup (basic)
- ✅ Input validation
- ✅ Basic tests cho authentication

### Frontend
- ✅ React + Vite setup với Tailwind CSS + Ant Design
- ✅ Axios instance với interceptors
- ✅ Zustand auth store
- ✅ Login page hoạt động
- ✅ Register page hoạt động
- ✅ Forgot password page
- ✅ Protected route component
- ✅ Router setup

### Testing
- ✅ Backend có thể chạy: npm run dev
- ✅ Frontend có thể chạy: npm run dev
- ✅ User có thể register account
- ✅ User có thể login và nhận token
- ✅ Protected routes redirect về login nếu chưa auth

---

# PHASE 2: ROUTE & BUS MANAGEMENT

**Thời gian:** 2 tuần
**Độ ưu tiên:** 🔴 Cao (Critical)

## MỤC TIÊU PHASE 2
Xây dựng hệ thống quản lý nhà xe, tuyến đường, xe và nhân viên

---

## 📦 BƯỚC 2.1: BUS OPERATOR MANAGEMENT

### A. BusOperator Model

**File: backend/src/models/BusOperator.js**
```
Mục đích: Schema cho nhà xe

Schema fields:

Company Information:
- companyName: { type: String, required: true, unique: true, trim: true }
- businessLicense: { type: String, required: true, unique: true }
- taxCode: { type: String, required: true, unique: true }
- email: { type: String, required: true, unique: true, lowercase: true }
- phone: { type: String, required: true }
- password: { type: String, required: true, select: false }

Address:
- address: {
    street: String,
    city: String,
    province: String,
    postalCode: String
  }

Representative:
- representative: {
    name: { type: String, required: true },
    position: String,
    phone: String,
    email: String,
    idCard: String
  }

Bank Information:
- bankInfo: {
    bankName: String,
    accountNumber: String,
    accountName: String,
    branch: String
  }

Media:
- logo: { type: String }
- coverImage: { type: String }
- description: { type: String }

Verification:
- verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
- verificationDocuments: [{
    type: { type: String, enum: ['business_license', 'tax_certificate', 'other'] },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
- rejectionReason: { type: String }

Status:
- isActive: { type: Boolean, default: true }
- isSuspended: { type: Boolean, default: false }
- suspensionReason: { type: String }

Statistics:
- rating: { type: Number, default: 0, min: 0, max: 5 }
- totalReviews: { type: Number, default: 0 }
- totalTrips: { type: Number, default: 0 }
- totalBookings: { type: Number, default: 0 }
- totalRevenue: { type: Number, default: 0 }

Timestamps:
- createdAt, updatedAt

Indexes:
- email (unique)
- companyName (unique)
- businessLicense (unique)
- verificationStatus + isActive (compound)

Pre-save hook:
- Hash password nếu modified

Methods:
- comparePassword(password): Verify password
- generateAuthToken(): Generate JWT (role: 'operator')
```

### B. Operator Controller

**File: backend/src/controllers/operator.controller.js**
```
Mục đích: Handle operator operations

Functions:

1. register
   Input: {
     companyName, businessLicense, taxCode,
     email, phone, password,
     address, representative, bankInfo,
     documents (files)
   }

   Steps:
   - Validate all required fields
   - Check email, companyName, businessLicense, taxCode chưa tồn tại
   - Upload verification documents lên Cloudinary
   - Create new BusOperator với verificationStatus = 'pending'
   - Send email notification về việc chờ duyệt
   - Return response

2. login
   Input: { email, password }

   Steps:
   - Tìm operator bằng email (select password)
   - Verify password
   - Check verificationStatus = 'approved'
   - Check isActive = true, isSuspended = false
   - Generate JWT token
   - Generate refresh token, lưu Redis
   - Return token và operator info

3. getProfile (protected)
   - Return operator info từ req.user

4. updateProfile (protected)
   Input: { address, bankInfo, description, logo, coverImage }

   Steps:
   - Tìm operator
   - Upload new logo/cover nếu có
   - Update allowed fields
   - Save
   - Return updated operator

5. getDashboardStats (protected)
   - Aggregate statistics:
     - Total revenue (today, this month, this year)
     - Total bookings
     - Total trips
     - Upcoming trips
     - Average rating
   - Return stats object
```

### C. Operator Routes

**File: backend/src/routes/operator.routes.js**
```
Routes:

Public:
- POST /operators/register
- POST /operators/login

Protected (operatorAuth middleware):
- GET /operators/me/profile
- PUT /operators/me/profile
- GET /operators/me/dashboard/stats

Sub-routes (sẽ thêm sau):
- /operators/routes (Phase 2.2)
- /operators/buses (Phase 2.3)
- /operators/trips (Phase 3)
- /operators/employees (Phase 2.4)
```

### D. Operator Auth Middleware

**File: backend/src/middleware/operatorAuth.middleware.js**
```
Mục đích: Authenticate operator

Similar to auth.middleware.js:
- Verify JWT token
- Find BusOperator by userId
- Check verificationStatus = 'approved'
- Check isActive, not isSuspended
- Attach operator vào req.operator
```

### E. Frontend: Operator Registration

**File: frontend/src/pages/operator/OperatorRegisterPage.jsx**
```
Mục đích: Multi-step registration form

Structure:

1. Use Ant Design Steps component

2. Step 1: Company Information
   Fields:
   - Company Name
   - Business License Number
   - Tax Code
   - Email
   - Phone
   - Password, Confirm Password

3. Step 2: Representative Information
   Fields:
   - Full Name
   - Position
   - Phone
   - Email
   - ID Card Number

4. Step 3: Business Address & Bank Info
   Fields:
   - Street Address
   - City (select)
   - Province (select)
   - Bank Name (select)
   - Account Number
   - Account Name
   - Branch

5. Step 4: Upload Documents
   - Business License (image/PDF)
   - Tax Certificate (image/PDF)
   - Other documents (optional)

   Use Ant Design Upload component

6. Step 5: Review & Submit
   - Display all info for review
   - Edit button (go back to step)
   - Submit button

Handlers:
- onNext: Validate current step, move to next
- onPrev: Go back
- onSubmit: Call API register operator
- Show success modal: "Registration submitted, waiting for approval"
```

**File: frontend/src/pages/operator/OperatorLoginPage.jsx**
```
Similar to customer LoginPage:
- Different styling/branding
- After login, redirect to /operator/dashboard
- Save token riêng cho operator
```

---

## 📦 BƯỚC 2.2: ROUTE MANAGEMENT

### A. Route Model

**File: backend/src/models/Route.js**
```
Schema fields:

Operator:
- operator: { type: Schema.Types.ObjectId, ref: 'BusOperator', required: true }

Origin:
- origin: {
    city: { type: String, required: true },
    province: { type: String, required: true },
    stationName: String,
    stationAddress: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }

Destination:
- destination: {
    city: { type: String, required: true },
    province: { type: String, required: true },
    stationName: String,
    stationAddress: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }

Pickup Points (max 20):
- pickupPoints: [{
    name: { type: String, required: true },
    address: String,
    coordinates: { lat: Number, lng: Number },
    timeOffset: { type: Number, default: 0 } // minutes from departure
  }]

Dropoff Points (max 20):
- dropoffPoints: [{
    name: { type: String, required: true },
    address: String,
    coordinates: { lat: Number, lng: Number },
    timeOffset: { type: Number, default: 0 } // minutes from departure
  }]

Stops/Waypoints (max 15):
- stops: [{
    name: String,
    address: String,
    coordinates: { lat: Number, lng: Number },
    stopDuration: { type: Number, default: 15 } // minutes
  }]

Distance & Duration:
- distance: { type: Number, required: true } // km
- estimatedDuration: { type: Number, required: true } // minutes

Status:
- isActive: { type: Boolean, default: true }

Timestamps:
- createdAt, updatedAt

Indexes:
- operator + origin.city + destination.city (compound)
- isActive
```

### B. Route Controller

**File: backend/src/controllers/route.controller.js**
```
Functions:

1. createRoute (protected, operator)
   Input: {
     origin, destination,
     pickupPoints, dropoffPoints,
     stops, distance, estimatedDuration
   }

   Steps:
   - Validate input
   - Check pickupPoints max 20
   - Check dropoffPoints max 20
   - Check stops max 15
   - Tính distance bằng Google Maps API (optional)
   - Create route với operator = req.operator._id
   - Return created route

2. getRoutes (protected, operator)
   Query params: page, limit, search, isActive

   Steps:
   - Find routes của operator hiện tại
   - Filter theo isActive nếu có
   - Search theo origin.city, destination.city
   - Paginate
   - Return routes + pagination info

3. getRouteById (protected, operator)
   - Find route by ID
   - Check belongs to operator
   - Return route

4. updateRoute (protected, operator)
   - Find route
   - Check belongs to operator
   - Update allowed fields
   - Return updated route

5. deleteRoute (protected, operator)
   - Find route
   - Check không có trip nào đang active
   - Soft delete (set isActive = false)
   - Return success
```

### C. Route Routes

**File: backend/src/routes/route.routes.js**
```
Protected routes (operatorAuth):
- POST /operators/routes
- GET /operators/routes
- GET /operators/routes/:id
- PUT /operators/routes/:id
- DELETE /operators/routes/:id

Mount in operator.routes.js
```

### D. Frontend: Route Management

**File: frontend/src/pages/operator/RoutesPage.jsx**
```
Structure:

1. Header:
   - Title "Routes Management"
   - Button "Add New Route"

2. Filters:
   - Search box (search by city)
   - Filter by status (All, Active, Inactive)

3. Routes Table (Ant Design Table):
   Columns:
   - Origin (city, province)
   - Destination (city, province)
   - Distance (km)
   - Duration (hours)
   - Pickup Points (count)
   - Dropoff Points (count)
   - Status (Active/Inactive badge)
   - Actions (Edit, Delete icons)

   Pagination

4. Handlers:
   - useEffect: Fetch routes on mount
   - handleSearch: Filter routes
   - handleAdd: Open modal/form
   - handleEdit: Open modal với route data
   - handleDelete: Confirm và delete
```

**File: frontend/src/components/operator/RouteFormModal.jsx**
```
Form Modal cho Create/Edit Route:

Structure:
- Modal với title "Add Route" hoặc "Edit Route"
- Form với các fields:

Section 1: Origin
- City (autocomplete từ danh sách cities VN)
- Province (auto-fill based on city)
- Station Name
- Station Address
- Map picker (optional) để chọn coordinates

Section 2: Destination
- Similar to Origin

Section 3: Pickup Points
- Dynamic list (Add/Remove buttons)
- Each point:
  - Name
  - Address
  - Time offset (minutes)

Section 4: Dropoff Points
- Similar to Pickup Points

Section 5: Stops (optional)
- Dynamic list
- Each stop:
  - Name
  - Address
  - Stop duration (minutes)

Section 6: Distance & Duration
- Distance (km) - input hoặc auto-calculate từ Google Maps
- Estimated Duration (hours:minutes)

Buttons:
- Cancel
- Submit (Create/Update)

Handlers:
- onFinish: Validate và call API
- addPickupPoint: Add new pickup point
- removePickupPoint: Remove point
- (similar cho dropoff và stops)
```

---

## 📦 BƯỚC 2.3: BUS MANAGEMENT

### A. Bus Model

**File: backend/src/models/Bus.js**
```
Schema fields:

Operator:
- operator: { type: Schema.Types.ObjectId, ref: 'BusOperator', required: true }

Basic Info:
- busNumber: { type: String, required: true, unique: true, trim: true, uppercase: true }
- busType: {
    type: String,
    required: true,
    enum: ['limousine', 'sleeper', 'seater', 'double_decker']
  }

Seat Layout Configuration:
- seatLayout: {
    floors: { type: Number, required: true, min: 1, max: 2 },
    totalSeats: { type: Number, required: true },
    layout: {
      floor1: [[ // 2D array representing seat map
        {
          seatNumber: String,  // e.g., "A1"
          type: { type: String, enum: ['seat', 'aisle', 'empty', 'driver'] }
        }
      ]],
      floor2: [[ // Nếu có floor 2
        { seatNumber: String, type: String }
      ]]
    }
  }

Amenities:
- amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'toilet', 'tv', 'water', 'blanket', 'pillow', 'charger', 'reclining_seat']
  }]

Vehicle Details:
- manufacturer: String
- model: String
- yearOfManufacture: Number
- licensePlate: String (same as busNumber)

Media:
- images: [{ type: String }] // Array of image URLs

Status:
- status: {
    type: String,
    enum: ['active', 'maintenance', 'retired'],
    default: 'active'
  }
- maintenanceNotes: String

Timestamps

Indexes:
- operator + status
- busNumber (unique)
```

### B. Bus Controller

**File: backend/src/controllers/bus.controller.js**
```
Functions:

1. createBus (protected, operator)
   Input: {
     busNumber, busType,
     seatLayout,
     amenities,
     manufacturer, model, yearOfManufacture,
     images (files)
   }

   Steps:
   - Validate input
   - Check busNumber chưa tồn tại
   - Validate seatLayout structure
   - Upload images lên Cloudinary
   - Create bus với operator = req.operator._id
   - Return created bus

2. getBuses (protected, operator)
   Query: page, limit, status, busType

   - Find buses của operator
   - Filter theo status, busType
   - Paginate
   - Return buses

3. getBusById (public - để customer xem khi booking)
   - Find bus
   - Populate operator info
   - Return bus với seat layout

4. updateBus (protected, operator)
   - Find bus, check belongs to operator
   - Upload new images nếu có
   - Update fields
   - Return updated bus

5. deleteBus (protected, operator)
   - Find bus
   - Check không có trip nào đang active
   - Soft delete (status = 'retired')
   - Return success
```

### C. Frontend: Bus Management

**File: frontend/src/pages/operator/BusesPage.jsx**
```
Structure:

1. Header với "Add New Bus" button

2. Filters:
   - Search by bus number
   - Filter by type (All, Limousine, Sleeper, etc.)
   - Filter by status (Active, Maintenance, Retired)

3. Bus Grid/Cards:
   - Grid layout
   - Each card:
     - Bus image (carousel nếu nhiều ảnh)
     - Bus number (large, bold)
     - Type badge
     - Total seats
     - Amenities icons
     - Status badge
     - Actions: Edit, Delete, Configure Seats

4. Handlers:
   - Fetch buses
   - Filter/search
   - Open create modal
   - Open edit modal
   - Delete bus
```

**File: frontend/src/components/operator/BusFormModal.jsx**
```
Form sections:

1. Basic Information
   - Bus Number (input, uppercase)
   - Bus Type (select)
   - Manufacturer
   - Model
   - Year of Manufacture

2. Amenities
   - Checkboxes cho mỗi amenity
   - Grid layout với icons

3. Images Upload
   - Ant Design Upload với drag & drop
   - Preview uploaded images
   - Max 5 images

4. Button "Configure Seat Layout"
   - Opens SeatLayoutBuilder modal

Submit: Save bus info
```

**File: frontend/src/components/operator/SeatLayoutBuilder.jsx**
```
Mục đích: Interactive seat map builder

Structure:

1. Configuration Panel (Left sidebar):
   - Number of floors (1 or 2)
   - Rows (input)
   - Columns (input)
   - Auto-generate layout button

2. Canvas (Main area):
   - Grid representing bus layout
   - Each cell có thể là:
     - Seat (click to label: A1, A2, B1, etc.)
     - Aisle (walkway)
     - Empty (không dùng)
     - Driver position

   - Toolbar:
     - Select mode (seat, aisle, empty)
     - Eraser
     - Auto-label seats (alphabetically)

   - Floors tabs (nếu 2 floors)

3. Preview Panel (Right sidebar):
   - Total seats count
   - Seat layout preview (như customer sẽ thấy)

4. Buttons:
   - Cancel
   - Save Layout

Implementation:
- Use HTML5 Canvas hoặc SVG
- Drag & drop seats
- Click to change cell type
- Save layout as JSON structure
```

---

## 📦 BƯỚC 2.4: EMPLOYEE MANAGEMENT

### A. Employee Model

**File: backend/src/models/Employee.js**
```
Schema fields:

Operator:
- operator: { type: Schema.Types.ObjectId, ref: 'BusOperator', required: true }

Basic Info:
- employeeId: { type: String, required: true, unique: true }
- fullName: { type: String, required: true }
- email: { type: String, required: true, lowercase: true }
- phone: { type: String, required: true }
- password: { type: String, required: true, select: false }

Role:
- role: {
    type: String,
    required: true,
    enum: ['driver', 'trip_manager']
  }

Personal Info:
- dateOfBirth: Date
- gender: { type: String, enum: ['male', 'female', 'other'] }
- address: {
    street: String,
    city: String,
    province: String
  }
- idCard: String
- avatar: String

Driver-specific (chỉ nếu role = driver):
- driverLicense: {
    licenseNumber: String,
    licenseClass: String, // B1, B2, C, D, E, etc.
    issueDate: Date,
    expiryDate: Date,
    issuingAuthority: String
  }

Work Info:
- hireDate: { type: Date, default: Date.now }
- isActive: { type: Boolean, default: true }
- assignedTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]

Timestamps

Indexes:
- employeeId (unique)
- operator + role
- email

Pre-save hook:
- Hash password
- Auto-generate employeeId: ${operator.companyCode}-${role}-${number}

Methods:
- comparePassword(password)
```

### B. Employee Controller

**File: backend/src/controllers/employee.controller.js**
```
Functions:

1. createEmployee (protected, operator)
   Input: {
     fullName, email, phone, password,
     role, dateOfBirth, gender,
     idCard, avatar,
     driverLicense (nếu driver)
   }

   Steps:
   - Validate input
   - Check email chưa tồn tại
   - Generate employeeId
   - Create employee
   - Send email với login credentials
   - Return employee

2. getEmployees (protected, operator)
   Query: page, limit, role, isActive

   - Find employees của operator
   - Filter theo role, isActive
   - Paginate
   - Return employees

3. getEmployeeById (protected, operator)
   - Find employee
   - Return details

4. updateEmployee (protected, operator)
   - Find employee
   - Update fields
   - Return updated

5. deleteEmployee (protected, operator)
   - Check không có assigned trips
   - Soft delete (isActive = false)
   - Return success

6. employeeLogin
   Input: { employeeId, password }

   - Find employee by employeeId
   - Verify password
   - Check isActive
   - Generate JWT với role
   - Return token + employee info
```

### C. Frontend: Employee Management

**File: frontend/src/pages/operator/EmployeesPage.jsx**
```
Structure:

1. Tabs:
   - Drivers
   - Trip Managers

2. Each tab has:
   - "Add Employee" button
   - Table:
     Columns:
     - Avatar
     - Employee ID
     - Full Name
     - Email
     - Phone
     - Status (Active/Inactive)
     - Actions (Edit, Delete, View Details)

3. Handlers:
   - Switch tabs
   - Fetch employees by role
   - Add employee
   - Edit employee
```

**File: frontend/src/components/operator/EmployeeFormModal.jsx**
```
Form:

1. Basic Info:
   - Full Name
   - Email
   - Phone
   - Password (for new employee)
   - Role (select: Driver, Trip Manager)

2. Personal Info:
   - Date of Birth
   - Gender
   - ID Card Number
   - Address

3. Driver License (show only if role = driver):
   - License Number
   - License Class (select)
   - Issue Date
   - Expiry Date

4. Avatar upload

Submit: Create/Update employee
```

---

## 📦 BƯỚC 2.5: OPERATOR DASHBOARD LAYOUT

### A. Dashboard Layout Component

**File: frontend/src/components/operator/OperatorLayout.jsx**
```
Structure:

1. Layout with Sidebar + Header + Content

2. Sidebar:
   - Logo
   - Menu items:
     - Dashboard (icon: DashboardOutlined)
     - Routes (icon: EnvironmentOutlined)
     - Buses (icon: CarOutlined)
     - Trips (icon: CalendarOutlined)
     - Employees (icon: UserOutlined)
     - Reports (icon: BarChartOutlined)
     - Vouchers (icon: TagOutlined)
     - Settings (icon: SettingOutlined)

   - Active menu highlight
   - Collapsible sidebar

3. Header:
   - Breadcrumb
   - Search (global)
   - Notifications (icon + badge)
   - Operator name + avatar
   - Dropdown menu:
     - Profile
     - Settings
     - Logout

4. Content Area:
   - {children} (page content)

Use Ant Design Layout components
```

**File: frontend/src/pages/operator/OperatorDashboard.jsx**
```
Dashboard overview (placeholder, sẽ hoàn thiện Phase 5):

1. Stats Cards Row:
   - Total Revenue (icon: dollar)
   - Total Trips (icon: car)
   - Total Bookings (icon: ticket)
   - Average Rating (icon: star)

2. Charts Row:
   - Revenue chart (line/bar)
   - Bookings trend

3. Upcoming Trips Table:
   - Next 10 trips
   - Quick view

Sẽ implement chi tiết ở Phase 5
```

---

## ✅ DELIVERABLES PHASE 2

Sau khi hoàn thành Phase 2:

### Backend
- ✅ BusOperator model và authentication
- ✅ Operator registration với approval workflow
- ✅ Route model và CRUD APIs
- ✅ Bus model với flexible seat layout
- ✅ Employee model và management
- ✅ Operator dashboard stats API (basic)

### Frontend
- ✅ Operator registration page (multi-step)
- ✅ Operator login page
- ✅ Operator dashboard layout với sidebar
- ✅ Routes management page
- ✅ Route form modal
- ✅ Buses management page
- ✅ Bus form modal
- ✅ Seat layout builder (interactive)
- ✅ Employees management page
- ✅ Employee form modal

### Testing
- ✅ Operator có thể đăng ký
- ✅ Admin có thể approve operator (manual - sẽ có UI ở Phase 6)
- ✅ Operator có thể login và access dashboard
- ✅ Operator có thể quản lý routes (CRUD)
- ✅ Operator có thể quản lý buses với seat layout
- ✅ Operator có thể quản lý employees

---

# PHASE 3: BOOKING SYSTEM

**Thời gian:** 3 tuần
**Độ ưu tiên:** 🔴 Cao (Critical)

## MỤC TIÊU PHASE 3
Xây dựng core booking flow: tìm kiếm → chọn ghế → thanh toán

---

## 📦 BƯỚC 3.1: TRIP SCHEDULING

### A. Trip Model

**File: backend/src/models/Trip.js**
```
Schema fields:

References:
- operator: { type: Schema.Types.ObjectId, ref: 'BusOperator', required: true }
- route: { type: Schema.Types.ObjectId, ref: 'Route', required: true }
- bus: { type: Schema.Types.ObjectId, ref: 'Bus', required: true }
- driver: { type: Schema.Types.ObjectId, ref: 'Employee' }
- tripManager: { type: Schema.Types.ObjectId, ref: 'Employee' }

Schedule:
- departureTime: { type: Date, required: true }
- arrivalTime: { type: Date, required: true }

Pricing:
- pricing: {
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    finalPrice: { type: Number },
    dynamicPricingEnabled: { type: Boolean, default: false },
    dynamicPricingRules: {
      // Rules for dynamic pricing based on occupancy, time, etc.
      lowDemand: { threshold: 30, discount: 10 }, // <30% occupied: 10% discount
      highDemand: { threshold: 80, markup: 20 }    // >80% occupied: 20% markup
    }
  }

Seat Availability:
- seatAvailability: {
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number },
    bookedSeats: [{ type: String }], // Array of seat numbers: ["A1", "A2", ...]
    lockedSeats: [{
      seatNumber: String,
      lockedBy: String, // userId or sessionId
      lockedAt: Date,
      expiresAt: Date
    }]
  }

Status:
- status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  }

Journey Tracking:
- journeyTracking: {
    currentLocation: {
      lat: Number,
      lng: Number,
      lastUpdated: Date
    },
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: Schema.Types.ObjectId, ref: 'Employee' }
    }]
  }

Policies:
- cancellationPolicy: {
    rules: [{
      hoursBeforeDeparture: Number,
      refundPercentage: Number
    }]
  }

Timestamps

Indexes:
- route + departureTime (compound)
- status
- departureTime

Virtual fields:
- occupancyRate: (bookedSeats.length / totalSeats) * 100

Pre-save hook:
- Calculate finalPrice based on dynamic pricing
- Calculate availableSeats = totalSeats - bookedSeats.length
```

### B. Trip Controller - Operator Side

**File: backend/src/controllers/trip.controller.js**
```
Functions cho Operator:

1. createTrip (protected, operator)
   Input: {
     routeId, busId, driverId, tripManagerId,
     departureTime, arrivalTime,
     basePrice, discount,
     cancellationPolicy
   }

   Steps:
   - Validate input
   - Check route, bus, driver, tripManager tồn tại và belongs to operator
   - Check bus chưa được assign cho trip khác trong cùng time range
   - Check driver chưa có trip trong cùng time range
   - Copy totalSeats từ bus.seatLayout.totalSeats
   - Initialize seatAvailability
   - Calculate finalPrice
   - Create trip
   - Update employee assignedTrips
   - Return created trip

2. createRecurringTrips (protected, operator)
   Input: {
     tripTemplate: { routeId, busId, ... },
     recurringConfig: {
       frequency: 'daily' | 'weekly',
       daysOfWeek: [0,1,2,3,4,5,6], // Nếu weekly
       startDate: Date,
       endDate: Date,
       departureTime: '08:00' // Time string
     }
   }

   Steps:
   - Validate template
   - Generate list of dates theo config
   - For each date:
     - Create trip với template data
     - Set departureTime = date + time
     - Calculate arrivalTime
   - Batch insert trips
   - Return created trips count

3. getTrips (protected, operator)
   Query: page, limit, startDate, endDate, routeId, status

   - Find trips của operator
   - Filter theo query params
   - Populate route, bus, driver info
   - Sort by departureTime
   - Paginate
   - Return trips

4. getTripById (protected, operator)
   - Find trip
   - Populate all refs
   - Return trip details

5. updateTrip (protected, operator)
   - Find trip
   - Check không có bookings (hoặc chỉ cho update một số fields)
   - Update fields
   - Return updated trip

6. cancelTrip (protected, operator)
   - Find trip
   - Get all bookings của trip
   - For each booking:
     - Calculate refund (100% nếu operator cancel)
     - Process refund
     - Update booking status = cancelled
     - Send notification
   - Update trip status = cancelled
   - Return success
```

### C. Trip Routes - Operator

```
Backend routes:

Protected (operatorAuth):
- POST /operators/trips
- POST /operators/trips/recurring
- GET /operators/trips
- GET /operators/trips/:id
- PUT /operators/trips/:id
- DELETE /operators/trips/:id
```

### D. Frontend: Trip Scheduling

**File: frontend/src/pages/operator/TripsPage.jsx**
```
Structure:

1. View modes:
   - Calendar view (Ant Design Calendar)
   - List view (Table)

2. Filters:
   - Date range picker
   - Route (select)
   - Status (select)

3. Buttons:
   - "Create Trip"
   - "Create Recurring Trips"

4. Calendar View:
   - Display trips as events
   - Click date to see trips
   - Click trip to view details

5. List View:
   - Table columns:
     - Departure Time
     - Route (origin → destination)
     - Bus
     - Driver
     - Seats (booked/total)
     - Status
     - Actions

Handlers:
- Fetch trips
- Filter
- Create trip
- Edit trip
- Cancel trip
```

**File: frontend/src/components/operator/TripFormModal.jsx**
```
Form sections:

1. Route & Vehicle:
   - Route (select dropdown - fetch operator's routes)
   - Bus (select - filter available buses)
   - Driver (select - filter available drivers)
   - Trip Manager (select)

2. Schedule:
   - Departure Date
   - Departure Time
   - Arrival Time (calculate based on route duration)

3. Pricing:
   - Base Price (input)
   - Discount % (optional)
   - Final Price (auto-calculate, display)
   - Enable Dynamic Pricing (checkbox)

4. Cancellation Policy:
   - Dynamic rules list:
     - Hours before departure
     - Refund percentage
   - Add/Remove rules

Submit:
- Validate time conflicts
- Create trip
```

**File: frontend/src/components/operator/RecurringTripModal.jsx**
```
Form:

1. Trip Template:
   - Same fields as TripFormModal
   - Except date (sẽ generate)

2. Recurring Configuration:
   - Frequency (radio: Daily, Weekly)
   - Days of Week (checkboxes, nếu weekly)
   - Date Range (start - end)
   - Departure Time (time picker)

3. Preview:
   - Table showing generated trips
   - Columns: Date, Departure Time, Arrival Time
   - Total trips count

Submit:
- Create all trips
- Show progress bar
- Display result
```

---

## 📦 BƯỚC 3.2: TRIP SEARCH (PUBLIC API)

### A. Trip Search API

**File: backend/src/controllers/trip.controller.js (thêm public functions)**
```
Public functions:

1. searchTrips (public)
   Query params:
   - from: origin city (required)
   - to: destination city (required)
   - date: departure date (required)
   - seats: number of seats needed (default: 1)

   Optional filters:
   - busType: limousine, sleeper, etc.
   - minPrice, maxPrice
   - departureTimeFrom, departureTimeTo (time range)
   - amenities: array of amenity names
   - minRating: minimum operator rating

   Sort:
   - sortBy: price, departureTime, rating (default: departureTime)
   - order: asc, desc (default: asc)

   Pagination:
   - page (default: 1)
   - limit (default: 10)

   Steps:
   1. Find routes matching origin and destination cities
   2. Find trips của routes đó:
      - departureTime trong ngày specified (00:00 - 23:59)
      - status = 'scheduled'
      - availableSeats >= seats requested
   3. Populate operator, bus, route
   4. Apply filters:
      - busType: filter bus.busType
      - Price range: filter trip.pricing.finalPrice
      - Time range: filter departureTime
      - Amenities: filter bus.amenities includes all requested
      - Rating: filter operator.rating >= minRating
   5. Sort theo sortBy
   6. Paginate
   7. Return trips với:
      - Trip info
      - Route info (origin, destination, pickup/dropoff points)
      - Bus info (type, amenities, seat layout)
      - Operator info (name, logo, rating)
      - Available seats

2. getTripDetails (public)
   Params: tripId

   - Find trip by ID
   - Populate all refs
   - Get real-time seat availability (từ Redis + DB)
   - Return full trip details

3. getDynamicPrice (public)
   Params: tripId, seats

   - Find trip
   - Calculate price based on:
     - Current occupancy rate
     - Time until departure
     - Number of seats requested
   - Return calculated price
```

### B. Trip Search Routes

```
Public routes:

- GET /trips/search
- GET /trips/:id
- GET /trips/:id/dynamic-price
```

### C. Frontend: Search & Listing

**File: frontend/src/pages/customer/HomePage.jsx**
```
Structure:

1. Hero Section:
   - Background image (bus/travel)
   - Heading: "Đặt vé xe khách nhanh chóng, tiện lợi"
   - Search form (prominent):
     - From city (autocomplete)
     - To city (autocomplete)
     - Date (date picker, min: today)
     - Number of seats (number input, 1-6)
     - Search button (large, primary)

2. Popular Routes Section:
   - Grid of route cards:
     - Hanoi → Danang
     - HCMC → Dalat
     - Etc.
   - Click to search

3. Featured Operators:
   - Carousel of operator logos
   - Rating stars

4. How It Works:
   - 3 steps visual:
     1. Search & Select
     2. Book & Pay
     3. Get E-ticket

5. Benefits:
   - Icons + text:
     - Fast booking
     - Secure payment
     - E-ticket
     - 24/7 support

Handler:
- handleSearch:
  - Validate inputs
  - Navigate to /search với query params
```

**File: frontend/src/pages/customer/SearchResultsPage.jsx**
```
Structure:

1. Search Summary Header:
   - Display: "Hanoi → Danang, Dec 25, 2 seats"
   - Edit search button
   - X results found

2. Sidebar (Filters):
   - Departure Time:
     - Morning (6-12)
     - Afternoon (12-18)
     - Evening (18-24)
     - Night (0-6)
   - Price Range (slider)
   - Bus Type (checkboxes)
   - Amenities (checkboxes)
   - Operator Rating (stars)
   - "Apply Filters" button

3. Main Content:
   - Sort dropdown: Price, Time, Rating
   - Trip Cards (list):
     Each card:
     - Left: Operator logo
     - Middle:
       - Operator name + rating
       - Departure time → Arrival time (duration)
       - Route: Origin → Destination
       - Bus type + amenities icons
     - Right:
       - Price (strikethrough original if discount)
       - Available seats: X seats left
       - "Select Seats" button (primary)

     - Click card → Expand details:
       - Full route with pickup/dropoff points
       - Bus images carousel
       - Detailed amenities list
       - Reviews preview

   - Pagination
   - Empty state (nếu no results):
     - Friendly message
     - Suggestions (change date, route)

4. Loading state (skeleton cards)

Handlers:
- useEffect: Fetch trips on mount with query params
- handleFilter: Apply filters, re-fetch
- handleSort: Sort trips
- handleSelectSeats: Navigate to /trips/:id
```

**File: frontend/src/services/tripApi.js**
```
API functions:

- searchTrips(params): GET /trips/search
- getTripById(id): GET /trips/:id
- getDynamicPrice(tripId, seats): GET /trips/:id/dynamic-price
```

---

## 📦 BƯỚC 3.3: SEAT SELECTION & LOCKING

### A. Seat Lock Service (Redis)

**File: backend/src/services/seatLock.service.js**
```
Functions:

1. lockSeats(tripId, seats, userId/sessionId)
   Input: tripId, seats array, identifier

   Steps:
   - For each seat:
     - Check seat available (không bị booked trong DB)
     - Check seat không bị locked trong Redis
     - Nếu available:
       - Create Redis key: `seat_lock:${tripId}:${seatNumber}`
       - Value: JSON.stringify({ lockedBy: identifier, lockedAt: Date.now() })
       - TTL: 15 minutes (900 seconds)
     - Nếu unavailable: Throw error
   - Emit socket event 'seats_locked'
   - Return success

2. unlockSeats(tripId, seats, identifier)
   - Verify seats locked by identifier
   - Delete Redis keys
   - Emit socket event 'seats_unlocked'

3. extendLock(tripId, seats, identifier)
   - Verify seats locked by identifier
   - Reset TTL to 15 minutes
   - Return new expiry time

4. getLockedSeats(tripId)
   - Get all keys matching `seat_lock:${tripId}:*`
   - Parse values
   - Return array of locked seat objects

5. checkSeatAvailability(tripId, seats)
   - Find trip, get bookedSeats
   - Get lockedSeats from Redis
   - Check seats not in bookedSeats or lockedSeats
   - Return boolean for each seat
```

### B. WebSocket Setup

**File: backend/src/services/websocket.service.js**
```
Socket.IO events:

1. Connection:
   - io.on('connection', (socket) => { ... })

2. Join trip room:
   - socket.on('join_trip', (tripId) => {
       socket.join(`trip:${tripId}`)
     })

3. Leave trip room:
   - socket.on('leave_trip', (tripId) => {
       socket.leave(`trip:${tripId}`)
     })

4. Broadcast events:
   - emitSeatsLocked(tripId, seats):
     io.to(`trip:${tripId}`).emit('seats_locked', { seats })

   - emitSeatsUnlocked(tripId, seats):
     io.to(`trip:${tripId}`).emit('seats_unlocked', { seats })

   - emitSeatsBooked(tripId, seats):
     io.to(`trip:${tripId}`).emit('seats_booked', { seats })

Export functions
```

**Setup trong server.js:**
```
1. Import socket.io
2. Create io server:
   const io = require('socket.io')(server, {
     cors: { origin: FRONTEND_URL }
   })
3. Pass io to websocket service
```

### C. Booking Hold API

**File: backend/src/controllers/booking.controller.js (tạo mới)**
```
Functions:

1. holdSeats (public, with guestAuth)
   Input: { tripId, seats: ["A1", "A2"] }

   Steps:
   - Validate tripId, seats
   - Get userId or sessionId từ req
   - Call seatLock.lockSeats(tripId, seats, identifier)
   - Return:
     {
       success: true,
       holdId: generated UUID,
       expiresAt: timestamp + 15 min,
       seats: seats array
     }

2. getAvailableSeats (public)
   Params: tripId

   - Find trip
   - Get bookedSeats from trip
   - Get lockedSeats from Redis
   - Get bus seatLayout
   - Return seat map với availability:
     {
       seatNumber: "A1",
       status: "available" | "booked" | "locked" | "unavailable"
     }
```

### D. Frontend: Seat Selection

**File: frontend/src/pages/customer/TripDetailPage.jsx**
```
Structure:

1. Trip Summary Section:
   - Breadcrumb: Home > Search > Trip Details
   - Route: Origin → Destination
   - Departure Date & Time
   - Duration, Distance
   - Operator info (logo, name, rating)

2. Bus Information:
   - Images carousel
   - Bus type
   - Amenities (icons + labels)

3. Pricing Information:
   - Base price per seat
   - Discount (if any)
   - Final price
   - Available seats count

4. Pickup & Dropoff Points:
   - Tabs or accordion
   - List of points với addresses

5. Seat Selection Section (sticky):
   - Heading: "Select Your Seats"
   - SeatMapComponent (interactive)
   - Selected seats display (chips)
   - Total price calculation
   - Countdown timer (nếu đã lock seats)
   - "Continue to Booking" button

6. Reviews Section (preview):
   - Recent reviews
   - Rating breakdown
   - "See all reviews" link

7. Cancellation Policy:
   - Collapsible section
   - Policy rules table

State:
- trip (trip details)
- selectedSeats (array)
- lockedSeats (array)
- totalPrice (calculated)
- holdExpiry (timestamp)
- socket (WebSocket connection)

Handlers:
- useEffect: Fetch trip details
- useEffect: Connect socket, join trip room
- handleSeatSelect: Add/remove seat from selection
- handleContinue: Lock seats, navigate to passenger info
- Socket listeners:
  - seats_locked: Update UI
  - seats_unlocked: Update UI
  - seats_booked: Update UI
```

**File: frontend/src/components/customer/SeatMapComponent.jsx**
```
Props:
- seatLayout (from bus)
- availableSeats (real-time status)
- selectedSeats (array)
- onSeatSelect (callback)
- maxSeats (6)

Structure:

1. Floor tabs (nếu 2 floors)

2. Legend:
   - Available (green box)
   - Booked (gray box)
   - Locked (yellow box)
   - Selected (blue box)
   - Driver/Aisle (icon)

3. Seat Grid:
   - Render theo seatLayout matrix
   - Each cell:
     - Nếu type = 'seat':
       - Seat component:
         - Seat number (A1, A2, ...)
         - Class name based on status:
           - available: green, clickable
           - booked: gray, disabled
           - locked: yellow, disabled
           - selected: blue, clickable
         - onClick: Toggle selection

     - Nếu type = 'aisle':
       - Empty space (walkway)

     - Nếu type = 'driver':
       - Steering wheel icon

4. Styling:
   - Grid layout (CSS Grid hoặc Flexbox)
   - Responsive
   - Touch-friendly (mobile)

Handlers:
- handleSeatClick(seatNumber):
  - Check status available
  - Check max seats not exceeded
  - Toggle selection
  - Call onSeatSelect callback
```

---

## 📦 BƯỚC 3.4: BOOKING FLOW

### A. Booking Model

**File: backend/src/models/Booking.js**
```
Schema đã mô tả ở phần overview, implement chi tiết:

Fields:
- bookingCode (unique, indexed)
- user (ref, optional)
- trip (ref, required, indexed)
- seats (array of passenger objects)
- contactInfo
- pickupPoint, dropoffPoint
- pricing
- voucher (ref, optional)
- paymentStatus (enum, indexed)
- paymentMethod
- status (enum)
- holdExpiryTime
- guestSession

Methods:
- calculateTotal(): Calculate total price
- isExpired(): Check if hold expired
- canCancel(): Check cancellation policy
```

### B. Booking Controller

**File: backend/src/controllers/booking.controller.js**
```
Functions:

1. createBooking (guestAuth - cho phép cả user và guest)
   Input: {
     tripId,
     seats: [{
       seatNumber,
       passenger: { fullName, phone, idCard, email }
     }],
     pickupPointId,
     dropoffPointId,
     contactEmail, contactPhone (required nếu guest),
     voucherCode (optional)
   }

   Steps:
   1. Validate input
   2. Find trip, populate route
   3. Verify seats still locked by current user/session:
      - Call seatLock service
      - Nếu không locked: Return error "Seats expired"
   4. Validate pickup/dropoff points tồn tại trong route
   5. Validate voucher (nếu có):
      - Find voucher by code
      - Check valid, not expired
      - Check usage limit
      - Calculate discount
   6. Calculate pricing:
      - basePrice = trip.pricing.finalPrice
      - subtotal = basePrice * seats.length
      - voucherDiscount = apply voucher logic
      - finalTotal = subtotal - voucherDiscount
   7. Create booking:
      - Generate bookingCode: BK + timestamp + random
      - status = 'pending'
      - paymentStatus = 'pending'
      - holdExpiryTime = now + 15 min
      - Save passenger info for each seat
   8. Save booking
   9. Return booking object với bookingCode

2. confirmBooking (internal, gọi từ payment callback)
   Input: bookingId

   Steps:
   1. Find booking
   2. Update status = 'confirmed'
   3. Update paymentStatus = 'paid'
   4. Update trip.seatAvailability:
      - Add seats to bookedSeats
      - Decrease availableSeats
   5. Unlock seats từ Redis
   6. Emit socket event 'seats_booked'
   7. Generate ticket (sẽ implement Phase 4)
   8. Send email/SMS notification (Phase 4)
   9. Update voucher usage (nếu có)
   10. Return success

3. getBookingByCode (public)
   Input: { bookingCode, email }

   - Find booking by bookingCode
   - Verify email matches (contactInfo.email hoặc user.email)
   - Populate trip, route
   - Return booking details

4. getMyBookings (protected, user)
   Query: status (upcoming, past, cancelled), page, limit

   - Find bookings của user
   - Filter:
     - upcoming: trip.departureTime >= now, status = confirmed
     - past: trip.departureTime < now
     - cancelled: status = cancelled
   - Populate trip, route, ticket
   - Sort by trip.departureTime
   - Paginate
   - Return bookings

5. cancelBooking (guestAuth)
   Input: bookingId

   Steps:
   1. Find booking, populate trip
   2. Verify belongs to user/session
   3. Check booking.canCancel() (chưa departed)
   4. Calculate refund theo cancellation policy:
      - Hours until departure
      - Apply policy rules
   5. Update booking status = 'cancelled'
   6. Release seats:
      - Remove from trip.bookedSeats
      - Increase availableSeats
   7. Initiate refund (nếu đã paid):
      - Call payment service refund
   8. Send notification
   9. Return refund amount
```

### C. Booking Routes

```
- POST /bookings (create)
- POST /bookings/hold-seats (hold seats)
- GET /bookings/code/:code (lookup)
- GET /bookings/my-bookings (protected)
- POST /bookings/:id/cancel
```

### D. Frontend: Passenger Info Page

**File: frontend/src/pages/customer/PassengerInfoPage.jsx**
```
Prerequisites:
- User đã select seats từ TripDetailPage
- Seats đã được locked
- Có holdId và expiry time

Structure:

1. Progress Steps:
   - Select Seats (completed)
   - Passenger Info (active)
   - Payment
   - Confirmation

2. Countdown Timer (sticky header):
   - "Complete booking in XX:XX"
   - Red warning nếu < 5 min

3. Trip Summary (sidebar):
   - Route
   - Departure date/time
   - Bus info
   - Selected seats (chips)
   - Pickup/Dropoff points (editable)

4. Contact Information (nếu guest):
   - Email (required)
   - Phone (required)

5. Passenger Information:
   - For each selected seat:
     - Card/Panel: "Seat A1"
     - Full Name (required)
     - Phone (required)
     - ID Card (required)
     - Email (optional)

     - Nếu logged in user:
       - Button "Load from saved passengers"
       - Select từ saved passengers list

6. Pickup & Dropoff Selection:
   - Pickup Point (select từ route.pickupPoints)
   - Dropoff Point (select từ route.dropoffPoints)

7. Voucher Code:
   - Input field
   - "Apply" button
   - Display discount nếu valid
   - Error message nếu invalid

8. Pricing Summary:
   - Base price × seats
   - Voucher discount (nếu có)
   - Final total (large, bold)

9. Buttons:
   - "Back to Seat Selection"
   - "Continue to Payment" (primary, large)

State:
- contactInfo
- passengers (array)
- pickupPoint, dropoffPoint
- voucherCode, voucherDiscount
- loading
- countdown (seconds)

Handlers:
- useEffect: Start countdown timer
- useEffect: Warn nếu countdown gần hết
- handlePassengerChange: Update passenger info
- handleApplyVoucher: Validate voucher
- handleContinue:
  - Validate all fields
  - Create booking
  - Navigate to payment page

Validation:
- All required fields filled
- Phone format valid
- ID card format valid
- Email format valid (nếu có)
```

### E. Frontend: Payment Page

**File: frontend/src/pages/customer/PaymentPage.jsx**
```
Prerequisites:
- Booking đã created với status = 'pending'
- Có bookingCode

Structure:

1. Progress Steps:
   - Select Seats (completed)
   - Passenger Info (completed)
   - Payment (active)
   - Confirmation

2. Countdown Timer (sticky)

3. Booking Summary (sidebar):
   - Trip info
   - Passengers list
   - Pricing breakdown
   - Booking code

4. Payment Method Selection:
   - Radio group:
     - VNPay (logo)
     - MoMo (logo)
     - ZaloPay (logo)
     - ATM Card (logo)
     - Credit Card (logo)
     - Cash on Bus (nếu operator allows)

   - Selected method hiển thị instructions

5. Terms & Conditions:
   - Checkbox: "I agree to terms"
   - Link to terms modal

6. Buttons:
   - "Back"
   - "Pay Now" (disabled nếu chưa agree)

Handlers:
- handleSelectMethod: Set payment method
- handlePayNow:
  - Call API create payment
  - Receive payment URL
  - Redirect: window.location.href = paymentUrl
```

---

## 📦 BƯỚC 3.5: PAYMENT INTEGRATION

### A. Payment Models & Services

**File: backend/src/models/Payment.js**
```
Schema đã mô tả ở overview, implement:

Fields:
- booking (ref, indexed)
- transactionId (unique, từ gateway)
- amount
- paymentMethod
- gatewayResponse (object, lưu full response)
- status (enum)
- paidAt
- refundId (nếu có refund)
- refundedAt

Timestamps
```

**File: backend/src/services/vnpay.service.js**
```
VNPay integration:

1. Config:
   - TMN_CODE: Merchant code
   - HASH_SECRET: Secret key
   - URL: Payment URL
   - RETURN_URL: Callback URL

2. createPaymentUrl(booking)
   Input: booking object

   Steps:
   - Prepare params:
     - vnp_TmnCode
     - vnp_Amount (amount * 100)
     - vnp_OrderInfo (booking description)
     - vnp_OrderType
     - vnp_ReturnUrl
     - vnp_TxnRef (bookingCode)
     - vnp_IpAddr
     - vnp_CreateDate (YYYYMMDDHHmmss)
   - Sort params alphabetically
   - Create signature: HMAC SHA512
   - Build URL query string
   - Return full payment URL

3. verifyCallback(query)
   Input: callback query params

   Steps:
   - Extract vnp_SecureHash từ query
   - Remove vnp_SecureHash khỏi params
   - Sort params
   - Create signature với HASH_SECRET
   - Compare signatures
   - Verify vnp_ResponseCode = '00' (success)
   - Return { isValid: boolean, data: parsed data }
```

**Tương tự cho MoMo, ZaloPay services**

### B. Payment Controller

**File: backend/src/controllers/payment.controller.js**
```
Functions:

1. createPayment (guestAuth)
   Input: { bookingId, paymentMethod }

   Steps:
   1. Find booking, check status = 'pending'
   2. Check not expired
   3. Create Payment record với status = 'pending'
   4. Generate payment URL based on method:
      - vnpay: vnpay.service.createPaymentUrl(booking)
      - momo: momo.service.createPayment(booking)
      - zalopay: zalopay.service.createPayment(booking)
   5. Return payment URL

2. handleVNPayCallback (public)
   Input: query params từ VNPay redirect

   Steps:
   1. Verify callback signature
   2. Extract bookingCode từ vnp_TxnRef
   3. Find booking by bookingCode
   4. Find payment record
   5. Update payment:
      - transactionId = vnp_TransactionNo
      - gatewayResponse = full query
      - status = vnp_ResponseCode === '00' ? 'success' : 'failed'
      - paidAt = now (nếu success)
   6. Nếu success:
      - Call booking.confirmBooking()
   7. Nếu failed:
      - Update booking status = 'cancelled'
      - Release seats
   8. Redirect về frontend:
      - Success: FRONTEND_URL/booking/success?bookingCode=xxx
      - Failed: FRONTEND_URL/booking/failed?reason=xxx

3. handleMoMoCallback (tương tự)

4. handleRefund (internal)
   Input: paymentId, amount, reason

   - Find payment
   - Call gateway refund API
   - Update payment với refund info
   - Return result
```

### C. Payment Routes

```
- POST /payments/create
- GET /payments/vnpay/callback
- POST /payments/vnpay/ipn (VNPay IPN)
- GET /payments/momo/callback
- POST /payments/momo/ipn
(Tương tự cho các gateways khác)
```

### D. Frontend: Payment Callbacks

**File: frontend/src/pages/customer/PaymentSuccessPage.jsx**
```
Structure:

1. Success Icon (large checkmark)

2. Message:
   - "Payment Successful!"
   - "Your booking has been confirmed"

3. Booking Information:
   - Booking Code (large, bold)
   - Trip details
   - Passenger names
   - Total paid

4. Next Steps:
   - "E-ticket has been sent to your email"
   - "You can download your ticket below"

5. Buttons:
   - "Download Ticket" (primary)
   - "View Booking Details"
   - "Back to Home"

useEffect:
- Fetch booking details by code (từ query param)
```

**File: frontend/src/pages/customer/PaymentFailedPage.jsx**
```
Structure:

1. Error Icon

2. Message:
   - "Payment Failed"
   - Reason (từ query param)

3. Information:
   - "Your seats have been released"
   - "You can try booking again"

4. Buttons:
   - "Try Again" (back to search)
   - "Back to Home"
```

---

## 📦 BƯỚC 3.6: GUEST BOOKING SUPPORT

### A. Guest Session Service

**File: backend/src/services/guestSession.service.js**
```
Functions:

1. createGuestSession()
   - Generate unique sessionId: uuid()
   - Lưu vào Redis:
     - Key: `guest_session:${sessionId}`
     - Value: { createdAt: Date.now() }
     - TTL: 1 hour
   - Return sessionId

2. validateGuestSession(sessionId)
   - Check sessionId tồn tại trong Redis
   - Return boolean

3. extendGuestSession(sessionId)
   - Reset TTL to 1 hour
```

### B. Guest Auth Middleware

**File: backend/src/middleware/guestAuth.middleware.js**
```
Mục đích: Allow cả authenticated user và guest

Middleware guestAuth:
1. Check Authorization header có JWT không
2. Nếu có JWT:
   - Verify JWT
   - Load user
   - Attach req.user
   - Set req.isGuest = false
3. Nếu không có JWT:
   - Check header X-Guest-Session-Id
   - Validate guest session
   - Attach req.sessionId
   - Set req.isGuest = true
4. Call next()

Nếu cả 2 đều không có: Return 401
```

### C. Update Booking Logic

```
Trong booking.controller.js:

- createBooking:
  - Nếu req.user: Set booking.user = req.user._id
  - Nếu req.isGuest: Set booking.guestSession = req.sessionId
  - Require contactEmail, contactPhone nếu guest

- getBookingByCode:
  - Verify email matches
  - Không cần authentication

- cancelBooking:
  - Check ownership:
    - Nếu user: booking.user == req.user._id
    - Nếu guest: booking.guestSession == req.sessionId
```

### D. Frontend: Guest Flow

**File: frontend/src/services/guestApi.js**
```
Functions:

- createGuestSession(): POST /guest/session
- Store sessionId in localStorage
```

**Trong authStore.js:**
```
Thêm state:
- guestSessionId: localStorage.getItem('guestSessionId')

Thêm action:
- initGuestSession: async () => {
    if (!token && !guestSessionId) {
      const sessionId = await guestApi.createGuestSession()
      localStorage.setItem('guestSessionId', sessionId)
      set({ guestSessionId: sessionId })
    }
  }
```

**Trong api.js interceptor:**
```
Request interceptor:
- Nếu có token: Add Authorization header
- Nếu không có token nhưng có guestSessionId:
  - Add X-Guest-Session-Id header
```

**Trong PassengerInfoPage:**
```
- Nếu không login:
  - Show banner: "Booking as guest"
  - Show link: "Have an account? Login for faster booking"
  - Require contact email, phone
  - Call initGuestSession nếu chưa có
```

### E. Guest Booking Lookup

**File: frontend/src/pages/customer/GuestBookingLookupPage.jsx**
```
Structure:

1. Form:
   - Booking Code (input)
   - Email or Phone (input)
   - "Look Up" button

2. Handler:
   - Submit: Call API getBookingByCode
   - Display booking details modal

3. Booking Details Modal:
   - Trip info
   - Passenger info
   - Booking status
   - Download ticket button
   - Cancel booking button (nếu allowed)
```

---

## ✅ DELIVERABLES PHASE 3

Sau khi hoàn thành Phase 3:

### Backend
- ✅ Trip model với seat availability tracking
- ✅ Trip scheduling APIs (single + recurring)
- ✅ Trip search API với filters & sort
- ✅ Seat locking service (Redis) với 15 min TTL
- ✅ WebSocket cho real-time seat updates
- ✅ Booking model và APIs
- ✅ Payment integration (VNPay + others)
- ✅ Guest session management
- ✅ Voucher validation (basic)

### Frontend
- ✅ Trip scheduling page (operator)
- ✅ Recurring trip creation
- ✅ Home page với search form
- ✅ Search results page với filters
- ✅ Trip detail page
- ✅ Interactive seat map với real-time updates
- ✅ Passenger info form
- ✅ Payment method selection
- ✅ Payment success/failed pages
- ✅ Guest booking support
- ✅ Guest booking lookup

### Testing
- ✅ Operator có thể tạo trips
- ✅ Customer có thể search trips
- ✅ Seat selection hoạt động real-time
- ✅ Seats bị lock trong 15 phút
- ✅ Booking flow hoàn chỉnh
- ✅ Payment integration hoạt động
- ✅ Guest có thể book vé
- ✅ Voucher discount được apply

---

## 🎯 KẾT LUẬN PART 1

Sau khi hoàn thành 3 phases đầu tiên, bạn đã có:

### MVP Core System
✅ **Hoàn chỉnh flow đặt vé từ đầu đến cuối:**
- Tìm kiếm chuyến xe
- Xem chi tiết và chọn ghế
- Nhập thông tin hành khách
- Thanh toán
- Nhận booking confirmation

### Infrastructure
✅ **Backend:**
- MongoDB + Redis hoạt động
- JWT authentication cho 3 roles: Customer, Operator, Employee
- WebSocket cho real-time updates
- Payment gateway integration
- Security middleware đầy đủ

✅ **Frontend:**
- 3 web apps riêng biệt: Customer, Operator, (Trip Manager & Admin sẽ ở Part 2-3)
- Responsive UI với Ant Design + Tailwind
- Real-time seat availability
- State management với Zustand

### Sẵn sàng cho Phase 4
Tiếp theo sẽ implement:
- Electronic ticket với QR code
- Email/SMS notifications
- Trip manager QR scanner
- Ticket cancellation & refund

---

**File này cover Phases 1-3 chi tiết. Tiếp tục với Part 2 (Phases 4-5) trong file riêng.**
