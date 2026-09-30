import { z } from "zod";
import { getPrisma } from "@/server/db";
import { requireAdmin } from "@/server/services/auth";
import { apiError } from "@/server/services/resource-service";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.union([z.string().trim().regex(/^[+\d\s().-]{9,20}$/, "Số điện thoại không hợp lệ."), z.literal("")]),
}).strict();

export async function PATCH(request: Request) {
  try {
    const user = await requireAdmin();
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Thông tin tài khoản không hợp lệ." }, { status: 400 });
    const updated = await getPrisma().userAccount.update({ where: { id: user.id }, data: { name: parsed.data.name, phone: parsed.data.phone || null }, select: { name: true, phone: true, email: true } });
    return Response.json(updated);
  } catch (error) {
    const failure = apiError(error);
    return Response.json({ error: failure.message }, { status: failure.status });
  }
}
