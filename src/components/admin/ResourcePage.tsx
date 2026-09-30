import { Suspense } from "react";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { AdminLoadingState } from "@/components/admin/AdminStates";
import type { ResourceKey } from "@/lib/resource-config";
export function ResourcePage({ resource, embedded = false }: { resource: ResourceKey; embedded?: boolean }) {
  return <Suspense fallback={<AdminLoadingState />}><ResourceManager resource={resource} embedded={embedded} /></Suspense>;
}
