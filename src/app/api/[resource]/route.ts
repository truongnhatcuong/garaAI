import { isResourceKey } from "@/lib/resource-config";
import { apiError, createResource, listResource } from "@/server/services/resource-service";
import { parseListQuery } from "@/server/validation/resources";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ resource: string }> };
export async function GET(request: Request, context: Context) {
  const { resource } = await context.params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tài nguyên không tồn tại." }, { status: 404 });
  try {
    const query = parseListQuery(new URL(request.url).searchParams);
    return Response.json(await listResource(resource, query), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message, details: failure.details }, { status: failure.status });
  }
}
export async function POST(request: Request, context: Context) {
  const { resource } = await context.params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tài nguyên không tồn tại." }, { status: 404 });
  try {
    const body: unknown = await request.json();
    return Response.json(await createResource(resource, body), { status: 201 });
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message, details: failure.details }, { status: failure.status });
  }
}
