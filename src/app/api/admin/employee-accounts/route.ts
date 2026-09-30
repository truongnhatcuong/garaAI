import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/server/db";
import { hashPassword, requireAdmin } from "@/server/services/auth";
import { apiError, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";

const inputSchema = z.object({
  employeeId: z.string().min(1),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.union([z.string().min(8).max(128), z.literal("")]),
}).strict();

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const employeeId = new URL(request.url).searchParams.get("employeeId");
    if (!employeeId) throw new ResourceError("Vui lòng chọn nhân viên.", 400);
    const employee = await getPrisma().employee.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true, code: true, name: true, email: true, account: { select: { id: true, email: true } } },
    });
    if (!employee) throw new ResourceError("Không tìm thấy nhân viên.", 404);
    return Response.json({ employee: { id: employee.id, code: employee.code, name: employee.name, email: employee.email }, hasAccount: Boolean(employee.account) });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = inputSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Thông tin tài khoản không hợp lệ." }, { status: 400 });
    const { employeeId, email, password } = parsed.data;
    const db = getPrisma();
    const employee = await db.employee.findFirst({ where: { id: employeeId, deletedAt: null }, include: { account: true } });
    if (!employee) throw new ResourceError("Không tìm thấy nhân viên.", 404);
    if (!employee.account && !password) throw new ResourceError("Cần đặt mật khẩu ban đầu cho nhân viên.", 400);
    await db.$transaction(async (tx) => {
      await tx.employee.update({ where: { id: employeeId }, data: { email } });
      if (employee.account) {
        await tx.userAccount.update({
          where: { id: employee.account.id },
          data: { name: employee.name, email, ...(password ? { passwordHash: hashPassword(password) } : {}) },
        });
        if (password) await tx.session.deleteMany({ where: { userId: employee.account.id } });
      } else {
        await tx.userAccount.create({ data: { name: employee.name, email, passwordHash: hashPassword(password), role: "EMPLOYEE", employeeId } });
      }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    return Response.json({ ok: true, email, hasAccount: true });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
