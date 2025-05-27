import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  submitContactMessage,
  fetchContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.ts";
import { verifyAdminToken } from "../middleware/authMiddleware.ts";

const router = new Router();

// Public: Submit contact form
router.post("/", async (ctx: Context) => {
  await submitContactMessage(ctx);
});

// Admin: Fetch all contact messages
router.get("/", verifyAdminToken, async (ctx: Context) => {
  await fetchContactMessages(ctx);
});

// Admin: Delete contact message
router.delete("/:id", verifyAdminToken, async (ctx: Context) => {
  await deleteContactMessage(ctx);
});

export default router;