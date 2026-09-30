import { z } from "zod";
import { requireAdmin } from "@/server/services/auth";
import { getPrisma } from "@/server/db";
import { apiError } from "@/server/services/resource-service";

const schema = z.object({ title: z.string().trim().min(2).max(191), amount: z.number().finite().positive().max(999999999999) });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = schema.parse(await request.json());
    const expense = await getPrisma().expense.create({ data: { ...data, spentAt: new Date() } });
    return Response.json(expense, { status: 201 });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
