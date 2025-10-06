import { db } from "@/db/init";
import { sql } from "drizzle-orm";

async function main() {
  // Drop tables in order (respecting foreign key constraints)
  await db.execute(sql`DROP TABLE IF EXISTS "link_clicks" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "short_links" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE`);

  console.log("✓ All tables dropped successfully");
}

main();
