import { apiError } from "@/server/services/resource-service";
import { deleteMine, updateMine } from "@/server/services/customer-service";
export const runtime = "nodejs";
type Context = { params: Promise<{ resource: string; id: string }> };
export async function PATCH(request: Request, context: Context) { try { const { resource, id } = await context.params; return Response.json(await updateMine(resource, id, await request.json())); } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); } }
export async function DELETE(_request: Request, context: Context) { try { const { resource, id } = await context.params; await deleteMine(resource, id); return Response.json({ ok: true }); } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); } }
