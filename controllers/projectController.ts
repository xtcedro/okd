import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { db } from "../config/db.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const SITE_KEY = env.SITE_KEY;

// === GET /api/projects ===
export const getAllProjects = async (ctx: Context) => {
  try {
    const result = await db.execute(
      "SELECT * FROM projects WHERE site_key = ? ORDER BY created_at DESC",
      [SITE_KEY],
    );

    const projects = result.rows ?? [];

    console.log(`📦 ${projects.length} projects retrieved.`);
    ctx.response.status = 200;
    ctx.response.body = projects;
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch projects." };
  }
};

// === POST /api/projects ===
export const createProject = async (ctx: Context) => {
  try {
    const form = ctx.state.formData || {};
    const { title, description, image } = form;

    if (!title || !description || !image) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Title, description, and image are required.",
      };
      return;
    }

    await db.execute(
      `INSERT INTO projects (site_key, title, image, description, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [SITE_KEY, title, image, description],
    );

    console.log("✅ Project created:", title);
    ctx.response.status = 201;
    ctx.response.body = { message: "Project created successfully." };
  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to create project." };
  }
};

// === PUT /api/projects/:id ===
export const updateProject = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const form = ctx.state.formData || {};
    const { title, description, image } = form;

    if (!title || !description) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Title and description are required." };
      return;
    }

    const query = image
      ? `UPDATE projects SET title = ?, image = ?, description = ?, updated_at = NOW()
         WHERE id = ? AND site_key = ?`
      : `UPDATE projects SET title = ?, description = ?, updated_at = NOW()
         WHERE id = ? AND site_key = ?`;

    const params = image
      ? [title, image, description, id, SITE_KEY]
      : [title, description, id, SITE_KEY];

    const result = await db.execute(query, params);

    if (result.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "Project not found or site key mismatch.",
      };
      return;
    }

    console.log("✏️ Project updated:", id);
    ctx.response.status = 200;
    ctx.response.body = { message: "Project updated successfully." };
  } catch (error) {
    console.error("❌ Error updating project:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to update project." };
  }
};

// === DELETE /api/projects/:id ===
export const deleteProject = async (ctx: Context) => {
  try {
    const id = ctx.params.id;

    const result = await db.execute(
      "DELETE FROM projects WHERE id = ? AND site_key = ?",
      [id, SITE_KEY],
    );

    if (result.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "Project not found or site key mismatch.",
      };
      return;
    }

    console.log("🗑️ Project deleted:", id);
    ctx.response.status = 200;
    ctx.response.body = { message: "Project deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting project:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to delete project." };
  }
};