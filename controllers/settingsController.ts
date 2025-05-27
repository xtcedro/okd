import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { db } from "../config/db.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const SITE_KEY = env.SITE_KEY;

// === GET /api/settings ===
export const getSiteSettings = async (ctx: Context) => {
  try {
    const settings = await db.query(
      "SELECT hero_headline, contact_email, business_phone FROM site_settings WHERE site_key = ? LIMIT 1",
      [SITE_KEY],
    );

    if (!settings || settings.length === 0) {
      console.warn(`⚠️ No settings found for site key: ${SITE_KEY}`);
      ctx.response.status = 404;
      ctx.response.body = { error: `Settings not found for ${SITE_KEY}` };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = settings[0]; // Object with expected keys
    console.log("✅ Site settings fetched for:", SITE_KEY);
  } catch (err) {
    console.error("❌ Error fetching settings:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};

// === POST /api/settings ===
export const updateSiteSettings = async (ctx: Context) => {
  const { value } = await ctx.request.body({ type: "json" });
  const { heroHeadline, contactEmail, businessPhone } = await value;

  if (!heroHeadline || !contactEmail || !businessPhone) {
    ctx.response.status = 400;
    ctx.response.body = { error: "All fields are required" };
    return;
  }

  try {
    const existing = await db.query(
      "SELECT id FROM site_settings WHERE site_key = ?",
      [SITE_KEY],
    );

    if (!existing || existing.length === 0) {
      await db.execute(
        `INSERT INTO site_settings (site_key, hero_headline, contact_email, business_phone)
         VALUES (?, ?, ?, ?)`,
        [SITE_KEY, heroHeadline, contactEmail, businessPhone],
      );
      console.log("🆕 Inserted new settings for site:", SITE_KEY);
    } else {
      await db.execute(
        `UPDATE site_settings
         SET hero_headline = ?, contact_email = ?, business_phone = ?
         WHERE site_key = ?`,
        [heroHeadline, contactEmail, businessPhone, SITE_KEY],
      );
      console.log("✏️ Updated settings for site:", SITE_KEY);
    }

    ctx.response.status = 200;
    ctx.response.body = { message: `Settings updated for ${SITE_KEY}` };
  } catch (err) {
    console.error("❌ Error updating settings:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};