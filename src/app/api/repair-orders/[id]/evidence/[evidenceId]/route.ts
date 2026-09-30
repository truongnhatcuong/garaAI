import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError, ResourceError } from "@/server/services/resource-service";
import { cleanupUploadedImages, processImageDeletionJobs, uploadImages } from "@/server/services/image-service";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string; evidenceId: string }> };

export async function PATCH(request: Request, context: Context) {
  let uploaded: { imageUrl: string; imageUploadKey: string }[] = [];
  try {
    await requireAdmin();
    const { id, evidenceId } = await context.params;
    const form = await request.formData();
    const file = form.get("image");
    const caption = String(form.get("caption") ?? "").trim();
    if (caption.length > 255) throw new ResourceError("Chú thích quá dài.", 400);
    if (file instanceof File && file.size) uploaded = await uploadImages([file]);
    const db = getPrisma();
    const item = await db.$transaction(async (tx) => {
      const old = await tx.repairEvidence.findFirst({ where: { id: evidenceId, repairOrderId: id, repairOrder: { deletedAt: null } } });
      if (!old) throw new ResourceError("Không tìm thấy ảnh.", 404);
      const result = await tx.repairEvidence.update({ where: { id: evidenceId }, data: { caption: caption || null, ...(uploaded[0] ?? {}) } });
      if (uploaded.length && old.imageUploadKey) await tx.imageDeletionJob.createMany({ data: [{ key: old.imageUploadKey }], skipDuplicates: true });
      return result;
    });
    await processImageDeletionJobs().catch((error: unknown) => console.error("Image cleanup failed", error));
    return Response.json(item);
  } catch (error) {
    if (uploaded.length) {
      await cleanupUploadedImages(uploaded.map((item) => item.imageUploadKey));
    }
    const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id, evidenceId } = await context.params;
    await getPrisma().$transaction(async (tx) => {
      const old = await tx.repairEvidence.findFirst({ where: { id: evidenceId, repairOrderId: id, repairOrder: { deletedAt: null } } });
      if (!old) throw new ResourceError("Không tìm thấy ảnh.", 404);
      await tx.repairEvidence.delete({ where: { id: evidenceId } });
      if (old.imageUploadKey) await tx.imageDeletionJob.createMany({ data: [{ key: old.imageUploadKey }], skipDuplicates: true });
    });
    await processImageDeletionJobs().catch((error: unknown) => console.error("Image cleanup failed", error));
    return Response.json({ ok: true });
  } catch (error) { const failure = apiError(error); return Response.json({ error: failure.message }, { status: failure.status }); }
}
