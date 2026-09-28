import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "./auth.model";
import { env } from "../../config/env";
import { successResponse, errorResponse } from "../../common/response";
import { setAuthCookie, clearAuthCookie } from "../../common/cookies";
import { Request, Response } from "express";
import crypto from "crypto";
import { sendEmail } from "../../common/mail";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, "Name, email and password are required", 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse(res, "User with this email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
      status: "active",
      isVerified: true,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    setAuthCookie(res, token);

    return successResponse(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
      201,
      "User registered successfully"
    );
  } catch (error: any) {
    return errorResponse(res, error.message || "Registration failed", 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Please provide email and password", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (user.status === "banned") {
      return errorResponse(res, "Your account has been suspended by Admin", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    setAuthCookie(res, token);

    return successResponse(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        token,
      },
      200,
      "Login successful"
    );
  } catch (error: any) {
    return errorResponse(res, error.message || "Login failed", 500);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, "Email address is required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return 200 for security, or specific message if preferred
      return successResponse(res, null, 200, "If an account exists with this email, password reset instructions have been sent.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${env.ADMIN_URL || "http://localhost:5174"}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    await sendEmail({
      to: user.email,
      subject: "BetSnipe Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0c1016; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto;">
          <h2 style="color: #00E676; margin-top: 0;">Password Reset Request</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested to reset your password for BetSnipe. Click the button below to set a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00E676; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #1f2937; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">BetSnipe Platform • Security Center</p>
        </div>
      `,
      text: `Hello ${user.name}, Please reset your password using the following link: ${resetUrl}`,
    });

    return successResponse(
      res,
      { resetToken, resetUrl },
      200,
      "Password reset instructions have been sent to your email"
    );
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to process forgot password", 500);
  }
};

export const setNewPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return errorResponse(res, "Reset token and new password are required", 400);
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return errorResponse(res, "Invalid or expired password reset token", 400);
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return successResponse(res, null, 200, "Password reset successfully. You can now log in.");
  } catch (error: any) {
    return errorResponse(res, error.message || "Password reset failed", 500);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, "Current and new password are required", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse(res, null, 200, "Password changed successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to change password", 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, user, 200, "Profile fetched successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to fetch profile", 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  clearAuthCookie(res);
  return successResponse(res, null, 200, "Logout successful");
};

// Admin Endpoints
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, status } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    return successResponse(res, users, 200, "Users fetched successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to fetch users", 500);
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (status) user.status = status;
    if (role) user.role = role;
    await user.save();

    return successResponse(res, user, 200, "User updated successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to update user", 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, null, 200, "User deleted successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to delete user", 500);
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeSubscribers = await User.countDocuments({
      subscriptionStatus: "active",
    });
    const trialUsers = await User.countDocuments({
      subscriptionPlan: "trial",
      subscriptionStatus: "active",
    });
    const bannedUsers = await User.countDocuments({ status: "banned" });

    // Recent 5 users
    const recentUsers = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(
      res,
      {
        totalUsers,
        activeSubscribers,
        trialUsers,
        bannedUsers,
        recentUsers,
        revenue: activeSubscribers * 49, // sample estimate
      },
      200,
      "Admin stats fetched successfully"
    );
  } catch (error: any) {
    return errorResponse(res, error.message || "Failed to fetch admin stats", 500);
  }
};
