/**
 * Netlify Functions entry point.
 * Wraps the same Express app with serverless-http and ensures the MongoDB
 * connection is ready before serving requests (avoids cold-start buffer timeouts).
 */
require('dotenv').config();

const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = require('../../app');

const connectPromise = process.env.MONGODB_URI
  ? mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    })
  : Promise.resolve();

const handler = serverless(app);

exports.handler = async (event, context) => {
  try {
    await connectPromise;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Database connection failed', error: err.message }),
    };
  }
  return handler(event, context);
};
