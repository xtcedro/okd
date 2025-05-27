import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { db } from "../config/db.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const SITE_KEY = env.SITE_KEY;

/**
 * GET /api/analytics
 * Returns dashboard statistics for appointments, blogs, and contact messages
 */
export const getSiteAnalytics = async (ctx: Context) => {
  try {
    const [[{ totalAppointments }]] = await db.execute(
      "SELECT COUNT(*) AS totalAppointments FROM appointments WHERE site_key = ?",
      [SITE_KEY],
    );

    const [[{ totalBlogs }]] = await db.execute(
      "SELECT COUNT(*) AS totalBlogs FROM blogs WHERE site_key = ?",
      [SITE_KEY],
    );

    const [[{ totalMessages }]] = await db.execute(
      "SELECT COUNT(*) AS totalMessages FROM contact_messages WHERE site_key = ?",
      [SITE_KEY],
    );

    ctx.response.status = 200;
    ctx.response.body = {
      totalAppointments,
      totalBlogs,
      totalMessages,
    };
  } catch (error) {
    console.error("❌ [AnalyticsController] Error:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};