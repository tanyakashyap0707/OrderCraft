/**
 * Vercel entrypoint
 *
 * Vercel manages the HTTP server lifecycle itself — calling app.listen()
 * would hang. This file exports the Express app as a plain request handler
 * and fires off the MongoDB connection as a side-effect so it is ready
 * by the time the first request arrives.
 */

const path = require("path");
const dotenv = require("dotenv");

// Load .env for local `vercel dev`. On production Vercel, env vars are
// injected by the dashboard and dotenv is a no-op.
dotenv.config({ path: path.resolve(__dirname, "backend/.env") });

const app = require("./backend/src/app");
const connectDB = require("./backend/src/config/db");

// Initiate DB connection once at cold-start (non-blocking).
connectDB();

// Export the Express app — Vercel wraps it in an HTTP server.
module.exports = app;
