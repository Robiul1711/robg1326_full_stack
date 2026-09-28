import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { CMSContent } from "../modules/cms/cms.model";

async function seedPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB Atlas");

    let cms = await CMSContent.findOne();
    if (!cms) {
      cms = await CMSContent.create({});
    }

    cms.packages = [
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
    ];

    await cms.save();
    console.log("🎉 CMS Packages successfully updated in database!");
    console.log("Total Packages:", cms.packages.length);
  } catch (error) {
    console.error("Error seeding packages:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedPackages();
