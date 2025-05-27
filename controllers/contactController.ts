import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { db } from "../config/db.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const SITE_KEY = env.SITE_KEY;

// === Submit a Contact Message ===
export const submitContactMessage = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { name, email, phone, message } = await value;

    if (!name || !phone || !message) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Name, phone, and message are required.",
      };
      return;
    }

    await db.execute(
      `INSERT INTO contact_messages (site_key, name, email, phone, message, submitted_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [SITE_KEY, name, email || null, phone, message],
    );

    ctx.response.status = 200;
    ctx.response.body = { message: "Message submitted successfully." };
  } catch (error) {
    console.error("❌ Error submitting contact message:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};

export const fetchContactMessages = async (ctx: Context) => {
  try {
    const result = await db.execute(
      `SELECT * FROM contact_messages 
       WHERE site_key = ? 
       ORDER BY submitted_at DESC`,
      [SITE_KEY],
    );

    const messages = result.rows ?? [];

    ctx.response.status = 200;
    ctx.response.body = messages;
  } catch (error) {
    console.error("❌ Error fetching contact messages:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};

export const deleteContactMessage = async (ctx: Context) => {
  const id = ctx.params.id;

  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Contact message ID is required." };
    return;
  }

  try {
    const result = await db.execute(
      `DELETE FROM contact_messages WHERE id = ? AND site_key = ?`,
      [id, SITE_KEY],
    );

    if (result.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Message not found." };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Contact message deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting contact message:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};