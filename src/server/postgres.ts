import { Pool } from "pg";
import { env } from "@/server/env";

let pool: Pool | undefined;

export function getPostgresPool() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum tersedia.");
  }

  pool ??= new Pool({
    connectionString: env.DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
}

export async function checkPostgresConnection() {
  const result = await getPostgresPool().query<{
    now: Date;
    current_database: string;
    current_user: string;
  }>("select now(), current_database(), current_user");

  return result.rows[0];
}
