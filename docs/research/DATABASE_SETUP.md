# MySQL setup

The app uses Prisma 7 with MySQL. Set `DATABASE_URL` in `.env` using `.env.example` as a template. Use a dedicated application database such as `autocare`; TiDB's `sys` schema is reserved for system views. For TiDB Cloud, include `?sslaccept=strict`. The runtime adapter translates this to a verified TLS connection. The Prisma CLI uses the URL directly.

The seed creates the records mapped in `DATABASE_MAPPING.md` and is safe to re-run. To create an initial admin login, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding. Do not use the example password in a deployed environment.

```bash
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

Customer accounts are created through `/register`. Admin CRUD and exports require an admin session; customer APIs scope records to the signed-in customer.
