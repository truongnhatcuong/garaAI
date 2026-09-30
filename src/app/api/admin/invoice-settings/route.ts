import { invoiceTaxSchema } from "@/lib/invoice-tax";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError } from "@/server/services/resource-service";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = invoiceTaxSchema.parse(await request.json());
    const settings = await getPrisma().invoiceSettings.upsert({
      where: { id: 1 }, create: { id: 1, ...input }, update: input,
    });
    return Response.json({ taxPercent: settings.taxPercent.toNumber() });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
