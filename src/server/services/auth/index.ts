import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getPrisma } from "@/server/db";

const cookieName = "autocare_session";
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
export function verifyPassword(password: string, stored: string) { const [salt, value] = stored.split(":"); if (!salt || !value) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(value, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }
export async function createSession(userId: string) { const token = randomBytes(32).toString("hex"); await getPrisma().session.create({ data: { tokenHash: hash(token), userId, expiresAt: new Date(Date.now() + 30 * 86400000) } }); (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 86400 }); }
export async function getCurrentUser() { const token = (await cookies()).get(cookieName)?.value; if (!token) return null; const session = await getPrisma().session.findUnique({ where: { tokenHash: hash(token) }, include: { user: { include: { customer: true, employee: true } } } }); if (!session || session.expiresAt <= new Date()) return null; const user = session.user; return user.role === "EMPLOYEE" && (!user.employee || user.employee.deletedAt || user.employee.status !== "ACTIVE") ? null : user; }
export async function endSession() { const store = await cookies(); const token = store.get(cookieName)?.value; if (token) await getPrisma().session.deleteMany({ where: { tokenHash: hash(token) } }); store.delete(cookieName); }
export async function requireAdmin() { const user = await getCurrentUser(); if (!user || user.role !== "ADMIN") throw new Error("UNAUTHORIZED"); return user; }
export async function requireEmployee() { const user = await getCurrentUser(); if (!user || user.role !== "EMPLOYEE" || !user.employeeId || !user.employee) throw new Error("UNAUTHORIZED"); return user; }
