import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.ts";
import { verifyAdminToken } from "../middleware/authMiddleware.ts";
import { handleFileUpload } from "../config/upload.ts";

const router = new Router();

// === GET /api/projects (Public)
router.get("/", getAllProjects);

// === POST /api/projects (Admin, with file upload)
router.post("/", verifyAdminToken, async (ctx: Context) => {
  const body = await ctx.request.body({ type: "form-data" });
  const formData = await body.value.read({ maxSize: 10_000_000 });

  // Build a native FormData instance
  const nativeForm = new FormData();

  for (const [key, value] of Object.entries(formData.fields)) {
    nativeForm.append(key, value);
  }

  for (const file of formData.files || []) {
    if (file.content && file.originalName) {
      const blob = new Blob([file.content], { type: file.contentType });
      const fileObj = new File([blob], file.originalName, {
        type: file.contentType,
      });
      nativeForm.append(file.name, fileObj);
    }
  }

  const uploaded = await handleFileUpload(nativeForm);
  if (uploaded.length > 0) {
    formData.fields.image = uploaded[0];
  }

  ctx.state.formData = formData.fields;
  await createProject(ctx);
});

// === PUT /api/projects/:id (Admin, with optional file upload)
router.put("/:id", verifyAdminToken, async (ctx: Context) => {
  const body = await ctx.request.body({ type: "form-data" });
  const formData = await body.value.read({ maxSize: 10_000_000 });

  const nativeForm = new FormData();

  for (const [key, value] of Object.entries(formData.fields)) {
    nativeForm.append(key, value);
  }

  for (const file of formData.files || []) {
    if (file.content && file.originalName) {
      const blob = new Blob([file.content], { type: file.contentType });
      const fileObj = new File([blob], file.originalName, {
        type: file.contentType,
      });
      nativeForm.append(file.name, fileObj);
    }
  }

  const uploaded = await handleFileUpload(nativeForm);
  if (uploaded.length > 0) {
    formData.fields.image = uploaded[0];
  }

  ctx.state.formData = formData.fields;
  await updateProject(ctx);
});

// === DELETE /api/projects/:id (Admin)
router.delete("/:id", verifyAdminToken, deleteProject);

export default router;