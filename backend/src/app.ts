import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";
import cmsRoutes from "./modules/cms/cms.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://bet-snipe.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

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
