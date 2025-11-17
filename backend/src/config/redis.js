const redis = require('redis');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB, 10) || 0,
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis Ready');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis Reconnecting...');
    });

    await redisClient.connect();

    // Test connection
    await redisClient.set('test', 'QuikRide Redis Connection OK');
    const testValue = await redisClient.get('test');
    console.log('✅ Redis Test:', testValue);

    return redisClient;
  } catch (error) {
    console.error('❌ Error connecting to Redis:', error.message);
    // Don't exit process, Redis is not critical for initial setup
    // process.exit(1);
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

module.exports = connectRedis;
module.exports.getRedisClient = getRedisClient;
