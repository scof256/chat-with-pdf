import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

let dbInstance: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
    if (!dbInstance) {
        // Note: NEON_DATABASE_URL is not checked here to allow builds to succeed
        // without the environment variable being set. It is required at runtime.
        // Vercel dashboard screenshot showed POSTGRES_URL, POSTGRES_PRISMA_URL,
        // and DATABASE_URL_UNPOOLED. Ensure one of these is renamed to NEON_DATABASE_URL.
        if (!process.env.NEON_DATABASE_URL) {
            throw new Error("database url not found");
        }
        const sql = neon(process.env.NEON_DATABASE_URL);
        dbInstance = drizzle(sql);
    }
    return dbInstance;
}

