import { z } from "zod";
import { createSession, hashPassword } from "@/server/services/auth";
import { getPrisma } from "@/server/db";
import { apiError } from "@/server/services/resource-service";

const schema = z.object({ name: z.string().trim().min(2), phone: z.string().trim().min(9), email: z.email(), password: z.string().min(8) });
export async function POST(request: Request) { try { const input = schema.parse(await request.json()); const email = input.email.toLowerCase(); const user = await getPrisma().userAccount.create({ data: { name: input.name, email, passwordHash: hashPassword(input.password), role: "CUSTOMER", customer: { create: { name: input.name, phone: input.phone, email } } } }); await createSession(user.id); return Response.json({ role: user.role }, { status: 201 }); } catch (error) { const result = apiError(error); return Response.json({ error: result.message }, { status: result.status }); } }
