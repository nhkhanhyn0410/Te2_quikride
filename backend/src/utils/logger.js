const fs = require('fs');
const path = require('path');

/**
 * Simple logger utility
 * For production, consider using Winston or Pino
 */

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, process.env.LOG_FILE || 'app.log');
const errorLogFile = path.join(logsDir, 'error.log');

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 * @returns {string} - Formatted log message
 */
const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
};

/**
 * Write log to file
 * @param {string} file - Log file path
 * @param {string} message - Log message
 */
const writeLog = (file, message) => {
  fs.appendFile(file, message, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

/**
 * Logger object
 */
const logger = {
  /**
   * Info level log
   */
  info: (message, meta = {}) => {
    const log = formatLog('info', message, meta);
    console.log(log);
    if (process.env.NODE_ENV !== 'test') {
      writeLog(logFile, log);
    }
  },

  /**
   * Error level log
   */
  error: (message, meta = {}) => {
    const log = formatLog('error', message, meta);
    console.error(log);
    if (process.env.NODE_ENV !== 'test') {
      writeLog(errorLogFile, log);
      writeLog(logFile, log);
    }
  },

  /**
   * Warning level log
   */
  warn: (message, meta = {}) => {
    const log = formatLog('warn', message, meta);
    console.warn(log);
    if (process.env.NODE_ENV !== 'test') {
      writeLog(logFile, log);
    }
  },

  /**
   * Debug level log
   */
  debug: (message, meta = {}) => {
    if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV === 'development') {
      const log = formatLog('debug', message, meta);
      console.log(log);
      if (process.env.NODE_ENV !== 'test') {
        writeLog(logFile, log);
      }
    }
  },
};

module.exports = logger;
