import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError, ResourceError } from "@/server/services/resource-service";
import { cleanupUploadedImages, processImageDeletionJobs, uploadImages } from "@/server/services/image-service";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const db = getPrisma();
    const order = await db.repairOrder.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
    if (!order) throw new ResourceError("Không tìm thấy phiếu sửa chữa.", 404);
    const items = await db.repairEvidence.findMany({ where: { repairOrderId: id }, orderBy: { sortOrder: "asc" } });
    await processImageDeletionJobs().catch((error: unknown) => console.error("Image cleanup retry failed", error));
    return Response.json({ items });
  } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); }
}

export async function POST(request: Request, context: Context) {
  let uploaded: { imageUrl: string; imageUploadKey: string }[] = [];
  try {
    await requireAdmin();
    const { id } = await context.params;
    const form = await request.formData();
    const files = form.getAll("images").filter((value): value is File => value instanceof File);
    const caption = String(form.get("caption") ?? "").trim();
    if (caption.length > 255) throw new ResourceError("Chú thích quá dài.", 400);
    const db = getPrisma();
    if (!(await db.repairOrder.findFirst({ where: { id, deletedAt: null }, select: { id: true } }))) throw new ResourceError("Không tìm thấy phiếu sửa chữa.", 404);
    uploaded = await uploadImages(files);
    const items = await db.$transaction(async (tx) => {
      if (!(await tx.repairOrder.findFirst({ where: { id, deletedAt: null }, select: { id: true } }))) throw new ResourceError("Phiếu sửa chữa đã bị xoá.", 409);
      const count = await tx.repairEvidence.count({ where: { repairOrderId: id } });
      return Promise.all(uploaded.map((image, index) => tx.repairEvidence.create({ data: { repairOrderId: id, ...image, caption: caption || null, sortOrder: count + index } })));
    });
    return Response.json({ items }, { status: 201 });
  } catch (error) {
    if (uploaded.length) {
      await cleanupUploadedImages(uploaded.map((item) => item.imageUploadKey));
    }
    const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status });
  }
}
