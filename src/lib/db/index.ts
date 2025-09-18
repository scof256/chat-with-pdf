import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

let dbInstance: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (dbInstance) {
    return dbInstance;
  }
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error("database url not found");
  }
  const sql = neon(process.env.NEON_DATABASE_URL);
  dbInstance = drizzle(sql);
  return dbInstance;
};

// This is a proxy to the db instance so that we can use it in the old way
// This is not ideal, but it will save us from refactoring all the files that use db
export const db = new Proxy(
  {},
  {
    get: (_, prop) => {
      return getDb()[prop as keyof typeof db];
    },
  }
) as ReturnType<typeof drizzle>;
