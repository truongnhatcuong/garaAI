export const dynamic = "force-dynamic";
import Link from "next/link";
import { PageHeading } from "@/components/ui/AppUi";
import { getPrisma } from "@/server/db";
export default async function Page() { let services; try { services = await getPrisma().service.findMany({ where: { deletedAt: null, status: "ACTIVE" }, orderBy: { title: "asc" } }); } catch (error) { return <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-red-700" role="alert">{error instanceof Error ? error.message : "Không tải được dịch vụ."}</div>; }
  return <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8"><PageHeading title="Dịch vụ chăm sóc xe" description="Bảng giá và thời lượng dịch vụ hiện tại." />{services.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map((service) => <div className="card flex flex-col p-5" key={service.id}><h2 className="font-bold">{service.title}</h2><p className="mt-2 flex-1 text-xs leading-5 text-slate-600">{service.description}</p><div className="mt-4 flex justify-between text-xs"><span>{service.durationMinutes} phút</span><b className="text-blue-700">{Number(service.price).toLocaleString("vi-VN")} ₫</b></div><Link href="/appointments" className="btn btn-primary mt-4 w-full">Đặt lịch</Link></div>)}</div> : <p className="card p-6 text-sm text-slate-600">Chưa có dịch vụ.</p>}</div>;
}
