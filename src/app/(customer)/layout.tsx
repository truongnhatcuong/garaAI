import { redirect } from "next/navigation";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { getCurrentUser } from "@/server/services/auth";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user?.role === "EMPLOYEE") redirect("/employee");
  return <CustomerShell>{children}</CustomerShell>;
}
