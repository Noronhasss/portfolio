const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    // If no MongoDB URI provided, run in "offline mode" (no DB required for testing)
    if (!mongoURI) {
      console.warn('⚠️  MONGODB_URI not set - running without database');
      console.log('📝 Messages will NOT be saved (database disabled)');
      return false;
    }

    // Try to connect to MongoDB Atlas
    console.log('🔌 Attempting MongoDB connection...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Connected to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
    return true;

  } catch (error) {
    // Log specific error types
    console.error('❌ MongoDB connection error:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.error('   └─ Network issue: Check your internet connection');
    }
    if (error.name === 'MongoAuthenticationError') {
      console.error('   └─ Auth issue: Invalid credentials in MongoDB Atlas');
    }
    if (error.name === 'MongoParseError') {
      console.error('   └─ Parse error: Invalid connection string format');
    }
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   └─ Connection refused: MongoDB server not running');
    }
    
    console.error('⚠️  Running without database - features limited');
    return false;
  }
};

module.exports = { connectDB };
