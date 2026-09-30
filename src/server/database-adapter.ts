import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/** Prisma CLI reads DATABASE_URL itself; the runtime MariaDB driver needs explicit TLS settings. */
export function createDatabaseAdapter(connectionString: string): PrismaMariaDb {
  const url = new URL(connectionString);
  if (url.protocol !== "mysql:" && url.protocol !== "mariadb:") {
    throw new Error("DATABASE_URL phải dùng giao thức MySQL.");
  }
  const sslAccept = url.searchParams.get("sslaccept");
  const ssl = sslAccept === "strict" || url.searchParams.get("ssl") === "true"
    ? { rejectUnauthorized: true }
    : sslAccept === "accept_invalid_certs"
      ? { rejectUnauthorized: false }
      : undefined;
  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    ...(ssl ? { ssl } : {}),
    connectionLimit: 5,
    connectTimeout: 5000,
    acquireTimeout: 15000,
  });
}
