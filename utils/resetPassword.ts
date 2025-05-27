// resetPassword.ts
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { db } from "../config/db.ts";

const prompt = async (label: string): Promise<string> => {
  const input = promptSync(`${label}: `);
  if (!input) throw new Error(`${label} is required`);
  return input.trim();
};

// Wrapper to use Deno.prompt()
const promptSync = (message: string): string | null => {
  const buf = new Uint8Array(1024);
  Deno.stdout.writeSync(new TextEncoder().encode(message));
  const n = <number> Deno.stdin.readSync(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
};

try {
  console.log("\n=== Admin Password Reset Utility ===");

  const username = await prompt("Username");
  const siteKey = await prompt("Site Key");
  const newPassword = await prompt("New Password");

  const [user] = await db.query(
    "SELECT id FROM admin_users WHERE username = ? AND site_key = ?",
    [username, siteKey]
  );

  if (!user) {
    console.error("❌ Admin user not found.");
    Deno.exit(1);
  }

  const hashed = await hash(newPassword);
  await db.execute(
    "UPDATE admin_users SET password_hash = ? WHERE username = ? AND site_key = ?",
    [hashed, username, siteKey]
  );

  console.log("✅ Password updated successfully.");
  Deno.exit(0);
} catch (err) {
  console.error("❌ Error:", err.message);
  Deno.exit(1);
}