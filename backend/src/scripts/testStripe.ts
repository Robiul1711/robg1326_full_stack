import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

async function testKey() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  console.log("Testing Key:", key.substring(0, 15) + "..." + key.substring(key.length - 6));
  console.log("Key length:", key.length);

  const stripe = new Stripe(key, { apiVersion: "2023-10-16" as any });
  try {
    const res = await stripe.balance.retrieve();
    console.log("SUCCESS: Stripe connection works!", res);
  } catch (err: any) {
    console.error("FAILED with message:", err.message);
  }
}

testKey();
