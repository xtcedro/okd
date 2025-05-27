import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { adminLogin } from "../controllers/adminController.ts";
import { verifyAdminToken } from "../middleware/authMiddleware.ts";

const router = new Router();

// Admin Login Route
router.post("/login", async (ctx: Context) => {
  await adminLogin(ctx);
});


export default router;
