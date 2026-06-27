import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../config";
import * as schema from "./schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool, { schema });
export { schema };
