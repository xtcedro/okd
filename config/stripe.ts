import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import Stripe from "npm:stripe"; // or your preferred Stripe version

const env = await loadEnv();
const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia", // Replace with your actual Stripe API version
});

export default stripe;
