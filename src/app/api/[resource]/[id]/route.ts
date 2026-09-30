import { isResourceKey } from "@/lib/resource-config";
import { apiError, deleteResource, getResource, updateResource } from "@/server/services/resource-service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ resource: string; id: string }> };
export async function GET(_request: Request, context: Context) {
  const { resource, id } = await context.params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tài nguyên không tồn tại." }, { status: 404 });
  try { return Response.json(await getResource(resource, id), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); }
}
export async function PATCH(request: Request, context: Context) {
  const { resource, id } = await context.params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tài nguyên không tồn tại." }, { status: 404 });
  try { const body: unknown = await request.json(); return Response.json(await updateResource(resource, id, body)); }
  catch (error) { const failure = apiError(error); return Response.json({ error: failure.message, details: failure.details }, { status: failure.status }); }
}
export async function DELETE(_request: Request, context: Context) {
  const { resource, id } = await context.params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tài nguyên không tồn tại." }, { status: 404 });
  try { await deleteResource(resource, id); return Response.json({ ok: true }); }
  catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); }
}
