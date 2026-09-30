import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError, ResourceError } from "@/server/services/resource-service";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const restored = await getPrisma().$transaction(async (tx) => {
      // Share the intake lock so restoring and receiving the same vehicle cannot race.
      await tx.appointmentBookingMutex.update({ where: { id: 1 }, data: { version: { increment: 1 } } });
      const order = await tx.repairOrder.findFirst({ where: { id, deletedAt: null }, include: { customer: true, vehicle: true } });
      if (!order) throw new ResourceError("Không tìm thấy phiếu sửa chữa.", 404);
      if (order.status !== "CANCELLED") throw new ResourceError("Chỉ khôi phục được phiếu đã hủy. Vui lòng tải lại trang.", 409);
      if (order.customer.deletedAt || order.vehicle.deletedAt || (order.vehicle.customerId && order.vehicle.customerId !== order.customerId)) throw new ResourceError("Khách hàng hoặc xe không còn hợp lệ để khôi phục phiếu.", 409);
      const invoice = await tx.invoice.findFirst({ where: { repairOrderId: id, deletedAt: null, status: { not: "CANCELLED" } }, select: { code: true } });
      if (invoice) throw new ResourceError(`Phiếu đã xuất hóa đơn ${invoice.code}, không thể khôi phục.`, 409);
      const other = await tx.repairOrder.findFirst({ where: { id: { not: id }, vehicleId: order.vehicleId, deletedAt: null, status: { notIn: ["COMPLETED", "CANCELLED"] } }, select: { code: true } });
      if (other) throw new ResourceError(`Xe đang có phiếu ${other.code} chưa hoàn tất. Hãy xử lý phiếu đó trước.`, 409);
      const changed = await tx.repairOrder.updateMany({
        where: { id, status: "CANCELLED", deletedAt: null, updatedAt: order.updatedAt },
        data: { status: "INTAKE", bayCode: null },
      });
      if (!changed.count) throw new ResourceError("Phiếu vừa thay đổi. Vui lòng tải lại trang.", 409);
      if (order.appointmentId) {
        const appointment = await tx.appointment.updateMany({
          where: { id: order.appointmentId, deletedAt: null, status: "CANCELLED", customerId: order.customerId, vehicleId: order.vehicleId },
          data: { status: "IN_PROGRESS" },
        });
        if (!appointment.count) throw new ResourceError("Lịch hẹn liên kết đã thay đổi hoặc bị xóa, không thể khôi phục phiếu.", 409);
      }
      return { id, status: "INTAKE" };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
    return Response.json(restored);
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
