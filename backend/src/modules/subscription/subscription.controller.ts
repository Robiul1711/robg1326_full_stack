import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";

export const createCheckoutSession = (req: Request, res: Response) =>
  subscriptionService.createCheckoutSession(req, res);

export const verifySession = (req: Request, res: Response) =>
  subscriptionService.verifySession(req, res);

export const handleWebhook = (req: Request, res: Response) =>
  subscriptionService.handleWebhook(req, res);

export const getAllSubscriptions = (req: Request, res: Response) =>
  subscriptionService.getAllSubscriptions(req, res);
