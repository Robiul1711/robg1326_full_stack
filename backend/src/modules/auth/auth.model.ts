import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "banned" | "pending";
  isVerified: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "none";
  subscriptionExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: { type: String, enum: ["active", "banned", "pending"], default: "active" },
    isVerified: { type: Boolean, default: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    subscriptionPlan: { type: String, default: "free" },
    subscriptionStatus: { type: String, enum: ["active", "canceled", "past_due", "none"], default: "none" },
    subscriptionExpiresAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

