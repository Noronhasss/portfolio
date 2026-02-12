/* =============================================
   BACKEND - MAIN SERVER FILE
   Express.js setup with CORS, middleware, routes
   ============================================= */

// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const contactRoutes = require('./routes/contacts');

// Initialize Express app
const app = express();

// ===== MIDDLEWARE SETUP =====

// Enable CORS (Cross-Origin Resource Sharing)
// Allows frontend to make requests from different origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ===== LOGGING MIDDLEWARE =====
// Simple request logging for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== ROUTES =====

// Health check endpoint - used to verify server is running
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint to verify backend is working
app.get('/api/test', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend API is working',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Contact form API routes
// All routes start with /api/contacts
app.use('/api/contacts', contactRoutes);

// ===== ERROR HANDLING MIDDLEWARE =====

// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ===== SERVER STARTUP =====

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Function to start the server
const startServer = async () => {
    try {
        // Verify critical environment variables
        console.log('📋 Checking environment variables...');
        
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn('⚠️  Email credentials missing - email feature will not work');
        }
        
        // Attempt to connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        const dbConnected = await connectDB();
        
        const dbStatus = dbConnected ? '✅ Connected' : '⚠️  Offline (fallback mode)';
        
        // Start Express server regardless of database connection
        // Server runs with limited functionality if DB is unavailable
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════╗
║   PORTFOLIO API SERVER STARTED        ║
╚════════════════════════════════════════╝
🚀 Server running on: http://localhost:${PORT}
📧 API: http://localhost:${PORT}/api
💾 Database: ${dbStatus}
📋 Environment: ${process.env.NODE_ENV || 'development'}
📝 Health check: http://localhost:${PORT}/health
            `);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⚠️  Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n⚠️  Server shutting down gracefully...');
    process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

module.exports = app;
