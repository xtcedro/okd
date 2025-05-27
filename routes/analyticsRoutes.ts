import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getSiteAnalytics } from "../controllers/analyticsController.ts";

const router = new Router();

// Route: GET /api/analytics
router.get("/", async (ctx: Context) => {
  try {
    await getSiteAnalytics(ctx);
  } catch (err) {
    ctx.throw(500, "Failed to fetch analytics data");
  }
});

export default router;