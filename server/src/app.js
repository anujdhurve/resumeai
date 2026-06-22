const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./utils/db');


// Connect to MongoDB
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'ResumeAI API is running 🚀' });
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const resumeRoutes = require('./routes/resume.routes');
app.use('/api/resume', resumeRoutes);

const historyRoutes = require('./routes/history.routes');
app.use('/api/history', historyRoutes);

module.exports = app;