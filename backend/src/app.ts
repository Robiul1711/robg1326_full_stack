import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";
import cmsRoutes from "./modules/cms/cms.routes";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Ensure MongoDB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection error:", err);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/cms", cmsRoutes);

app.get("/", (req, res) => {
  res.send({ status: "success", message: "BetSnipe API Server is running smoothly" });
});

export default app;
