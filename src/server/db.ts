import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { createDatabaseAdapter } from "@/server/database-adapter";

const globalForPrisma = globalThis as unknown as {
  autocarePrisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL chưa được cấu hình. Hãy thêm URL MySQL vào .env.");
  }
  
  // A dev server can keep an instance created before Prisma generated a new model.
  if (!globalForPrisma.autocarePrisma || typeof globalForPrisma.autocarePrisma.siteMapSettings?.findUnique !== "function") {
    if (globalForPrisma.autocarePrisma) {
      void globalForPrisma.autocarePrisma.$disconnect().catch((error: unknown) => {
        console.error("Could not disconnect stale Prisma client", error);
      });
    }
    const client = new PrismaClient({
      adapter: createDatabaseAdapter(process.env.DATABASE_URL),
    });
    if (typeof client.siteMapSettings?.findUnique !== "function") {
      throw new Error("Prisma Client chưa được cập nhật. Chạy npm run prisma:generate và khởi động lại dev server.");
    }
    globalForPrisma.autocarePrisma = client;
  }
  return globalForPrisma.autocarePrisma;
}
