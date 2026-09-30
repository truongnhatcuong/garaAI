import { requireAdmin } from "@/server/services/auth";
import { getPrisma } from "@/server/db";
import { apiError } from "@/server/services/resource-service";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const result = await getPrisma().expense.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } });
    if (!result.count) return Response.json({ error: "Không tìm thấy khoản chi." }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
