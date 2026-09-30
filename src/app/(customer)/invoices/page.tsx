import Link from "next/link";
import { ArrowRight, ReceiptText, Search } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { Status } from "@/components/ui/AppUi";
import { displayValue, resourceConfig } from "@/lib/resource-config";
import { statusTone } from "@/lib/status";
import { getPrisma } from "@/server/db";
import {
  getInvoiceCustomerId,
  invoiceDate,
  invoiceMoney,
} from "@/server/services/customer-invoices";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const customerId = await getInvoiceCustomerId();
  const params = await searchParams;
  const search =
    typeof params.search === "string" ? params.search.trim().slice(0, 100) : "";
  const status = typeof params.status === "string" ? params.status : "";
  const options = resourceConfig.invoices.statusOptions ?? [];
  const validStatus = options.some((option) => option.value === status)
    ? status
    : "";
  const where: Prisma.InvoiceWhereInput = {
    customerId,
    deletedAt: null,
    ...(validStatus
      ? { status: validStatus as Prisma.EnumInvoiceStatusFilter["equals"] }
      : {}),
    ...(search
      ? {
          OR: [
            { code: { contains: search } },
            { vehicle: { is: { plate: { contains: search } } } },
          ],
        }
      : {}),
  };
  const db = getPrisma();
  const total = await db.invoice.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const requestedPage = Number(params.page);
  const page = Math.min(
    totalPages,
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1,
  );
  const invoices = await db.invoice.findMany({
    where,
    orderBy: [{ issuedAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * 10,
    take: 10,
    select: {
      id: true,
      code: true,
      issuedAt: true,
      total: true,
      status: true,
      vehicle: { select: { plate: true, name: true } },
      payments: {
        where: { deletedAt: null, status: "COMPLETED" },
        select: { amount: true },
      },
    },
  });
  const pageHref = (target: number) =>
    "/invoices?" +
    new URLSearchParams({
      search,
      status: validStatus,
      page: String(target),
    }).toString();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <header className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <ReceiptText size={24} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Hóa đơn của tôi
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Xem từng khoản dịch vụ, ưu đãi và các lần thanh toán của bạn.
          </p>
        </div>
      </header>
      <section className="card overflow-hidden">
        <form
          action="/invoices"
          className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5"
        >
          <label className="min-w-48 flex-1 text-xs font-medium text-slate-600">
            Tìm hóa đơn
            <div className="relative mt-1.5">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-3 text-slate-400"
              />
              <input
                name="search"
                defaultValue={search}
                placeholder="Mã hóa đơn hoặc biển số xe"
                className="field w-full pl-9!"
                maxLength={100}
              />
            </div>
          </label>
          <label className="text-xs font-medium text-slate-600">
            Trạng thái
            <select
              name="status"
              defaultValue={validStatus}
              className="field mt-1.5 block w-full sm:w-44"
            >
              <option value="">Tất cả trạng thái</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            Tìm kiếm
          </button>
          {(search || validStatus) && (
            <Link href="/invoices" className="btn btn-soft">
              Bỏ lọc
            </Link>
          )}
        </form>
        <div className="px-5 py-2 text-xs text-slate-500">
          {total} hóa đơn · Mới nhất trước
        </div>
        {invoices.length ? (
          <div className="divide-y divide-slate-100">
            {invoices.map((invoice) => {
              const paid = invoice.payments.reduce(
                (sum, payment) => sum + Number(payment.amount),
                0,
              );
              return (
                <article
                  key={invoice.id}
                  className="grid gap-4 px-5 py-3 transition-colors hover:bg-blue-50/30 sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={"/invoices/" + invoice.id}
                        className="break-all font-semibold text-blue-800 hover:underline"
                      >
                        {invoice.code}
                      </Link>
                      <Status tone={statusTone(invoice.status)}>
                        {displayValue(
                          invoice.status,
                          "status",
                          resourceConfig.invoices,
                        )}
                      </Status>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {invoice.vehicle
                        ? invoice.vehicle.plate + " · " + invoice.vehicle.name
                        : "Chưa có thông tin xe"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Phát hành {invoiceDate(invoice.issuedAt)}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="sm:text-right">
                      <p className="text-xs text-slate-500">Tổng hóa đơn</p>
                      <p className="mt-1 text-xl font-bold tabular-nums text-slate-950">
                        {invoiceMoney(Number(invoice.total))}
                      </p>
                      {["UNPAID", "PARTIALLY_PAID"].includes(
                        invoice.status,
                      ) && (
                        <p className="mt-1 text-xs text-amber-800">
                          Còn lại{" "}
                          {invoiceMoney(
                            Math.max(0, Number(invoice.total) - paid),
                          )}
                        </p>
                      )}
                    </div>
                    <Link
                      href={"/invoices/" + invoice.id}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Xem chi tiết <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-14 text-center">
            <ReceiptText className="mx-auto text-slate-300" size={36} />
            <h2 className="mt-4 font-semibold text-slate-900">
              {search || validStatus
                ? "Không tìm thấy hóa đơn phù hợp"
                : "Bạn chưa có hóa đơn"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {search || validStatus
                ? "Thử tìm mã khác hoặc bỏ bộ lọc."
                : "Hóa đơn sẽ xuất hiện sau khi gara hoàn tất và xuất hóa đơn cho phiếu sửa chữa."}
            </p>
          </div>
        )}
        {totalPages > 1 && (
          <nav
            aria-label="Phân trang hóa đơn"
            className="flex items-center justify-between border-t px-5 py-4 text-sm"
          >
            <span className="text-slate-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-3">
              {page > 1 && (
                <Link className="btn btn-soft" href={pageHref(page - 1)}>
                  Trước
                </Link>
              )}
              {page < totalPages && (
                <Link className="btn btn-soft" href={pageHref(page + 1)}>
                  Sau
                </Link>
              )}
            </div>
          </nav>
        )}
      </section>
    </div>
  );
}
