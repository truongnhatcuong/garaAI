import "server-only";
import { randomBytes } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { generatedCodeConfig } from "@/lib/generated-code-config";
import type { ResourceKey } from "@/lib/resource-config";

export function generateCode(resource: ResourceKey) {
  const config = generatedCodeConfig[resource];
  if (!config) throw new Error(`Không có cấu hình mã cho ${resource}.`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh", year: "2-digit", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const date = ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value).join("");
  return `${config.prefix}-${date}-${randomBytes(6).toString("hex").toUpperCase()}`;
}

export async function withGeneratedCode<T>(resource: ResourceKey, write: (code: string) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try { return await write(generateCode(resource)); }
    catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < 2)) throw error;
    }
  }
  throw new Error("Không thể tạo mã duy nhất. Vui lòng thử lại.");
}
