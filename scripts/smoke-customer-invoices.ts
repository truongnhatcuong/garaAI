import "dotenv/config";
import { randomBytes, createHash } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDatabaseAdapter } from "../src/server/database-adapter";

const db = new PrismaClient({ adapter: createDatabaseAdapter(process.env.DATABASE_URL!) });
const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const tag = randomBytes(6).toString("hex");
const customers: string[] = [];
const accounts: string[] = [];
let invoiceId = "";

async function main() {
  try {
    const tokens: string[] = [];
    for (const suffix of ["owner", "other"]) {
      const customer = await db.customer.create({ data: { name: "Invoice test " + suffix + tag } });
      customers.push(customer.id);
      const account = await db.userAccount.create({ data: { customerId: customer.id, role: "CUSTOMER", email: suffix + tag + "@example.test", passwordHash: "temporary" } });
      accounts.push(account.id);
      const token = randomBytes(32).toString("hex");
      tokens.push(token);
      await db.session.create({ data: { userId: account.id, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: new Date(Date.now() + 300000) } });
    }
    const code = "TEST-INVOICE-" + tag;
    const invoice = await db.invoice.create({ data: { code, customerId: customers[0], subtotal: 100000, total: 100000, status: "UNPAID" } });
    invoiceId = invoice.id;
    const get = async (path: string, token?: string) => {
      const response = await fetch(base + path, { redirect: "manual", headers: token ? { Cookie: "autocare_session=" + token } : {} });
      return { response, html: await response.text() };
    };
    const list = await get("/invoices?search=" + code, tokens[0]);
    if (!list.response.ok || !list.html.includes(code) || !list.html.includes("/invoices/" + invoice.id)) throw new Error("Owner cannot find invoice and detail link");
    const detail = await get("/invoices/" + invoice.id, tokens[0]);
    if (!detail.response.ok || !detail.html.includes(code) || !detail.html.includes("Lịch sử thanh toán") || detail.html.includes("Giá vốn phụ tùng")) throw new Error("Owner detail failed or internal cost exposed");
    const other = await get("/invoices/" + invoice.id, tokens[1]);
    if (other.html.includes(code) || !(other.response.status === 404 || other.html.includes("NEXT_HTTP_ERROR_FALLBACK;404"))) throw new Error("Another customer can access invoice");
    const anonymous = await get("/invoices/" + invoice.id);
    if (anonymous.html.includes(code) || !(anonymous.response.headers.get("location")?.includes("/login") || anonymous.html.includes("NEXT_REDIRECT"))) throw new Error("Anonymous access not blocked");
    console.log("PASS: invoice list, owner detail, no internal cost, foreign invoice 404, login required.");
  } finally {
    if (invoiceId) await db.invoice.delete({ where: { id: invoiceId } });
    await db.session.deleteMany({ where: { userId: { in: accounts } } });
    await db.userAccount.deleteMany({ where: { id: { in: accounts } } });
    await db.customer.deleteMany({ where: { id: { in: customers } } });
    await db.$disconnect();
  }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
