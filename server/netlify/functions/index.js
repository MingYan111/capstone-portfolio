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

const net = require('net');
const dns = require('dns').promises;

async function tcpTest(host, port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port, timeout: 4000 });
    const done = (r) => { try { sock.destroy(); } catch (e) {} resolve(r); };
    sock.on('connect', () => done('OK'));
    sock.on('error', (e) => done('ERR:' + (e.code || e.message)));
    sock.on('timeout', () => done('TIMEOUT'));
  });
}

const handler = serverless(app);

exports.handler = async (event, context) => {
  // TEMPORARY diagnostic endpoint - removed after diagnosis
  if (event.path === '/__diag' || (event.queryStringParameters && event.queryStringParameters.diag === '1')) {
    const h0 = 'ac-5nivzwm-shard-00-00.6stgtah.mongodb.net';
    const h1 = 'ac-5nivzwm-shard-00-01.6stgtah.mongodb.net';
    let dns0 = 'N/A';
    try { dns0 = JSON.stringify(await dns.resolve4(h0)); } catch (e) { dns0 = 'ERR:' + e.code; }
    const tcp = await Promise.all([
      tcpTest(h0, 27017),
      tcpTest(h0, 443),
      tcpTest(h1, 27017),
      tcpTest(h1, 443),
    ]);

    let connect = 'SKIPPED(already=' + mongoose.connection.readyState + ')';
    if (mongoose.connection.readyState === 0 && process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 7000,
          connectTimeoutMS: 7000,
        });
        connect = 'OK state=' + mongoose.connection.readyState;
      } catch (e) {
        connect = 'ERR: ' + e.message + (e.reason ? ' | reason: ' + JSON.stringify(e.reason) : '');
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mongo_uri_set: !!process.env.MONGODB_URI,
        node_version: process.version,
        mongoose_state: mongoose.connection.readyState,
        dns_shard00: dns0,
        tcp: {
          'shard00:27017': tcp[0],
          'shard00:443': tcp[1],
          'shard01:27017': tcp[2],
          'shard01:443': tcp[3],
        },
        connect_test: connect,
      }),
    };
  }
  return handler(event, context);
};
