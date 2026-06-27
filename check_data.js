import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const p = new PrismaClient({ adapter });

const users = await p.user.findMany({
  where: { role: "INSTRUCTOR" },
  select: { id: true, name: true, inviteCode: true, role: true },
});
console.log(JSON.stringify(users, null, 2));
await p.$disconnect();
pool.end();
