import mongoose from 'mongoose';

// IMPORTANT: Remove hard‑coded credentials for production; rely on env only.
// Provide a very minimal unsafe fallback ONLY for local dev if env not set (can be deleted).
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const start = Date.now();
    // Connection tuning for unstable / mobile hotspot networks:
    const baseOpts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 8000, // fail fast
      socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 20000,
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 10,
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 0,
      heartbeatFrequencyMS: Number(process.env.MONGO_HEARTBEAT_MS) || 10000,
      retryWrites: true,
      family: 4, // prefer IPv4 (mobile carriers occasionally break IPv6 DNS)
    };

    // Optional direct connection fallback if SRV lookups are flaky
    let uriToUse = MONGODB_URI;
    if (process.env.MONGODB_DIRECT_FALLBACK === 'true' && /mongodb\+srv:/.test(MONGODB_URI)) {
      // Add &directConnection=true (Mongo driver will ignore if not applicable)
      uriToUse = MONGODB_URI.includes('?') ? `${MONGODB_URI}&directConnection=true` : `${MONGODB_URI}?directConnection=true`;
    }

    cached.promise = mongoose.connect(uriToUse, baseOpts).then((mongooseInstance) => {
      const ms = Date.now() - start;
      console.log(`MongoDB connected in ${ms} ms (pool size target ${baseOpts.maxPoolSize})`);
      return mongooseInstance;
    }).catch((error) => {
      console.error('MongoDB initial connection error:', error?.message || error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('MongoDB connection failed:', e?.message || e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Extra diagnostic listeners (only once)
if (!mongoose.connection.listeners('error').length) {
  mongoose.connection.on('error', (err) => {
    console.error('[Mongoose connection error]', err?.message || err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[Mongoose] disconnected');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('[Mongoose] reconnected');
  });
}

export default connectDB;
