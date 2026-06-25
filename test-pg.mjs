import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const res = await pool.query("SELECT 1 AS ok");
  console.log("pg works:", res.rows);
} catch (e) {
  console.error("pg error:", JSON.stringify({ message: e.message, code: e.code }));
  if (e.errors) {
    for (const err of e.errors) {
      console.error("sub-error:", JSON.stringify({ message: err.message, code: err.code }));
    }
  }
} finally {
  await pool.end();
}
