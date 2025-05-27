import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import stripe from "../config/stripe.ts";

// === Create PaymentIntent (Online) ===
export const createPaymentIntent = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { amount } = await value;

    if (!amount || isNaN(amount) || amount <= 0) {
      console.warn("⚠️ Invalid amount received for PaymentIntent:", amount);
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid amount" };
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    console.log("💳 Created PaymentIntent:", paymentIntent.id);
    ctx.response.status = 200;
    ctx.response.body = { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("❌ Error creating PaymentIntent:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
  }
};

// === Fetch Recent Transactions ===
export const fetchTransactions = async (ctx: Context) => {
  try {
    const payments = await stripe.paymentIntents.list({ limit: 10 });

    console.log("📄 Fetched recent transactions:", payments.data.length);
    const cleaned = payments.data.map((intent) => ({
      id: intent.id,
      amount: intent.amount,
      created: intent.created,
      status: intent.status,
      payment_method_types: intent.payment_method_types,
    }));

    ctx.response.status = 200;
    ctx.response.body = cleaned;
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Unable to fetch transactions" };
  }
};

// === List Stripe Terminal Readers ===
export const listReaders = async (ctx: Context) => {
  try {
    const readers = await stripe.terminal.readers.list({ limit: 10 });
    console.log("📡 Listed Stripe readers:", readers.data.length);
    ctx.response.status = 200;
    ctx.response.body = readers.data;
  } catch (err) {
    console.error("❌ Error listing readers:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to list readers" };
  }
};

// === Create Stripe Terminal Connection Token ===
export const createConnectionToken = async (ctx: Context) => {
  try {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    console.log("🔐 Created Stripe Terminal connection token.");
    ctx.response.status = 200;
    ctx.response.body = { secret: connectionToken.secret };
  } catch (err) {
    console.error("❌ Error creating connection token:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to create connection token" };
  }
};

// === Create Terminal PaymentIntent ===
export const createTerminalPaymentIntent = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { amount } = await value;

    if (!amount || isNaN(amount) || amount <= 0) {
      console.warn("⚠️ Invalid amount for terminal PaymentIntent:", amount);
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid amount" };
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card_present"],
      capture_method: "manual",
    });

    console.log("💳 Created Terminal PaymentIntent:", paymentIntent.id);
    ctx.response.status = 200;
    ctx.response.body = { paymentIntent };
  } catch (err) {
    console.error("❌ Error creating terminal PaymentIntent:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to create terminal payment intent" };
  }
};

// === Capture Terminal PaymentIntent ===
export const captureTerminalPaymentIntent = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { paymentIntentId } = await value;

    if (!paymentIntentId) {
      console.warn("⚠️ Missing paymentIntentId in capture request.");
      ctx.response.status = 400;
      ctx.response.body = { error: "Missing paymentIntentId" };
      return;
    }

    const intent = await stripe.paymentIntents.capture(paymentIntentId);
    console.log("✅ Captured Terminal PaymentIntent:", paymentIntentId);
    ctx.response.status = 200;
    ctx.response.body = intent;
  } catch (err) {
    console.error("❌ Error capturing terminal payment:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to capture payment" };
  }
};

// === Cancel Terminal PaymentIntent ===
export const cancelTerminalPaymentIntent = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { paymentIntentId } = await value;

    if (!paymentIntentId) {
      console.warn("⚠️ Missing paymentIntentId in cancel request.");
      ctx.response.status = 400;
      ctx.response.body = { error: "Missing paymentIntentId" };
      return;
    }

    const intent = await stripe.paymentIntents.cancel(paymentIntentId);
    console.log("❎ Cancelled Terminal PaymentIntent:", paymentIntentId);
    ctx.response.status = 200;
    ctx.response.body = intent;
  } catch (err) {
    console.error("❌ Error canceling terminal payment:", err.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to cancel payment" };
  }
};