const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const p = new PrismaClient({ adapter });

async function main() {
  const users = await p.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: { id: true, name: true, inviteCode: true, role: true },
  });
  console.log('INSTRUCTORS:', JSON.stringify(users, null, 2));
}
main().catch(e => console.error(e.message)).finally(() => { p.$disconnect(); pool.end(); });
