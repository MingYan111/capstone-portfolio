/**
 * Vercel serverless entry point.
 * Reuses the same Express app; maintains the MongoDB connection across
 * warm invocations (Mongoose buffers queries until the connection is ready).
 */
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('../app');

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  }).catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
}

module.exports = app;
