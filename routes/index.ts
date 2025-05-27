import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { send } from "https://deno.land/x/oak@v12.6.1/send.ts";

// Modular route imports
import adminRoutes from "./adminRoutes.ts";
import analyticsRoutes from "./analyticsRoutes.ts";
import appointmentRoutes from "./appointmentRoutes.ts";
import blogRoutes from "./blogRoutes.ts";
import chatRoutes from "./chatRoutes.ts";
import contactRoutes from "./contactRoutes.ts";
import dashboardRoutes from "./dashboardRoutes.ts";
import settingsRoutes from "./settingsRoutes.ts";
import stripeRoutes from "./stripeRoutes.ts";
import projectRoutes from "./projectRoutes.ts";

const router = new Router();


router.get("/", async (ctx) => {
  await send(ctx, "/public/pages/home/index.html", {
    root: Deno.cwd(),
    index: "index.html",
  });
});


// === Route Registry Logging ===
console.log("\x1b[32m%s\x1b[0m", "\n🔗 Registering API Routes...\n");

router.use("/api/admin", adminRoutes.routes(), adminRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Admin routes loaded at /api/admin");

router.use("/api/analytics", analyticsRoutes.routes(), analyticsRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Analytics routes loaded at /api/analytics");

router.use("/api/appointments", appointmentRoutes.routes(), appointmentRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Appointment routes loaded at /api/appointments");

router.use("/api/blogs", blogRoutes.routes(), blogRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Blog routes loaded at /api/blogs");

router.use("/api/chat", chatRoutes.routes(), chatRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Chat routes loaded at /api/chat");

router.use("/api/contact", contactRoutes.routes(), contactRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Contact routes loaded at /api/contact");

router.use("/api/dashboard", dashboardRoutes.routes(), dashboardRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Dashboard routes loaded at /api/dashboard");

router.use("/api/settings", settingsRoutes.routes(), settingsRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Settings routes loaded at /api/settings");

router.use("/api/stripe", stripeRoutes.routes(), stripeRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Stripe routes loaded at /api/stripe");

router.use("/api/projects", projectRoutes.routes(), projectRoutes.allowedMethods());
console.log("\x1b[36m%s\x1b[0m", "➡️  Projects routes loaded at /api/projects");

console.log("\x1b[32m%s\x1b[0m", "\n✅ All API routes successfully registered.");
console.log("\x1b[33m%s\x1b[0m", "🚀 Your framework is modular, future-ready, and thriving.\n");


export default router;
