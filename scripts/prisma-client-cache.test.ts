import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";
import type { PrismaClient } from "../src/generated/prisma/client";

// Next.js provides this server-only alias; the standalone Node test needs it too.
registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier === "server-only" ? resolve("node_modules/next/dist/compiled/server-only/empty.js") : specifier, context);
  },
});

test("replaces a cached client from before schema regeneration and reuses the new client", async () => {
  const { getPrisma } = await import("../src/server/db");
  const cache = globalThis as unknown as { autocarePrisma?: PrismaClient; autocarePrismaConstructor?: unknown };
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "mysql://test:test@localhost:3306/test";
  let disconnected = false;
  cache.autocarePrisma = { $disconnect: async () => { disconnected = true; } } as unknown as PrismaClient;
  delete cache.autocarePrismaConstructor;
  try {
    const client = getPrisma();
    assert.equal(typeof client.invoiceSettings.findUnique, "function");
    assert.equal(disconnected, true);
    assert.equal(getPrisma(), client);
    // Simulate another generated client constructor being hot-reloaded.
    cache.autocarePrismaConstructor = {};
    const regenerated = getPrisma();
    assert.notEqual(regenerated, client);
    assert.equal(typeof regenerated.invoiceSettings.findUnique, "function");
    assert.equal(getPrisma(), regenerated);
  } finally {
    await cache.autocarePrisma?.$disconnect();
    delete cache.autocarePrisma;
    delete cache.autocarePrismaConstructor;
    if (previousUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  }
});
