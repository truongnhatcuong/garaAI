import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";
import { TierDiscountSettings } from "@/components/admin/TierDiscountSettings";
import { InvoiceTaxSettings } from "@/components/admin/InvoiceTaxSettings";
import { SiteMapSettingsForm } from "@/components/admin/SiteMapSettingsForm";
import { AdminProfileForm } from "@/components/admin/AdminProfileForm";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { getSiteMap } from "@/server/services/site-map";

export default async function Page() {
  const [user, tiers, invoiceSettings, siteMap] = await Promise.all([requireAdmin(), getPrisma().membershipTier.findMany(), getPrisma().invoiceSettings.findUnique({ where: { id: 1 } }), getSiteMap()]);
  const order = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  return <div className="mx-auto max-w-4xl space-y-4"><h1 className="admin-page-title">Cài đặt</h1><AdminProfileForm name={user.name?.trim() || "Quản trị viên"} email={user.email} phone={user.phone ?? ""} createdAt={user.createdAt.toISOString()} /><TierDiscountSettings tiers={tiers.sort((a, b) => order.indexOf(a.code) - order.indexOf(b.code)).map((tier) => ({ code: tier.code, label: tier.label, discountPercent: tier.discountPercent.toNumber() }))} /><InvoiceTaxSettings taxPercent={invoiceSettings?.taxPercent.toNumber() ?? 0} /><SiteMapSettingsForm initialMap={siteMap} /><ChangePasswordForm /></div>;
}
