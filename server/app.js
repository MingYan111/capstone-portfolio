/**
 * Express app (framework only — no listening).
 * Used locally by server.js and on Vercel by api/index.js.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// ---------- Middleware ----------
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.json({
    name: 'Portfolio & Blog API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      projects: ['GET /api/projects', 'POST /api/projects', 'PUT /api/projects/:id', 'DELETE /api/projects/:id'],
      skills: ['GET /api/skills', 'POST /api/skills', 'PUT /api/skills/:id', 'DELETE /api/skills/:id'],
      messages: ['POST /api/messages', 'GET /api/messages', 'DELETE /api/messages/:id'],
      posts: ['GET /api/posts', 'GET /api/posts/:id', 'POST /api/posts', 'PUT /api/posts/:id', 'DELETE /api/posts/:id'],
      comments: ['GET /api/posts/:postId/comments', 'POST /api/posts/:postId/comments', 'DELETE /api/comments/:id'],
    },
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api', require('./routes/comments'));

// ---------- 404 & error handler ----------
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
