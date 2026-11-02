/**
 * Netlify Functions entry point.
 * Wraps the same Express app with serverless-http and maintains the
 * MongoDB connection across warm invocations.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = require('../../app');

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
}

exports.handler = serverless(app);
