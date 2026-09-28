import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionDoc extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  plan: string;
  amount: number;
  currency: string;
  status: "active" | "canceled" | "past_due" | "completed" | "pending";
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscriptionDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    plan: { type: String, default: "monthly" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "completed", "pending"],
      default: "pending",
    },
    stripeSessionId: { type: String },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDoc>("Subscription", subscriptionSchema);
