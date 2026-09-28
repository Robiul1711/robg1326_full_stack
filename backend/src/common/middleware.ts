import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getAuthCookie } from "./cookies";
import { errorResponse } from "./response";
import { env } from "../config/env";
import { User } from "../modules/auth/auth.model";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  let token = getAuthCookie(req);

  // Also support Authorization: Bearer <token>
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return errorResponse(res, "Unauthorized: No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role?: string };
    
    // Check if user still exists and is not banned
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, "User not found or deleted", 401);
    }

    if (user.status === "banned") {
      return errorResponse(res, "Account has been suspended. Please contact support.", 403);
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
    
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return errorResponse(res, "Access denied: Admin privileges required", 403);
  }
  next();
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "admin" | "user";
        name?: string;
      };
    }
  }
}

