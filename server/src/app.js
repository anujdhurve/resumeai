require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/db');

// Connect to MongoDB
connectDB();

const app = express();

// Core middleware — MUST come before any routes
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Debug logger (optional, remove once confirmed working)
app.use((req, res, next) => {
  console.log('Method:', req.method, '| Path:', req.path, '| Body:', req.body);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'ResumeAI API is running 🚀' });
});

// Routes — now correctly placed AFTER all middleware
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const resumeRoutes = require('./routes/resume.routes');
app.use('/api/resume', resumeRoutes);

const historyRoutes = require('./routes/history.routes');
app.use('/api/history', historyRoutes);

const profileRoutes = require('./routes/profile.routes');
app.use('/api/profile', profileRoutes);

module.exports = app;