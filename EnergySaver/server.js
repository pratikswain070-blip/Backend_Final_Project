const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');
const setupSwagger = require('./swagger/swagger');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const readingRoutes = require('./routes/readingRoutes');
const limitRoutes = require('./routes/limitRoutes');
const alertRoutes = require('./routes/alertRoutes');
const compareRoutes = require('./routes/compareRoutes');
const reportRoutes = require('./routes/reportRoutes');
const tipRoutes = require('./routes/tipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

// Setup Socket.io
socketHandler(io);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/homes', homeRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/limits', limitRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Swagger API Documentation
setupSwagger(app);

// Serve Frontend Dashboard directly
app.use(express.static(path.join(__dirname, 'frontend')));

// API Info route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to EnergySaver API - Smart Home Energy Manager',
    docs: '/api-docs',
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  EnergySaver Server running on port ${PORT}`);
    console.log(`  API:     http://localhost:${PORT}`);
    console.log(`  Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`========================================\n`);
  });
});
