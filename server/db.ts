import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Test the connection
db.select().from(schema.products).execute()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    throw error;
  });