import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  submitAppointment,
  fetchAppointments,
  deleteAppointment,
} from "../controllers/appointmentController.ts";
import { verifyAdminToken } from "../middleware/authMiddleware.ts";

const router = new Router();

// Public Route: POST /api/appointments
router.post("/", async (ctx: Context) => {
  await submitAppointment(ctx);
});

// Admin-Protected Routes
router.get("/", verifyAdminToken, async (ctx: Context) => {
  await fetchAppointments(ctx);
});

router.delete("/:id", verifyAdminToken, async (ctx: Context) => {
  await deleteAppointment(ctx);
});

export default router;