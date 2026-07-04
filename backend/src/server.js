require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// Main health route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      message: 'Server is healthy and running',
      timestamp: new Date().toISOString()
    }
  });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];
  
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };
