import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.user.count();
    console.log("Connected, user count:", count);
  } catch (e) {
    console.error("Error name:", e.constructor?.name);
    console.error("Error code:", e.code);
    console.error("Error message:", e.message);
    console.error("Stack:", e.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
