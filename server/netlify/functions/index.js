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

const handler = serverless(app);

exports.handler = async (event, context) => {
  // TEMPORARY diagnostic endpoint - removed after diagnosis
  if (event.path === '/__diag' || (event.queryStringParameters && event.queryStringParameters.diag === '1')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mongo_uri_set: !!process.env.MONGODB_URI,
        admin_email_set: !!process.env.ADMIN_EMAIL,
        jwt_set: !!process.env.JWT_SECRET,
        node_version: process.version,
        mongoose_state: mongoose.connection.readyState,
      }),
    };
  }
  return handler(event, context);
};
