import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import router from "./routes/index.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const env = await loadEnv();
const app = new Application();
const port = parseInt(env.PORT || "3000");

// === DENOGENESIS FRAMEWORK BOOTUP LOGS ===
const version = "v1.3.0";
const buildDate = "May 19, 2025";

console.log("\x1b[35m%s\x1b[0m", "✨========================================================✨");
console.log("\x1b[36m%s\x1b[0m", "         Welcome to the DenoGenesis Framework Engine");
console.log("\x1b[33m%s\x1b[0m", `         ⚙️  Version: ${version}`);
console.log("\x1b[33m%s\x1b[0m", `         📅 Build Date: ${buildDate}`);
console.log("\x1b[33m%s\x1b[0m", "         🚀 Developed by Pedro M. Dominguez");
console.log("\x1b[35m%s\x1b[0m", "✨========================================================✨");

console.log("\x1b[32m%s\x1b[0m", "💡 This isn't just code — it's a revolution in motion.");
console.log("\x1b[36m%s\x1b[0m", "🔓 Powered by Deno. Structured by Oak. Hardened on Debian.");
console.log("\x1b[34m%s\x1b[0m", "🔗 GitHub: https://github.com/xtcedro");
console.log("\x1b[32m%s\x1b[0m", "🌍 Pedro M. Dominguez is democratizing technology in Oklahoma City");
console.log("\x1b[32m%s\x1b[0m", "   — one system, one local business, one breakthrough at a time.");
console.log("\x1b[33m%s\x1b[0m", "⚡  Bringing AI, automation, and full-stack innovation to the people.");
console.log("\x1b[32m%s\x1b[0m", "🛠️  This is DenoGenesis — born from purpose, built with precision.");
console.log("\x1b[36m%s\x1b[0m", "✨ Let's rebuild the web — together.\n");

// === STATIC FILE MIDDLEWARE (Public Assets) ===
app.use(async (ctx, next) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".ttf", ".woff2", ".html"];

  if (fileWhitelist.some(ext => filePath.endsWith(ext))) {
    try {
      await send(ctx, filePath, {
        root: `${Deno.cwd()}/public`,
        index: "index.html",
      });
      return;
    } catch {
      // Let it fall through to 404
    }
  }

  await next();
});


app.use(oakCors({
  origin: "https://domingueztechsolutions.com",
  credentials: true, // allow cookies if needed
}));

// === ROUTES ===
app.use(router.routes());
app.use(router.allowedMethods());

// === 404 FALLBACK ===
app.use(async (ctx) => {
  ctx.response.status = 404;
  await send(ctx, "/pages/errors/404.html", {
    root: `${Deno.cwd()}/public`,
  });
});

// === START SERVER ===
console.log("\x1b[32m%s\x1b[0m", `⚙️  DenoGenesis server is now running on http://localhost:${port}`);
await app.listen({ port });
