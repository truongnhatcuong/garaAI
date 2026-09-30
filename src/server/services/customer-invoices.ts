import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/services/auth";

export async function getInvoiceCustomerId() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin/invoices");
  if (user.role !== "CUSTOMER" || !user.customerId || !user.customer || user.customer.deletedAt) redirect("/login");
  return user.customerId;
}

export const invoiceMoney = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
export const invoiceDate = (value: Date) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(value);
