import { getCurrentUser } from "@/server/services/auth";
export async function GET() { const user = await getCurrentUser(); return Response.json(user ? { id: user.id, name: user.customer?.name ?? user.employee?.name ?? user.name ?? null, email: user.email, phone: user.phone, role: user.role, customer: user.customer ? { id: user.customer.id, name: user.customer.name } : null } : null); }
