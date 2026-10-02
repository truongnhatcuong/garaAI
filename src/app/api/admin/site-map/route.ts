import { siteMapSchema } from "@/lib/site-map";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError } from "@/server/services/resource-service";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = siteMapSchema.parse(await request.json());
    const map = await getPrisma().siteMapSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...input },
      update: input,
    });
    return Response.json({ placeName: map.placeName, address: map.address, embedUrl: map.embedUrl });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
