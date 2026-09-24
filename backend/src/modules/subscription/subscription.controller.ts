import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";

export const createSubscription = async (req: Request, res: Response) => {
  await subscriptionService.createSubscription(req, res);
};

export const getSubscriptions = async (req: Request, res: Response) => {
  await subscriptionService.getSubscriptions(req, res);
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  await subscriptionService.getSubscriptionById(req, res);
};

export const updateSubscription = async (req: Request, res: Response) => {
  await subscriptionService.updateSubscription(req, res);
};


export const deleteSubscription = async (req: Request, res: Response) => {
  await subscriptionService.deleteSubscription(req, res);
};
