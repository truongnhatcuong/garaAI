import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { bayStatus } from "@/lib/bay-status";
import { getPrisma } from "@/server/db";
import { requireEmployee } from "@/server/services/auth";
import { apiError, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";

const inputSchema = z.object({
  status: z.enum(["ASSIGNED", "IN_PROGRESS", "BLOCKED", "DONE"]),
  note: z.string().trim().max(1000, "Báo cáo tối đa 1.000 ký tự.").optional(),
}).strict();
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const user = await requireEmployee();
    const { id } = await context.params;
    const parsed = inputSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Thông tin báo cáo không hợp lệ." }, { status: 400 });
    if (parsed.data.status === "BLOCKED" && !parsed.data.note) {
      return Response.json({ error: "Vui lòng ghi lý do cần hỗ trợ để quản trị biết." }, { status: 400 });
    }

    const db = getPrisma();
    const bay = await db.workshopBay.findFirst({
      where: { id, employeeId: user.employeeId, vehicleId: { not: null }, deletedAt: null },
      select: { code: true, statusText: true, vehicleId: true, progressNote: true, updatedAt: true },
    });
    if (!bay) throw new ResourceError("Không tìm thấy khoang có xe được giao cho bạn.", 404);

    const statusText = {
      ASSIGNED: bayStatus.assigned,
      IN_PROGRESS: bayStatus.inProgress,
      BLOCKED: bayStatus.blocked,
      DONE: bayStatus.done,
    }[parsed.data.status];
    const progressNote = parsed.data.note === undefined ? bay.progressNote : parsed.data.note || null;
    if (parsed.data.status !== "DONE" && statusText === bay.statusText && progressNote === bay.progressNote) {
      throw new ResourceError("Chưa có thay đổi nào để gửi.", 400);
    }
    await db.$transaction(async (tx) => {
      const activeOrders = parsed.data.status === "DONE" ? await tx.repairOrder.findMany({
        where: { bayCode: bay.code, deletedAt: null, status: { in: ["INTAKE", "WAITING_APPROVAL", "WAITING_PARTS", "REPAIRING"] } },
        select: { id: true, code: true }, take: 2,
      }) : [];
      if (activeOrders.length > 1) throw new ResourceError("Khoang có nhiều phiếu đang mở. Vui lòng báo quản trị kiểm tra.", 409);
      if (activeOrders[0]) {
        const assigned = await tx.repairOrder.findFirst({ where: { id: activeOrders[0].id, vehicleId: bay.vehicleId!, technicianId: user.employeeId }, select: { id: true } });
        if (!assigned) throw new ResourceError("Phiếu và phân công khoang không khớp. Vui lòng báo quản trị kiểm tra.", 409);
      }
      const updated = await tx.workshopBay.updateMany({
        where: { id, employeeId: user.employeeId, vehicleId: bay.vehicleId, updatedAt: bay.updatedAt, deletedAt: null },
        data: parsed.data.status === "DONE"
          ? { vehicleId: null, employeeId: null, statusText: "Trống", progressNote: null, reportedAt: null }
          : { statusText, progressNote, reportedAt: new Date() },
      });
      if (!updated.count) throw new ResourceError("Phân công hoặc trạng thái đã thay đổi. Vui lòng tải lại trang.", 409);
      if (activeOrders[0]) await tx.repairOrder.update({ where: { id: activeOrders[0].id }, data: { status: "QUALITY_CHECK" } });
      await tx.notification.create({
        data: {
          title: `Khoang ${bay.code}: ${statusText}`.slice(0, 190),
          body: `${user.employee?.name ?? "Nhân viên"} báo cáo${progressNote ? `: ${progressNote}` : ` trạng thái ${statusText}.`}${activeOrders[0] ? ` Phiếu ${activeOrders[0].code} đang chờ kiểm định, khoang đã trống.` : parsed.data.status === "DONE" ? " Khoang đã trống." : ""}`,
          type: parsed.data.status === "BLOCKED" ? "WARNING" : parsed.data.status === "DONE" ? "SUCCESS" : "INFO",
          employeeId: user.employeeId,
        },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    return Response.json({ ok: true, statusText: parsed.data.status === "DONE" ? "Trống" : statusText, progressNote: parsed.data.status === "DONE" ? null : progressNote });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Vui lòng đăng nhập tài khoản nhân viên." }, { status: 401 });
    }
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
