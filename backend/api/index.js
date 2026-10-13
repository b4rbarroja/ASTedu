// Vercel serverless entrypoint. Vercel requires the Express app to be
// exported from a file in /api.
const app = require("../index");

module.exports = app;
