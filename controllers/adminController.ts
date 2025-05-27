import { Context } from "https://deno.land/x/oak/mod.ts";
import { compare } from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { db } from "../config/db.ts";
import { jwtKey } from "../utils/authKey.ts"; // ✅ use shared CryptoKey

const env = config();
const SITE_KEY = env.SITE_KEY;

if (!SITE_KEY) {
  console.error("Fatal Error: SITE_KEY is not defined in .env");
  throw new Error("Missing SITE_KEY");
}

export async function adminLogin(ctx: Context): Promise<void> {
  console.log("adminLogin: Received login request");

  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { success: false, message: "Request body is required" };
      return;
    }

    const body = ctx.request.body({ type: "json" });
    const value = await body.value;
    const username = (value as Record<string, unknown>).username;
    const password = (value as Record<string, unknown>).password;

    if (typeof username !== "string" || typeof password !== "string") {
      ctx.response.status = 400;
      ctx.response.body = { success: false, message: "Username and password are required" };
      return;
    }

    console.log(`adminLogin: Attempting login for "${username}"`);

    const result = await db.query(
      "SELECT id, username, password_hash FROM admin_users WHERE username = ? AND site_key = ?",
      [username, SITE_KEY]
    );

    if (result.length === 0) {
      ctx.response.status = 401;
      ctx.response.body = { success: false, message: "Invalid username or password" };
      return;
    }

    const user = result[0];
    const match = await compare(password, user.password_hash);

    if (!match) {
      ctx.response.status = 401;
      ctx.response.body = { success: false, message: "Invalid username or password" };
      return;
    }

    console.log("adminLogin: Password verified, creating token");

    const payload = {
      id: user.id,
      username: user.username,
      siteKey: SITE_KEY,
      exp: getNumericDate(60 * 60 * 24 * 7), // 7 days
    };

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, jwtKey);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      message: "Authentication successful",
      token,
    };

    console.log(`adminLogin: Login success for "${username}"`);
  } catch (err) {
    console.error("adminLogin: Error:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: "Internal server error" };
  }
}