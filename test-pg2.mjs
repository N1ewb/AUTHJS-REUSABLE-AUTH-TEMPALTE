import pg from "pg";

// Parse the connection string manually
const parsed = new URL(process.env.DATABASE_URL);
console.log("Parsed host:", parsed.hostname);
console.log("Parsed port:", parsed.port);
console.log("Parsed user:", decodeURIComponent(parsed.username));
console.log("Parsed database:", parsed.pathname?.slice(1));

// Try direct connect without pool
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const res = await client.query("SELECT 1 AS ok");
  console.log("Works:", res.rows);
} catch (e) {
  console.error("Client error:", e.message, e.code);
} finally {
  await client.end();
}
