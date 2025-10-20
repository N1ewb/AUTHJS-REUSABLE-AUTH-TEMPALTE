import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

prisma
  .$connect()
  .then(() => console.log("Database connected successfully"))
  .catch((e: unknown) => console.error("Database connection error:", e));

export default prisma;
