import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getAuthCookie } from "./cookies";
import { errorResponse } from "./response";
import { env } from "../config/env";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = getAuthCookie(req);
  if (!token) {
    return errorResponse(res, "Unauthorized", 401);
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid token", 401);
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}
