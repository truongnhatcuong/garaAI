import { z } from "zod";
import { createSession, verifyPassword } from "@/server/services/auth";
import { getPrisma } from "@/server/db";
import { apiError } from "@/server/services/resource-service";

const schema = z.object({ email: z.email(), password: z.string().min(1) });
export async function POST(request: Request) { try { const { email, password } = schema.parse(await request.json()); const user = await getPrisma().userAccount.findUnique({ where: { email: email.toLowerCase() }, include: { employee: true } }); if (!user || !verifyPassword(password, user.passwordHash)) return Response.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 }); if (user.role === "EMPLOYEE" && (!user.employee || user.employee.deletedAt || user.employee.status !== "ACTIVE")) return Response.json({ error: "Tài khoản nhân viên đã ngừng hoạt động." }, { status: 403 }); await createSession(user.id); return Response.json({ role: user.role }); } catch (error) { const result = apiError(error); return Response.json({ error: result.message }, { status: result.status }); } }
