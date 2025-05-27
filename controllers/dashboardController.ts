import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// === GET /api/dashboard ===
// Returns dashboard overview content structure for the admin panel
export const getDashboardOverview = async (ctx: Context) => {
  console.log("📡 [Dashboard] Admin overview request received.");
  console.log("🔐 Verifying dashboard access...");

  const overviewPayload = {
    welcomeMessage: "Welcome to the Admin Dashboard!",
    contentSections: [
      { label: "✏️ Manage Blogs", link: "manage-blogs.html" },
      { label: "📅 Manage Appointments", link: "public-appointments.html" },
      { label: "📅 Manage Projects", link: "manage-projects.html" },
    ],
    systemTools: [
      { label: "📊 View Site Analytics", link: "site-analytics.html" },
      { label: "⚙️ Site Settings", link: "settings.html" },
      { label: "📫 User Messages", link: "user-messages.html" },
      { label: "💳 Stripe Terminal", link: "terminal.html" } // Added terminal link
    ],
  };

  console.log("✅ [Dashboard] Overview content prepared and delivered.");
  ctx.response.status = 200;
  ctx.response.body = overviewPayload;
};
