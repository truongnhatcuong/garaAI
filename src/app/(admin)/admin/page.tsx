import { DashboardPage } from "@/components/admin/DashboardPage";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: Promise<{ period?: string | string[]; date?: string | string[] }> }) {
  const { period, date } = await searchParams;
  return <DashboardPage periodValue={typeof period === "string" ? period : undefined} dateValue={typeof date === "string" ? date : undefined} />;
}
