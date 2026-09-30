import "server-only";
import { UTApi } from "uploadthing/server";
import { getPrisma } from "@/server/db";

export class ImageInputError extends Error {}

function uploadApi() {
  if (!process.env.UPLOADTHING_TOKEN) throw new Error("UPLOADTHING_TOKEN chưa được cấu hình.");
  return new UTApi();
}

export async function uploadImages(files: File[]) {
  if (!files.length || files.length > 10) throw new ImageInputError("Chọn từ 1 đến 10 ảnh.");
  for (const file of files) {
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024 || file.size === 0) throw new ImageInputError("Ảnh phải thuộc định dạng hình ảnh và không quá 8 MB.");
  }
  const results = await uploadApi().uploadFiles(files);
  const uploaded = results.flatMap((result) => result.data ? [{ imageUrl: result.data.url, imageUploadKey: result.data.key }] : []);
  if (results.some((result) => result.error)) {
    await cleanupUploadedImages(uploaded.map((item) => item.imageUploadKey));
    throw new Error("Không thể tải đủ ảnh lên UploadThing.");
  }
  return uploaded;
}

export async function queueImageDeletion(keys: string[]) {
  const unique = [...new Set(keys.filter(Boolean))];
  if (unique.length) await getPrisma().imageDeletionJob.createMany({ data: unique.map((key) => ({ key })), skipDuplicates: true });
}

export async function cleanupUploadedImages(keys: string[]) {
  if (!keys.length) return;
  try {
    await queueImageDeletion(keys);
  } catch (error) {
    console.error("Could not queue image cleanup; attempting direct deletion", error);
    try { await uploadApi().deleteFiles(keys); }
    catch (failure) { console.error("Direct image cleanup failed", failure); }
    return;
  }
  await processImageDeletionJobs(keys).catch((error: unknown) => console.error("Image cleanup failed", error));
}

export async function processImageDeletionJobs(keys?: string[]) {
  const db = getPrisma();
  const jobs = keys
    ? await db.imageDeletionJob.findMany({ where: { key: { in: keys } } })
    : await db.imageDeletionJob.findMany({ take: 10, orderBy: { createdAt: "asc" } });
  if (!jobs.length) return;
  await Promise.all(jobs.map(async (job) => {
    try {
      const result = await uploadApi().deleteFiles(job.key);
      if (!result.success) throw new Error("UploadThing chưa xác nhận xoá ảnh.");
      await db.imageDeletionJob.deleteMany({ where: { key: job.key } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lỗi xoá ảnh";
      await db.imageDeletionJob.updateMany({ where: { key: job.key }, data: { attempts: { increment: 1 }, lastError: message.slice(0, 1000) } });
      console.error("UploadThing image cleanup queued for retry", message);
    }
  }));
}
