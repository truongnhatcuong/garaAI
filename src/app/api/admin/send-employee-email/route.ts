import { z } from "zod";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { EmployeeMailError, sendEmployeeMail } from "@/server/services/employee-mail";
import { apiError, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";

const schema = z.object({
  employeeId: z.string().min(1),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(5000),
}).strict();

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Thông báo không hợp lệ." }, { status: 400 });
    const employee = await getPrisma().employee.findFirst({
      where: { id: parsed.data.employeeId, deletedAt: null, status: "ACTIVE" },
      select: { name: true, email: true, account: { select: { id: true } } },
    });
    if (!employee) throw new ResourceError("Nhân viên không tồn tại hoặc đã ngừng hoạt động.", 404);
    if (!employee.account || !employee.email) throw new ResourceError("Nhân viên chưa có tài khoản và email. Hãy cấp tài khoản trước.", 400);
    await sendEmployeeMail({ to: employee.email, name: employee.name, subject: parsed.data.subject, message: parsed.data.message });
    return Response.json({ ok: true, recipient: employee.email });
  } catch (error) {
    if (error instanceof EmployeeMailError) return Response.json({ error: error.message }, { status: 502 });
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
