import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/settingsController.ts";
import { verifyAdminToken } from "../middleware/authMiddleware.ts";

const router = new Router();

// Public: GET /api/settings
router.get("/", async (ctx: Context) => {
  await getSiteSettings(ctx);
});

// Protected: POST /api/settings
router.post("/", verifyAdminToken, async (ctx: Context) => {
  await updateSiteSettings(ctx);
});

export default router;