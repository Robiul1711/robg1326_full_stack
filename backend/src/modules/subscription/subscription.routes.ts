import { Router } from "express";
import {
  createCheckoutSession,
  verifySession,
  handleWebhook,
  getAllSubscriptions,
} from "./subscription.controller";
import { authenticate, authorizeAdmin } from "../../common/middleware";

const router = Router();

// User Stripe Checkout Session
router.post("/checkout", authenticate, createCheckoutSession);
router.post("/verify", authenticate, verifySession);

// Stripe Webhook (Raw body is handled or JSON depending on stripe config)
router.post("/webhook", handleWebhook);

// Admin Orders / Subscriptions List
router.get("/admin/orders", authenticate, authorizeAdmin, getAllSubscriptions);

export default router;
