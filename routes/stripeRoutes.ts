import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  createPaymentIntent,
  fetchTransactions,
  listReaders,
  createConnectionToken,
  createTerminalPaymentIntent,
  captureTerminalPaymentIntent,
  cancelTerminalPaymentIntent,
} from "../controllers/stripeController.ts";

const router = new Router();

// Online payments
router.post("/create-payment-intent", async (ctx: Context) => {
  await createPaymentIntent(ctx);
});

router.get("/transactions", async (ctx: Context) => {
  await fetchTransactions(ctx);
});

// Stripe Terminal
router.get("/terminal/readers", async (ctx: Context) => {
  await listReaders(ctx);
});

router.post("/terminal/connection-token", async (ctx: Context) => {
  await createConnectionToken(ctx);
});

router.post("/terminal/payment-intent", async (ctx: Context) => {
  await createTerminalPaymentIntent(ctx);
});

router.post("/terminal/capture", async (ctx: Context) => {
  await captureTerminalPaymentIntent(ctx);
});

router.post("/terminal/cancel", async (ctx: Context) => {
  await cancelTerminalPaymentIntent(ctx);
});

export default router;