import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/server/services/auth";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user?.role === "EMPLOYEE") redirect("/employee");
  if (!user || user.role !== "ADMIN") redirect("/login");
  return <AdminShell name={user.name?.trim() || "Quản trị viên"}>{children}</AdminShell>;
}
