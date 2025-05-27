import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getDashboardOverview } from "../controllers/dashboardController.ts";
import { verifyAdminToken } from "../middleware/authMiddleware.ts";

const router = new Router();

// Protected route: GET /api/dashboard
router.get("/", verifyAdminToken, async (ctx: Context) => {
  await getDashboardOverview(ctx);
});

export default router;