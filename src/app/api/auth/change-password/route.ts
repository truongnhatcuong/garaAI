import { z } from "zod";
import { getPrisma } from "@/server/db";
import { endSession, getCurrentUser, hashPassword, verifyPassword } from "@/server/services/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Vui lòng đăng nhập để đổi mật khẩu." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Mật khẩu mới phải có từ 8 đến 128 ký tự." }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;
  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return Response.json({ error: "Mật khẩu hiện tại không đúng." }, { status: 400 });
  }
  if (currentPassword === newPassword) {
    return Response.json({ error: "Mật khẩu mới phải khác mật khẩu hiện tại." }, { status: 400 });
  }

  const db = getPrisma();
  const changed = await db.$transaction(async (tx) => {
    const result = await tx.userAccount.updateMany({
      where: { id: user.id, passwordHash: user.passwordHash },
      data: { passwordHash: hashPassword(newPassword) },
    });
    if (!result.count) return false;
    await tx.session.deleteMany({ where: { userId: user.id } });
    return true;
  });
  if (!changed) return Response.json({ error: "Mật khẩu đã thay đổi ở phiên khác. Vui lòng đăng nhập lại." }, { status: 409 });
  await endSession();
  return Response.json({ success: true });
}
