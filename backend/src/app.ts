import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.get("/", (req, res) => {
  res.send({ status: "success", message: "Server is running smoothly" });
});

export default app;
