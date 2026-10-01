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
  
  if (!globalForPrisma.autocarePrisma) {
    globalForPrisma.autocarePrisma = new PrismaClient({
      adapter: createDatabaseAdapter(process.env.DATABASE_URL),
    });
  }
  return globalForPrisma.autocarePrisma;
}
