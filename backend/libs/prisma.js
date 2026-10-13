const { PrismaClient } = require("@prisma/client");

// Always reuse a single PrismaClient. Creating one per request/per module
// would exhaust Neon's connection limits very quickly on serverless.
// globalThis guards against duplicate instances when the module is evaluated
// more than once (hot reload in dev, or repeated module graphs on Vercel).
const prisma =
  globalThis.__prisma ?? new PrismaClient({ log: ["warn", "error"] });

globalThis.__prisma = prisma;

module.exports = prisma;
