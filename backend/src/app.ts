import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";
import cmsRoutes from "./modules/cms/cms.routes";

const app = express();

// Simple & clean: origin: true dynamically reflects whatever domain makes the request
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/cms", cmsRoutes);

app.get("/", (req, res) => {
  res.send({ status: "success", message: "BetSnipe API Server is running smoothly" });
});

export default app;
