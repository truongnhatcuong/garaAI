import { getPrisma } from "@/server/db";
import { apiError } from "@/server/services/resource-service";
export async function GET() { try { const items = await getPrisma().service.findMany({ where: { deletedAt: null, status: "ACTIVE" }, select: { id: true, code: true, title: true, description: true, durationMinutes: true, price: true }, orderBy: { title: "asc" } }); return Response.json({ items }); } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); } }
