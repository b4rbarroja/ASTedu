// Load .env for local development. On Vercel the platform injects env vars
// directly and there is no .env file, so this is a no-op there. dotenv never
// overwrites variables that are already set.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const subjects = require("./routes/subjects");
const prisma = require("./libs/prisma");

const app = express();

// Required when running behind Vercel's proxy so Express sees the real
// client IP and the original protocol (needed for Secure cookies).
app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));

// ---------------------------------------------------------------------------
// CORS — driven by ALLOWED_ORIGINS (comma separated). Never "*" with credentials.
// Requests without an Origin header (curl, server-to-server) are not given
// CORS headers, which is correct: only browsers care.
// ---------------------------------------------------------------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, false);
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      return callback(null, false); // deny, never reflect
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  })
);

// ---------------------------------------------------------------------------
// Health. Vercel rewrites all traffic to /api, and it is ambiguous whether the
// function then sees the original path or the destination path, so both are
// registered. Canonical path is /api/health.
// ---------------------------------------------------------------------------
function healthHandler(req, res) {
  res.status(200).json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

async function healthDbHandler(req, res) {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    res
      .status(200)
      .json({ status: "ok", db: "up", latencyMs: Date.now() - started });
  } catch (error) {
    console.error("health/db failed:", error.code || "", error.message);
    res.status(503).json({ status: "error", db: "down" });
  }
}

app.get(["/api/health", "/health"], healthHandler);
app.get(["/api/health/db", "/health/db"], healthDbHandler);

// ---------------------------------------------------------------------------
// API — same reasoning as above: mounted at /subjects (original path) and
// /api/subjects (destination path).
// ---------------------------------------------------------------------------
app.use("/subjects", subjects);
app.use("/api/subjects", subjects);

// 404 (JSON, not HTML) for unknown routes.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler — otherwise a rejected handler promise can leave a
// serverless function in an undefined state.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Internal server error" });
});

// Local dev only: Vercel invokes the exported app directly and must never
// reach this branch.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Express server with Prisma running on port ${PORT}`);
  });
}

module.exports = app;
