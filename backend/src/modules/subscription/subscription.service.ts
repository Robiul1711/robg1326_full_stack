import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/response";

export const createSubscription = async (req: Request, res: Response) => {
  return successResponse(res, null, 201, "Subscription created");
};

export const getSubscriptions = async (req: Request, res: Response) => {
  return successResponse(res, [], 200, "Subscriptions fetched");
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  return successResponse(res, null, 200, "Subscription fetched");
};

export const updateSubscription = async (req: Request, res: Response) => {
  return successResponse(res, null, 200, "Subscription updated");
};

export const deleteSubscription = async (req: Request, res: Response) => {
  return successResponse(res, null, 200, "Subscription deleted");
};
