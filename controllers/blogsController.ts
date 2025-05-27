import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { db } from "../config/db.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const SITE_KEY = env.SITE_KEY;

// === GET all blog posts ===
export const getAllBlogs = async (ctx: Context) => {
  try {
    const result = await db.execute(
      "SELECT * FROM blogs WHERE site_key = ? ORDER BY created_at DESC",
      [SITE_KEY],
    );

    const rows = result.rows ?? [];
    ctx.response.status = 200;
    ctx.response.body = rows;
  } catch (err) {
    console.error("❌ Error fetching blogs:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};

// === POST a new blog post ===
export const createBlogPost = async (ctx: Context) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const { title, author, summary, content } = await body.value;

    if (!title || !author || !summary || !content) {
      ctx.response.status = 400;
      ctx.response.body = { error: "All fields are required." };
      return;
    }

    await db.execute(
      `INSERT INTO blogs (site_key, title, author, summary, content) 
       VALUES (?, ?, ?, ?, ?)`,
      [SITE_KEY, title, author, summary, content],
    );

    ctx.response.status = 201;
    ctx.response.body = { message: "Blog post created successfully." };
  } catch (err) {
    console.error("❌ Error creating blog post:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};

// === PUT to update a blog post ===
export const updateBlogPost = async (ctx: Context) => {
  const blogId = ctx.params.id;

  try {
    const body = ctx.request.body({ type: "json" });
    const { title, author, summary, content } = await body.value;

    if (!title || !author || !summary || !content) {
      ctx.response.status = 400;
      ctx.response.body = { error: "All fields are required." };
      return;
    }

    const result = await db.execute(
      `UPDATE blogs 
       SET title = ?, author = ?, summary = ?, content = ?, updated_at = NOW() 
       WHERE id = ? AND site_key = ?`,
      [title, author, summary, content, blogId, SITE_KEY],
    );

    if (result.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Blog post not found." };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Blog post updated successfully." };
  } catch (err) {
    console.error("❌ Error updating blog post:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};

// === DELETE a blog post ===
export const deleteBlogPost = async (ctx: Context) => {
  const blogId = ctx.params.id;

  try {
    const result = await db.execute(
      "DELETE FROM blogs WHERE id = ? AND site_key = ?",
      [blogId, SITE_KEY],
    );

    if (result.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Blog post not found or already deleted." };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Blog post deleted successfully." };
  } catch (err) {
    console.error("❌ Error deleting blog post:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};