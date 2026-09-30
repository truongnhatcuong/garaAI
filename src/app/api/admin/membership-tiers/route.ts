import { z } from "zod";
import { requireAdmin } from "@/server/services/auth";
import { getPrisma } from "@/server/db";
import { apiError } from "@/server/services/resource-service";

const schema = z.object({
  code: z.enum(["Bronze", "Silver", "Gold", "Platinum", "Diamond"]),
  discountPercent: z.number().finite().min(0).max(100),
});

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const input = schema.parse(await request.json());
    const tier = await getPrisma().membershipTier.update({
      where: { code: input.code }, data: { discountPercent: input.discountPercent },
    });
    return Response.json(tier);
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
