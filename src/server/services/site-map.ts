import "server-only";
import defaults from "../../../config.json";
import { siteMapSchema, type SiteMap } from "@/lib/site-map";
import { getPrisma } from "@/server/db";

const defaultSiteMap = siteMapSchema.parse(defaults.googleMaps);

export async function getSiteMap(): Promise<SiteMap> {
  try {
    const stored = await getPrisma().siteMapSettings.findUnique({ where: { id: 1 } });
    return stored ? { placeName: stored.placeName, address: stored.address, embedUrl: stored.embedUrl } : defaultSiteMap;
  } catch (error) {
    console.error("Site map settings unavailable", error instanceof Error ? `${error.name}: ${error.message}` : error);
    return defaultSiteMap;
  }
}
