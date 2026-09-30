import { endSession } from "@/server/services/auth";
export async function POST() { await endSession(); return Response.json({ success: true }); }
