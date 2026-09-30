import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/server/db";

const activeStatuses = ["PENDING", "CONFIRMED", "ARRIVED", "IN_PROGRESS"] as const;
const fallbackDurationMinutes = 60;

export class AppointmentBookingError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Schedule = {
  startsAt: Date;
  endsAt?: Date | null;
  serviceId?: string | null;
};

export function isActiveAppointmentStatus(status: string | null | undefined) {
  return !status || activeStatuses.some((active) => active === status);
}

export async function reserveAppointment<T>(
  schedule: Schedule,
  excludeId: string | undefined,
  write: (tx: Prisma.TransactionClient, endsAt: Date) => Promise<T>,
): Promise<T> {
  const db = getPrisma();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await db.$transaction(async (tx) => {
        // Serialize the conflict check and write on TiDB, which does not support SERIALIZABLE.
        await tx.appointmentBookingMutex.update({ where: { id: 1 }, data: { version: { increment: 1 } } });
        const startsAt = schedule.startsAt;
        if (Number.isNaN(startsAt.getTime())) throw new AppointmentBookingError("Ngày giờ hẹn không hợp lệ.", 400);
        const service = schedule.serviceId
          ? await tx.service.findFirst({ where: { id: schedule.serviceId, deletedAt: null }, select: { durationMinutes: true } })
          : null;
        if (schedule.serviceId && !service) throw new AppointmentBookingError("Dịch vụ không tồn tại.", 400);
        const duration = Math.max(1, service?.durationMinutes ?? fallbackDurationMinutes);
        const endsAt = schedule.endsAt ?? new Date(startsAt.getTime() + duration * 60_000);
        if (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
          throw new AppointmentBookingError("Giờ kết thúc phải sau giờ bắt đầu.", 400);
        }

        const candidates = await tx.appointment.findMany({
          where: {
            deletedAt: null,
            status: { in: [...activeStatuses] },
            startsAt: { lt: endsAt },
            OR: [{ endsAt: { gt: startsAt } }, { endsAt: null }],
            ...(excludeId ? { id: { not: excludeId } } : {}),
          },
          select: { startsAt: true, endsAt: true, service: { select: { durationMinutes: true } } },
        });
        const conflict = candidates.some((item) => {
          const itemEnd = item.endsAt ?? new Date(item.startsAt.getTime() + Math.max(1, item.service?.durationMinutes ?? fallbackDurationMinutes) * 60_000);
          return itemEnd > startsAt;
        });
        if (conflict) throw new AppointmentBookingError("Khung giờ này đã có lịch hẹn. Vui lòng chọn thời gian khác.", 409);
        return write(tx, endsAt);
      }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, maxWait: 5000, timeout: 10000 });
    } catch (error) {
      const retryable = error instanceof Prisma.PrismaClientKnownRequestError
        && (error.code === "P2034" || (error.code === "P2039" && /write conflict|deadlock|lock wait timeout|9007|1213/i.test(error.message)));
      if (retryable) {
        if (attempt < 2) continue;
        throw new AppointmentBookingError("Khung giờ này vừa được đặt. Vui lòng chọn thời gian khác.", 409);
      }
      throw error;
    }
  }
  throw new AppointmentBookingError("Không thể giữ khung giờ. Vui lòng thử lại.", 409);
}
