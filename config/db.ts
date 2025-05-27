import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Load environment variables
const env = await loadEnv();

const dbConfig = {
  hostname: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  db: env.DB_NAME,
  poolSize: 10,
};

// ✅ NodeGenesis Universal Database Client
export const db = await new Client().connect({
  hostname: dbConfig.hostname,
  username: dbConfig.username,
  password: dbConfig.password,
  db: dbConfig.db,
  poolSize: dbConfig.poolSize,
});

// ✅ Test Connection
try {
  const result = await db.execute("SELECT 1");
  console.log("✨===========================================✨");
  console.log("✅ NodeGenesis Universal Database Connected");
  console.log("✨ Database:", dbConfig.db);
  console.log("✨ Host:", dbConfig.hostname);
  console.log("✨===========================================✨");
} catch (err) {
  console.error("❌ Database connection error:", err.message);
  Deno.exit(1);
}