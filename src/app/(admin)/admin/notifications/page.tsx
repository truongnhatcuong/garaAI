import { EmployeeEmailForm } from "@/components/admin/EmployeeEmailForm";
import { NotificationHistory } from "@/components/admin/NotificationHistory";

export default function Page() {
  return <div className="space-y-5"><EmployeeEmailForm /><NotificationHistory /></div>;
}
