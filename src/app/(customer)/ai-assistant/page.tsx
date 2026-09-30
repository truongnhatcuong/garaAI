import { AiAssistantPage } from "@/components/customer/AiAssistantPage";
import { getCurrentUser } from "@/server/services/auth";

export default async function Page() {
  const user = await getCurrentUser();
  return <AiAssistantPage customerName={user?.role === "CUSTOMER" ? user.customer?.name ?? null : null} />;
}
