import type { ResourceKey } from "@/lib/resource-config";

export type GeneratedCodeField = "code" | "sku";

export const generatedCodeConfig: Partial<Record<ResourceKey, { field: GeneratedCodeField; prefix: string }>> = {
  appointments: { field: "code", prefix: "LH" },
  services: { field: "code", prefix: "DV" },
  employees: { field: "code", prefix: "NV" },
  parts: { field: "sku", prefix: "PT" },
  "repair-orders": { field: "code", prefix: "SC" },
  invoices: { field: "code", prefix: "HD" },
  payments: { field: "code", prefix: "TT" },
  bays: { field: "code", prefix: "K" },
};

export function isGeneratedCodeField(resource: ResourceKey, fieldName: string) {
  return generatedCodeConfig[resource]?.field === fieldName;
}
