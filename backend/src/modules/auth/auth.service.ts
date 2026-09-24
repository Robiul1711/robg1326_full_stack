import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "./auth.model";
import { env } from "../../config/env";
import { successResponse, errorResponse } from "../../common/response";
import { setAuthCookie, clearAuthCookie } from "../../common/cookies";
import { Request, Response } from "express";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, "User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id, email: user.email }, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  setAuthCookie(res, token);

  return successResponse(
    res,
    { id: user._id, name: user.name, email: user.email },
    201,
    "User registered successfully"
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return errorResponse(res, "Invalid credentials", 401);
  }

  const token = jwt.sign({ id: user._id, email: user.email }, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  setAuthCookie(res, token);

  return successResponse(
    res,
    { id: user._id, name: user.name, email: user.email },
    200,
    "Login successful"
  );
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  return successResponse(res, { resetToken }, 200, "Password reset token generated");
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return errorResponse(res, "Invalid or expired token", 400);
  }

  user.isVerified = true;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return successResponse(res, null, 200, "Email verified successfully");
};

export const setNewPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return errorResponse(res, "Invalid or expired token", 400);
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.isVerified = true;
  await user.save();

  return successResponse(res, null, 200, "Password reset successfully");
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id).select("-password");
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }
  return successResponse(res, user, 200, "User fetched successfully");
};

export const logout = async (req: Request, res: Response) => {
  clearAuthCookie(res);
  return successResponse(res, null, 200, "Logout successful");
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select("-password");
  return successResponse(res, users, 200, "Users fetched successfully");
};
