const express = require('express');
const cors = require('cors');
const path = require('path');

// Import middleware
const { 
  errorHandler, 
  notFoundHandler, 
  requestLogger, 
  corsOptions 
} = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Request logging
app.use(requestLogger);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
}

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AWS re:Invent Sessions API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AWS re:Invent Conference Sessions API',
    version: '1.0.0',
    endpoints: {
      sessions: {
        'GET /api/sessions': 'Get all sessions (paginated)',
        'GET /api/sessions/:id': 'Get session by ID with speakers',
        'GET /api/sessions/search': 'Search sessions with filters'
      },
      speakers: {
        'GET /api/speakers': 'Get all speakers (paginated)',
        'GET /api/speakers/:id': 'Get speaker by ID with sessions'
      },
      schedule: {
        'POST /api/schedule': 'Add session to user schedule',
        'GET /api/schedule/:userId': 'Get user schedule',
        'DELETE /api/schedule/:scheduleId': 'Remove session from schedule'
      },
      utility: {
        'GET /api/metadata': 'Get session types, tracks, and levels',
        'GET /health': 'Health check endpoint'
      }
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Serve frontend for any other route in production (SPA fallback)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER
// ============================================

// Start server
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 AWS re:Invent Sessions API Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Documentation: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
