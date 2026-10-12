import { redirect } from "next/navigation";
import { customerAssistantHref } from "@/lib/customer-assistant-navigation";

export default function Page() {
  redirect(customerAssistantHref);
}
