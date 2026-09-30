import { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../../config/env";
import { successResponse, errorResponse } from "../../common/response";
import { User } from "../auth/auth.model";
import { Subscription } from "./subscription.model";
import { CMSContent, IPackageItem } from "../cms/cms.model";

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16" as any,
    })
  : null;

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return errorResponse(res, "Stripe is not configured on the server", 500);
    }

    const { plan = "monthly", packageId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, "User must be logged in to create a checkout session", 401);
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    let clientUrl = env.CLIENT_URL || "https://bet-snipe.vercel.app";
    const originHeader = req.headers.origin;
    if (originHeader && (originHeader.includes("localhost") || originHeader.includes("vercel.app") || originHeader.includes("betsnipe"))) {
      clientUrl = originHeader;
    }
    clientUrl = clientUrl.replace(/\/$/, "");

    // Fetch CMS content for dynamic packages
    const cms = await CMSContent.findOne();
    let selectedPackage: IPackageItem | undefined = undefined;

    if (cms?.packages && cms.packages.length > 0) {
      selectedPackage = cms.packages.find(
        (p: IPackageItem) =>
          p.id === packageId ||
          p.id === plan ||
          p.name.toLowerCase() === String(plan).toLowerCase() ||
          p.name.toLowerCase() === String(packageId).toLowerCase()
      );
    }

    let planName = "BetSnipe Membership";
    let planDescription = "Access to sports betting intelligence and signal bots";
    let amountInCents = 4900;

    if (selectedPackage) {
      planName = `BetSnipe ${selectedPackage.name}`;
      planDescription = selectedPackage.subtitle || `Access to ${selectedPackage.name} tier`;
      amountInCents = Math.round((Number(selectedPackage.price) || 14.99) * 100);
    } else if (plan === "monthly") {
      amountInCents = cms?.pricing?.monthlyPrice ? cms.pricing.monthlyPrice * 100 : 4900;
      planName = "BetSnipe Monthly Pro Plan";
      planDescription = "Monthly subscription for sports betting intelligence & discord bot";
    } else if (plan === "yearly") {
      amountInCents = cms?.pricing?.yearlyPrice ? cms.pricing.yearlyPrice * 100 : 39900;
      planName = "BetSnipe Annual VIP Plan";
      planDescription = "Annual VIP access to high-value betting signals with priority perks";
    }

    // Create or retrieve Stripe Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // For Free Trial immediate activation
    if (plan === "trial") {
      user.subscriptionPlan = "trial";
      user.subscriptionStatus = "active";
      user.subscriptionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await user.save();

      await Subscription.create({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        plan: "trial",
        amount: 0,
        currency: "usd",
        status: "active",
        stripeCustomerId: customerId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: user.subscriptionExpiresAt,
      });

      return successResponse(
        res,
        {
          url: `${clientUrl}?trial_success=true`,
          message: "7-Day Free Trial activated successfully",
        },
        200,
        "Trial activated"
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: planDescription,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${clientUrl}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}?payment_cancelled=true`,
      metadata: {
        userId: user._id.toString(),
        plan: selectedPackage ? selectedPackage.name : plan,
        packageId: selectedPackage ? selectedPackage.id : (packageId || plan),
      },
    });

    // Save preliminary record
    await Subscription.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      plan: (selectedPackage ? selectedPackage.name : plan) as any,
      amount: amountInCents / 100,
      currency: "usd",
      status: "pending",
      stripeSessionId: session.id,
      stripeCustomerId: customerId,
    });

    return successResponse(
      res,
      {
        url: session.url,
        sessionId: session.id,
      },
      200,
      "Checkout session created successfully"
    );
  } catch (error: any) {
    console.error("❌ Stripe Checkout Creation Error:", error);
    return errorResponse(res, error.message || "Failed to create Stripe checkout session", 500);
  }
};

export const verifySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return errorResponse(res, "Session ID is required", 400);
    }

    if (sessionId.startsWith("mock_session_")) {
      const sub = await Subscription.findOne({ stripeSessionId: sessionId });
      if (sub) {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await User.findByIdAndUpdate(sub.userId, {
          subscriptionPlan: sub.plan,
          subscriptionStatus: "active",
          subscriptionExpiresAt: expiresAt,
        });
        sub.status = "active";
        sub.currentPeriodStart = new Date();
        sub.currentPeriodEnd = expiresAt;
        await sub.save();
      }
      return successResponse(res, { verified: true }, 200, "Payment verified successfully");
    }

    if (!stripe) {
      return errorResponse(res, "Stripe is not configured", 500);
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return errorResponse(res, "Payment has not been completed", 400);
    }

    const userId = session.metadata?.userId;
    const plan = (session.metadata?.plan || "monthly") as any;

    if (userId) {
      const expirationDays = String(plan).toLowerCase().includes("whale") || String(plan).toLowerCase().includes("yearly") ? 365 : 30;
      const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

      await User.findByIdAndUpdate(userId, {
        subscriptionPlan: plan,
        subscriptionStatus: "active",
        subscriptionExpiresAt: expiresAt,
      });

      await Subscription.findOneAndUpdate(
        { stripeSessionId: sessionId },
        {
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: expiresAt,
        }
      );
    }

    return successResponse(res, { verified: true }, 200, "Payment verified successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Session verification failed", 500);
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  if (!stripe || !env.STRIPE_WEBHOOK_SECRET || !sig) {
    return res.status(400).send("Webhook configuration missing");
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = (session.metadata?.plan || "monthly") as "monthly" | "yearly";

    if (userId) {
      const expirationDays = plan === "yearly" ? 365 : 30;
      const expiresAt = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);

      await User.findByIdAndUpdate(userId, {
        subscriptionPlan: plan,
        subscriptionStatus: "active",
        subscriptionExpiresAt: expiresAt,
      });

      await Subscription.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: expiresAt,
        }
      );
    }
  }

  return res.json({ received: true });
};

// Admin: Get All Orders / Subscriptions
export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });
    return successResponse(res, subscriptions, 200, "Subscriptions fetched successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to fetch subscriptions", 500);
  }
};
