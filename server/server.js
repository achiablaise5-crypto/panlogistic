/**
 * Pan Logistics API Server
 * Main entry point for the backend API
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const trackingRoutes = require('./routes/tracking');
const contactRoutes = require('./routes/contact');

const User = require('./models/User');
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const { testConnection } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================================================
// MIDDLEWARE
// ==========================================================================

// Security headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        // In production, you should add your actual domain here
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            // Local development
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5500',
            'http://localhost',
            'http://127.0.0.1',
            // Vercel deployments (add your actual Vercel URL when deploying)
            'https://pan-logistics.vercel.app',
            'https://pan-logistics-ca.vercel.app',
            // Add your custom domain when ready
            // 'https://panlogistics.ca',
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // In development, allow all; in production, deny unauthorized origins
            if (process.env.NODE_ENV === 'production') {
                console.log(`CORS blocked origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            } else {
                callback(null, true); // Allow all for testing in development
            }
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (in development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}

// ==========================================================================
// STATIC FILES (Frontend)
// ==========================================================================

// Serve static files from the parent directory (where HTML files are)
app.use(express.static(path.join(__dirname, '..')));

// Serve static files from css and js directories
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/image', express.static(path.join(__dirname, '..', 'image')));

// ==========================================================================
// API ROUTES
// ==========================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Pan Logistics API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/contact', contactRoutes);

// Admin stats endpoint
app.get('/api/admin/stats', async (req, res) => {
    try {
        const bookingStats = await Booking.getStatistics();
        const unreadMessages = await Contact.getUnreadCount();
        
        res.json({
            success: true,
            data: {
                bookings: bookingStats,
                messages: { unread: unreadMessages }
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});

// Seed admin user (run once to create default admin)
app.post('/api/admin/seed', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = {
            email: 'admin@panlogistics.ca',
            password: hashedPassword,
            name: 'Pan Logistics Admin',
            role: 'admin',
            created_at: new Date().toISOString()
        };
        
        // Store in Supabase
        const { supabase } = require('./config/supabase');
        const { data, error } = await supabase
            .from('users')
            .upsert([adminUser], { onConflict: 'email' })
            .select();
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Admin user created successfully',
            credentials: {
                email: 'admin@panlogistics.ca',
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating admin user'
        });
    }
});

// Setup tables endpoint
app.post('/api/admin/setup', async (req, res) => {
    try {
        const { supabase } = require('./config/supabase');
        
        // Create users table
        await supabase.rpc('create_users_table');
        
        res.json({
            success: true,
            message: 'Tables created successfully'
        });
    } catch (error) {
        // Table creation via RPC failed - user needs to run SQL manually
        res.json({
            success: false,
            message: 'Please run the SQL schema manually in Supabase Dashboard',
            sql_file: 'server/database/supabase-schema.sql',
            error: error.message
        });
    }
});

// ==========================================================================
// FRONTEND ROUTES
// ==========================================================================

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve admin-login.html
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin-login.html'));
});

// Serve admin-dashboard.html
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin-dashboard.html'));
});

// ==========================================================================
// ERROR HANDLING
// ==========================================================================

// 404 handler - redirect to index.html for SPA behavior
app.use((req, res) => {
    // If it's an API request, return JSON
    if (req.path.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            message: 'Endpoint not found'
        });
    } else {
        // Otherwise, redirect to index.html
        res.redirect('/');
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'Internal server error'
    });
});

// ==========================================================================
// DATABASE INITIALIZATION & SERVER START
// ==========================================================================

const initializeDatabase = async () => {
    try {
        console.log('Checking database connection...');
        
        // Test connection
        const connected = await testConnection();
        if (!connected) {
            console.error('❌ Database connection failed');
            process.exit(1);
        }
        
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

const startServer = async () => {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Pan Logistics API Server                             ║
║                                                            ║
║   Status: Running                                         ║
║   Port: ${PORT}                                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║                                                            ║
║   Endpoints:                                               ║
║   - Health: GET /api/health                               ║
║   - Auth: POST /api/auth/login                             ║
║   - Bookings: POST /api/bookings/create                   ║
║   - Tracking: GET /api/tracking/:trackingNumber           ║
║   - Contact: POST /api/contact                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
    });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Start the server
startServer();

// Export for testing
module.exports = app;
