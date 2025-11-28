const mongoose = require('mongoose');
const logger = require('./utils/logger');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGODB_URI;

    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.success(`MongoDB Đã kết nối: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on('error', (err) => {
      logger.error('Lỗi khi kết nối MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error(' Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
