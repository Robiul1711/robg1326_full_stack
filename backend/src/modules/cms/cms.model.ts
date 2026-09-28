import mongoose, { Schema, Document } from "mongoose";

export interface IFaqItem {
  id: number;
  q: string;
  a: string;
}

export interface ITestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface IPackageItem {
  id: string;
  name: string;
  popular: boolean;
  originalPrice: string;
  discountPrice: string;
  price: number;
  period: string;
  subtitle: string;
  features: string[];
  cta: string;
  accessNote?: string;
}

export interface ICMSContent extends Document {
  hero: {
    headline: string;
    subheadline: string;
    ctaButtonText: string;
    trialBadgeText: string;
  };
  pricing: {
    monthlyPrice: number;
    yearlyPrice: number;
    trialDays: number;
    features: string[];
  };
  packages: IPackageItem[];
  siteSettings: {
    siteName: string;
    supportEmail: string;
    telegramLink: string;
    discordLink: string;
    announcementBanner: string;
    isAnnouncementActive: boolean;
  };
  rulesAndDisclaimer: {
    disclaimerText: string;
    termsUrl: string;
    privacyUrl: string;
  };
  faqs: IFaqItem[];
  testimonials: ITestimonialItem[];
  updatedAt: Date;
}

const cmsContentSchema = new Schema<ICMSContent>(
  {
    hero: {
      headline: {
        type: String,
        default: "Automated Sports Betting Intelligence & High-Value Signals",
      },
      subheadline: {
        type: String,
        default: "Gain an edge with real-time algorithm-driven predictions, automated tracking, and transparent ROI stats.",
      },
      ctaButtonText: { type: String, default: "Start 7-Day Free Trial" },
      trialBadgeText: { type: String, default: "🔥 7 Days Free Access • No Risk" },
    },
    pricing: {
      monthlyPrice: { type: Number, default: 49 },
      yearlyPrice: { type: Number, default: 399 },
      trialDays: { type: Number, default: 7 },
      features: {
        type: [String],
        default: [
          "Instant Discord & Telegram Bot Alerts",
          "Real-time High EV Value Bets",
          "Advanced Analytics & Edge Tracking",
          "24/7 Dedicated Support Community",
          "Bankroll Management AI Advisor",
        ],
      },
    },
    packages: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          popular: { type: Boolean, default: false },
          originalPrice: { type: String, default: "$29.99" },
          discountPrice: { type: String, default: "$14.99" },
          price: { type: Number, default: 14.99 },
          period: { type: String, default: "/ month" },
          subtitle: { type: String, default: "" },
          features: { type: [String], default: [] },
          cta: { type: String, default: "START 7-DAY TRIAL" },
          accessNote: { type: String, default: "" },
        },
      ],
      default: [
        {
          id: "sharps",
          name: "SHARPS",
          popular: false,
          originalPrice: "$29.99",
          discountPrice: "$14.99",
          price: 14.99,
          period: "/ month",
          subtitle: "For the disciplined everyday bettor who wants sharper straight plays.",
          features: [
            "Daily straight bets on major sports",
            "Core spreads, totals, and moneylines",
            "Model-backed confidence scores",
            "Standard alerts during your trial",
            "Access to app + web dashboard",
          ],
          cta: "START 7-DAY TRIAL — SHARPS",
          accessNote:
            "Sharps Access: After purchase, log in using the same email you paid with. Your Sharps picks unlock automatically.",
        },
        {
          id: "sniper-elite",
          name: "SNIPER ELITE",
          popular: true,
          originalPrice: "$79.99",
          discountPrice: "$39.99",
          price: 39.99,
          period: "/ month",
          subtitle: "For bettors who want full-board reads, props, and deeper angles.",
          features: [
            "Everything in Sharps",
            "Player props and alt lines",
            "Parlay edges & aggressive angles",
            "Enhanced notes and line-move context",
            "Priority game alerts during your trial",
          ],
          cta: "START 7-DAY TRIAL — ELITE",
          accessNote: "",
        },
        {
          id: "whale-access",
          name: "WHALE ACCESS",
          popular: false,
          originalPrice: "$199.99",
          discountPrice: "$99.99",
          price: 99.99,
          period: "/ month",
          subtitle: "For high-stakes players who take edges and process seriously.",
          features: [
            "Everything in Sniper Elite",
            "High-conviction premium plays",
            "Advanced positions & alt markets",
            "Priority support and future private tools",
            "Built for aggressive bankrolls",
          ],
          cta: "START 7-DAY TRIAL — WHALE",
          accessNote: "",
        },
      ],
    },
    siteSettings: {
      siteName: { type: String, default: "BetSnipe" },
      supportEmail: { type: String, default: "support@betsnipe.com" },
      telegramLink: { type: String, default: "https://t.me/betsnipe" },
      discordLink: { type: String, default: "https://discord.gg/betsnipe" },
      announcementBanner: {
        type: String,
        default: "Special Launch: Get 20% OFF on Annual Subscription with code SNIPE20!",
      },
      isAnnouncementActive: { type: Boolean, default: true },
    },
    rulesAndDisclaimer: {
      disclaimerText: {
        type: String,
        default: "Gambling involves risk. Please gamble responsibly. Past performance is not indicative of future results.",
      },
      termsUrl: { type: String, default: "#" },
      privacyUrl: { type: String, default: "#" },
    },
    faqs: {
      type: [
        {
          id: { type: Number },
          q: { type: String },
          a: { type: String },
        },
      ],
      default: [
        {
          id: 0,
          q: "Is Bet Snipe a sportsbook?",
          a: "No. Bet Snipe does not accept or place bets. We provide analysis, predictions, and informational content. You place your own wagers through your preferred legal sportsbook.",
        },
        {
          id: 1,
          q: "How does the 50% off holiday special work?",
          a: "Standard pricing is shown crossed out on the site. When you start your 7-day free trial through the Bet Snipe app before January 1, you lock in the 50% off monthly rate shown in gold for as long as you keep your membership active.",
        },
        {
          id: 2,
          q: "What happens after my 7-day trial?",
          a: "If you like what you see and don't cancel, your membership will roll into a paid subscription at the tier you selected, using your locked-in rate if you activated during the holiday promo. If you cancel before your trial ends, you will not be billed.",
        },
        {
          id: 3,
          q: "Do I have to pay to sign up?",
          a: "No. Creating an account is free. When you activate a membership tier, your 7-day free trial begins. You can cancel before the trial ends if you don't want to continue.",
        },
        {
          id: 4,
          q: "Do you guarantee profits or a certain win rate?",
          a: "No. Sports betting always carries risk. No system, model, or person can guarantee outcomes. Bet Snipe is for informational and entertainment purposes only, and past performance never guarantees future results.",
        },
        {
          id: 5,
          q: "Which sports do you focus on?",
          a: "We focus on major markets: NBA, NFL, MLB, NHL, UFC, and select top-tier soccer. Coverage may expand over time as the platform grows.",
        },
      ],
    },
    testimonials: {
      type: [
        {
          id: { type: String },
          quote: { type: String },
          author: { type: String },
          role: { type: String },
        },
      ],
      default: [
        {
          id: "t1",
          quote: "Bet Snipe stopped me from chasing every single game. I lock in a few edges, ride with a plan, and live with the results. Way less chaos.",
          author: "User Alias",
          role: "Verified Member",
        },
        {
          id: "t2",
          quote: "The 20-minute alerts before tip have saved me from bad numbers more times than I can count. I treat it like my second set of eyes.",
          author: "User Alias",
          role: "Verified Member",
        },
      ],
    },
  },
  { timestamps: true }
);

export const CMSContent =
  mongoose.models.CMSContent ||
  mongoose.model<ICMSContent>("CMSContent", cmsContentSchema);
