import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RepairIntakeForm } from "@/components/admin/RepairIntakeForm";
import { getPrisma } from "@/server/db";

export default async function Page({ searchParams }: { searchParams: Promise<{ appointmentId?: string }> }) {
  const { appointmentId } = await searchParams;
  const appointment = appointmentId ? await getPrisma().appointment.findFirst({
    where: { id: appointmentId, deletedAt: null },
    include: { customer: true, vehicle: true, service: true, repairOrder: { select: { id: true } } },
  }) : null;
  if (appointmentId && !appointment) notFound();
  if (appointment?.repairOrder) redirect(`/admin/repair-orders/${appointment.repairOrder.id}`);
  return <div className="mx-auto max-w-5xl space-y-5">
    <div>
      <Link href={appointment ? "/admin/appointments" : "/admin/repair-orders"} className="admin-text-link text-xs">← {appointment ? "Lịch hẹn" : "Phiếu sửa chữa"}</Link>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-blue-700">{appointment ? `Tiếp nhận lịch ${appointment.code}` : "Khách đến trực tiếp"}</p>
      <h1 className="admin-page-title mt-1">Tạo phiếu sửa chữa</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--admin-muted)]">Xác nhận xe và hạng mục cần làm. Chọn kỹ thuật viên cùng khoang trống khi bắt đầu sửa chữa.</p>
    </div>
    {appointment && ["CANCELLED", "COMPLETED"].includes(appointment.status)
      ? <div className="admin-panel p-5 text-sm text-red-700">Lịch hẹn này đã kết thúc. Không thể tạo phiếu từ lịch hẹn.</div>
      : <RepairIntakeForm appointment={appointment ? {
        id: appointment.id,
        code: appointment.code,
        customer: { id: appointment.customer.id, name: appointment.customer.name, phone: appointment.customer.phone, email: appointment.customer.email },
        vehicle: { id: appointment.vehicle.id, plate: appointment.vehicle.plate, name: appointment.vehicle.name, customerId: appointment.vehicle.customerId },
        service: appointment.service ? { id: appointment.service.id, title: appointment.service.title, price: Number(appointment.service.price) } : null,
        notes: appointment.notes,
        startsAt: appointment.startsAt.toISOString(),
      } : null} />}
  </div>;
}
