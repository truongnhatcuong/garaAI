import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { createDatabaseAdapter } from "@/server/database-adapter";

const globalForPrisma = globalThis as unknown as {
  autocarePrisma?: PrismaClient;
  autocarePrismaConstructor?: typeof PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL chưa được cấu hình. Hãy thêm URL MySQL vào .env.");
  }
  // Fast Refresh preserves globals, including clients generated from an older schema.
  if (!globalForPrisma.autocarePrisma || globalForPrisma.autocarePrismaConstructor !== PrismaClient) {
    const previous = globalForPrisma.autocarePrisma;
    globalForPrisma.autocarePrisma = new PrismaClient({
      adapter: createDatabaseAdapter(process.env.DATABASE_URL),
    });
    globalForPrisma.autocarePrismaConstructor = PrismaClient;
    if (previous) void previous.$disconnect().catch((error: unknown) => console.error("Failed to disconnect stale Prisma client", error));
  }
  return globalForPrisma.autocarePrisma;
}
