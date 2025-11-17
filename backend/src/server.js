const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import configurations
const connectDB = require('./config/database');
const connectRedis = require('./config/redis');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const operatorRoutes = require('./routes/operator.routes');
const adminRoutes = require('./routes/admin.routes');
const routeRoutes = require('./routes/route.routes');
const busRoutes = require('./routes/bus.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');
const {
  sanitizeData,
  preventXSS,
  preventHPP,
  setSecurityHeaders,
  sanitizeRequest,
  detectAttackPatterns,
} = require('./middleware/security.middleware');
const { validateOrigin } = require('./middleware/csrf.middleware');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Connect to Redis
connectRedis();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Additional security headers
app.use(setSecurityHeaders);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(sanitizeData());

// Data sanitization against XSS
app.use(preventXSS());

// Prevent parameter pollution
app.use(preventHPP());

// Custom request sanitization
app.use(sanitizeRequest);

// Detect attack patterns
app.use(detectAttackPatterns);

// Validate origin for state-changing requests
app.use(validateOrigin);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // 100 requests per minute
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'QuikRide API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'QuikRide API v1',
    version: '1.0.0',
    documentation: `/api/${API_VERSION}/docs`,
  });
});

// Mount routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/operators`, operatorRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/routes`, routeRoutes);
app.use(`/api/${API_VERSION}/buses`, busRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở chế độ ${process.env.NODE_ENV} trên port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/${API_VERSION}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

module.exports = app;
