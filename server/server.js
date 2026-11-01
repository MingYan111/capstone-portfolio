/**
 * Local server entry point.
 * Loads the Express app, connects to MongoDB, then listens.
 */
require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error('Failed to start server (database connection failed).');
    process.exit(1);
  });
