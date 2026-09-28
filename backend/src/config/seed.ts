import bcrypt from "bcryptjs";
import { User } from "../modules/auth/auth.model";
import { CMSContent } from "../modules/cms/cms.model";

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin User
    const existingAdmin = await User.findOne({
      $or: [{ email: "admin@example.com" }, { role: "admin" }],
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        isVerified: true,
      });
      console.log("👑 Default Super Admin seeded: admin@example.com / admin123");
    }

    // 2. Seed Default CMS Content
    const existingCMS = await CMSContent.findOne();
    if (!existingCMS) {
      await CMSContent.create({
        hero: {
          headline: "Automated Sports Betting Intelligence & High-Value Signals",
          subheadline:
            "Gain an unfair edge with real-time algorithm-driven predictions, automated tracking, and transparent ROI stats.",
          ctaButtonText: "Start 7-Day Free Trial",
          trialBadgeText: "🔥 7 Days Free Access • No Risk",
        },
        pricing: {
          monthlyPrice: 49,
          yearlyPrice: 399,
          trialDays: 7,
          features: [
            "Instant Discord & Telegram Bot Alerts",
            "Real-time High EV Value Bets",
            "Advanced Analytics & Edge Tracking",
            "24/7 Dedicated Support Community",
            "Bankroll Management AI Advisor",
          ],
        },
        siteSettings: {
          siteName: "BetSnipe",
          supportEmail: "support@betsnipe.com",
          telegramLink: "https://t.me/betsnipe",
          discordLink: "https://discord.gg/betsnipe",
          announcementBanner:
            "Special Launch: Get 20% OFF on Annual Subscription with code SNIPE20!",
          isAnnouncementActive: true,
        },
        rulesAndDisclaimer: {
          disclaimerText:
            "Gambling involves risk. Please gamble responsibly. Past performance is not indicative of future results.",
          termsUrl: "#",
          privacyUrl: "#",
        },
      });
      console.log("📝 Default CMS Content seeded successfully");
    }
  } catch (error: any) {
    console.warn("⚠️ Database seeder error:", error.message);
  }
};
