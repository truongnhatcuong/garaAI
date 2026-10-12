export const dynamic = "force-dynamic";
import { HomePage } from "@/components/customer/HomePage";
import { AiAssistantChat } from "@/components/customer/AiAssistantChat";
import { getCurrentUser } from "@/server/services/auth";

export default async function Page() {
  const user = await getCurrentUser();
  return (
    <>
      <HomePage />
      <AiAssistantChat
        customerName={
          user?.role === "CUSTOMER" ? (user.customer?.name ?? null) : null
        }
      />
    </>
  );
}
