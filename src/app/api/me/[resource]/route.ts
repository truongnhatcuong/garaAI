import { apiError } from "@/server/services/resource-service";
import { createMine, listMine } from "@/server/services/customer-service";
export const runtime = "nodejs";
type Context = { params: Promise<{ resource: string }> };
export async function GET(request: Request, context: Context) { try { const { resource } = await context.params; return Response.json(await listMine(resource, new URL(request.url).searchParams), { headers: { "Cache-Control": "no-store" } }); } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); } }
export async function POST(request: Request, context: Context) { try { const { resource } = await context.params; return Response.json(await createMine(resource, await request.json()), { status: 201 }); } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); } }
