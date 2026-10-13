// Read-only connectivity probe. Usage: node probe.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();
  try {
    const t0 = Date.now();
    const rows = await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log("CONNECT_OK", JSON.stringify(rows), `${Date.now() - t0}ms`);
    const info = await prisma.$queryRaw`SELECT current_database() AS db, version() AS v`;
    console.log("SERVER", JSON.stringify(info).slice(0, 200));
    const counts = await prisma.$queryRaw`
      SELECT (SELECT count(*) FROM "Subject") AS subjects,
             (SELECT count(*) FROM "Summary") AS summaries`;
    console.log(
      "COUNTS",
      JSON.stringify(counts, (k, v) => (typeof v === "bigint" ? Number(v) : v))
    );
  } catch (e) {
    console.error("CONNECT_FAIL", e.code || "", e.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
