import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDatabaseAdapter } from "../src/server/database-adapter";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_NAME?.trim() || "Quản trị viên";
  const phone = process.env.ADMIN_PHONE?.trim() || null;
  const password = process.env.ADMIN_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;
  if (!email || !password || !databaseUrl) {
    throw new Error("Cần cấu hình ADMIN_EMAIL, ADMIN_PASSWORD và DATABASE_URL trong .env.");
  }
  const db = new PrismaClient({ adapter: createDatabaseAdapter(databaseUrl) });
  try {
    const existing = await db.userAccount.findUnique({ where: { email } });
    if (existing && existing.role !== "ADMIN") {
      throw new Error("Email này đang thuộc tài khoản khách hàng; không thể chuyển quyền tự động.");
    }
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
    await db.$transaction(async (tx) => {
      if (existing) {
        await tx.userAccount.update({ where: { id: existing.id }, data: { passwordHash, name: existing.name || name, phone: existing.phone || phone } });
        await tx.session.deleteMany({ where: { userId: existing.id } });
      } else {
        await tx.userAccount.create({ data: { name, phone, email, passwordHash, role: "ADMIN" } });
      }
    });
    console.log(`Đã tạo/cập nhật tài khoản quản trị: ${email}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
