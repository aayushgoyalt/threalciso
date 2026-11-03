import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    let uri = process.env.MONGODB_URI;

    // Check if we need in-memory fallback in dev/test when URI is missing or unreachable
    if (!uri) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ No MONGODB_URI set. Launching in-memory MongoDB fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        process.env.MONGODB_URI = uri;
      } else {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
      }
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        return m;
      })
      .catch(async (err) => {
        // If connecting to localhost failed in development, fallback to MongoMemoryServer
        if (process.env.NODE_ENV !== 'production' && !uri.includes('mongodb.net')) {
          console.warn('⚠️ Failed to connect to local MongoDB. Launching in-memory MongoDB fallback...', err.message);
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const memoryUri = mongod.getUri();
          process.env.MONGODB_URI = memoryUri;
          return mongoose.connect(memoryUri, opts);
        }
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    global.mongooseCache = cached;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

